<template>
    <v-row no-gutters :justify="justify">
        <v-col v-for="(button, index) in children" :key="index" class="text-center px-1">
            <macro-prompt-button :label="button.label" :gcode="button.gcode" :button-style="button.style" block />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import type { PromptButtonItem } from '@/util/prompt-protocol'
import MacroPromptButton from '@/components/dialogs/MacroPromptButton.vue'

@Component({ components: { MacroPromptButton } })
export default class MacroPromptButtonGroup extends Mixins(BaseMixin) {
    @Prop({ type: Array, required: true }) readonly children!: PromptButtonItem[]
    // Top-level prompt_align. Grouped cells span full width so this is center-equivalent today, but
    // it is wired through so the container honors alignment per spec and stays forward-compatible.
    @Prop({ type: String, default: 'center' }) readonly align!: string

    get justify(): string {
        if (this.align === 'left') return 'start'
        if (this.align === 'right') return 'end'
        return 'center'
    }
}
</script>
