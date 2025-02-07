<template>
  <div class="app-container">
    <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch"
             label-width="70px">
      <el-form-item label="类型" prop="type">
        <el-select style="width: 215px" v-model="queryParams.type" @change="handleQuery"
                   placeholder="请选择" clearable>
          <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="dt">
          <el-date-picker
              v-model="queryParams.dt"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled-date="disableConfig"
              pack-options="op"
              @change="handleQuery()"
          >
          </el-date-picker>
      </el-form-item>
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>
    <div id="depositChart" style="width: 90%; height: 400px"></div>
    <div id="withdrawChart" style="width: 90%; height: 400px"></div>
    <div id="flowChart" style="width: 90%; height: 400px"></div>
  </div>
</template>

<script lang="ts" name="assetStatistics" setup>
import assetStatistics from "@/api/request/operation/assetStatistics";
// prettier-ignore
const {
    loading,
    single,
    multiple,
    open,
    showSearch,
    total,
    configList,
    title,
    queryParams,
    queryFormRef,
    form,
    formRef,
    rules,
    getList,
    cancel,
    handleQuery,
    resetQuery,
    handleAdd,
    handleSelectionChange,
    handleUpdate,
    pageTableRef,
    cleanSelect,
    typeList
} = assetStatistics();
// 限制日期选择器的范围
const disableConfig = (time: Date) => {
  return time.getTime() >  Date.now() ||  time.getTime() < Date.now()- 31*24*3600000;
};
</script>

<style lang="scss" scoped>
.mRbox {
    width: 100%;
    font-weight: 400;
    margin-left: 30px;
    border-bottom: 1px dotted #dfdcdc;
    display: flex;
    justify-content: flex-end;
}
</style>
