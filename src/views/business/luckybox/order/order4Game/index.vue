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
            <el-form-item label="订单状态" prop="orderStatus">
                <el-select style="width: 215px" v-model="queryParams.orderStatus" @change="handleQuery"
                    placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in typeList3" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="是否中奖" prop="isWinning">
                <el-select style="width: 215px" v-model="queryParams.isWinning" @change="handleQuery" placeholder="请选择"
                    clearable>
                    <el-option v-for="(item, index) in typeList1" :key="index" :label="item.name" :value="item.id" />
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
                    v-hasPermi="['order:order4Game:operator']"
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
                    v-hasPermi="['order:order4Game:operator']"
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
                <el-table-column label="订单编号" fixed prop="orderTxNo" min-width="200px"/>
                <el-table-column label="游戏ID" fixed prop="gameId" min-width="140px"/>
                <el-table-column label="账户ID" prop="accountId" min-width="140px"/>
                <el-table-column label="奖品ID"  prop="gamePrizeId" min-width="140px"/>
                <el-table-column label="订单状态" prop="orderStatus" min-width="100px">
                    <template #default="scope">
                        <span v-if="scope.row.orderStatus == '0'">未支付</span>
                        <span v-if="scope.row.orderStatus == '1'">已支付</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否中奖" prop="isWinning" min-width="100px">
                    <template #default="scope">
                        <span v-if="scope.row.isWinning == '0'">未中奖</span>
                        <span v-if="scope.row.isWinning == '1'">已中奖</span>
                    </template>
                </el-table-column>
              <el-table-column label="花费金额" prop="gameExpendBalance" min-width="100px">
                <template #default="scope">
                  <span>{{ Number(scope.row.gameExpendBalance).toFixed(2) }}</span>
                </template>
              </el-table-column>
                <el-table-column label="奖励金额" prop="gameRewardBalance" min-width="100px">
                    <template #default="scope">
                        <span>{{ Number(scope.row.gameRewardBalance).toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="奖品名称" prop="gamePrizeName" min-width="100px" />
                <el-table-column label="备注" prop="remark" min-width="100px"  />
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
                <el-table-column label="操作" fixed="right" min-width="90px"
                    class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-link class="table_link_btn" :underline="false" type="primary"
                            @click="handleUpdate(scope.row)" v-hasPermi="['order:Order4Game:operator']"><span
                                class="table_link_text">详情</span></el-link>
                        <!-- <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['order:order4Game:operator']"
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
                <el-form-item label="订单编号" prop="orderTxNo" style="font-weight: 600;">
                    <span class="mRbox">{{ form.orderTxNo }}</span>
                </el-form-item>
                <el-form-item label="订单状态" prop="orderStatus" style="font-weight: 600;">
                    <span class="mRbox" v-if="form.orderStatus == '0'">未支付</span>
                    <span class="mRbox" v-if="form.orderStatus == '1'">已支付</span>
                </el-form-item>
                <el-form-item label="是否中奖" prop="isWinning" style="font-weight: 600;">
                    <span class="mRbox" v-if="form.isWinning == '0'">未中奖</span>
                    <span class="mRbox" v-if="form.isWinning == '1'">已中奖</span>
                </el-form-item>
              <el-form-item label="花费金额" prop="gameExpendBalance" style="font-weight: 600;">
                <span class="mRbox">{{ Number(form.gameExpendBalance).toFixed(2) }}</span>
              </el-form-item>
                <el-form-item label="奖励金额" prop="gameRewardBalance" style="font-weight: 600;">
                    <span class="mRbox">{{ Number(form.gameRewardBalance).toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="奖品名称" prop="gamePrizeName" style="font-weight: 600;">
                    <span class="mRbox">{{ form.gamePrizeName }}</span>
                </el-form-item>
                <el-form-item label="备注" prop="remark" style="font-weight: 600;">
                    <span class="mRbox">{{ form.remark }}</span>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime" style="font-weight: 600;">
                    <span class="mRbox">{{ parseTime(form.createTime) }}</span>
                </el-form-item>
                <el-form-item label="更新时间" prop="updateTime" style="font-weight: 600;">
                    <span class="mRbox">{{ parseTime(form.updateTime) }}</span>
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

<script lang="ts" name="order4Game" setup>
import order4Game from "@/api/request/business/luckybox/order/order4Game/index";
import stacky from "@/utils/table-sticky";

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
    langType, typeList1, typeList3
} = order4Game();
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
