<template>
    <div :class="{ hidden: hidden }" class="pagination-container">
        <el-pagination class="pagination-container-item" :background="background" v-model:current-page="currentPage" v-model:page-size="pageSize"
            :layout="layout" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>

<script lang='ts' setup>
import {scrollTo} from "@/utils/scroll-to";
import { computed ,defineComponent} from 'vue';
const props = defineProps({
    total: {
        required: true,
        type: Number,
    },
    page: {
        type: Number,
        default: 1,
    },
    limit: {
        type: Number,
        default: 20,
    },
    layout: {
        type: String,
        default: "total, sizes, prev, pager, next, jumper",
    },
    background: {
        type: Boolean,
        default: true,
    },
    autoScroll: {
        type: Boolean,
        default: true,
    },
    hidden: {
        type: Boolean,
        default: false,
    },
})
 const emit = defineEmits<{
   (event: 'update:page', val: number): void
   (event: 'update:limit', val: number): void
   (event: 'pagination', val: any): void
 }>()

const currentPage = computed({
    get(){
        return props.page
    },
    set(val){

       emit("update:page", val);
    }
})
const pageSize = computed({
    get() {
        return props.limit;
    },
    set(val) {
       emit("update:limit", val);
    },
});
const handleSizeChange = (val:number) => {
    if (currentPage.value * val > props.total) {
        currentPage.value = 1;
    }
    emit("pagination", { page: currentPage.value, limit: val });
    if (props.autoScroll) {
        scrollTo(0, 800,Function);
    }
};
const handleCurrentChange = (val:number) => {
    emit("pagination", { page: val, limit: pageSize.value });
    if (props.autoScroll) {
        scrollTo(0, 800,Function);
    }
};
</script>

<style  scoped>
.pagination-container {
    background: #fff;
   display: flex;
    justify-content: flex-end;
}
.pagination-container-item{
    margin-right: 20px;
}
.pagination-container.hidden {
	display: none;
}
</style>
