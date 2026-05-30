import { describe, it, expect, vi } from 'vitest'
import { actions } from '@/store/prompt/actions'
import { getDefaultState } from '@/store/prompt/index'
import { promptView } from '@/util/prompt-protocol'

// Minimal Vuex action context harness.
function makeCtx() {
    const state = getDefaultState()
    const commit = vi.fn((type: string, payload: any) => {
        if (type === 'setPromptState') state.promptState = payload
    })
    return { state, commit, dispatch: vi.fn(), rootState: {} as any, ctx: () => ({ state, commit, dispatch: vi.fn() }) }
}

describe('prompt actions', () => {
    it('ingestRawLine folds a prompt line into state', () => {
        const h = makeCtx()
        ;(actions.ingestRawLine as any)({ state: h.state, commit: h.commit }, '// action:prompt_begin Hello')
        ;(actions.ingestRawLine as any)({ state: h.state, commit: h.commit }, '// action:prompt_text Hi')
        ;(actions.ingestRawLine as any)({ state: h.state, commit: h.commit }, '// action:prompt_show')
        const v = promptView(h.state.promptState)
        expect(v).toMatchObject({ visible: true, title: 'Hello', items: [{ type: 'text', text: 'Hi' }] })
    })

    it('ingestRawLine ignores non-prompt lines', () => {
        const h = makeCtx()
        ;(actions.ingestRawLine as any)({ state: h.state, commit: h.commit }, 'ok T:200 /210')
        expect(h.commit).not.toHaveBeenCalled()
    })

    it('replayGcodeStore rebuilds from broadcast responses and ignores outbound command entries', () => {
        const h = makeCtx()
        const store = [
            // outbound user command containing action:prompt_ — MUST be ignored:
            { type: 'command', message: 'RESPOND TYPE=command MSG="action:prompt_begin Bad"' },
            { type: 'response', message: '// action:prompt_begin Replayed' },
            { type: 'response', message: '// action:prompt_text back' },
            { type: 'response', message: '// action:prompt_show' },
        ]
        ;(actions.replayGcodeStore as any)({ commit: h.commit }, store)
        const v = promptView(h.state.promptState)
        expect(v).toMatchObject({ visible: true, title: 'Replayed', items: [{ type: 'text', text: 'back' }] })
    })

    it('reset clears an active prompt', () => {
        const h = makeCtx()
        ;(actions.ingestRawLine as any)({ state: h.state, commit: h.commit }, '// action:prompt_begin X')
        ;(actions.ingestRawLine as any)({ state: h.state, commit: h.commit }, '// action:prompt_show')
        ;(actions.reset as any)({ state: h.state, commit: h.commit })
        expect(promptView(h.state.promptState).visible).toBe(false)
    })
})
