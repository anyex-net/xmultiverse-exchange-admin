<template>
  <div class="app-container">
    <!--        <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch"-->
    <!--                 label-width="70px">-->
    <!--            <el-form-item label="机构名称" prop="name">-->
    <!--                <el-input v-model="queryParams.orgName" placeholder="请输入" clearable style="width: 240px"-->
    <!--                          @keyup.enter.native="handleQuery()" @change="handleQuery()" />-->
    <!--            </el-form-item>-->
    <!--            &lt;!&ndash; prettier-ignore &ndash;&gt;-->
    <!--            <form-search @reset="resetQuery()" @search="handleQuery()" />-->
    <!--        </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          v-hasPermi="['system:organization:operator']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain size="small" @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
      <!-- prettier-ignore -->
      <right-toolbar :show="false" v-model:showSearch="showSearch" @queryTable="getList()" />
    </el-row>
    <div class="self-table">
      <el-table
        size="small"
        stripe
        v-loading="loading"
        v-if="refreshTable"
        :data="deptList"
        :default-expand-all="isExpandAll"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="机构名称" prop="orgName" min-width="120" />

        <el-table-column
          label="机构描述"
          min-width="120"
          prop="orgDest"
          :show-overflow-tooltip="true"
        />
        <!--                <el-table-column label="创建人" min-width="120" prop="createByName" :show-overflow-tooltip="true" />-->
        <el-table-column label="排序" min-width="100" prop="sortNum" />
        <el-table-column label="创建时间" min-width="150" prop="createDate">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              ><span
                class="table_link_text"
                v-hasPermi="['system:organization:operator']"
                >修改</span
              ></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleAdd(scope.row)"
              ><span
                class="table_link_text"
                v-hasPermi="['system:organization:operator']"
                >新增</span
              ></el-link
            >

            <el-link
              v-if="scope.row.parentId != 0"
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:organization:operator']"
              ><span class="table_link_text">删除</span></el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current"
            v-model:limit="queryParams.size" @pagination="getList()" /> -->

    <!-- 添加或修改地区对话框 -->
    <el-dialog :title="title" v-model="open" width="30%" append-to-body>
      <el-form
        size="small"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          v-if="form.parentId !== 0"
          label="上级机构"
          prop="parentId"
        >
          <!-- prettier-ignore -->
          <el-tree-select v-model="form.parentId" :data="AreaOptions"
                                    :props="{ value: 'id', label: 'orgName', children: 'children' }" value-key="id"
                                    placeholder="选择上级机构" check-strictly filterable :render-after-expand="false"
                                    style="width: 100%;" />
        </el-form-item>
        <el-form-item label="机构编码" prop="orgCode">
          <el-input v-model="form.orgCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="机构名称" prop="orgName">
          <el-input v-model="form.orgName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="排序" prop="sortNum">
          <el-input-number v-model="form.sortNum" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="机构描述" prop="orgDest">
          <el-input
            v-model="form.orgDest"
            placeholder="请输入"
            type="textarea"
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

<script lang="ts" name="organization" setup>
import Organization from "@/hooks/system/organization";
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
    open,
    showSearch,
    deptList,
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
    handleUpdate,
    submitForm,
    handleDelete,
    toggleExpandAll,
    refreshTable,
    isExpandAll,
    AreaOptions,
} = Organization();
</script>
