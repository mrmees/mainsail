import type { PromptState } from '@/util/prompt-protocol'

export interface PromptModuleState {
    // The engine's opaque, JSON-serializable reducer state.
    promptState: PromptState
}
