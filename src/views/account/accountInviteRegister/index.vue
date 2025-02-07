<template>
  <div class="app-container">
    <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch"
             label-width="100px">
      <el-form-item label="邀请人账户ID" prop="inviteId">
        <el-input v-model="queryParams.inviteId" placeholder="请输入" clearable style="width: 240px"
                  @keyup.enter.native="handleQuery()" @change="handleQuery()"/>
      </el-form-item>
      <el-form-item label="邀请人UID" prop="inviteUnid">
        <el-input v-model="queryParams.inviteUnid" placeholder="请输入" clearable style="width: 240px"
                  @keyup.enter.native="handleQuery()" @change="handleQuery()"/>
      </el-form-item>
      <el-form-item label="被邀请人账户ID" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入" clearable style="width: 240px"
                  @keyup.enter.native="handleQuery()" @change="handleQuery()"/>
      </el-form-item>
      <el-form-item label="被邀请人UID" prop="unid">
        <el-input v-model="queryParams.unid" placeholder="请输入" clearable style="width: 240px"
                  @keyup.enter.native="handleQuery()" @change="handleQuery()"/>
      </el-form-item>

      <!-- prettier-ignore -->
      <form-search @reset="resetQuery()" @search="handleQuery()"/>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()"/>
    </el-row>
    总邀请人数<span v-html="Number(statisticsEntity.total).toFixed(0)"></span>&nbsp; &nbsp;今日邀请人数<span v-html="Number(statisticsEntity.curTotal).toFixed(0)"></span>
    <div class="self-table">
      <el-table size="small" stripe v-loading="loading" ref="pageTableRef" :data="configList"
                @selection-change="handleSelectionChange">
        <el-table-column label="邀请人账户ID"  prop="inviteId" min-width="150px"/>
        <el-table-column label="邀请人UID"  prop="inviteUnid" min-width="120px"/>
        <el-table-column label="邀请人邮箱" prop="inviteEmail" min-width="120px"/>
        <el-table-column label="邀请码" prop="referralCode" min-width="120px"/>
        <el-table-column label="被邀请人账户ID"  prop="id" min-width="150px"/>
        <el-table-column label="被邀请人UID"  prop="unid" min-width="120px"/>
        <el-table-column label="被邀请人邮箱" prop="email" min-width="120px"/>
        <el-table-column label="被邀请人注册时间" prop="createTime" min-width="140px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current"
                v-model:limit="queryParams.size" @pagination="getList()"/>

  </div>
</template>

<script lang="ts" name="account" setup>
import account from "@/api/request/account/accountInviteRegister/index";
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
  cleanSelect,
  langType,
  typeList
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
