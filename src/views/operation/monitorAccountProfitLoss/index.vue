<template>
    <div class="app-container">
      全平台账户浮动累计盈亏<span v-html="Number(statisticsModel.profitLoss).toFixed(2)"></span>
      &nbsp;&nbsp;=&nbsp;&nbsp;全平台账户累计余额<span v-html="Number(statisticsModel.balance).toFixed(2)"></span>
      &nbsp;&nbsp;-&nbsp;&nbsp;全平台账户累计充值<span v-html="Number(statisticsModel.sumDeposit).toFixed(2)"></span>
      &nbsp;&nbsp;-&nbsp;&nbsp;全平台账户累计强增<span v-html="Number(statisticsModel.sumAdjustAdd).toFixed(2)"></span>
      &nbsp;&nbsp;+&nbsp;&nbsp;全平台账户累计提现<span v-html="Number(statisticsModel.sumWithDraw).toFixed(2)"></span>
      &nbsp;&nbsp;+&nbsp;&nbsp;全平台账户累计强减<span v-html="Number(statisticsModel.sumAdjustSub).toFixed(2)"></span>
      <br />
      下游支付平台GP对应的商户余额<span v-html="Number(statisticsModel.sumDeposit*(1-0.045)-statisticsModel.sumWithDraw*(1+0.035)).toFixed(2)"></span>
      &nbsp;&nbsp;=&nbsp;&nbsp;全平台账户累计充值<span v-html="Number(statisticsModel.sumDeposit).toFixed(2)"></span>(1-充值手续费率4.5%)
      &nbsp;&nbsp;-&nbsp;&nbsp;全平台账户累计提现<span v-html="Number(statisticsModel.sumWithDraw).toFixed(2)"></span>(1+提现手续费率3.5%)
      <br />
      <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch" style="margin-top:20px;"
            label-width="70px">
            <!-- <el-form-item label="币种" prop="currency">
                <el-input v-model="queryParams.currency" placeholder="请输入" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item> -->
            <el-form-item label="账户ID" prop="id">
                <el-input v-model="queryParams.id" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <form-search @reset="resetQuery()" @search="handleQuery()" />
        </el-form>
        <el-row :gutter="10" class="mb8">
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
        </el-row>
        <div class="self-table">
            <el-table size="small" stripe v-loading="loading" ref="pageTableRef" :data="configList"
                @selection-change="handleSelectionChange">
              <el-table-column label="账户ID" prop="id" min-width="140px"/>

              <el-table-column label="账户余额" prop="balance" >
                <template #default="scope">
                  <span>{{ Number(scope.row.balance).toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="账户冻结余额" prop="frozenBal" >
                <template #default="scope">
                  <span>{{ Number(scope.row.frozenBal).toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="累计充入" prop="sumDeposit" >
                <template #default="scope">
                  <span>{{ Number(scope.row.sumDeposit).toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="累计提出" prop="sumWithDraw" >
                <template #default="scope">
                  <span>{{ Number(scope.row.sumWithDraw).toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="累计调增" prop="sumAdjustAdd" >
                <template #default="scope">
                  <span>{{ Number(scope.row.sumAdjustAdd).toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="累计调减" prop="sumAdjustSub" >
                <template #default="scope">
                  <span>{{ Number(scope.row.sumAdjustSub).toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="浮动盈亏" prop="profitLoss" >
                <template #default="scope">
                  <span>{{ Number(scope.row.profitLoss).toFixed(2) }}</span>
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

<script lang="ts" name="monitorAccountProfitLoss" setup>
import monitorAccountProfitLoss from "@/api/request/operation/monitorAccountProfitLoss/index";
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
    typeList,
    statisticsModel
} = monitorAccountProfitLoss();
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
