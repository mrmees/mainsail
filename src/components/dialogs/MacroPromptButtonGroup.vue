<template>
    <v-row no-gutters>
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
}
</script>
