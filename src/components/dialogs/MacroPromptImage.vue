<template>
    <span v-if="inline" class="d-inline-block text-center">
        <img v-if="!failed" :src="url" :alt="alt" :style="imgStyle" @error="failed = true" />
        <span v-else-if="alt">{{ alt }}</span>
    </span>
    <v-row v-else no-gutters>
        <v-col :class="['py-1', 'text-' + align]">
            <img v-if="!failed" :src="url" :alt="alt" :style="imgStyle" @error="failed = true" />
            <p v-else-if="alt" class="ma-0">{{ alt }}</p>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { escapePath } from '@/plugins/helpers'

// Image base dimension (scale=1) per dialog size — ~dialog width / 3. The image fits a
// base×base box (object-fit contain) so aspect is kept and height is bounded.
const SIZE_BASE_PX: Record<string, number> = { small: 133, normal: 200, large: 267, 'x-large': 333 }
const FULLSCREEN_BASE_VW = 33

@Component({})
export default class MacroPromptImage extends Mixins(BaseMixin) {
    @Prop({ type: String, required: true }) readonly path!: string
    @Prop({ type: String, default: '' }) readonly alt!: string
    @Prop({ type: Number, default: null }) readonly scale!: number | null
    @Prop({ type: Boolean, default: false }) readonly inline!: boolean
    @Prop({ type: String, default: 'normal' }) readonly dialogSize!: string
    @Prop({ type: String, default: 'center' }) readonly align!: string

    failed = false

    // path is an engine-validated `config/...` resource; Moonraker serves it at /server/files/<path>.
    // escapePath() handles spaces/#/?/% etc., matching all other Mainsail file-URL construction.
    get url(): string {
        const base = this.$store.getters['socket/getUrl']
        return `${base}/server/files/${escapePath(this.path)}`
    }

    // Box = base(dialog size) × scale (scale null/invalid → 1). Square box, object-fit contain →
    // aspect preserved and BOTH width and height bounded. full-screen uses vw so it tracks resizes.
    get imgStyle(): Record<string, string> {
        const s = this.scale && this.scale > 0 ? this.scale : 1
        const size = this.dialogSize || 'normal'
        const dim =
            size === 'full-screen'
                ? `${(FULLSCREEN_BASE_VW * s).toFixed(2)}vw`
                : `${Math.round((SIZE_BASE_PX[size] ?? SIZE_BASE_PX.normal) * s)}px`
        return { width: dim, height: dim, objectFit: 'contain' }
    }
}
</script>
