import { MutationTree } from 'vuex'
import { PromptModuleState } from '@/store/prompt/types'
import type { PromptState } from '@/util/prompt-protocol'

export const mutations: MutationTree<PromptModuleState> = {
    setPromptState(state, next: PromptState) {
        state.promptState = next
    },
}
