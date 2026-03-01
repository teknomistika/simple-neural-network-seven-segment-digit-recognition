import { createApp, type ComponentPublicInstance } from 'vue'
import 'unfonts.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import App from './App.vue'

const app = createApp(App).use(createVuetify())

// Import all components (vue and svg)
Object.entries(import.meta.glob('./components/*.(vue|svg)', {
    eager: true,
    import: 'default'
})).forEach(([k, v]) => {
    let { name, ext } = k.match(/\/(?<name>[^\/]+)\.(?<ext>.{3})$/).groups
    if (ext == 'svg')
        name = `${name}Svg`
    app.component(name, v)
})

app.mount('#app')

declare module 'vue' {
    // Register all components to make programmer happy :-)
    export interface GlobalComponents {
        ActionChip: typeof import('./components/ActionChip.vue').default
        Changes: typeof import('./components/Changes.vue').default
        ChipColor: typeof import('./components/ChipColor.vue').default
        DatasetDialog: typeof import('./components/DatasetDialog.vue').default
        GasPedal: typeof import('./components/GasPedal.vue').default
        ModelStats: typeof import('./components/ModelStats.vue').default
        SliderValue: typeof import('./components/SliderValue.vue').default
        TrafficLight: typeof import('./components/TrafficLight.vue').default
        TrainingStats: typeof import('./components/TrainingStats.vue').default
        TextColor: typeof import('./components/TextColor.vue').default
        TrainingVector: typeof import('./components/TrainingVector.vue').default
        TrainingVectorSvg: ComponentPublicInstance
        BulbSvg: ComponentPublicInstance
    }
}
