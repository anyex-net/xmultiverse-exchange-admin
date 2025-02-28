<template>
  <div class="app-container">
    <el-form
      size="small"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item
        :label="i.title"
        :prop="i.name"
        v-for="i in formSearchs"
        :key="i.name"
      >
        <el-select
          v-model="(queryParams as any)[i.name]"
          style="width: 120px"
          placeholder="请选择"
          v-if="i.type === 'radio'"
        >
          <el-option
            v-for="(dict, index) in formOptions[i.name]"
            :key="index"
            :label="dict"
            :value="index"
          ></el-option>
        </el-select>
        <el-input
          v-else
          v-model="(queryParams as any)[i.name]"
          placeholder="请输入"
          clearable
          style="width: 120px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <div class="self-table">
      <el-table
        size="small"
        stripe
        v-loading="loading"
        ref="pageTableRef"
        :data="dataList"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
<!--        <el-table-column label="主键" prop="id" min-width="150px" />-->

        <el-table-column
          :label="i.title"
          :formatter="i.formatter"
          :prop="i.name"
          min-width="150px"
          v-for="i in titles"
          :key="i.name"
        />
        <el-table-column label="创建时间" prop="createTime" min-width="150px" />
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
              @click="handleShowDetail(scope.row)"
              v-hasPermi="['rwa:rwaInstSpvProductPurchase:data']"
              ><span class="table_link_text">详情</span></el-link
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
      <el-form
        size="small"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="160px"
      >
        <el-row v-for="(i, k) in formtitles" :key="k">
          <el-col :span="12" v-for="i2 in i" :key="i2.name">
            <el-form-item :label="i2.title" :prop="i2.name">
                <el-select
                    v-model="(form as any)[i2.name]"
                    style="width: 120px"
                    placeholder="请选择"
                    v-if="i2.type === 'radio'"
                >
                    <el-option
                        v-for="(o, k) in formOptions[i2.name]"
                        :key="o"
                        :label="o"
                        :value="k"
                    ></el-option>
                </el-select>
              <el-input
                v-else
                v-model="(form as any)[i2.name]"
                :placeholder="'请输入' + i2.title"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div v-if="isShowBtn === true" class="dialog-footer">
          <!-- prettier-ignore -->
          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
          <el-button size="small" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="rwaInstSpvProductPurchase" setup>
import datas from "@/hooks/rwa/rwaInstSpvProductPurchase";
import {
  formSearchs,
  titles,
  formOptions,
  formtitles,
  rules,
} from "@/data/rwa/rwaInstSpvProductPurchase";

const {
  loading,
  single,
  multiple,
  open,
  showSearch,
  total,
  dataList,
  title,
  queryParams,
  queryFormRef,
  form,
  formRef,
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
    handleShowDetail,
    isShowBtn
} = datas();
</script>
