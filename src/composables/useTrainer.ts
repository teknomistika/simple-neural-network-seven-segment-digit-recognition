import { reactive, ref, shallowReactive, watch, type Ref } from "vue";
import { useDatasets } from "./useDatasets";
import { useModel } from "./useModel";
import { getActionCategory } from "@/utils/traffic-light.util";

const { datasets } = useDatasets()
const { model, train } = useModel()

const predictState = reactive({
    inputs: [NaN, NaN, NaN],
    output: NaN,
    target: NaN
})


/** unique digits */
// const actions = [...new Set(samples.map(v => v.action))]


function selectSample(sampleIndex?: number) {

}
export function useTrainer() {
    return { predictState }
}