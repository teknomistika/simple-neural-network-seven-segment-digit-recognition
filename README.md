# 🚦 Teaching a Neural Network When to Press the Gas Pedal

## Introduction

Neural networks are often introduced using complex problems such as image recognition, digit classification, or natural language processing. While powerful, these examples can be difficult to understand at a fundamental level because they involve many inputs, many outputs, and large amounts of data.

This project takes a different approach.

Instead of starting with a complex problem, we begin with a **simple, real-life decision** that everyone understands:

> **When should a driver press the gas pedal based on a traffic light?**

By modeling this everyday situation, we can clearly see what a neural network actually does, how it learns, and what each part of the network means.

---

## The Problem

A traffic light has three possible signals:

* 🔴 **Red**
* 🟡 **Yellow**
* 🟢 **Green**

At any moment, **only one light is on**.

A driver reacts to these signals by adjusting the gas pedal:

| Traffic Light | Gas Pedal Action     |
| ------------- | -------------------- |
| Red           | Do not press (0.0)   |
| Yellow        | Press slightly (0.1) |
| Green         | Press fully (1.0)    |

The goal of this project is to teach a neural network to **learn this behavior automatically** from examples, instead of hard-coding the rules.

---

## Why This Problem Is Ideal for Learning Neural Networks

This problem is intentionally simple, but it is not trivial. It allows us to demonstrate the **core ideas of neural networks** without unnecessary complexity.

### ✔ Real-life analogy

Everyone understands traffic lights and driving behavior.

### ✔ Minimal structure

* **3 inputs**: Red, Yellow, Green
* **1 output**: Gas pedal pressure

This makes the network easy to visualize and reason about.

### ✔ Continuous output

The output is a number between 0 and 1, which fits naturally with regression and linear neurons.

### ✔ Fully interpretable

Each weight in the network has a clear meaning:

* How strongly a light influences the driver’s action
* Whether its influence is positive or negative

---

## What This Project Teaches

Using this simple problem, we can clearly demonstrate:

* What a neuron really computes
* How inputs are combined using weights
* The role of bias in decision making
* How training adjusts weights over time
* Why neural networks are mathematical models, not magic

Once these concepts are understood, more complex problems—such as digit recognition or image classification—become much easier to grasp.

---

## Why Not Start with a Bigger Problem?

Many tutorials begin with problems like digit recognition or image classification. While impressive, these problems often hide the fundamentals behind layers of complexity.

In contrast, the traffic-light problem allows us to:

* See every calculation
* Visualize every connection
* Understand every learning step

This makes it an ideal **first neural network**.

---

## Summary

This project demonstrates that:

> **A neural network does not need to be large or complex to be meaningful.**

By teaching a neural network when to press the gas pedal, we build a strong foundation for understanding how neural networks work in the real world.
