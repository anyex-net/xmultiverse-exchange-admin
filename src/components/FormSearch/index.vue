<template>
    <el-form-item class="item-search">
        <!-- prettier-ignore -->
        <el-button type="primary" icon="search" @click="queryClick" size="small">搜索</el-button>
        <el-button class="btn-small" icon="refresh" size="small" @click="resetClick">重置</el-button>
    </el-form-item>
   
</template>

<script lang='ts' setup>
import { } from 'vue'
const emit = defineEmits<{
    (event: 'reset'): void
    (event: 'search'): void
}>()
const resetClick = () => {
    emit('reset')
}
const queryClick = () => {
    emit('search')
}

</script>
 
<style lang="scss" scoped>

</style>