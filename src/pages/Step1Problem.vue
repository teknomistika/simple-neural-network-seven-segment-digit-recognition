<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
const lights = ref([0, 0, 0])
const pressure = ref(0)
const pressures = [0.0, 0.5, 1.0]

let idx = 0
let timer = setInterval(() => {

    lights.value.forEach((v, i) => lights.value[i] = 0)
    pressure.value = pressures[idx]
    lights.value[idx++] = 1

    if (idx >= lights.value.length) idx = 0

}, 1000)

onUnmounted(() => {
    clearInterval(timer)
})

</script>

<template>
    <!-- <traffic-light with-sliders /> -->
    <v-card max-width="720px" class="ma-auto">
        <v-card-text class="text-justify">
            <h1 class="text-h5">Teaching a Neural Network When to Press the Gas Pedal</h1>
            <br />
            <p>Neural networks are often introduced using complex problems such as image recognition, digit
                classification, or natural language processing. While powerful, these examples can be difficult to
                understand at a fundamental level because they involve many inputs, many outputs, and large amounts
                of data. This project takes a different approach.</p>
            <p>Instead of starting with a complex problem, we begin with a <strong>simple, real-life
                    decision</strong> that everyone understands:</p>
            <br />
            <blockquote>
                <strong>When should a driver press the gas pedal based on a traffic light?</strong>
            </blockquote>
            <br />
            <p>By modeling this everyday situation, we can clearly see what a neural network actually does, how it
                learns, and what each part of the network means.</p>
        </v-card-text>
        <VDivider />
        <v-card-text>
            <h2>The Problem</h2>
            <br />
            <p>A traffic light has three possible signals:</p>
            <TrafficLight readonly :model-value="lights" class="py-4" />

            <p>At any moment, <strong>must be only one light is on</strong>.</p>
            <p>A driver reacts to these signals by adjusting the gas pedal,
                although the neural network produces a continuous output value, a real driver ultimately makes a
                discrete decision: <code>stop</code>, <code>wait</code>, or <code>go</code>.
                To bridge this gap, the gas pedal value is mapped into action categories based on simple thresholds.
            </p>

            The output of the neural network is interpreted as an intensity level, which is then converted into one of
            three driving actions:
            <VRow class="mb-2">
                <VCol cols="12" sm="8">
                    <table style="border-collapse: collapse;" class="my-3 border w-100">
                        <thead>
                            <tr>
                                <th>Traffic Light</th>
                                <th>Gas Pedal</th>
                                <th>Target</th>
                                <th>Threshold</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Red</td>
                                <td>Do not press </td>
                                <td><code>0.00</code></td>
                                <td><code> 0.00 - 0.25</code></td>
                                <td>STOP</td>
                            </tr>
                            <tr>
                                <td>Yellow</td>
                                <td>Press slightly </td>
                                <td><code>0.50</code></td>
                                <td><code>0.26 - 0.75</code></td>
                                <td>WAIT</td>
                            </tr>
                            <tr>
                                <td>Green</td>
                                <td>Press fully </td>
                                <td><code>1.00</code></td>
                                <td><code>0.76 - 1.00</code></td>
                                <td>GO</td>
                            </tr>
                        </tbody>
                    </table>
                </VCol>
                <VCol cols="12" sm="4" class="d-flex flex-column text-center justify-center">
                    Gas Pedal Pressure:
                    <GasPedal :model-value="pressure" />
                    <div>
                        <ActionChip :treshold="pressure" />
                    </div>
                </VCol>
            </VRow>

            <p>The goal of this project is to teach a neural network to <strong>learn this behavior
                    automatically</strong> from examples, instead of hard-coding the rules.</p>
        </v-card-text>

        <VDivider />
        <v-card-text>
            <h2>Why This Problem Is Ideal for Learning Neural Networks</h2>

            <p>This problem is intentionally simple, but it is not trivial. It allows us to demonstrate the
                <strong>core
                    ideas of neural networks</strong> without unnecessary complexity.
            </p>

            <h3>✔ Real-life analogy</h3>

            <p>Everyone understands traffic lights and driving behavior.</p>

            <h3>✔ Minimal structure</h3>

            <ul>
                <li><strong>3 inputs</strong>: Red, Yellow, Green</li>
                <li><strong>1 output</strong>: Gas pedal pressure</li>
            </ul>

            <p>This makes the network easy to visualize and reason about.</p>

            <h3>✔ Continuous output</h3>

            <p>The output is a number between 0 and 1, which fits naturally with regression and linear neurons.</p>

            <h3>✔ Fully interpretable</h3>

            <p>Each weight in the network has a clear meaning:</p>

            <ul>
                <li>How strongly a light influences the driver's action</li>
                <li>Whether its influence is positive or negative</li>
            </ul>
        </v-card-text>
        <VDivider />
        <v-card-text>
            <h2>What This Project Teaches</h2>

            <p>Using this simple problem, we can clearly demonstrate:</p>

            <ul>
                <li>What a neuron really computes</li>
                <li>How inputs are combined using weights</li>
                <li>The role of bias in decision making</li>
                <li>How training adjusts weights over time</li>
                <li>Why neural networks are mathematical models, not magic</li>
            </ul>

            <p>Once these concepts are understood, more complex problems—such as digit recognition or image
                classification—become much easier to grasp.</p>

        </v-card-text>
    </v-card>
</template>

<style scoped>
ul {
    margin-left: 20px;
    padding: 15px 0px;
}

th {
    background-color: rgb(var(--v-theme-background))
}

td,
th {
    padding: 6px;
}
</style>