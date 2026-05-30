<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue'
import { VRow, VCol } from 'vuetify/lib'
import BaseMixin from '@/components/mixins/base'
import { parseMarkup } from '@/util/prompt-protocol'
import type { MarkupNode } from '@/util/prompt-protocol'

const SIZE_FONT: Record<string, string> = {
    small: '0.75rem',
    normal: '1rem',
    large: '1.5rem',
    'x-large': '2rem',
}

@Component({})
export default class MacroPromptMarkup extends Mixins(BaseMixin) {
    @Prop({ type: String, required: true }) readonly markup!: string
    @Prop({ type: String, required: true }) readonly plainText!: string
    @Prop({ type: Boolean, default: false }) readonly inline!: boolean

    get ast(): MarkupNode[] {
        try {
            return parseMarkup(this.markup)
        } catch {
            return [{ type: 'text', text: this.plainText }]
        }
    }

    renderNode(h: CreateElement, node: MarkupNode): VNode | string {
        if (node.type === 'text') return node.text
        const children = node.children.map((c) => this.renderNode(h, c))
        switch (node.tag) {
            case 'b':
            case 'i':
            case 'u':
                return h(node.tag, children)
            case 'color':
                return h('span', { style: { color: node.value } }, children)
            case 'bgcolor':
                return h('span', { style: { backgroundColor: node.value } }, children)
            case 'size':
                return h('span', { style: { fontSize: SIZE_FONT[node.value] ?? '1rem' } }, children)
            default:
                return h('span', children)
        }
    }

    render(h: CreateElement): VNode {
        const content = h(
            'p',
            { staticClass: 'ma-0', class: { 'd-inline-block': this.inline }, style: { whiteSpace: 'pre-wrap' } },
            this.ast.map((n) => this.renderNode(h, n))
        )
        // Inline (inside a row): no grid wrapper. Otherwise wrap as a block row.
        // NOTE: Vuetify components are NOT globally registered (Mainsail auto-imports them into
        // <template> blocks via unplugin-vue-components). A hand-written render function never goes
        // through that transform, so we must reference the imported VRow/VCol options directly —
        // string tags 'v-row'/'v-col' would resolve as unknown elements at runtime.
        if (this.inline) return content
        return h(VRow, { props: { noGutters: true } }, [h(VCol, { staticClass: 'py-1' }, [content])])
    }
}
</script>
