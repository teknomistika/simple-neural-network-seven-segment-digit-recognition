import { shallowReactive, watch, type Ref } from "vue";


export function useSizeWatcher(el: Ref<HTMLElement>, ratio: number) {
    // Guest width, assume the padding is 16px, scroll width is 15px
    const guessWidth = document.body.clientWidth - 16 * 2 - 15
    const guessHeight = guessWidth / ratio
    const size = shallowReactive({
        w: guessWidth, h: guessHeight
    })
    const resizeObserver = new ResizeObserver(entries => {
        size.w = entries[0].contentRect.width;
        size.h = entries[0].contentRect.height;
    })
    let w = watch(el, e => {
        if (e) {
            resizeObserver.observe(e)
            w()
            // start unwatcher
            let u = watch(el, e => {
                if (!e) {
                    u()
                    resizeObserver.disconnect()
                }
            })
        }
    })
    return size
}