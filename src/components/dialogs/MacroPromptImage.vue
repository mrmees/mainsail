<template>
    <span v-if="inline" class="d-inline-block text-center">
        <img v-if="!failed" :src="url" :alt="alt" :style="imgStyle" @error="failed = true" />
        <span v-else-if="alt">{{ alt }}</span>
    </span>
    <v-row v-else no-gutters>
        <v-col class="text-center py-1">
            <img v-if="!failed" :src="url" :alt="alt" :style="imgStyle" @error="failed = true" />
            <p v-else-if="alt" class="ma-0">{{ alt }}</p>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { escapePath } from '@/plugins/helpers'

@Component({})
export default class MacroPromptImage extends Mixins(BaseMixin) {
    @Prop({ type: String, required: true }) readonly path!: string
    @Prop({ type: String, default: '' }) readonly alt!: string
    @Prop({ type: Number, default: null }) readonly scale!: number | null
    @Prop({ type: Boolean, default: false }) readonly inline!: boolean

    failed = false

    // path is an engine-validated `config/...` resource; Moonraker serves it at /server/files/<path>.
    // escapePath() handles spaces/#/?/% etc., matching all other Mainsail file-URL construction.
    get url(): string {
        const base = this.$store.getters['socket/getUrl']
        return `${base}/server/files/${escapePath(this.path)}`
    }

    get imgStyle(): Record<string, string> {
        const max = this.scale && this.scale > 0 ? `${Math.round(this.scale * 100)}%` : '100%'
        return { maxWidth: max, height: 'auto' }
    }
}
</script>
