<template>
    <!-- Aligned (left/right): shrink to content and position with flex justify. -->
    <div v-if="align !== 'center'" class="d-flex my-1" :class="justifyClass">
        <v-btn :color="color" @click="sendGcode">{{ label }}</v-btn>
    </div>
    <!-- Center (default): fill the container/cell, matching the centered full-width convention. -->
    <v-btn v-else :color="color" :block="block" class="my-1" @click="sendGcode">{{ label }}</v-btn>
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
    // Top-level horizontal alignment (prompt_align). Cells inside rows/groups never pass this.
    @Prop({ type: String, default: 'center' }) readonly align!: string

    get color(): string {
        return STYLE_COLORS[this.buttonStyle] ?? ''
    }

    get justifyClass(): string {
        if (this.align === 'left') return 'justify-start'
        if (this.align === 'right') return 'justify-end'
        return 'justify-center'
    }

    sendGcode() {
        this.$store.dispatch('server/addEvent', { message: this.gcode, type: 'command' })
        this.$socket.emit('printer.gcode.script', { script: this.gcode })
    }
}
</script>
