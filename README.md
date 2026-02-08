# Single-Neuron Neural Network – Seven-Segment Digit Recognition

> **Educational project:** demystifying neural networks by building the *smallest possible* one that still learns.

This project implements a **single-neuron neural network** (7 inputs → 1 output) in **pure JavaScript**, trained with **gradient descent and backpropagation**, to recognize digits displayed in **seven-segment form**.

The goal is not performance, but **understanding**.

---

## ✨ What This Project Demonstrates

* A neural network can be **only one neuron**
* Backpropagation is just the **chain rule**
* Learning = **adjusting weights step-by-step**
* No libraries, no frameworks, no magic

If you understand this project, you understand the *core* of modern neural networks.

---

## 🧠 Problem Definition

We want to recognize digits `0–9` displayed using a **seven-segment display**:

### TODO: Add Seven segment image with segment's name

```
 a
f b
 g
e c
 d
```

Each segment is either:

* `1` → ON
* `0` → OFF

### Input

* **7 input neurons**
* Each neuron corresponds to one segment: `[a, b, c, d, e, f, g]`

### Output

* **1 output neuron**
* Continuous value in range `0.0 – 0.9`

Examples:

* `0.0 ≈ digit 0`
* `0.5 ≈ digit 5`
* `0.9 ≈ digit 9`

This is **regression**, not classification.

---

## 📊 Dataset

| Digit | Segments ON   | Input Vector      | Target |
| ----: | ------------- | ----------------- | ------ |
|     0 | a b c d e f   | `[1,1,1,1,1,1,0]` | `0.0`  |
|     1 | b c           | `[0,1,1,0,0,0,0]` | `0.1`  |
|     2 | a b d e g     | `[1,1,0,1,1,0,1]` | `0.2`  |
|     3 | a b c d g     | `[1,1,1,1,0,0,1]` | `0.3`  |
|     4 | b c f g       | `[0,1,1,0,0,1,1]` | `0.4`  |
|     5 | a c d f g     | `[1,0,1,1,0,1,1]` | `0.5`  |
|     6 | a c d e f g   | `[1,0,1,1,1,1,1]` | `0.6`  |
|     7 | a b c         | `[1,1,1,0,0,0,0]` | `0.7`  |
|     8 | a b c d e f g | `[1,1,1,1,1,1,1]` | `0.8`  |
|     9 | a b c d f g   | `[1,1,1,1,0,1,1]` | `0.9`  |

---

## 🧮 Model Architecture

```
7 inputs ──▶ [ single neuron ] ──▶ 1 output
```

Mathematically:

```
z = w · x + b
y = sigmoid(z)
```

Where:

* `w` = weights (7 values)
* `b` = bias
* `sigmoid` = activation function

---

## 🔁 Training & Backpropagation

### Loss Function

Mean Squared Error (MSE):

```
L = ½ (y − t)²
```

### Backpropagation (Chain Rule)

For each weight `wᵢ`:

```
∂L/∂wᵢ = (y − t) · y(1 − y) · xᵢ
```

Weight update:

```
wᵢ = wᵢ − learning_rate · ∂L/∂wᵢ
```

Bias update:

```
b = b − learning_rate · ∂L/∂z
```

📌 **This is backpropagation** — no shortcuts, no hidden steps.

---

## 👁️ Visualization (Learning Process)

The project includes visualizations that show:

* Forward pass values
* Prediction vs target
* Error magnitude
* Weight updates per step
* Error decreasing over epochs

This makes learning **visible**, not abstract.

---

## 🏃 How to Run

  Todo..

---

## 🎓 Educational Takeaways

* A neural network does **not** need millions of parameters
* Backpropagation is just calculus
* Bias is a **shift**, not magic
* Complexity comes from **depth**, not mysticism

> If you understand this project, modern deep learning becomes much less scary.

---

## 🧪 Suggested Experiments

* Remove the bias → observe learning instability
* Remove sigmoid → pure linear neuron
* Add noise to inputs
* Add one hidden neuron (7 → 2 → 1)
* Turn this into a hardware / embedded demo

---

## 📜 License

MIT – use it freely for:

* Education
* Workshops
* YouTube content
* Experiments

---

## 🙌 Philosophy

> *"Yang terlihat canggih, seringkali ternyata sederhana."*

This project exists to make AI **less mystical and more logical**.
