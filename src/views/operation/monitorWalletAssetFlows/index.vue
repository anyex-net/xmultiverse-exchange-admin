<template>
    <div class="app-container">
        <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch"
            label-width="70px">
            <!-- <el-form-item label="币种" prop="currency">
                <el-input v-model="queryParams.currency" placeholder="请输入" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item> -->
            <el-form-item label="账户ID" prop="accountId">
                <el-input v-model="queryParams.accountId" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="监控状态" prop="monitorStatus">
                <el-select style="width: 215px" v-model="queryParams.monitorStatus" @change="handleQuery"
                    placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <form-search @reset="resetQuery()" @search="handleQuery()" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
        </el-row>
        <div class="self-table">
            <el-table size="small" stripe v-loading="loading" ref="pageTableRef" :data="configList"
                @selection-change="handleSelectionChange">
              <el-table-column label="账户ID" prop="accountId" min-width="140px"/>
              <el-table-column label="最后一次监控时间" prop="lastMonitorTime" min-width="140px">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.lastMonitorTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="监控状态" prop="monitorStatus" min-width="120px">
                <template #default="scope">
                  <span v-if="scope.row.monitorStatus == 1">正常</span>
                  <span style="color:red;" v-if="scope.row.monitorStatus == 0">异常</span>
                </template>
              </el-table-column>
                <el-table-column label="监控内容" prop="remark" min-width="100px"  />
                <el-table-column label="创建时间" prop="createTime" min-width="140px">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" prop="updateTime" min-width="140px">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current" v-model:limit="queryParams.size"
            @pagination="getList()" />
    </div>
</template>

<script lang="ts" name="monitorWalletAssetFlows" setup>
import monitorWalletAssetFlows from "@/api/request/operation/monitorWalletAssetFlows/index";
import stacky from "../../../utils/table-sticky";

const {
    getContainer,
    clearListener,
    initFixedHeader,
    updateFixedRight,
    resizeChange,
    getFixedDom,
    setFixedStyle,
    clearFixedStyle,
    headerDragend,
    scrollEvent,
    getTableXy,
    getDom,
    updateHeaderHeight,
    tablexy,
    fixedRightDom,
    fixedLeftDom,
    scrollDom,
    parentDom,
    tableWidth,
    timerList,
    tableDom,
    containerDom,
    __opened,
    parent,
    setScrollXWidth,
} = stacky();
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
} = monitorWalletAssetFlows();
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
