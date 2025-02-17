<template>
  <div class="app-container">
    <el-form
      size="small"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      v-show="showSearch"
      label-width="70px"
    >
      <!-- <el-form-item label="币种" prop="currency">
                <el-input v-model="queryParams.currency" placeholder="请输入" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item> -->
      <el-form-item label="账户ID" prop="accountId">
        <el-input
          v-model="queryParams.accountId"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <!-- <el-form-item label="支付状态" prop="paymentStatus">
                <el-select style="width: 215px" v-model="queryParams.paymentStatus" @change="handleQuery"
                    placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in typeList3" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item> -->
      <el-form-item label="是否开奖" prop="isLotteryDrawn">
        <el-select
          style="width: 215px"
          v-model="queryParams.isLotteryDrawn"
          @change="handleQuery"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否中奖" prop="isWinning">
        <el-select
          style="width: 215px"
          v-model="queryParams.isWinning"
          @change="handleQuery"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in typeList1"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="orderStatus">
                <el-select style="width: 215px" v-model="queryParams.orderStatus" @change="handleQuery"
                    placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in typeList2" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item> -->
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="handleAdd"
                    v-hasPermi="['order:order4Activity:operator']"
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
                    v-hasPermi="['order:order4Activity:operator']"
                >删除
                </el-button
                >
            </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
    </el-row>
    <div class="self-table">
      <el-table
        size="small"
        stripe
        v-loading="loading"
        ref="pageTableRef"
        :data="configList"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column
          label="订单编号"
          fixed
          prop="orderTxNo"
          min-width="200px"
        />
        <el-table-column
          label="活动ID"
          fixed
          prop="activityId"
          min-width="140px"
        />
        <el-table-column label="账户ID" prop="accountId" min-width="140px" />
        <el-table-column label="商品ID" prop="skuId" min-width="140px" />
        <el-table-column label="产品ID" prop="spuId" min-width="140px" />
        <el-table-column
          label="商品活动类型"
          prop="activityType"
          min-width="120px"
        />
        <el-table-column label="价格" prop="orderActPrice" min-width="100px">
          <template #default="scope">
            <span>{{ scope.row.orderActPrice.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="尾款金额"
          prop="orderActBalancePayment"
          min-width="100px"
        >
          <template #default="scope">
            <span>{{ scope.row.orderActBalancePayment.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="活动原价"
          prop="activitySkuPrice"
          min-width="100px"
        >
          <template #default="scope">
            <span>{{ scope.row.activitySkuPrice.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="购买份数"
          prop="orderActPurchaseNum"
          min-width="100px"
        />
        <el-table-column
          label="总金额"
          prop="orderSumBalance"
          min-width="100px"
        >
          <template #default="scope">
            <span>{{ scope.row.orderSumBalance.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="orderStatus" min-width="120px">
          <template #default="scope">
            <span v-if="scope.row.orderStatus == '0'">未开奖</span>
            <span v-if="scope.row.orderStatus == '1'">未中奖</span>
            <span v-if="scope.row.orderStatus == '2'">已中奖无需支付尾款</span>
            <span v-if="scope.row.orderStatus == '3'">已中奖待支付尾款</span>
            <span v-if="scope.row.orderStatus == '4'">已支付尾款待发货</span>
            <span v-if="scope.row.orderStatus == '5'">已发货待收货</span>
            <span v-if="scope.row.orderStatus == '6'">已收货完成</span>
            <span v-if="scope.row.orderStatus == '9'"
              >已支付尾款但缺货等值现金充抵</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="余额扣减金额"
          prop="balanceDeductionAmount"
          min-width="100px"
        >
          <template #default="scope">
            <span v-if="scope.row.balanceDeductionAmount != ''">{{
              scope.row.balanceDeductionAmount.toFixed(2)
            }}</span>
          </template>
        </el-table-column>
        <!--
                <el-table-column label="支付实际金额" prop="paymentActualAmount" min-width="100px">
                    <template #default="scope">
                        <span v-if="scope.row.paymentActualAmount">{{ scope.row.paymentActualAmount.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付时间" prop="paymentTime" min-width="140px">

                    <template #default="scope">
                        <span>{{ parseTime(scope.row.paymentTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付编号" prop="paymentNo" min-width="100px" />
                <el-table-column label="支付状态" prop="paymentStatus" min-width="100px">

                    <template #default="scope">
                        <span v-if="scope.row.paymentStatus == '-1'">不用支付</span>
                        <span v-if="scope.row.paymentStatus == '0'">未支付</span>
                        <span v-if="scope.row.paymentStatus == '1'">已支付</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付描述" prop="paymentDesc" min-width="120px" />
                -->
        <el-table-column
          label="一轮总份数"
          prop="activitySumNum"
          min-width="100px"
        />
        <el-table-column
          label="总轮数"
          prop="activitySumRound"
          min-width="100px"
        />
        <el-table-column
          label="当前轮数"
          prop="activityCurrentRound"
          min-width="100px"
        />
        <el-table-column
          label="是否开奖"
          prop="isLotteryDrawn"
          min-width="100px"
        >
          <template #default="scope">
            <span v-if="scope.row.isLotteryDrawn == '0'">未开奖</span>
            <span v-if="scope.row.isLotteryDrawn == '1'">已开奖</span>
          </template>
        </el-table-column>
        <el-table-column label="是否中奖" prop="isWinning" min-width="100px">
          <template #default="scope">
            <span v-if="scope.row.isWinning == '0'">未中奖</span>
            <span v-if="scope.row.isWinning == '1'">已中奖</span>
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
        <el-table-column
          label="操作"
          fixed="right"
          min-width="90px"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['order:order4Activity:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
            <!-- <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['order:order4Activity:operator']"
                        ><span class="table_link_text">删除</span></el-link
                        > -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      @pagination="getList()"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
      @close="cleanSelect()"
    >
      <el-form size="small" ref="formRef" :model="form" :rules="rules">
        <el-form-item label="编号" prop="orderTxNo" style="font-weight: 600">
          <span class="mRbox">{{ form.orderTxNo }}</span>
        </el-form-item>
        <el-form-item
          label="商品活动类型"
          prop="activityType"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.activityType }}</span>
        </el-form-item>
        <el-form-item
          label="价格"
          prop="orderActPrice"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ Number(form.orderActPrice).toFixed(2) }}</span>
        </el-form-item>
        <el-form-item
          label="尾款金额"
          prop="orderActBalancePayment"
          style="font-weight: 600"
        >
          <span class="mRbox">{{
            Number(form.orderActBalancePayment).toFixed(2)
          }}</span>
        </el-form-item>
        <el-form-item
          label="活动原价"
          prop="activitySkuPrice"
          style="font-weight: 600"
        >
          <span class="mRbox">{{
            Number(form.activitySkuPrice).toFixed(2)
          }}</span>
        </el-form-item>
        <el-form-item
          label="购买份数"
          prop="orderActPurchaseNum"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.orderActPurchaseNum }}</span>
        </el-form-item>
        <el-form-item
          label="总金额"
          prop="orderSumBalance"
          style="font-weight: 600"
        >
          <span class="mRbox">{{
            Number(form.orderSumBalance).toFixed(2)
          }}</span>
        </el-form-item>
        <el-form-item label="状态" prop="orderStatus" style="font-weight: 600">
          <span class="mRbox" v-if="form.orderStatus == '0'">未开奖</span>
          <span class="mRbox" v-if="form.orderStatus == '1'">未中奖</span>
          <span class="mRbox" v-if="form.orderStatus == '2'"
            >已中奖无需支付尾款</span
          >
          <span class="mRbox" v-if="form.orderStatus == '3'"
            >已中奖待支付尾款</span
          >
          <span class="mRbox" v-if="form.orderStatus == '4'"
            >已支付尾款待发货</span
          >
          <span class="mRbox" v-if="form.orderStatus == '5'">已发货待收货</span>
          <span class="mRbox" v-if="form.orderStatus == '6'">已收货完成</span>
          <span class="mRbox" v-if="form.orderStatus == '9'"
            >已支付尾款但缺货等值现金充抵</span
          >
        </el-form-item>
        <el-form-item
          label="余额扣减金额"
          prop="balanceDeductionAmount"
          style="font-weight: 600"
        >
          <span class="mRbox">{{
            Number(form.balanceDeductionAmount).toFixed(2)
          }}</span>
        </el-form-item>
        <!-- <el-form-item label="支付实际金额" prop="paymentActualAmount" style="font-weight: 600;">
                    <span class="mRbox" v-if="form.paymentActualAmount">{{ Number(form.paymentActualAmount).toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="支付时间" prop="paymentTime" style="font-weight: 600;">
                    <span class="mRbox">{{ parseTime(form.paymentTime) }}</span>
                </el-form-item>
                <el-form-item label="支付编号" prop="paymentNo" style="font-weight: 600;">
                    <span class="mRbox">{{ form.paymentNo }}</span>
                </el-form-item>
                <el-form-item label="支付状态" prop="paymentStatus" style="font-weight: 600;">
                    <span class="mRbox" v-if="form.paymentStatus == ''"></span>
                    <span class="mRbox" v-if="form.paymentStatus == '-1'">不用支付</span>
                    <span class="mRbox" v-if="form.paymentStatus == '0'">未支付</span>
                    <span class="mRbox" v-if="form.paymentStatus == '1'">已支付</span>
                </el-form-item>
                <el-form-item label="支付描述" prop="paymentDesc" style="font-weight: 600;">
                    <span class="mRbox">{{ form.paymentDesc }}</span>
                </el-form-item> -->
        <el-form-item
          label="一轮总份数"
          prop="activitySumNum"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.activitySumNum }}</span>
        </el-form-item>
        <el-form-item
          label="总轮数"
          prop="activitySumRound"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.activitySumRound }}</span>
        </el-form-item>
        <el-form-item
          label="当前轮数"
          prop="activityCurrentRound"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.activityCurrentRound }}</span>
        </el-form-item>
        <el-form-item
          label="是否开奖"
          prop="isLotteryDrawn"
          style="font-weight: 600"
        >
          <span class="mRbox" v-if="form.isLotteryDrawn == '0'">未开奖</span>
          <span class="mRbox" v-if="form.isLotteryDrawn == '1'">已开奖</span>
        </el-form-item>
        <el-form-item
          label="是否中奖"
          prop="isWinning"
          style="font-weight: 600"
        >
          <span class="mRbox" v-if="form.isWinning == '0'">未中奖</span>
          <span class="mRbox" v-if="form.isWinning == '1'">已中奖</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="font-weight: 600">
          <span class="mRbox">{{ form.remark }}</span>
        </el-form-item>
        <el-form-item
          label="创建时间"
          prop="createTime"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ parseTime(form.createTime) }}</span>
        </el-form-item>
        <el-form-item
          label="更新时间"
          prop="updateTime"
          style="font-weight: 600"
        >
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

<script lang="ts" name="order4Activity" setup>
import order4Activity from "@/hooks/business/luckybox/order/order4Activity";
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
    langType,
    typeList, typeList1, typeList2, typeList3
} = order4Activity();
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
