import { ActionTree } from 'vuex'
import Vue from 'vue'
import { PromptModuleState } from '@/store/prompt/types'
import { RootState } from '@/store/types'
import { parseAction, reducePrompt, disconnectEvent, initialPromptState } from '@/util/prompt-protocol'

const ENGINE_OPTS = { frontendId: 'mainsail', frontendCategories: ['web'] }

export const actions: ActionTree<PromptModuleState, RootState> = {
    // Raw, UNFILTERED tap from notify_gcode_response — never goes through the console filter.
    ingestRawLine({ state, commit }, rawLine: string) {
        if (typeof rawLine !== 'string' || !rawLine.startsWith('// action:prompt_')) return
        const event = parseAction(rawLine)
        if (event) commit('setPromptState', reducePrompt(state.promptState, event))
    },

    // Rebuild prompt state from the buffered gcode_store on (re)connect.
    // This is authoritative: per the protocol's reset-then-replay reconnect model, it rebuilds from
    // a fresh state over buffered history. A live prompt_begin arriving in the brief window between
    // the gcode_store snapshot and this commit could be overwritten, but Moonraker's snapshot
    // normally already contains it, so it is recovered here.
    replayGcodeStore({ commit }, gcodeStore: Array<{ type?: string; message: string }>) {
        let s = initialPromptState(ENGINE_OPTS)
        for (const entry of gcodeStore ?? []) {
            // Only Klipper's broadcast RESPONSES count. Never replay outbound `command`
            // entries — e.g. a user's own `RESPOND TYPE=command MSG="action:prompt_begin Bad"`
            // is stored as a command and must NOT be treated as a prompt broadcast.
            if (!entry || entry.type === 'command') continue
            const message = entry.message
            if (typeof message !== 'string' || !message.startsWith('// action:prompt_')) continue
            const event = parseAction(message)
            if (event) s = reducePrompt(s, event)
        }
        commit('setPromptState', s)
    },

    // Klipper/Moonraker disconnect — clear active prompt + pending metadata.
    reset({ state, commit }) {
        commit('setPromptState', reducePrompt(state.promptState, disconnectEvent()))
    },

    // Close control: tell Klipper to end the prompt (broadcast to all clients).
    closePrompt() {
        const gcode = 'RESPOND TYPE=command MSG="action:prompt_end"'
        Vue.$socket.emit('printer.gcode.script', { script: gcode })
    },
}
