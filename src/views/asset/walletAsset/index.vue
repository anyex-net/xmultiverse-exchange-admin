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
      <!--            <el-form-item label="币种" prop="currency">
                <el-input v-model="queryParams.currency" placeholder="请输入" clearable style="width: 240px"
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
                    v-hasPermi="['asset:walletAsset:operator']"
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
                    v-hasPermi="['asset:walletAsset:operator']"
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
          label="账户ID"
          fixed
          prop="accountId"
          min-width="140px"
        />
        <el-table-column label="币种" prop="currency" min-width="120px" />
        <el-table-column label="余额" prop="balance" min-width="120px">
          <template #default="scope">
            <span>{{ scope.row.balance.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="冻结" prop="frozenBal" min-width="120px">
          <template #default="scope">
            <span>{{ scope.row.frozenBal.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="130px" />
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
              v-hasPermi="['asset:walletAsset:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
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
        <el-form-item label="币种" prop="currency" style="font-weight: 600">
          <span class="mRbox">{{ form.currency }}</span>
        </el-form-item>
        <el-form-item label="余额" prop="balance" style="font-weight: 600">
          <span class="mRbox">{{ Number(form.balance).toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="冻结" prop="frozenBal" style="font-weight: 600">
          <span class="mRbox">{{ Number(form.frozenBal).toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="font-weight: 600">
          <span class="mRbox">{{ form.remark }}</span>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      v-model="openAdjust"
      width="500px"
      append-to-body
      @close="cleanSelect()"
    >
      <el-form
        size="small"
        ref="formAdjustRef"
        :model="formAdjust"
        :rules="rulesAdjust"
      >
        <el-form-item label="账户ID" prop="accountId" style="font-weight: 600">
          <span class="mRbox">{{ formAdjust.accountId }}</span>
        </el-form-item>
        <el-form-item label="币种" prop="currency" style="font-weight: 600">
          <span class="mRbox">PKR</span>
        </el-form-item>
        <el-form-item
          label="调整方向"
          prop="direction"
          style="font-weight: 600"
        >
          <el-select
            v-model="formAdjust.direction"
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整金额" prop="amount" style="font-weight: 600">
          <el-input
            style="width: 300px"
            type="number"
            v-model="formAdjust.amount"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" type="primary" @click="submitForm"
            >确 定</el-button
          >
          <el-button size="small" @click="cancelAdjust">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="walletAsset" setup>
import walletAsset from "@/hooks/asset/walletAsset";
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
    openAdjust,
    showSearch,
    total,
    configList,
    title,
    queryParams,
    queryFormRef,
    form,
    formAdjust,
    formRef,
    formAdjustRef,
    rules,
    rulesAdjust,
    getList,
    cancel,
    cancelAdjust,
    handleQuery,
    resetQuery,
    handleAdd,
    handleSelectionChange,
    handleUpdate,
    handleUpdateAdjust,
    pageTableRef,
    cleanSelect,
    langType,
    typeList,
    submitForm
} = walletAsset();
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
