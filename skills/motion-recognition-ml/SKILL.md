---
name: motion-recognition-ml
description: "End-to-end ML pipeline for motion/gesture recognition using the WRLDS AirHive 9-axis IMU sensor (accelerometer + gyroscope). Use when building a movement classifier from BLE sensor data — covers data collection format, labeling, feature extraction, model training, evaluation, and deployment. Triggers on requests like: train a model to recognize gestures, classify sensor movements, detect specific motions, build a sports analytics ML model, or set up a motion recognition pipeline for a customer project."
---

# Motion Recognition ML Pipeline

Standard workflow for building a movement classifier on top of AirHive sensor data. Works for any domain: sports, industrial, rehabilitation, gaming.

## Pipeline Overview

```
Collect labeled data → Clean & window → Extract features → Train classifier → Evaluate → Deploy
```

Choose your starting point:

| Situation | Start at |
|---|---|
| No data yet | Step 1: Collect |
| Have raw CSV, not labeled | Step 2: Label |
| Have labeled CSV | Step 3: Train |
| Have model, need to ship | Step 5: Deploy |

---

## Step 1: Data Collection

**Data format** — every recording session produces a CSV:

```
timestamp_ms, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, label
```

- Accel units: **mg** (calibrated, see `berg-airhive-sensor` skill)
- Gyro units: **dps** (degrees per second)
- `label`: string class name (`"forehand"`, `"backhand"`, `"idle"`) — use `"unlabeled"` during streaming if labeling post-hoc
- Sample rate: typically 50–100 Hz from AirHive
- Magnetometer columns (`mag_x/y/z`) are optional — include if available, omit if noisy

**To build the data collection app**, use the `berg-airhive-imu-3d-view` skill — it has a validated, working BLE stack with all three sensor characteristics (accel, gyro, mag). Extend it to write CSV rows instead of (or alongside) rendering.

See [references/data-collection.md](references/data-collection.md) for:
- Recording session protocol
- How much data per class you need
- Post-hoc vs real-time labeling
- Folder/file naming convention

---

## Step 2: Windowing

Split the continuous time series into fixed-length windows before feature extraction or model input.

**Default parameters (adjust per domain):**

| Parameter | Default | Notes |
|---|---|---|
| Window size | 100 samples (1s at 100Hz) | Shorter for fast gestures (50ms), longer for slow (2s) |
| Overlap | 50% | Higher overlap = more training samples |
| Min activity threshold | accel magnitude std > 50 mg | Skip windows that are pure idle |

```python
from assets.pipeline import window_data
windows, labels = window_data(df, window_size=100, overlap=0.5)
```

---

## Step 3: Choose Model Path

**< 500 labeled windows per class → Classical ML (Random Forest)**
Fast to train, interpretable, works well with hand-crafted features.

**500+ labeled windows per class → 1D-CNN**
Learns features from raw signal, higher ceiling, needs more data.

See [references/model-training.md](references/model-training.md) for both paths with code.

---

## Step 4: Features (Classical ML path only)

Extract from each window before feeding into Random Forest/SVM.

See [references/feature-engineering.md](references/feature-engineering.md) for the standard feature set.

Quick start:
```python
from assets.pipeline import extract_features
X = extract_features(windows)  # shape: (n_windows, n_features)
```

---

## Step 5: Train & Evaluate

```python
from assets.pipeline import train_and_evaluate
model, report = train_and_evaluate(X, y)
# Prints confusion matrix + per-class F1
```

Target: **F1 ≥ 0.90 per class** before deploying. If below threshold, see [references/model-training.md](references/model-training.md) troubleshooting section.

---

## Step 6: Deploy

See [references/deployment.md](references/deployment.md) for:
- TensorFlow Lite (Android)
- ONNX (cross-platform)
- REST API (cloud inference)
- Edge Impulse (embedded, recommended for hardware products)

---

## Starter Script

`assets/pipeline.py` contains ready-to-run functions for all steps above. Run it directly for a full end-to-end test on sample data:

```bash
python assets/pipeline.py --data path/to/recordings/ --model rf
```
