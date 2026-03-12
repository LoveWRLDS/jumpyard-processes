# Data Collection

## File & Folder Convention

```
data/
├── raw/
│   ├── session_YYYYMMDD_HHMMSS_subject01.csv
│   ├── session_YYYYMMDD_HHMMSS_subject02.csv
│   └── ...
└── processed/
    ├── windows_train.npy
    ├── windows_test.npy
    ├── labels_train.npy
    └── labels_test.npy
```

One CSV file per recording session. Multiple subjects = multiple files.

## CSV Format

```
timestamp_ms, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, mag_x, mag_y, mag_z, label
1700000000000, 12, -980, 45, 0.3, -1.2, 0.1, 18.2, -4.1, 42.3, idle
1700000000010, 15, -985, 48, 0.5, -1.0, 0.2, 18.3, -4.0, 42.1, idle
1700000000020, 340, -620, 180, 45.2, -12.3, 8.7, 19.1, -5.2, 41.8, forehand
```

- `timestamp_ms`: use `receivedAtMs` (wall-clock time when Android received the BLE notification) — **not** the 24-bit sensor timestamp. See [berg-airhive-imu-3d-view pitfalls](../../berg-airhive-imu-3d-view/references/pitfalls.md).
- Accel: calibrated mg (apply 6-point calibration from `berg-airhive-sensor` skill)
- Gyro: raw dps (Int16 from sensor)
- Mag: microtesla — apply `(-rawX/10, -rawY/10, -rawZ/10)` scaling from `berg-airhive-imu-3d-view` sensor protocol
- `label`: class string
- Magnetometer columns are **optional** — omit if sensor placement makes mag noisy (metallic equipment, near motors). For wrist/body use, accel+gyro is usually sufficient.

## Sample Emission Model

The AirHive sends accel, gyro, and mag as separate BLE notifications. The correct logging model (matching `berg-airhive-imu-3d-view`):

```
BLE notification arrives → update that sensor vector → emit row using latest-known values for all three sensors
```

This means rows are not perfectly time-aligned across axes — each row represents "latest known state" at the moment of one notification. This is fine for ML windowing at 50–100 Hz.

## How Much Data Per Class

| Dataset size | Expected result |
|---|---|
| 50–100 windows/class | Proof of concept, RF can work |
| 200–500 windows/class | Good RF model (F1 > 0.90 typical) |
| 500–2000 windows/class | Good 1D-CNN |
| 2000+ windows/class | Strong 1D-CNN, enables transfer learning |

Rules of thumb:
- More subjects > more reps from same subject (generalization)
- Vary recording conditions (standing, sitting, fast, slow)
- Collect **2× more idle/negative samples** than positive classes — models see idle most of the time

## Recording Protocol

### Real-Time Labeled Recording (recommended)

1. Build or use a recording app that:
   - Connects to AirHive via BLE (see `berg-airhive-sensor` skill)
   - Streams calibrated data at full rate
   - Has a button/key to set the current label
   - Writes rows continuously to CSV
2. Protocol per session:
   - 5s idle (baseline)
   - 10 reps of class A → press button before/after
   - 5s idle
   - 10 reps of class B
   - 5s idle
   - Repeat 3–5 sets

### Post-Hoc Labeling

If data was collected without labels, label it manually using a labeling tool:

1. Plot the accel magnitude over time to find activity segments
2. Mark segments with class labels (start/end timestamps)
3. Output: same CSV format with labels filled in

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('session.csv')
df['accel_mag'] = (df[['accel_x','accel_y','accel_z']]**2).sum(axis=1)**0.5
plt.plot(df['timestamp_ms'], df['accel_mag'])
plt.show()
# Visually identify activity windows, then annotate
```

## Sensor Placement Notes

Document sensor placement per project. It affects which axes carry signal:

| Body part | Dominant axes |
|---|---|
| Wrist (racket sports) | Gyro X/Y (rotation), Accel Z (swing) |
| Torso | Accel Z (vertical), Gyro Y (rotation) |
| Foot | Accel Z (impact), all gyro |
| Equipment (trampoline sensor) | Accel Z (bounce), gyro all |

Record placement in the session filename or a sidecar `session_meta.json`:
```json
{
  "subject": "subject01",
  "placement": "right_wrist",
  "activity": "table_tennis",
  "sensor_id": "AH-001",
  "notes": "dominant hand, wristband"
}
```

## Data Quality Checks

Run before training:

```python
# Check for gaps (missing samples)
df['dt'] = df['timestamp_ms'].diff()
gaps = df[df['dt'] > 30]  # >3× expected interval = gap
print(f"Found {len(gaps)} gaps")

# Check label distribution
print(df['label'].value_counts())

# Check for flat signal (disconnection or sensor freeze)
print(df[['accel_x','accel_y','accel_z']].std())
```

Red flags: std < 5 mg on all axes = sensor not moving or disconnected.
