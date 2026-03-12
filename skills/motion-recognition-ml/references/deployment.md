# Deployment

## Choose a Deployment Target

| Target | Best for | Complexity |
|---|---|---|
| **TensorFlow Lite** | Android on-device inference | Medium |
| **ONNX** | Cross-platform, any language | Low–Medium |
| **REST API** | Cloud inference, any client | Low |
| **Edge Impulse** | Embedded / MCU, turnkey platform | Low (their tooling does the work) |

---

## Option 1: TensorFlow Lite (Android)

**Use for:** 1D-CNN on Android. Real-time on-device inference — no internet required.

### Convert

```python
import tensorflow as tf

# Load trained Keras model
model = tf.keras.models.load_model('model_cnn.keras')

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]  # quantization (smaller + faster)
tflite_model = converter.convert()

with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
```

### Android Integration (Kotlin)

```kotlin
// 1. Add to build.gradle
// implementation 'org.tensorflow:tensorflow-lite:2.13.0'

// 2. Put model.tflite in app/src/main/assets/

// 3. Run inference
class MotionClassifier(context: Context) {
    private val interpreter: Interpreter
    private val inputBuffer = Array(1) { Array(100) { FloatArray(6) } }
    private val outputBuffer = Array(1) { FloatArray(NUM_CLASSES) }

    init {
        val model = loadModelFile(context, "model.tflite")
        interpreter = Interpreter(model)
    }

    fun classify(window: Array<FloatArray>): Int {
        inputBuffer[0] = window
        interpreter.run(inputBuffer, outputBuffer)
        return outputBuffer[0].indices.maxByOrNull { outputBuffer[0][it] } ?: 0
    }

    private fun loadModelFile(context: Context, filename: String): MappedByteBuffer {
        val fd = context.assets.openFd(filename)
        return FileInputStream(fd.fileDescriptor).channel
            .map(FileChannel.MapMode.READ_ONLY, fd.startOffset, fd.declaredLength)
    }
}
```

**Remember:** Apply the same normalization (mean/std from training) to the window before passing to TFLite.

---

## Option 2: ONNX (Cross-Platform)

**Use for:** Scikit-learn Random Forest → export as ONNX → run on Android, iOS, or any backend.

### Convert RF to ONNX

```python
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

initial_type = [('float_input', FloatTensorType([None, X_train.shape[1]]))]
onnx_model = convert_sklearn(model, initial_types=initial_type)

with open('model.onnx', 'wb') as f:
    f.write(onnx_model.SerializeToString())
```

```bash
pip install skl2onnx onnxruntime
```

### Android ONNX Inference (Kotlin)

```kotlin
// build.gradle: implementation 'com.microsoft.onnxruntime:onnxruntime-android:1.16.0'

val env = OrtEnvironment.getEnvironment()
val session = env.createSession(context.assets.open("model.onnx").readBytes())

val inputTensor = OnnxTensor.createTensor(env, FloatArray(features.size) { features[it] },
    longArrayOf(1, features.size.toLong()))
val output = session.run(mapOf("float_input" to inputTensor))
val scores = (output[0].value as Array<FloatArray>)[0]
val predictedClass = scores.indices.maxByOrNull { scores[it] } ?: 0
```

---

## Option 3: REST API (Cloud Inference)

**Use for:** Prototyping, non-realtime use cases, or when the phone sends data to a backend.

```python
# server.py — FastAPI
from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI()
model = joblib.load('model_rf.pkl')
le    = joblib.load('label_encoder.pkl')
scaler = joblib.load('scaler.pkl')

@app.post('/classify')
def classify(payload: dict):
    features = np.array(payload['features']).reshape(1, -1)
    features = scaler.transform(features)
    pred = model.predict(features)[0]
    proba = model.predict_proba(features)[0]
    return {
        'class': le.inverse_transform([pred])[0],
        'confidence': float(proba.max())
    }
```

```bash
pip install fastapi uvicorn
uvicorn server:app --host 0.0.0.0 --port 8000
```

---

## Option 4: Edge Impulse (Recommended for Hardware Products)

**Use for:** Shipping ML on the AirHive hardware itself or any MCU. Handles quantization, SDK generation, and C++ deployment automatically.

### Workflow

1. **Create project** at [edgeimpulse.com](https://edgeimpulse.com)
2. **Upload data** via CSV Wizard (use the standard CSV format from `data-collection.md`)
3. **Create impulse:** Time series input → Spectral Analysis (or raw) → Neural Network or Random Forest classifier
4. **Train** in Edge Impulse Studio
5. **Deploy:** Download Arduino library, C++ SDK, or use the REST API
6. **Integrate** with AirHive firmware or Android via the Edge Impulse Android SDK

Edge Impulse's spectral analysis block implements most of the features in `feature-engineering.md` automatically.

---

## Inference Loop Pattern (Android)

Regardless of format, the on-device inference loop follows the same pattern:

```kotlin
// 1. Maintain a sliding window buffer
val buffer = ArrayDeque<FloatArray>(WINDOW_SIZE)

// 2. On each new sensor sample (from BleService)
fun onNewSample(accel: FloatArray, gyro: FloatArray) {
    buffer.addLast(floatArrayOf(*accel, *gyro))
    if (buffer.size > WINDOW_SIZE) buffer.removeFirst()

    // 3. Classify every N samples (stride = WINDOW_SIZE * (1 - overlap))
    samplesUntilClassify--
    if (samplesUntilClassify <= 0 && buffer.size == WINDOW_SIZE) {
        samplesUntilClassify = STRIDE
        val window = buffer.toTypedArray()
        val result = classifier.classify(window)
        onClassificationResult(result)
    }
}
```
