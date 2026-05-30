<template>
    <v-btn :color="color" text @click="sendGcode">{{ label }}</v-btn>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import type { PromptStyle } from '@/util/prompt-protocol'

const STYLE_COLORS: Record<PromptStyle, string> = {
    primary: 'primary',
    secondary: '',
    info: 'info',
    warning: 'warning',
    error: 'error',
    success: 'success',
}

@Component({})
export default class MacroPromptFooterButton extends Mixins(BaseMixin) {
    @Prop({ type: String, required: true }) readonly label!: string
    @Prop({ type: String, required: true }) readonly gcode!: string
    @Prop({ type: String, default: 'secondary' }) readonly buttonStyle!: PromptStyle

    get color(): string {
        return STYLE_COLORS[this.buttonStyle] ?? ''
    }

    sendGcode() {
        this.$store.dispatch('server/addEvent', { message: this.gcode, type: 'command' })
        this.$socket.emit('printer.gcode.script', { script: this.gcode })
    }
}
</script>
