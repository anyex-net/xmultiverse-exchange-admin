<template>
    <component :is="type" v-bind="linkProps(to)">
        <slot />
    </component>
</template>

<script lang='ts' setup>
import { isExternal } from "@/utils/validate"
import { ref, computed } from 'vue'
const props = defineProps({
    to: {
        type: String,
        required: true
    }
})
const isExternals = computed(() => isExternal(props.to))
const type = computed(() => {
    if (isExternals) {
        return 'a'
    }
    return 'router-link'
}
)
function linkProps(to:string) {
    if (isExternals) {
        return {
            // href: to,
            target: '_blank',
            rel: 'noopener'
        }
    }
    return {
        to: to
    }
}
</script>
 
<style lang="scss" scoped>

</style>