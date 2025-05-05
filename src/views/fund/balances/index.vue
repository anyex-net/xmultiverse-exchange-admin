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
        <el-input
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
<!--        <el-table-column type="selection" width="55" align="center" />-->
<!--        <el-table-column label="主键" prop="id" min-width="150px" />-->

        <el-table-column
          :label="i.title"
          :prop="i.name"
          min-width="150px"
          v-for="i in titles"
          :key="i.name"
        />

        <el-table-column label="更新时间" prop="updateTime" min-width="150px" />
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
                  v-hasPermi="['fund:balances:data']"
              ><span class="table_link_text">详情</span></el-link
              >
              <el-link
                  class="table_link_btn"
                  :underline="false"
                  type="primary"
                  @click="handleUpdateAdjust(scope.row)"
                  v-hasPermi="['fund:balances:operator']"
              ><span class="table_link_text">调整</span></el-link
              >
<!--            <el-link-->
<!--              class="table_link_btn"-->
<!--              :underline="false"-->
<!--              type="primary"-->
<!--              @click="handleUpdate(scope.row)"-->
<!--              v-hasPermi="['fund:balances:operator']"-->
<!--              ><span class="table_link_text">修改</span></el-link-->
<!--            >-->
<!--            <el-link-->
<!--              class="table_link_btn"-->
<!--              :underline="false"-->
<!--              size="small"-->
<!--              type="primary"-->
<!--              @click="handleDelete(scope.row)"-->
<!--              v-hasPermi="['fund:balances:operator']"-->
<!--              ><span class="table_link_text">删除</span></el-link-->
<!--            >-->
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
        label-width="100px"
      >
        <el-row v-for="(i, k) in formtitles" :key="k">
          <el-col :span="12" v-for="i2 in i" :key="i2.name">
            <el-form-item :label="i2.title" :prop="i2.name">
              <el-input
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

    <el-dialog :title="title" v-model="openAdjust" width="500px" append-to-body @close="cleanSelect()">
        <el-form size="small" ref="formAdjustRef" :model="formAdjust" :rules="rulesAdjust" label-width="100px">
            <el-form-item label="资产ID" prop="id" style="font-weight: 600;">
                <span>{{ formAdjust.id }}</span>
            </el-form-item>
            <el-form-item label="币种" prop="currency" style="font-weight: 600;">
                <span>{{ formAdjust.currency }}</span>
            </el-form-item>
            <el-form-item label="调整方向" prop="type"  style="font-weight: 600;" >
                <el-select v-model="formAdjust.type" placeholder="请选择" style="width:300px;" >
                    <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发生数量" prop="changeAmt" style="font-weight: 600;">
                <el-input style="width:300px;"
                          type="number"
                          v-model="formAdjust.changeAmt"
                          placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="交易描述" prop="transDesc" style="font-weight: 600;">
                <el-input style="width:300px;"
                          type="text"
                          v-model="formAdjust.transDesc"
                          placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="备注" prop="remark" style="font-weight: 600;">
                <el-input style="width:300px;"
                          type="text"
                          v-model="formAdjust.remark"
                          placeholder="请输入"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="small" type="primary" @click="submitFormAdjust">确 定</el-button>
                <el-button size="small" @click="cancelAdjust">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" name="balances" setup>
import balances from "@/hooks/fund/balances";
import { formSearchs, titles, formtitles, rules } from "@/data/fund/balances";

// prettier-ignore
const {
  loading, single, multiple, open, showSearch, total, dataList, title, queryParams, queryFormRef, form, formRef,
  getList, cancel,handleQuery, resetQuery, handleAdd, handleSelectionChange,handleUpdate, submitForm, handleDelete, pageTableRef, cleanSelect,
    handleShowDetail, isShowBtn,typeList,
    openAdjust,
    formAdjust,
    handleUpdateAdjust,
    submitFormAdjust,
    cancelAdjust,
    rulesAdjust,
    formAdjustRef
} = balances();
</script>
