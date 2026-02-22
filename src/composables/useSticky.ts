import { watch, type Ref } from "vue";
import { useLayout } from "vuetify";


export function useSticky(el: Ref<HTMLElement>) {
    const layout = useLayout()
    const scrollContainer: HTMLDivElement = document.querySelector('main.v-main > .v-container')
    let inlineTopOffset = Infinity
    let isSticky = false

    const onScroll = () => {
        if (scrollContainer.scrollTop > inlineTopOffset) {
            if (!isSticky) {
                isSticky = true
                el.value.style.position = 'fixed'

            }
        } else {
            if (isSticky) {
                isSticky = false
                el.value.style.position = ''
            }
        }
    }
    scrollContainer.addEventListener('scroll', onScroll, { passive: true })

    const stopEl = watch(el, v => {
        if (!v) return
        inlineTopOffset = v.offsetTop
        el.value.style.top = layout.mainRect.value.top.toString() + 'px'
    }, { immediate: true })

    return {
        stop() {
            console.debug('STOP')
            stopEl()
            scrollContainer.removeEventListener('scroll', onScroll)
        }
    }
}