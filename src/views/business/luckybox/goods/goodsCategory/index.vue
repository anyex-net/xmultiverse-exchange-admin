<template>
  <div class="app-container">
    <!--        <el-form-->
    <!--            size="small"-->
    <!--            :model="queryParams"-->
    <!--            ref="queryFormRef"-->
    <!--            :inline="true"-->
    <!--            v-show="showSearch"-->
    <!--            label-width="70px"-->
    <!--        >-->
    <!--            <el-form-item label="分类名称" prop="name">-->
    <!--                <el-input-->
    <!--                    v-model="queryParams.name"-->
    <!--                    placeholder="请输入"-->
    <!--                    clearable-->
    <!--                    style="width: 240px"-->
    <!--                    @keyup.enter.native="handleQuery()"-->
    <!--                    @change="handleQuery()"-->
    <!--                />-->
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
          v-hasPermi="['goods:goodsCategory:operator']"
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
          v-hasPermi="['goods:goodsCategory:operator']"
          >删除</el-button
        >
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
        v-if="refreshTable"
        stripe
        v-loading="loading"
        ref="pageTableRef"
        :data="configList"
        @selection-change="handleSelectionChange"
        :default-expand-all="isExpandAll"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="分类名称" prop="name" fixed min-width="150px" />
        <el-table-column label="排序" prop="sort" min-width="90px" />
        <el-table-column label="创建时间" prop="createTime" min-width="150px"
          ><template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
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
              v-hasPermi="['goods:goodsCategory:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['goods:goodsCategory:operator']"
              ><span class="table_link_text">删除</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handlebrand(scope.row)"
              v-hasPermi="['goods:goodsCategory:operator']"
              ><span class="table_link_text">关联品牌</span></el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--        <pagination-->
    <!--            v-show="total > 0"-->
    <!--            :total="total"-->
    <!--            v-model:page="queryParams.current"-->
    <!--            v-model:limit="queryParams.size"-->
    <!--            @pagination="getList()"-->
    <!--        />-->

    <!-- 添加或修改商品分类对话框 -->
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
        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="treeOptions"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            value-key="id"
            placeholder="选择上级分类"
            check-strictly
            filterable
            :render-after-expand="false"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="排序" prop="name">
          <el-input-number
            v-model="form.sort"
            :min="1"
            :max="100"
            label="描述文字"
          ></el-input-number>
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
    <!-- 关联品牌 -->
    <el-dialog title="关联品牌" v-model="open1" width="500px" append-to-body>
      <el-form
        size="small"
        ref="formRef1"
        :model="form1"
        :rules="rules1"
        label-width="120px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input readonly v-model="form1.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商品品牌" prop="goodsBrandIds">
          <el-select
            v-model="form1.goodsBrandIds"
            multiple
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in brandList"
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
          <el-button size="small" type="primary" @click="submitForm1">确 定</el-button>
          <el-button size="small" @click="cancel1">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="goodsCategory" setup>
import GoodsCategory from "@/hooks/business/luckybox/goods/goodsCategory";
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
    loading, single, multiple, open, showSearch, total, configList, title, queryParams, queryFormRef, form, formRef, rules,
    getList, cancel,handleQuery, resetQuery, handleAdd, handleSelectionChange, handleUpdate, submitForm, handleDelete, pageTableRef, cleanSelect,brandList,treeOptions,handlebrand,formRef1,open1, form1,rules1,submitForm1,cancel1,isExpandAll,toggleExpandAll,refreshTable
} = GoodsCategory();
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
