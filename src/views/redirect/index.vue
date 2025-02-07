<template>
    <div></div>
</template>

<script lang='ts' setup>
// import {VNode,h} from 'vue';
import {useRoute,useRouter} from "vue-router"
const route=useRoute();
const router=useRouter();
const {params,query} =route;
const {path}=params
router.replace({path:"/"+path,query});
// function render(h:any){
//     return h();
// }
</script>

<style lang="scss" scoped>

</style>
