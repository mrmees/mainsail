<template>
    <p v-if="inline" class="mb-0 d-inline-block" style="white-space: pre-wrap">{{ text }}</p>
    <v-row v-else>
        <v-col>
            <p class="mb-0" style="white-space: pre-wrap">{{ text }}</p>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'

@Component({})
export default class MacroPromptText extends Mixins(BaseMixin) {
    @Prop({ type: String, required: true }) readonly text!: string
    @Prop({ type: Boolean, default: false }) readonly inline!: boolean
}
</script>
