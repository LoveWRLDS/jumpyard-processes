"""
WRLDS Motion Recognition Pipeline
----------------------------------
End-to-end pipeline: load CSVs → window → features → train → evaluate → export

Usage:
    python pipeline.py --data path/to/recordings/ --model rf
    python pipeline.py --data path/to/recordings/ --model cnn
    python pipeline.py --predict model_rf.pkl --input sample.csv
"""

import argparse
import glob
import os
import sys

import joblib
import numpy as np
import pandas as pd
from scipy import stats
from scipy.fft import rfft, rfftfreq
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.utils.class_weight import compute_class_weight


# ─── Constants ────────────────────────────────────────────────────────────────

AXES_6 = ['accel_x', 'accel_y', 'accel_z', 'gyro_x', 'gyro_y', 'gyro_z']
AXES_9 = AXES_6 + ['mag_x', 'mag_y', 'mag_z']  # use if magnetometer columns present
DERIVED = ['accel_mag', 'gyro_mag', 'jerk_mag']

SAMPLE_RATE = 100.0   # Hz — change to match your sensor config
WINDOW_SIZE = 100     # samples (1s at 100Hz)
OVERLAP     = 0.5     # 50%
STRIDE      = int(WINDOW_SIZE * (1 - OVERLAP))


# ─── Data Loading ──────────────────────────────────────────────────────────────

def load_recordings(data_dir: str) -> pd.DataFrame:
    """Load all CSVs in data_dir into a single DataFrame."""
    files = glob.glob(os.path.join(data_dir, '**', '*.csv'), recursive=True)
    if not files:
        raise FileNotFoundError(f"No CSV files found in {data_dir}")

    dfs = []
    for f in files:
        df = pd.read_csv(f)
        df['source_file'] = os.path.basename(f)
        dfs.append(df)

    combined = pd.concat(dfs, ignore_index=True)
    print(f"Loaded {len(files)} files, {len(combined)} total rows")
    print(f"Label distribution:\n{combined['label'].value_counts()}\n")
    return combined


def add_derived_signals(df: pd.DataFrame) -> pd.DataFrame:
    """Add accel_mag, gyro_mag, jerk_mag columns."""
    df = df.copy()
    df['accel_mag'] = np.sqrt(df.accel_x**2 + df.accel_y**2 + df.accel_z**2)
    df['gyro_mag']  = np.sqrt(df.gyro_x**2  + df.gyro_y**2  + df.gyro_z**2)
    df['jerk_mag']  = df['accel_mag'].diff().abs().fillna(0)
    return df


def detect_axes(df: pd.DataFrame):
    """Return AXES_9 if magnetometer columns present, else AXES_6."""
    has_mag = all(c in df.columns for c in ['mag_x', 'mag_y', 'mag_z'])
    return AXES_9 if has_mag else AXES_6


# ─── Windowing ─────────────────────────────────────────────────────────────────

def window_data(df: pd.DataFrame,
                window_size: int = WINDOW_SIZE,
                stride: int = STRIDE,
                min_activity_std: float = 20.0):
    """
    Slice DataFrame into overlapping windows.

    Returns:
        windows: np.ndarray of shape (n_windows, window_size, len(ALL_AXES))
        labels:  np.ndarray of shape (n_windows,) with string labels
    """
    df = add_derived_signals(df)
    axes = detect_axes(df)
    all_axes = axes + DERIVED
    windows, labels = [], []

    # Process each file separately to avoid window leakage across sessions
    for source in df['source_file'].unique():
        subset = df[df['source_file'] == source].reset_index(drop=True)
        values = subset[all_axes].values
        label_col = subset['label'].values

        for start in range(0, len(values) - window_size + 1, stride):
            end = start + window_size
            window = values[start:end]
            window_labels = label_col[start:end]

            # Skip windows with no clear dominant label (transition)
            dominant_label = pd.Series(window_labels).mode()[0]
            label_purity = (window_labels == dominant_label).mean()
            if label_purity < 0.8:
                continue

            # Skip low-activity idle (configurable)
            if dominant_label == 'idle' and window[:, 0:3].std() < min_activity_std:
                # Still include some idle — undersample to ~2:1 ratio vs active
                if np.random.random() > 0.3:
                    continue

            windows.append(window)
            labels.append(dominant_label)

    return np.array(windows, dtype=np.float32), np.array(labels)


# ─── Feature Extraction ────────────────────────────────────────────────────────

def _spectral_entropy(fft_vals: np.ndarray) -> float:
    psd = fft_vals ** 2
    psd_norm = psd / (psd.sum() + 1e-10)
    return float(-np.sum(psd_norm * np.log(psd_norm + 1e-10)))


def features_from_window(window: np.ndarray, sample_rate: float = SAMPLE_RATE) -> np.ndarray:
    """Extract feature vector from a single window. window: (n_samples, n_axes)."""
    feats = []
    n = window.shape[0]

    for i in range(window.shape[1]):
        sig = window[:, i]

        # Time domain
        feats += [
            float(np.mean(sig)),
            float(np.std(sig)),
            float(np.min(sig)),
            float(np.max(sig)),
            float(np.sqrt(np.mean(sig ** 2))),          # rms
            float(np.max(sig) - np.min(sig)),            # peak_to_peak
            float(np.sum(np.diff(np.sign(sig)) != 0) / n),  # zcr
            float(stats.skew(sig)),
            float(stats.kurtosis(sig)),
            float(np.sum(sig ** 2) / n),                 # energy
        ]

        # Frequency domain
        fft_vals = np.abs(rfft(sig))
        freqs = rfftfreq(n, d=1.0 / sample_rate)
        feats += [
            float(freqs[np.argmax(fft_vals)]),
            float(np.sum(fft_vals ** 2)),
            _spectral_entropy(fft_vals),
        ]

    return np.array(feats, dtype=np.float32)


def extract_features(windows: np.ndarray) -> np.ndarray:
    """Extract features from all windows. Returns (n_windows, n_features)."""
    return np.vstack([features_from_window(w) for w in windows])


# ─── Training ─────────────────────────────────────────────────────────────────

def train_and_evaluate(X: np.ndarray, y: np.ndarray, model_path: str = 'model_rf.pkl'):
    """Train a Random Forest, cross-validate, and save the model."""
    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=0.2, stratify=y_enc, random_state=42
    )

    classes = np.unique(y_train)
    weights = compute_class_weight('balanced', classes=classes, y=y_train)
    class_weight_dict = dict(zip(classes, weights))

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        min_samples_leaf=2,
        class_weight=class_weight_dict,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("\n=== Classification Report ===")
    print(classification_report(y_test, y_pred, target_names=le.classes_))
    print("=== Confusion Matrix ===")
    print(confusion_matrix(y_test, y_pred))

    cv = cross_val_score(model, X, y_enc, cv=StratifiedKFold(5), scoring='f1_weighted', n_jobs=-1)
    print(f"\nCV F1 (5-fold): {cv.mean():.3f} ± {cv.std():.3f}")

    joblib.dump(model, model_path)
    joblib.dump(le, model_path.replace('.pkl', '_labels.pkl'))
    print(f"\nModel saved: {model_path}")
    return model, le


# ─── Prediction ───────────────────────────────────────────────────────────────

def predict_file(model_path: str, csv_path: str):
    """Run windowed inference on a CSV file and print results."""
    model = joblib.load(model_path)
    le    = joblib.load(model_path.replace('.pkl', '_labels.pkl'))

    df = pd.read_csv(csv_path)
    df['source_file'] = 'input'
    if 'label' not in df.columns:
        df['label'] = 'unlabeled'

    windows, _ = window_data(df)
    if len(windows) == 0:
        print("No windows extracted — check data quality")
        return

    X = extract_features(windows)
    preds = le.inverse_transform(model.predict(X))
    proba = model.predict_proba(X).max(axis=1)

    for i, (pred, conf) in enumerate(zip(preds, proba)):
        t_start = i * STRIDE / SAMPLE_RATE
        print(f"  [{t_start:.1f}s] {pred} ({conf:.0%})")


# ─── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='WRLDS Motion Recognition Pipeline')
    parser.add_argument('--data',    help='Directory with labeled CSV recordings')
    parser.add_argument('--model',   default='rf', choices=['rf'], help='Model type')
    parser.add_argument('--output',  default='model_rf.pkl', help='Output model path')
    parser.add_argument('--predict', help='Path to saved model (.pkl) for inference')
    parser.add_argument('--input',   help='CSV file to run inference on')
    args = parser.parse_args()

    if args.predict and args.input:
        predict_file(args.predict, args.input)
        return

    if not args.data:
        parser.print_help()
        sys.exit(1)

    print(f"Loading data from: {args.data}")
    df = load_recordings(args.data)

    print("Windowing...")
    windows, labels = window_data(df)
    print(f"Windows: {len(windows)}, shape: {windows.shape}")
    print(f"Label counts: {dict(zip(*np.unique(labels, return_counts=True)))}\n")

    print("Extracting features...")
    X = extract_features(windows)
    print(f"Feature matrix: {X.shape}\n")

    print("Training Random Forest...")
    train_and_evaluate(X, labels, model_path=args.output)


if __name__ == '__main__':
    main()
