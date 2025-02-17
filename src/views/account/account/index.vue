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
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
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
      <!-- <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              size="small"
              @click="handleAdd"
              v-hasPermi="['account:account:operator']"
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
              v-hasPermi="['account:account:operator']"
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
        <el-table-column label="账户ID" fixed prop="id" min-width="150px" />
        <el-table-column label="UID" fixed prop="unid" min-width="120px" />
        <el-table-column label="国家" prop="country" min-width="80px" />
        <el-table-column label="手机号码" prop="mobile" min-width="120px" />
        <el-table-column
          label="账户昵称"
          prop="accountName"
          min-width="150px"
        />
        <el-table-column label="账户姓名" prop="realName" min-width="120px" />
        <el-table-column label="CNIC" prop="cnic" min-width="120px" />
        <el-table-column label="邮箱" prop="email" min-width="120px" />
        <el-table-column label="生日" prop="birth" min-width="90" />
        <el-table-column label="性别" prop="gender" min-width="90">
          <template #default="scope">
            <span v-if="scope.row.gender == 0">男</span>
            <span v-if="scope.row.gender == 1">女</span>
          </template>
        </el-table-column>
        <el-table-column label="设备ID" prop="deviceId" min-width="100px" />
        <el-table-column label="IP" prop="ip" min-width="100px" />
        <el-table-column label="经度" prop="lng" min-width="100px" />
        <el-table-column label="纬度" prop="lat" min-width="100px" />
        <el-table-column label="邀请码" prop="invitationCode" />
        <el-table-column label="推荐码" prop="referralCode" />
        <el-table-column label="状态" prop="status" min-width="90">
          <template #default="scope">
            <span v-if="scope.row.status == 0">正常</span>
            <span v-if="scope.row.status == 1">冻结</span>
            <span v-if="scope.row.status == 2">注销</span>
          </template>
        </el-table-column>
        <el-table-column label="来源" prop="source" />
        <el-table-column label="备注" prop="remark" min-width="150px" />
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
              v-hasPermi="['account:account:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
            <!-- <el-link class="table_link_btn" :underline="false" size="small" type="primary"
                @click="handleDelete(scope.row)" v-hasPermi="['account:account:operator']"><span
                    class="table_link_text">删除</span></el-link> -->
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
        <el-form-item label="UID" prop="unid" style="font-weight: 600">
          <span class="mRbox">{{ form.unid }}</span>
        </el-form-item>
        <el-form-item label="国家" prop="country" style="font-weight: 600">
          <span class="mRbox">{{ form.country }}</span>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" style="font-weight: 600">
          <span class="mRbox">{{ form.mobile }}</span>
        </el-form-item>
        <el-form-item
          label="账户昵称"
          prop="accountName"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.accountName }}</span>
        </el-form-item>
        <el-form-item label="账户姓名" prop="realName" style="font-weight: 600">
          <span class="mRbox">{{ form.realName }}</span>
        </el-form-item>
        <el-form-item label="CNIC" prop="cnic" style="font-weight: 600">
          <span class="mRbox">{{ form.cnic }}</span>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="font-weight: 600">
          <span class="mRbox">{{ form.email }}</span>
        </el-form-item>
        <el-form-item label="生日" prop="birth" style="font-weight: 600">
          <span class="mRbox">{{ form.birth }}</span>
        </el-form-item>
        <el-form-item label="性别" prop="gender" style="font-weight: 600">
          <span class="mRbox" v-if="form.gender">女</span>
          <span class="mRbox" v-else>男</span>
        </el-form-item>
        <el-form-item label="设备ID" prop="deviceId" style="font-weight: 600">
          <span class="mRbox">{{ form.deviceId }}</span>
        </el-form-item>
        <el-form-item label="IP" prop="ip" style="font-weight: 600">
          <span class="mRbox">{{ form.ip }}</span>
        </el-form-item>
        <el-form-item label="经度" prop="lng" style="font-weight: 600">
          <span class="mRbox">{{ form.lng }}</span>
        </el-form-item>
        <el-form-item label="纬度" prop="lat" style="font-weight: 600">
          <span class="mRbox">{{ form.lat }}</span>
        </el-form-item>
        <el-form-item
          label="邀请码"
          prop="invitationCode"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.invitationCode }}</span>
        </el-form-item>
        <el-form-item
          label="推荐码"
          prop="referralCode"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.referralCode }}</span>
        </el-form-item>
        <el-form-item label="状态" prop="status" style="font-weight: 600">
          <span class="mRbox" v-if="form.status == '0'">正常</span>
          <span class="mRbox" v-if="form.status == '1'">冻结</span>
          <span class="mRbox" v-if="form.status == '2'">注销</span>
        </el-form-item>
        <el-form-item label="来源" prop="source" style="font-weight: 600">
          <span class="mRbox">{{ form.source }}</span>
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

<script lang="ts" name="account" setup>
import account from "@/hooks/account/account";
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
