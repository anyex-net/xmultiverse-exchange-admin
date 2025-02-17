<template>
  <div class="app-container">
    <el-row
      style="display: flex; justify-content: space-between; flex-wrap: wrap"
    >
      <el-col :span="8" style="margin-bottom: 10px; margin-right: 10px">
        <el-form
          size="small"
          :model="queryParams1"
          ref="queryFormRef1"
          :inline="true"
          v-show="showSearch"
          label-width="70px"
        >
          <el-form-item label="品类名称" prop="name">
            <el-input
              v-model="queryParams1.name"
              placeholder="请输入"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery1()"
              @change="handleQuery1()"
            />
          </el-form-item>
          <!-- prettier-ignore -->
          <form-search @reset="resetQuery1()" @search="handleQuery1()" />
        </el-form>

        <el-row :gutter="10" class="mb8">
          <!--                     prettier-ignore-->
          <right-toolbar  v-model:showSearch="showSearch" @queryTable="getList1()" />
        </el-row>
        <div class="self-table">
          <el-table
            size="small"
            stripe
            v-loading="loading"
            ref="pageTableRef"
            :data="goodsspecList"
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentChange"
          >
            <el-table-column label="分类名称" prop="name" />
          </el-table>
        </div>
        <pagination
          v-show="total1 > 0"
          :total="total1"
          v-model:page="queryParams1.current"
          v-model:limit="queryParams1.size"
          @pagination="getList1()"
        />
      </el-col>
      <el-col :span="15">
        <el-form
          size="small"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          v-show="showSearch"
          label-width="70px"
        >
          <el-form-item label="参数名称" prop="paramName">
            <el-input
              v-model="queryParams.paramName"
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
            <el-button
              type="primary"
              plain
              size="small"
              @click="handleAdd"
              v-hasPermi="['goods:goodsSpecParam:operator']"
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
              v-hasPermi="['goods:goodsSpecParam:operator']"
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
              label="参数名称"
              prop="paramName"
              fixed
              min-width="120px"
            />
            <el-table-column
              label="参数值"
              prop="paramValue"
              min-width="120px"
            />
            <el-table-column label="单位" prop="unit" min-width="120px" />
            <el-table-column
              label="是否为数字参数"
              prop="paramValue"
              min-width="120px"
            >
              <template #default="scope">
                <span v-if="scope.row.isNumeric">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="120px"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-link
                  class="table_link_btn"
                  :underline="false"
                  type="primary"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['goods:goodsSpecParam:operator']"
                  ><span class="table_link_text">修改</span></el-link
                >
                <el-link
                  class="table_link_btn"
                  :underline="false"
                  size="small"
                  type="primary"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['goods:goodsSpecParam:operator']"
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
      </el-col>
    </el-row>

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
        <el-form-item label="商品品类" prop="spgId">
          <el-select
            v-model="form.spgId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in specList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="form.paramName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="参数值" prop="paramValue">
          <el-input v-model="form.paramValue" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否为数字参数" prop="isNumeric">
          <el-radio-group v-model="form.isNumeric">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
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

<script lang="ts" name="goodsSpecGroup" setup>
import GoodsSpecParam from "@/hooks/business/luckybox/goods/goodsSpecParam";
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
    specList,
    queryParams1,
    goodsspecList,
    total1,
    handleCurrentChange,
    handleQuery1,
    resetQuery1,
    queryFormRef1,
    getList1,
} = GoodsSpecParam();
</script>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}

.img_upload {
  width: 130px;
  height: 130px;
  border: 1px dashed #c1c1c1;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    font-size: 30px;
    color: #c1c1c1;
  }

  .img1 {
    width: 130px;
    height: 130px;
  }
}
</style>
