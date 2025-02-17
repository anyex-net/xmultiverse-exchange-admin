<template>
  <div class="app-container">
    <el-form
      size="small"
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号码"
          type="number"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery()"
        />
      </el-form-item>

      <!--            <el-form-item label="创建时间">-->
      <!--                <el-date-picker v-model="dateRange" style="width: 240px" value-format="YYYY-MM-DD" type="daterange"-->
      <!--                    range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="dataTime"></el-date-picker>-->
      <!--            </el-form-item>-->
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:userInfo:operator']"
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <!--            <el-col :span="1.5">-->
      <!--                <el-button type="success" plain  size="small" :disabled="single" @click="handleUpdate"-->
      <!--                    v-hasPermi="['system:userInfo:operator']">修改</el-button>-->
      <!--            </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:userInfo:operator']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="handleQuery()"
      />
    </el-row>
    <div class="self-table">
      <el-table
        size="small"
        stripe
        v-loading="loading"
        ref="pageTableRef"
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户名" fixed min-width="120" prop="userName" />
        <el-table-column label="手机号码" min-width="120" prop="phone" />
        <el-table-column label="性别" min-width="120" prop="gender">
          <template #default="scope">
            <span v-if="scope.row.gender == 0">男</span>
            <span v-if="scope.row.gender == 1">女</span>
          </template>
        </el-table-column>
        <el-table-column label="所属机构" min-width="130" prop="orgName" />
        <el-table-column label="角色" min-width="120" prop="roleIds">
          <template #default="scope">
            <div v-for="(item, index) in scope.row.roleList" :key="index">
              <span>{{ item.roleName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="90"
          align="center"
          key="active"
          prop="active"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.active"
              class="mb-2"
              :active-value="true"
              :inactive-value="false"
              style="
                --el-switch-on-color: #00cd00;
                --el-switch-off-color: #cdba96;
              "
              @change="handleStatusChange($event, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150" prop="createDate">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="180"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:userInfo:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:userInfo:operator']"
              ><span class="table_link_text">删除</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleResetPwd(scope.row)"
              v-hasPermi="['system:userInfo:operator']"
            >
              <span class="table_link_text">重置密码</span>
            </el-link>
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
      width="700px"
      append-to-body
      @close="cleanSelect()"
    >
      <el-form
        size="small"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入用户名"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="form.id == ''">
            <el-form-item label="密码" prop="passWord">
              <el-input
                v-model="form.passWord"
                placeholder="请输入密码"
                type="password"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择性别">
                <el-option
                  v-for="(dict, index) in sysUserSex"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="orgId">
              <el-tree-select
                v-model="form.orgId"
                :data="deptOptions"
                :props="elTreeProps"
                value-key="id"
                placeholder="请选择机构"
                check-strictly
                style="width: 200px"
                :render-after-expand="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select
                v-model="form.roleIds"
                placeholder="请选择角色"
                multiple
              >
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="active">
              <el-radio-group v-model="form.active">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!-- prettier-ignore -->
          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
          <el-button size="small" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="user" setup>
import User from "@/hooks/system/userInfo";
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
const {
  queryParams,
  showSearch,
  handleQuery,
  resetQuery,
  handleAdd,
  multiple,
  handleDelete,
  loading,
  userList,
  handleSelectionChange,
  handleUpdate,
  total,
  getList,
  title,
  open,
  form,
  rules,
  submitForm,
  cancel,
  elTreeProps,
  formRef,
  queryRef,
  pageTableRef,
  dateRange,
  dataTime,
  handleResetPwd,
  sysUserSex,
  userTypes,
  userParent,
  deptOptions,
  postOptions,
  single,
  handleStatusChange,
  cleanSelect,
} = User();
</script>

<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}
.el-input {
  width: 200px;
}
.el-select {
  width: 200px;
}
.popupMain {
  height: 600px;
}
</style>
