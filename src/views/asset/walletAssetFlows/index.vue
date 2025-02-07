<template>
    <div class="app-container">
        <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch"
            label-width="70px">
            <!-- <el-form-item label="币种" prop="currency">
                <el-input v-model="queryParams.currency" placeholder="请输入" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item> -->
            <!-- <el-form-item label="统计日期" style="font-weight: bold" prop="createTime">
                <el-date-picker v-model="queryParams.createTime" style="width: 240px" format="YYYY-MM-DD"
                    :default-time="defaultTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-"
                    start-placeholder="开始日期" end-placeholder="结束日期" @change="handleQuery"></el-date-picker>
            </el-form-item> -->
            <el-form-item label="账户ID" prop="accountId">
                <el-input v-model="queryParams.accountId" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="业务类型" prop="businessType">
                <el-select style="width: 215px" v-model="queryParams.businessType" @change="handleQuery"
                    placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in typeList1" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select style="width: 215px" v-model="queryParams.status" @change="handleQuery" placeholder="请选择"
                    clearable>
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <form-search @reset="resetQuery()" @search="handleQuery()" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <!-- <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="handleAdd"
                    v-hasPermi="['asset:walletAssetFlows:operator']"
                >新增
                </el-button
                >
            </el-col>

            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    size="small"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['asset:walletAssetFlows:operator']"
                >删除
                </el-button
                >
            </el-col> -->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
        </el-row>
        <div class="self-table">
            <el-table size="small" stripe v-loading="loading" ref="pageTableRef" :data="configList"
                @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column label="账户ID" fixed prop="accountId" min-width="150px" />
                <el-table-column label="币种" fixed prop="currency" min-width="100px" />
                <el-table-column label="业务类型" prop="businessType" min-width="120px">
                    <template #default="scope">
                        {{scope.row.businessType}}
                        <!-- <span v-if="scope.row.businessType == 'deposit'">充值</span>
                        <span v-if="scope.row.businessType == 'withDraw'">提现</span>
                        <span v-if="scope.row.businessType == 'revenue'">收入</span>
                        <span v-if="scope.row.businessType == 'expend'">花费</span>
                        <span v-if="scope.row.businessType == 'fee'">手续费</span> -->
                    </template>
                </el-table-column>
                <el-table-column label="变动前余额" prop="beforeBalance" min-width="120px">
                    <template #default="scope">
                        <span>{{ scope.row.beforeBalance.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="变动发生额" prop="balance" min-width="120px">
                    <template #default="scope">
                        <span>{{ scope.row.direction }}{{ scope.row.balance.toFixed(2) }}</span>
                    </template>
                </el-table-column>
              <el-table-column label="手续费" prop="fee" min-width="120px">
                <template #default="scope">
                  <span>{{ scope.row.fee.toFixed(2) }}</span>
                </template>
              </el-table-column>
                <el-table-column label="变动后余额" prop="afterBalance" min-width="100px">
                    <template #default="scope">
                        <span>{{ scope.row.afterBalance.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="关联业务ID" prop="orgBusinessId" min-width="150px" />
                <el-table-column label="关联业务编号" prop="orgBusinessNo" min-width="150px" />
                <el-table-column label="状态" prop="status" min-width="120px">
                    <template #default="scope">
                        <span v-if="scope.row.status == 1">有效</span>
                        <span v-if="scope.row.status == 0">无效</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="120px" />
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
                <el-table-column label="操作"  fixed="right" min-width="90px" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-link class="table_link_btn" :underline="false" type="primary"
                            @click="handleUpdate(scope.row)" v-hasPermi="['asset:walletAssetFlows:operator']"><span
                                class="table_link_text">详情</span></el-link>
                        <!-- <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['asset:walletAssetFlows:operator']"
                        ><span class="table_link_text">删除</span></el-link
                        > -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current" v-model:limit="queryParams.size"
            @pagination="getList()" />

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body @close="cleanSelect()">
            <el-form size="small" ref="formRef" :model="form" :rules="rules">
                <el-form-item label="币种" prop="currency" style="font-weight: 600;">
                    <span class="mRbox">{{ form.currency }}</span>
                </el-form-item>
                <el-form-item label="业务类型" prop="businessType" style="font-weight: 600;">
                    <span class="mRbox">{{ form.businessType }}</span>
                    <!-- <span class="mRbox" v-if="form.businessType == 'deposit'">充值</span>
                    <span class="mRbox" v-if="form.businessType == 'withDraw'">提现</span>
                    <span class="mRbox" v-if="form.businessType == 'revenue'">收入</span>
                    <span class="mRbox" v-if="form.businessType == 'expend'">花费</span>
                    <span class="mRbox" v-if="form.businessType == 'fee'">手续费</span> -->
                </el-form-item>
                <el-form-item label="变动前余额" prop="beforeBalance" style="font-weight: 600;">
                    <span class="mRbox">{{ Number(form.beforeBalance).toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="变动发生额" prop="balance" style="font-weight: 600;">
                    <span class="mRbox">{{ form.direction }}{{ Number(form.balance).toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="手续费" prop="fee" style="font-weight: 600;">
                  <span class="mRbox">{{ Number(form.fee).toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="变动后余额" prop="afterBalance" style="font-weight: 600;">
                    <span class="mRbox">{{ Number(form.afterBalance).toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="关联业务ID" prop="orgBusinessId" style="font-weight: 600;">
                    <span class="mRbox">{{ form.orgBusinessId }}</span>
                </el-form-item>

                <el-form-item label="状态" prop="status" style="font-weight: 600;">
                    <span class="mRbox" v-if="form.status == 1">有效</span>
                    <span class="mRbox" v-if="form.status == 0">无效</span>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime" style="font-weight: 600;">
                    <span class="mRbox">{{ parseTime(form.createTime) }}</span>
                </el-form-item>
                <el-form-item label="更新时间" prop="updateTime" style="font-weight: 600;">
                    <span class="mRbox">{{ parseTime(form.updateTime) }}</span>
                </el-form-item>
                <el-form-item label="备注" prop="remark" style="font-weight: 600;">
                    <span class="mRbox">{{ form.remark }}</span>
                </el-form-item>

            </el-form>
            <!-- <template #footer>
                <div class="dialog-footer">
                    <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
                    <el-button size="small" @click="cancel">取 消</el-button>
                </div>
            </template> -->
        </el-dialog>
    </div>
</template>

<script lang="ts" name="walletAssetFlows" setup>
import walletAssetFlows from "@/api/request/asset/walletAssetFlows/index";
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
    langType,
    typeList, typeList1
} = walletAssetFlows();
// import {
//     ref
// } from "vue";
// const defaultTime = ref<[Date, Date]>([
//     new Date(2000, 1, 1, 0, 0, 0),
//     new Date(2000, 2, 1, 23, 59, 59),
// ]);
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
