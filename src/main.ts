import { createApp } from 'vue'
import App from './App.vue'
import uiUtil from './utils/ui.util'

declare module 'vue' {
    export interface GlobalComponents {
        ActionChip: typeof import('./components/ActionChip.vue').default
        Changes: typeof import('./components/Changes.vue').default
        ChipColor: typeof import('./components/ChipColor.vue').default
        DatasetDialog: typeof import('./components/DatasetDialog.vue').default
        GasPedal: typeof import('./components/GasPedal.vue').default
        ModelStats: typeof import('./components/ModelStats.vue').default
        NeuralNetwork: typeof import('./components/NeuralNetwork.vue').default
        SliderValue: typeof import('./components/SliderValue.vue').default
        TrafficLight: typeof import('./components/TrafficLight.vue').default
        TrainingStats: typeof import('./components/TrainingStats.vue').default
        TextColor: typeof import('./components/TextColor.vue').default
    }
}

const app = createApp(App).use(uiUtil)
Object.entries(import.meta.glob('./components/*.vue', {
    eager: true,
    import: 'default'
})).forEach(([k, v]) => {
    const cName = k.match(/\/(?<name>[^\/]+)\.vue/).groups.name
    console.debug(cName, v)
    app.component(cName, v)
}
)

app.mount('#app')
