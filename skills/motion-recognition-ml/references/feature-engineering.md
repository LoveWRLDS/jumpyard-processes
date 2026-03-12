# Feature Engineering

Used only for the **Classical ML path** (Random Forest, SVM, GBM).
For 1D-CNN, skip this — the model learns features from raw windows.

## Standard Feature Set

Computed per axis (accel_x/y/z, gyro_x/y/z) and per derived signal (accel_mag, gyro_mag):

### Time Domain (per axis per window)

| Feature | Description |
|---|---|
| mean | Average value |
| std | Standard deviation |
| min / max | Range |
| rms | Root mean square — captures energy |
| peak_to_peak | max - min |
| zcr | Zero-crossing rate — frequency proxy |
| skewness | Asymmetry (useful for impact detection) |
| kurtosis | Peakedness (useful for sharp spikes) |
| energy | Sum of squared values / N |

### Frequency Domain (per axis per window)

| Feature | Description |
|---|---|
| dominant_freq | Frequency of max FFT magnitude |
| spectral_energy | Sum of squared FFT magnitudes |
| spectral_entropy | Disorder of frequency distribution |

### Derived Signals

Always compute and include as additional axes:

```python
df['accel_mag'] = (df.accel_x**2 + df.accel_y**2 + df.accel_z**2)**0.5
df['gyro_mag']  = (df.gyro_x**2  + df.gyro_y**2  + df.gyro_z**2)**0.5
df['jerk_mag']  = df['accel_mag'].diff().abs()  # rate of change of acceleration
```

## Total Feature Count

With 8 signals × 9 time-domain + 8 signals × 3 freq-domain = **96 features** per window.

This is manageable for Random Forest. If training is slow, use `SelectKBest` or feature importance to prune to top 20–30.

## Implementation

```python
import numpy as np
from scipy import stats
from scipy.fft import rfft, rfftfreq

AXES = ['accel_x', 'accel_y', 'accel_z', 'gyro_x', 'gyro_y', 'gyro_z',
        'accel_mag', 'gyro_mag']

def features_from_window(window: np.ndarray, sample_rate: float = 100.0) -> np.ndarray:
    """
    window: shape (n_samples, n_axes) — columns must match AXES order
    returns: 1D feature vector
    """
    feats = []
    n = window.shape[0]

    for i in range(window.shape[1]):
        sig = window[:, i]

        # Time domain
        feats += [
            np.mean(sig),
            np.std(sig),
            np.min(sig),
            np.max(sig),
            np.sqrt(np.mean(sig**2)),                         # rms
            np.max(sig) - np.min(sig),                        # peak_to_peak
            np.sum(np.diff(np.sign(sig)) != 0) / n,          # zcr
            float(stats.skew(sig)),
            float(stats.kurtosis(sig)),
            np.sum(sig**2) / n,                               # energy
        ]

        # Frequency domain
        fft_vals = np.abs(rfft(sig))
        freqs = rfftfreq(n, d=1.0/sample_rate)
        feats += [
            freqs[np.argmax(fft_vals)],                       # dominant_freq
            np.sum(fft_vals**2),                              # spectral_energy
            _spectral_entropy(fft_vals),
        ]

    return np.array(feats, dtype=np.float32)


def _spectral_entropy(fft_vals: np.ndarray) -> float:
    psd = fft_vals**2
    psd_norm = psd / (psd.sum() + 1e-10)
    return -np.sum(psd_norm * np.log(psd_norm + 1e-10))
```

## Feature Selection (Optional)

If model performance is poor, prune irrelevant features:

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectFromModel

rf = RandomForestClassifier(n_estimators=100)
rf.fit(X_train, y_train)

selector = SelectFromModel(rf, threshold='median')
X_train_pruned = selector.transform(X_train)
X_test_pruned  = selector.transform(X_test)
print(f"Features: {X_train.shape[1]} → {X_train_pruned.shape[1]}")
```

## Normalization

**Always scale features before SVM/logistic regression. Not required for Random Forest.**

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

# Save scaler alongside model for inference
import joblib
joblib.dump(scaler, 'scaler.pkl')
```
