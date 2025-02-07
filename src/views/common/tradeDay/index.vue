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
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          clearable
          @change="handleQuery()"
          placeholder="请选择"
          style="width: 240px"
        >
          <el-option
            v-for="item in listA3"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          v-hasPermi="['common:tradeDay:operator']"
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
          v-hasPermi="['common:tradeDay:operator']"
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
        <el-table-column label="日期" prop="date" min-width="150px"
          ><template #default="scope">
            <span>{{ formatDate1(scope.row.date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" min-width="150px"
          ><template #default="scope">
            <span>{{ scope.row.type ? "交易日" : "非交易日" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createName" min-width="150px"
          ><template #default="scope">
            <span>{{ scope.row.createName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新人" prop="updateBy" min-width="150px"
          ><template #default="scope">
            <span>{{ scope.row.updateBy }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="150px"
          ><template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" min-width="150px"
          ><template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
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
              v-hasPermi="['common:tradeDay:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['common:tradeDay:operator']"
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
        <el-form-item label="日期" prop="date">
          <el-date-picker
            style="width: 300px"
            v-model="form.date"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYYMMDD"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型" prop="type" style="font-weight: 600">
          <el-select
            style="width: 300px"
            v-model="form.type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in listA3"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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

<script lang="ts" name="tradeDay" setup>
import tradeDay1 from "@/api/request/common/tradeDay";
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
    getList, cancel,handleQuery, resetQuery, handleAdd, handleSelectionChange,listA3, handleUpdate, submitForm, handleDelete, pageTableRef, cleanSelect, isShowTooltip, onMouseOver,
} = tradeDay1();
function formatDate1(dateStr: any) {
  // 提取年份、月份和日期
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  // 将它们拼接成新的日期格式
  return `${year}-${month}-${day}`;
}
</script>
