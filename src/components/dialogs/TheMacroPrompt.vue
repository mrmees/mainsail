<template>
    <v-dialog :value="view.visible" :width="dialogWidth" persistent :fullscreen="isFullscreen">
        <panel
            :title="view.title"
            :icon="mdiInformation"
            card-class="macro_prompt-dialog"
            :margin-bottom="false"
            style="overflow: hidden">
            <template #buttons>
                <v-btn icon tile @click="closePrompt">
                    <v-icon>{{ mdiCloseThick }}</v-icon>
                </v-btn>
            </template>
            <v-card-text class="text-center">
                <template v-for="(item, index) in view.items">
                    <macro-prompt-text v-if="item.type === 'text'" :key="itemKey(index)" :text="item.text" />
                    <macro-prompt-markup
                        v-else-if="item.type === 'markup'"
                        :key="itemKey(index)"
                        :markup="item.markup"
                        :plain-text="item.plain_text" />
                    <macro-prompt-image
                        v-else-if="item.type === 'image'"
                        :key="itemKey(index)"
                        :path="item.path"
                        :alt="item.alt"
                        :scale="item.scale"
                        :dialog-size="view.size || 'normal'" />
                    <macro-prompt-button
                        v-else-if="item.type === 'button'"
                        :key="itemKey(index)"
                        :label="item.label"
                        :gcode="item.gcode"
                        :button-style="item.style" />
                    <macro-prompt-row
                        v-else-if="item.type === 'row'"
                        :key="itemKey(index)"
                        :children="item.children"
                        :dialog-size="view.size || 'normal'" />
                    <macro-prompt-button-group
                        v-else-if="item.type === 'button_group'"
                        :key="itemKey(index)"
                        :children="item.children" />
                </template>
            </v-card-text>
            <v-card-actions v-if="view.footer_buttons.length">
                <v-spacer />
                <macro-prompt-footer-button
                    v-for="(button, index) in view.footer_buttons"
                    :key="footerKey(index)"
                    :label="button.label"
                    :gcode="button.gcode"
                    :button-style="button.style" />
            </v-card-actions>
        </panel>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import Panel from '@/components/ui/Panel.vue'
import { mdiCloseThick, mdiInformation } from '@mdi/js'
import type { PromptView } from '@/util/prompt-protocol'
import MacroPromptText from '@/components/dialogs/MacroPromptText.vue'
import MacroPromptMarkup from '@/components/dialogs/MacroPromptMarkup.vue'
import MacroPromptImage from '@/components/dialogs/MacroPromptImage.vue'
import MacroPromptButton from '@/components/dialogs/MacroPromptButton.vue'
import MacroPromptRow from '@/components/dialogs/MacroPromptRow.vue'
import MacroPromptButtonGroup from '@/components/dialogs/MacroPromptButtonGroup.vue'
import MacroPromptFooterButton from '@/components/dialogs/MacroPromptFooterButton.vue'

const SIZE_WIDTHS: Record<string, number> = { small: 400, normal: 600, large: 800, 'x-large': 1000 }

@Component({
    components: {
        Panel,
        MacroPromptText,
        MacroPromptMarkup,
        MacroPromptImage,
        MacroPromptButton,
        MacroPromptRow,
        MacroPromptButtonGroup,
        MacroPromptFooterButton,
    },
})
export default class TheMacroPrompt extends Mixins(BaseMixin) {
    mdiInformation = mdiInformation
    mdiCloseThick = mdiCloseThick

    get view(): PromptView {
        return this.$store.getters['prompt/getView']
    }

    get epoch(): number {
        return this.$store.getters['prompt/getEpoch']
    }

    get isFullscreen(): boolean {
        return this.isMobile || this.view.size === 'full-screen'
    }

    get dialogWidth(): number {
        return SIZE_WIDTHS[this.view.size ?? 'normal'] ?? SIZE_WIDTHS.normal
    }

    // Epoch-prefixed keys: a new prompt_begin bumps the epoch so Vue never reuses stale vnodes.
    itemKey(index: number): string {
        return `${this.epoch}:item:${index}`
    }

    footerKey(index: number): string {
        return `${this.epoch}:footer:${index}`
    }

    closePrompt() {
        this.$store.dispatch('prompt/closePrompt')
    }
}
</script>

<style scoped></style>
