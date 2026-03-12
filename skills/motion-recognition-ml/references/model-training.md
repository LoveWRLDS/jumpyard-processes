# Model Training

## Path A: Classical ML (Random Forest)

**Use when:** < 500 labeled windows per class, need fast iteration, need interpretability.

### Dependencies
```bash
pip install scikit-learn pandas numpy scipy joblib
```

### Full Training Pipeline

```python
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

# 1. Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)  # y = array of string labels

# 2. Train/test split (stratified — preserves class balance)
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, stratify=y_encoded, random_state=42
)

# 3. Train
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,       # Let trees grow fully
    min_samples_leaf=2,
    class_weight='balanced',  # Handles imbalanced classes
    random_state=42,
    n_jobs=-1,
)
model.fit(X_train, y_train)

# 4. Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, target_names=le.classes_))
print(confusion_matrix(y_test, y_pred))

# 5. Cross-validate (more reliable than single split)
cv_scores = cross_val_score(model, X, y_encoded, cv=StratifiedKFold(5), scoring='f1_weighted')
print(f"CV F1: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

# 6. Save
joblib.dump(model, 'model_rf.pkl')
joblib.dump(le, 'label_encoder.pkl')
```

### Hyperparameter Tuning (if F1 < 0.90)

```python
from sklearn.model_selection import RandomizedSearchCV

param_dist = {
    'n_estimators': [100, 200, 500],
    'max_depth': [None, 10, 20, 30],
    'min_samples_leaf': [1, 2, 5],
    'max_features': ['sqrt', 'log2'],
}
search = RandomizedSearchCV(
    RandomForestClassifier(class_weight='balanced', n_jobs=-1),
    param_distributions=param_dist,
    n_iter=20, cv=5, scoring='f1_weighted', random_state=42
)
search.fit(X_train, y_train)
print(search.best_params_)
```

---

## Path B: 1D-CNN (Deep Learning)

**Use when:** 500+ labeled windows per class, or classical ML plateaus below target F1.

### Dependencies
```bash
pip install tensorflow numpy scikit-learn
```

### Model Architecture

```python
import tensorflow as tf
from tensorflow.keras import layers, models

def build_cnn(input_shape, n_classes):
    """
    input_shape: (window_size, n_channels) e.g. (100, 6) for 100 samples, 6 axes
    n_classes: number of output classes
    """
    model = models.Sequential([
        layers.Input(shape=input_shape),

        # Block 1
        layers.Conv1D(64, kernel_size=5, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling1D(pool_size=2),
        layers.Dropout(0.2),

        # Block 2
        layers.Conv1D(128, kernel_size=3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling1D(pool_size=2),
        layers.Dropout(0.2),

        # Block 3
        layers.Conv1D(64, kernel_size=3, padding='same', activation='relu'),
        layers.GlobalAveragePooling1D(),

        # Classifier head
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(n_classes, activation='softmax'),
    ])
    return model

# Build + compile
model = build_cnn(input_shape=(100, 6), n_classes=len(classes))
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
model.summary()
```

### Training

```python
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

le = LabelEncoder()
y_encoded = le.fit_transform(y)

# windows shape: (n_windows, window_size, n_axes)
X_train, X_test, y_train, y_test = train_test_split(
    windows, y_encoded, test_size=0.2, stratify=y_encoded
)

# Normalize per axis (fit on train, apply to test)
mean = X_train.mean(axis=(0,1), keepdims=True)
std  = X_train.std(axis=(0,1),  keepdims=True) + 1e-8
X_train = (X_train - mean) / std
X_test  = (X_test  - mean) / std

callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=15, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(patience=7, factor=0.5),
]

history = model.fit(
    X_train, y_train,
    validation_split=0.15,
    epochs=100,
    batch_size=32,
    callbacks=callbacks,
    class_weight=compute_class_weight(y_train),
)

# Evaluate
from sklearn.metrics import classification_report
y_pred = model.predict(X_test).argmax(axis=1)
print(classification_report(y_test, y_pred, target_names=le.classes_))

# Save
model.save('model_cnn.keras')
np.save('norm_mean.npy', mean)
np.save('norm_std.npy', std)
```

```python
from sklearn.utils.class_weight import compute_class_weight as _cw
import numpy as np

def compute_class_weight(y):
    classes = np.unique(y)
    weights = _cw('balanced', classes=classes, y=y)
    return dict(zip(classes, weights))
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| F1 < 0.70 on all classes | Too little data or noisy labels | Collect more data, re-check labeling |
| One class F1 much lower | Class imbalance | Add `class_weight='balanced'` |
| Good train F1, bad test F1 | Overfitting | More data, reduce max_depth (RF), add dropout (CNN) |
| Model works in notebook, fails on device | Normalization not applied at inference | Save + load scaler/mean/std alongside model |
| All predictions = one class | Imbalance + no balancing | Use stratified split + balanced class weights |

## Target Metric

**F1 ≥ 0.90 weighted average** across all classes before deployment.

For safety-critical or high-stakes use: target per-class recall ≥ 0.90 (minimize false negatives).
