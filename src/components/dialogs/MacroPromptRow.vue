<template>
    <v-row no-gutters align="center">
        <v-col v-for="(child, index) in children" :key="index" class="text-center px-1">
            <macro-prompt-text v-if="child.type === 'text'" :text="child.text" inline />
            <macro-prompt-markup
                v-else-if="child.type === 'markup'"
                :markup="child.markup"
                :plain-text="child.plain_text"
                inline />
            <macro-prompt-image
                v-else-if="child.type === 'image'"
                :path="child.path"
                :alt="child.alt"
                :scale="child.scale"
                :dialog-size="dialogSize"
                inline />
            <macro-prompt-button
                v-else-if="child.type === 'button'"
                :label="child.label"
                :gcode="child.gcode"
                :button-style="child.style" />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import type { PromptInlineItem } from '@/util/prompt-protocol'
import MacroPromptText from '@/components/dialogs/MacroPromptText.vue'
import MacroPromptMarkup from '@/components/dialogs/MacroPromptMarkup.vue'
import MacroPromptImage from '@/components/dialogs/MacroPromptImage.vue'
import MacroPromptButton from '@/components/dialogs/MacroPromptButton.vue'

@Component({ components: { MacroPromptText, MacroPromptMarkup, MacroPromptImage, MacroPromptButton } })
export default class MacroPromptRow extends Mixins(BaseMixin) {
    @Prop({ type: Array, required: true }) readonly children!: PromptInlineItem[]
    @Prop({ type: String, default: 'normal' }) readonly dialogSize!: string
}
</script>
