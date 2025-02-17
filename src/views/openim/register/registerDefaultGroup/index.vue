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
      <el-form-item label="群组ID" prop="groupId">
        <el-input
          v-model="queryParams.groupId"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="群组名称" prop="groupName">
        <el-input
          v-model="queryParams.groupName"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <!-- prettier-ignore -->
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-input
          v-model="form.groupId"
          placeholder="群组Id"
          clearable
          style="width: 200px; height: 26px"
          :prefix-icon="UserFilled"
        />
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          v-hasPermi="['openim:registerDefaultGroup:operator']"
          >新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['openim:registerDefaultGroup:operator']"
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
        <el-table-column label="用户头像" prop="">
          <template #default="scope">
            <el-image
              v-if="scope.row.groupFaceUrl != ''"
              style="width: 40px; height: 40px; border-radius: 10px"
              :src="scope.row.faceUrl"
            ></el-image>

            <img
              v-else
              src="../../../../assets/images/touxiang.png"
              style="width: 40px; height: 40px; border-radius: 10px"
          /></template>
        </el-table-column>
        <el-table-column label="群组ID" prop="groupId" />
        <el-table-column label="群组名称" prop="groupName" />
        <el-table-column
          label="操作"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <!--                        <el-link-->
            <!--                            class="table_link_btn"-->
            <!--                            :underline="false"-->
            <!--                            type="primary"-->
            <!--                            @click="handleUpdate(scope.row)"-->
            <!--                            v-hasPermi="['shop:shop:operator']"-->
            <!--                        ><span class="table_link_text">修改</span></el-link-->
            <!--                        >-->
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['openim:registerDefaultGroup:operator']"
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
  </div>
</template>

<script lang="ts" name="registerDefaultGroup" setup>
import registerDefaultGroup from "@/hooks/openim/register/registerDefaultGroup";
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
    queryParams1,
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
    UserFilled
} = registerDefaultGroup();
</script>
<style lang="scss" scoped>
.userS {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .userS_left {
    width: 47%;

    .userS_left_item {
      font-size: 14px;
      margin-bottom: 20px;
    }
  }
}
</style>
