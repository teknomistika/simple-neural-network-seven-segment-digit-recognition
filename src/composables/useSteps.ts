import { ref } from "vue"

const steps = [
    { id: 1, key: "dataset", title: "Dataset Creation" },
    { id: 2, key: "train", title: "Training Process" },
    { id: 3, key: "infer", title: "Inference & Test" }
]

const currentStep = ref(1)

export function useSteps() {
    function setStep(id) {
        currentStep.value = id
    }

    return {
        steps,
        currentStep,
        setStep
    }
}
