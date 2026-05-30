<template>
    <v-btn :color="color" :block="block" class="my-1" @click="sendGcode">{{ label }}</v-btn>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import type { PromptStyle } from '@/util/prompt-protocol'

// Map protocol semantic styles to Vuetify colors. 'secondary' → default (no color).
const STYLE_COLORS: Record<PromptStyle, string> = {
    primary: 'primary',
    secondary: '',
    info: 'info',
    warning: 'warning',
    error: 'error',
    success: 'success',
}

@Component({})
export default class MacroPromptButton extends Mixins(BaseMixin) {
    @Prop({ type: String, required: true }) readonly label!: string
    @Prop({ type: String, required: true }) readonly gcode!: string
    @Prop({ type: String, default: 'secondary' }) readonly buttonStyle!: PromptStyle
    // Content buttons fill their cell/container by default (spec: not label-sized).
    @Prop({ type: Boolean, default: true }) readonly block!: boolean

    get color(): string {
        return STYLE_COLORS[this.buttonStyle] ?? ''
    }

    sendGcode() {
        this.$store.dispatch('server/addEvent', { message: this.gcode, type: 'command' })
        this.$socket.emit('printer.gcode.script', { script: this.gcode })
    }
}
</script>
