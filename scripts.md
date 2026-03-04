Neural networks are often explained using complex examples like image recognition or language models.
But what if we could understand a neural network by teaching it something we already know?

In this video, we’ll teach a neural network "when to press the gas pedal", using a traffic light!


## Step 1 — Problem (screen 1)

Let’s start with the problem.

A traffic light has three signals: red, yellow, and green.
At any moment, only one light is on.

A human driver reacts to these signals intuitively:
red means stop, yellow means slow down or wait, and green means go.

Our goal is simple: teach a neural network to learn this behavior automatically.

Not with rules…
but by learning from examples.

*(pause briefly, let the viewer read)*

## Step 2 — Dataset (screen 2)

To teach a neural network, we need data.

Each training sample contains two things:
the state of the traffic light,
and the gas pedal pressure a driver would apply.

Red light produces zero pressure.
Yellow produces a small amount.
Green produces full pressure.

Although the neural network outputs a continuous value,
we later convert that value into actions:
stop, wait, or go.

This separation is important.
The network predicts intensity —
the decision logic comes afterward.


---

## Step 3 — Training (screen 3)

Now let’s look inside the neural network while it learns.

This network has:
three inputs,
one neuron,
and a single output.

Each input is multiplied by a weight.
These values are summed together, and a bias is added.

This is the entire neural network.

During training, the network:
makes a prediction,
compares it with the correct answer,
computes the error,
and adjusts the weights.

Nothing magical happens here.
Just math.

As training progresses, the loss decreases,
and the weights begin to represent meaningful relationships:
green becomes strongly positive,
red becomes strongly negative or neutral.


*(let the viewer watch values change)*

---

## Step 4 — Inference (screen 4)

Finally, we use the trained network to make a decision.

We turn on a light,
feed it into the network,
and observe the output.

The output is a number —
an intensity level.

That value is then mapped into a clear action:
stop, wait, or go.

This is how neural networks are used in real systems:
continuous prediction,
followed by simple decision thresholds.

---

## Closing (10–15 seconds)

This neural network is intentionally small.
But it contains everything that larger networks use:
weights, bias, loss, and learning.

By understanding this simple example,
you build intuition that scales to much more complex AI systems.

Neural networks are not magic.
They are understandable,
visual,
and learnable —
one neuron at a time.

---

## Optional call to action

> “In the next lesson, we’ll extend this idea
> and explore what happens when inputs become noisy,
> ambiguous,
> or conflicting.”

> “Thanks for watching.”
