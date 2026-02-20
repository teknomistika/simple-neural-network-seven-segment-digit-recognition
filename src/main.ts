import { createApp } from 'vue'
import App from './App.vue'
import uiUtil from './utils/ui.util'
import VueKonva from 'vue-konva';

const app = createApp(App).use(uiUtil).use(VueKonva, { prefix: 'k' })
Object.entries(import.meta.glob('./components/*.vue', {
    eager: true,
    import: 'default'
})).forEach(([k, v]) => {
    const cName = k.match(/\/(?<name>[^\/]+)\.vue/).groups.name
    app.component(cName, v)
}
)

app.mount('#app')

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
        TrainingStage: typeof import('./components/TrainingStage.vue').default

        // Rename Konva components with prefix
        KArc: GlobalComponents['Arc']
        KArrow: GlobalComponents['Arrow']
        KCircle: GlobalComponents['Circle']
        KEllipse: GlobalComponents['Ellipse']
        KFastLayer: GlobalComponents['FastLayer']
        KGroup: GlobalComponents['Group']
        KImage: GlobalComponents['Image']
        KLabel: GlobalComponents['Label']
        KLayer: GlobalComponents['Layer']
        KLine: GlobalComponents['Line']
        KPath: GlobalComponents['Path']
        KRect: GlobalComponents['Rect']
        KRegularPolygon: GlobalComponents['RegularPolygon']
        KRing: GlobalComponents['Ring']
        KShape: GlobalComponents['Shape']
        KSprite: GlobalComponents['Sprite']
        KStar: GlobalComponents['Star']
        KTag: GlobalComponents['Tag']
        KText: GlobalComponents['Text']
        KTextPath: GlobalComponents['TextPath']
        KTransformer: GlobalComponents['Transformer']
        KWedge: GlobalComponents['Wedge']
    }
}
