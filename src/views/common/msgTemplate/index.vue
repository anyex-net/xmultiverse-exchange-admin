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
      <el-form-item label="模版KEY" prop="tplKey">
        <el-input
          v-model="queryParams.tplKey"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="消息标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入描述"
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
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          v-hasPermi="['common:msgTemplate:operator']"
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
          v-hasPermi="['common:msgTemplate:operator']"
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
        <el-table-column
          label="模板内容"
          prop="content"
          fixed
          min-width="120px"
        >
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.content"
              placement="top"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.content }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="语言类型" prop="lang" min-width="120px" />
        <el-table-column label="消息标题" prop="title" min-width="120px">
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.title"
              placement="top"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.title }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="模版KEY" prop="tplKey" min-width="120px">
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.tplKey"
              placement="top"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.tplKey }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="模版类型" prop="type" min-width="120px" />
        <el-table-column label="备注" prop="dest" min-width="120px">
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.dest"
              placement="top"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.dest }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="remark" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120px"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['common:msgTemplate:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['common:msgTemplate:operator']"
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
        <el-form-item label="模版内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="语言类型" prop="lang">
          <el-select
            v-model="form.lang"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in langType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="模版KEY" prop="tplKey">
          <el-input v-model="form.tplKey" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="模版类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数描述" prop="dest">
          <el-input v-model="form.dest" type="textarea" placeholder="请输入" />
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

<script lang="ts" name="msgTemplate" setup>
import MsgTemplate from "@/hooks/common/msgTemplate";
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
    submitForm,
    handleDelete,
    pageTableRef,
    cleanSelect,
    langType,
    typeList,
    isShowTooltip,
    onMouseOver,
} = MsgTemplate();
</script>
