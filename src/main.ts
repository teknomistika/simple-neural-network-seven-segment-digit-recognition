import { createApp } from 'vue'
import App from './App.vue'
import uiUtil from './utils/ui.util'
import VueKonva from 'vue-konva';

const app = createApp(App).use(uiUtil).use(VueKonva, { prefix: 'konva' })
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
        KonvaArc: GlobalComponents['Arc']
        KonvaArrow: GlobalComponents['Arrow']
        KonvaCircle: GlobalComponents['Circle']
        KonvaEllipse: GlobalComponents['Ellipse']
        KonvaFastLayer: GlobalComponents['FastLayer']
        KonvaGroup: GlobalComponents['Group']
        KonvaImage: GlobalComponents['Image']
        KonvaLabel: GlobalComponents['Label']
        KonvaLayer: GlobalComponents['Layer']
        KonvaLine: GlobalComponents['Line']
        KonvaPath: GlobalComponents['Path']
        KonvaRect: GlobalComponents['Rect']
        KonvaRegularPolygon: GlobalComponents['RegularPolygon']
        KonvaRing: GlobalComponents['Ring']
        KonvaShape: GlobalComponents['Shape']
        KonvaSprite: GlobalComponents['Sprite']
        KonvaStar: GlobalComponents['Star']
        KonvaTag: GlobalComponents['Tag']
        KonvaText: GlobalComponents['Text']
        KonvaTextPath: GlobalComponents['TextPath']
        KonvaTransformer: GlobalComponents['Transformer']
        KonvaWedge: GlobalComponents['Wedge']
    }
}
