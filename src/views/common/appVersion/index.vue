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
      <el-form-item label="版本类型" prop="deviceType">
        <el-select
          style="width: 240px"
          v-model="queryParams.deviceType"
          @change="handleQuery"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in deviceList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!--            <el-form-item label="描述" prop="remark">-->
      <!--                <el-input-->
      <!--                    v-model="queryParams.remark"-->
      <!--                    placeholder="请输入描述"-->
      <!--                    clearable-->
      <!--                    style="width: 240px"-->
      <!--                    @keyup.enter.native="handleQuery()"-->
      <!--                    @change="handleQuery()"-->
      <!--                />-->
      <!--            </el-form-item>-->
      <!-- prettier-ignore -->
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          v-hasPermi="['common:appVersion:operator']"
          >新增</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['common:appVersion:operator']"
          >删除</el-button
        >
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
        <el-table-column label="设备类型" prop="deviceType" fixed />
        <el-table-column label="版本号" prop="appVersion" />
        <el-table-column label="build版本号" prop="buildVersion" />
        <el-table-column label="是否支持" prop="canSupport">
          <template #default="scope">
            <span v-if="scope.row.canSupport">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" prop="checkStatus">
          <template #default="scope">
            <span v-if="scope.row.checkStatus">已审核</span>
            <span v-else>未审核</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" prop="remark" />
        <el-table-column label="创建时间" prop="remark" min-width="150px"
          ><template #default="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120px"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['common:appVersion:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['common:appVersion:operator']"
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
      @close="cleanSelect()"
    >
      <el-form
        size="small"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="设备类型" prop="deviceType">
          <el-select
            style="width: 100%"
            v-model="form.deviceType"
            @change="handleQuery"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, index) in deviceList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="appVersion">
          <el-input v-model="form.appVersion" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="build版本号" prop="buildVersion">
          <el-input v-model="form.buildVersion" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="是否支持" prop="canSupport">
          <el-radio-group v-model="form.canSupport">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核状态" prop="checkStatus">
          <el-radio-group v-model="form.checkStatus">
            <el-radio :label="false">未审核</el-radio>
            <el-radio :label="true">已审核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
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

<script lang="ts" name="appVersion" setup>
import AppVersion from "@/hooks/common/appVersion";
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
    loading, single, multiple, open, showSearch, total, configList, title, queryParams, queryFormRef, form, formRef, rules,
    getList, cancel,handleQuery, resetQuery, handleAdd, handleSelectionChange, handleUpdate, submitForm, handleDelete, pageTableRef, cleanSelect,deviceList
} = AppVersion();
</script>
