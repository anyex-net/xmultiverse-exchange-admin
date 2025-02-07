<template>
  <div class="app-container">
    <el-form
      size="small"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      v-show="showSearch"
      label-width="90px"
    >
      <el-form-item label="好友用户ID" prop="friendUserId">
        <el-input
          v-model="queryParams.friendUserId"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
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
          v-hasPermi="['social:snsFriend:operator']"
          >新增
        </el-button>
      </el-col> -->

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['social:snsFriend:operator']"
          >删除
        </el-button>
      </el-col>
      <!-- prettier-ignore -->
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" fixed prop="id" />
        <el-table-column label="用户ID" prop="userId" />
        <el-table-column label="好友用户ID" prop="friendUserId" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="创建时间" prop="createTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['social:snsFriend:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['social:snsFriend:operator']"
              ><span class="table_link_text">删除</span></el-link
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
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
      @close="cleanSelect()"
    >
      <el-form size="small" ref="formRef" :model="form" :rules="rules">
        <el-form-item
          label="用户ID"
          prop="userId"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.userId }}</span>
        </el-form-item>
        <el-form-item
          label="好友用户ID"
          prop="friendUserId"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.friendUserId }}</span>
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
    </el-dialog>
  </div>
</template>

<script lang="ts" name="snsFriend" setup>
import snsFriend from "@/api/request/social/snsFriend";
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
    submitForm,
    handleDelete,
    pageTableRef,
    cleanSelect,
    uploadParams,
    uploadUrl,
    isShowTooltip,
    onMouseOver,
    iconChange,
    iconUpload
} = snsFriend();
</script>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}
.mRbox {
  width: 100%;
  font-weight: 400;
  margin-left: 30px;
  border-bottom: 1px dotted #dfdcdc;
  display: flex;
  justify-content: flex-end;
}
</style>
