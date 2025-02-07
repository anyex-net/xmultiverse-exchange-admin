<template>
    <div class="app-container">
        <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch"
            label-width="120px">
          <el-form-item label="账户ID" prop="accountId">
            <el-input v-model="queryParams.accountId" placeholder="请输入" clearable style="width: 240px"
                      @keyup.enter.native="handleQuery()" @change="handleQuery()" />
          </el-form-item>
<!--          <el-form-item label="币种" prop="currency">
            <el-input v-model="queryParams.currency" placeholder="请输入" clearable style="width: 240px"
                      @keyup.enter.native="handleQuery()" @change="handleQuery()" />
          </el-form-item>-->
            <el-form-item label="交易类型" prop="trxType">
                <el-select style="width: 240px" v-model="queryParams.trxType" @change="handleQuery"
                    placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in typeList1" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="转账状态" prop="trxStatus">
                <el-select style="width: 240px" v-model="queryParams.trxStatus" @change="handleQuery" placeholder="请选择"
                    clearable>
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
<!--            <el-form-item label="转账渠道" prop="trxChannel">
                <el-input v-model="queryParams.trxChannel" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="账户类型" prop="trxAccountType">
                <el-input v-model="queryParams.trxAccountType" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="收款账号" prop="trxAccountNo">
                <el-input v-model="queryParams.trxAccountNo" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="收款姓名" prop="trxAccountName">
                <el-input v-model="queryParams.trxAccountName" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="银行名字" prop="trxBankName">
                <el-input v-model="queryParams.trxBankName" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="国际银行账户号码" prop="trxIban">
                <el-input v-model="queryParams.trxIban" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="身份证号码" prop="trxCnic">
                <el-input v-model="queryParams.trxCnic" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="邮箱" prop="trxEmail">
                <el-input v-model="queryParams.trxEmail" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="手机号码" prop="trxMobile">
                <el-input v-model="queryParams.trxMobile" placeholder="请输入" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>-->
            <form-search @reset="resetQuery()" @search="handleQuery()" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <!-- <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="handleAdd"
                    v-hasPermi="['asset:walletAssetTransactions:operator']"
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
                    v-hasPermi="['asset:walletAssetTransactions:operator']"
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
                <el-table-column label="账户ID" fixed prop="accountId" min-width="150px"/>
                <el-table-column label="币种" fixed prop="currency" min-width="100px" />
                <el-table-column label="交易类型" prop="trxType" min-width="120px">
                    <template #default="scope">
                        <span v-if="scope.row.trxType == 'deposit'">充值</span>
                        <span v-if="scope.row.trxType == 'withDraw'">提现</span>
                    </template>
                </el-table-column>
                <el-table-column label="转账余额" prop="trxAmount" min-width="120px">
                    <template #default="scope">
                        <span>{{ scope.row.trxAmount.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="手续费" prop="trxFee" min-width="120px">
                    <template #default="scope">
                      <span>{{ scope.row.trxFee.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实际转账金额" prop="trxActAmount" min-width="120px">
                    <template #default="scope">
                      <span>{{ scope.row.trxActAmount.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="转账时间" prop="trxTime" min-width="140px">
                    <template #default="scope">
                      <span>{{ parseTime(scope.row.trxTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="转账编号" prop="trxNo" min-width="120px" />
                <el-table-column label="转账状态" prop="trxStatus" min-width="120px">
                    <template #default="scope">
                      <span v-if="scope.row.trxStatus == 'success'">成功</span>
                      <span v-if="scope.row.trxStatus == 'pending'">处理中</span>
                      <span v-if="scope.row.trxStatus == 'failed'">失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="转账描述" prop="trxDesc" min-width="120px"/>
                <el-table-column label="转账查询描述" prop="queryDesc" min-width="120px"/>
                <el-table-column label="转账渠道" prop="trxChannel" min-width="120px"/>
                <el-table-column label="收款账号" prop="trxAccountNo" min-width="120px"/>
                <el-table-column label="收款姓名" prop="trxAccountName" min-width="120px"/>
                <el-table-column label="银行名字" prop="trxBankName" min-width="120px"/>
                <el-table-column label="国际银行账户号码" min-width="130px" prop="trxIban"/>
                <el-table-column label="身份证号码" prop="trxCnic" min-width="130px" />
                <el-table-column label="邮箱" prop="trxEmail" min-width="120px"/>
                <el-table-column label="手机号码" prop="trxMobile" min-width="120px"/>
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
                            @click="handleUpdate(scope.row)" v-hasPermi="['asset:walletAssetTransactions:operator']"><span
                                class="table_link_text">详情</span></el-link>
                        <!-- <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['asset:walletAssetTransactions:operator']"
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
                <el-form-item label="交易类型" prop="trxType" style="font-weight: 600;">
                    <span class="mRbox" v-if="form.trxType == 'deposit'">充值</span>
                    <span class="mRbox" v-if="form.trxType == 'withDraw'">提现</span>
                </el-form-item>
                <el-form-item label="转账金额" prop="trxAmount" style="font-weight: 600;">
                    <span class="mRbox">{{ Number(form.trxAmount).toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="手续费" prop="trxFee" style="font-weight: 600;">
                    <span class="mRbox">{{ Number(form.trxFee).toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="实际转账金额" prop="trxActAmount" style="font-weight: 600;">
                    <span class="mRbox">{{ Number(form.trxActAmount).toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="转账时间" prop="trxTime" style="font-weight: 600;">
                    <span class="mRbox">{{ parseTime(form.trxTime) }}</span>
                </el-form-item>
                <el-form-item label="转账编号" prop="trxNo" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxNo }}</span>
                </el-form-item>
                <el-form-item label="转账状态" prop="trxStatus" style="font-weight: 600;">
                    <span class="mRbox" v-if="form.trxStatus == 'success'">成功</span>
                    <span class="mRbox" v-if="form.trxStatus == 'pending'">处理中</span>
                    <span class="mRbox" v-if="form.trxStatus == 'failed'">失败</span>
                </el-form-item>
                <el-form-item label="转账描述" prop="trxDesc" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxDesc }}</span>
                </el-form-item>
              <el-form-item label="转账查询描述" prop="trxDesc" style="font-weight: 600;">
                <span class="mRbox">{{ form.queryDesc }}</span>
              </el-form-item>
                <el-form-item label="转账渠道" prop="trxChannel" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxChannel }}</span>
                </el-form-item>
                <el-form-item label="账户类型" prop="trxAccountType" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxAccountType }}</span>
                </el-form-item>
                <el-form-item label="收款账号" prop="trxAccountNo" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxAccountNo }}</span>
                </el-form-item>
                <el-form-item label="收款姓名" prop="trxAccountName" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxAccountName }}</span>
                </el-form-item>
                <el-form-item label="银行名字" prop="trxBankName" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxBankName }}</span>
                </el-form-item>
                <el-form-item label="国际银行账户号码" prop="trxIban" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxIban }}</span>
                </el-form-item>
                <el-form-item label="身份证号码" prop="trxCnic" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxCnic }}</span>
                </el-form-item>
                <el-form-item label="邮箱" prop="trxEmail" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxEmail }}</span>
                </el-form-item>
                <el-form-item label="手机号码" prop="trxMobile" style="font-weight: 600;">
                    <span class="mRbox">{{ form.trxMobile }}</span>
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

<script lang="ts" name="walletAssetTransactions" setup>
import walletAssetTransactions from "@/api/request/asset/walletAssetTransactions/index";
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
} = walletAssetTransactions();
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
