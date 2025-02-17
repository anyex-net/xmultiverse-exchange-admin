<template>
  <div class="app-container">
    <el-form
      size="small"
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:resource:operator']"
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          >新增
        </el-button>
      </el-col>
      <!--            <el-col :span="1.5">-->
      <!--                <el-button type="success" plain  size="small" :disabled="single" @click="handleUpdate"-->
      <!--                    v-hasPermi="['system:resource:operator']">修改</el-button>-->
      <!--            </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:resource:operator']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          size="small"
          @click="handleExport"
          v-hasPermi="['system:resource:operator']"
          >前端导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          size="small"
          @click="handleExport1"
          v-hasPermi="['system:resource:operator']"
          >后端导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          size="small"
          @click="handleExportPdf"
          v-hasPermi="['system:resource:operator']"
          >导出pdf
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="handleQuery()"
      />
    </el-row>
    <div class="self-table">
      <el-table
        id="my-table"
        size="small"
        stripe
        v-loading="loading"
        ref="pageTableRef"
        :data="roleList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色编号" prop="roleCode" min-width="120" />
        <el-table-column label="角色名称" prop="roleName" />
        <el-table-column label="是否绑定GA" prop="roleName">
          <template #default="scope">
            <span v-if="scope.row.needGa">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDest" min-width="150" />
        <el-table-column label="创建时间" min-width="150" prop="createDate">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="150"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:resource:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:resource:operator']"
              ><span class="table_link_text">删除</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="setJurisdiction(scope.row)"
              v-hasPermi="['system:resource:operator']"
              ><span class="table_link_text">权限分配</span></el-link
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
      width="800px"
      append-to-body
      @close="cleanSelect()"
    >
      <el-button
        type="warning"
        plain
        size="small"
        @click="handleExportPdfForm"
        v-hasPermi="['system:resource:operator']"
        >导出pdf
      </el-button>
      <div ref="formPdf">
        <el-form
          id="myForm"
          size="small"
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色名称" prop="roleName">
                <el-input
                  class="elinput"
                  v-model="form.roleName"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色编码" prop="roleCode">
                <el-input v-model="form.roleCode" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="是否绑定GA" prop="needGa">
                <el-radio-group v-model="form.needGa">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="角色描述" prop="roleDest">
                <el-input
                  type="textarea"
                  v-model="form.roleDest"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <!-- prettier-ignore -->
          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
          <el-button size="small" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    分配权限-->
    <el-dialog
      title="分配权限"
      v-model="setJurisdictionShow"
      width="500px"
      append-to-body
      @close="cleanSelect()"
    >
      <div style="height: 500px; overflow: auto">
        <el-tree
          style="width: 100%; height: 100%"
          :data="setJurisdictionTableData"
          :props="{ children: 'children', label: 'resName' }"
          ref="setJurisdictionTree"
          node-key="id"
          :default-expand-all="false"
          show-checkbox
          check-strictly
          @check="setJurisdictionTableDataSelect"
        ></el-tree>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" type="primary" @click="submitForm1"
            >确 定</el-button
          >
          <el-button size="small" @click="cancel1">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="role" setup>
import Role from "@/hooks/system/role";
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
  roleList,
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
  formRef,
  queryRef,
  pageTableRef,
  cleanSelect,
  single,
  setJurisdiction,
  setJurisdictionShow,
  setJurisdictionTableData,
  setJurisdictionTree,
  setJurisdictionTableDataSelect,
  submitForm1,
  cancel1,
  handleExport,
  handleExport1,
  handleExportPdf,
  handleExportPdfForm,
  formPdf,
} = Role();
</script>

<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
/* 在你的样式表中添加以下规则 */
::v-deep .html2canvas-container .el-input__inner {
  border: 1px solid #ccc !important; /* 使用你想要的颜色和宽度 */
}
//导出pdf时vue3版本el-input输入框不支持,需要重新设置边框线
::v-deep .el-input__wrapper {
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
  //border-radius: 0;
}
//导出pdf时vue3版本el-textarea输入框不支持,需要重新设置边框线
::v-deep .el-textarea__inner {
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}

.popupMain {
  height: 600px;
}
</style>
