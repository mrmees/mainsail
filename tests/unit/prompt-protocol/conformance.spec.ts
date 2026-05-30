import { describe, it, expect } from 'vitest'
import doc from './fixtures.json'
import {
    initialPromptState,
    reducePrompt,
    parseAction,
    disconnectEvent,
    promptView,
} from '@/util/prompt-protocol'

const OPTS = { frontendId: 'mainsail', frontendCategories: ['web'] }
const EXACT_KEYS = ['footer_buttons', 'items', 'size', 'targets', 'title', 'visible']

const fixtures = (doc as any).fixtures as Array<{
    id: string
    level: 'core' | 'optional'
    events: string[]
    expected?: any
    expected_by_frontend?: Record<string, any>
    skip?: boolean
}>

describe.each(fixtures.filter((f) => f.skip !== true))('prompt fixture: $id ($level)', (fx) => {
    it('produces the expected normalized view', () => {
        let s = initialPromptState(OPTS)
        for (const line of fx.events) {
            const ev = line === '__disconnect__' ? disconnectEvent() : parseAction(line)
            if (ev) s = reducePrompt(s, ev)
        }
        const expected = fx.expected_by_frontend?.mainsail ?? fx.expected_by_frontend?.fluidd ?? fx.expected
        if (!expected) throw new Error(`fixture ${fx.id} has no expected state`)
        const view = promptView(s)
        expect(Object.keys(view).sort()).toEqual(EXACT_KEYS)
        expect(view).toMatchObject(expected)
    })
})
