import { Module } from 'vuex'
import { RootState } from '@/store/types'
import { PromptModuleState } from '@/store/prompt/types'
import { initialPromptState } from '@/util/prompt-protocol'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'

export const getDefaultState = (): PromptModuleState => ({
    promptState: initialPromptState({ frontendId: 'mainsail', frontendCategories: ['web'] }),
})

const state = getDefaultState()

export const prompt: Module<PromptModuleState, RootState> = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
