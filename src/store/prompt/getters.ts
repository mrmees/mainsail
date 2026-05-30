import { GetterTree } from 'vuex'
import { PromptModuleState } from '@/store/prompt/types'
import { RootState } from '@/store/types'
import { promptView, promptEpoch } from '@/util/prompt-protocol'
import type { PromptView } from '@/util/prompt-protocol'

export const getters: GetterTree<PromptModuleState, RootState> = {
    // Cached like a computed; deep-cloned by the engine so it is safe to render.
    getView(state): PromptView {
        return promptView(state.promptState)
    },
    getEpoch(state): number {
        return promptEpoch(state.promptState)
    },
    isVisible(state, localGetters): boolean {
        return localGetters.getView.visible
    },
}
