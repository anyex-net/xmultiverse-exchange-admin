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
      <el-form-item label="账户ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="UID" prop="unid">
        <el-input
          v-model="queryParams.unid"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="推荐码" prop="referralCode">
        <el-input
          v-model="queryParams.referralCode"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <!-- prettier-ignore -->
      <form-search @reset="resetQuery()" @search="handleQuery()"/>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
    </el-row>
    总发放佣金<span v-html="Number(statisticsEntity.total).toFixed(2)"></span
    >&nbsp; &nbsp;今日发放佣金<span
      v-html="Number(statisticsEntity.curTotal).toFixed(2)"
    ></span>
    <div class="self-table">
      <el-table
        size="small"
        stripe
        v-loading="loading"
        ref="pageTableRef"
        :data="configList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="账户ID" fixed prop="id" min-width="150px" />
        <el-table-column label="UID" fixed prop="unid" min-width="120px" />
        <el-table-column label="推荐码" prop="referralCode" min-width="120px" />
        <el-table-column label="总佣金" prop="createTime" min-width="140px">
          <template #default="scope">
            <span>{{ Number(scope.row.total).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          min-width="90px"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['account:accountInviteRewards:operator']"
              ><span class="table_link_text">账户关系</span></el-link
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
        <el-form-item label="账户ID" prop="id" style="font-weight: 600">
          <span class="mRbox">{{ form.id }}</span>
        </el-form-item>
        <el-form-item label="UID" prop="unid" style="font-weight: 600">
          <span class="mRbox">{{ form.unid }}</span>
        </el-form-item>
        <el-form-item
          label="推荐码"
          prop="referralCode"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.referralCode }}</span>
        </el-form-item>
        <el-form-item label="总佣金" prop="total" style="font-weight: 600">
          <span class="mRbox">{{ form.total }}</span>
        </el-form-item>
        <el-form-item
          label="一级邀请人数"
          prop="levelOneCnt"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.levelOneCnt }}</span>
        </el-form-item>
        <el-form-item
          label="二级邀请人数"
          prop="levelTwoCnt"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.levelTwoCnt }}</span>
        </el-form-item>
        <el-form-item
          label="三级邀请人数"
          prop="levelThreeCnt"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.levelThreeCnt }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="account" setup>
import account from "@/hooks/account/accountInviteRewards";
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
  statisticsEntity,
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
  cleanSelect
} = account();
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
