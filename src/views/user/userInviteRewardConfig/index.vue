<template>
  <div class="app-container">
    <el-form
      size="small"
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
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

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          size="small"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['user:user:operator']"-->
<!--          >新增</el-button-->
<!--        >-->
<!--      </el-col>-->

<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          size="small"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['user:user:operator']"-->
<!--          >删除</el-button-->
<!--        >-->
<!--      </el-col>-->
      <!-- prettier-ignore -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
    </el-row>
    <div class="self-table">
      <el-table
        size="small"
        stripe
        v-loading="loading"
        ref="pageTableRef"
        :data="dataList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" prop="id" min-width="150px" />

        <el-table-column
          :label="i.title"
          :formatter="i.formatter"
          :prop="i.name"
          min-width="150px"
          v-for="i in titles"
          :key="i.name"
        />

        <el-table-column label="创建时间" prop="createTime" min-width="150px" />
        <el-table-column label="更新人" prop="updateBy" min-width="150px" />
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
                  v-hasPermi="['user:userInviteRewardConfig:data']"
              ><span class="table_link_text">详情</span></el-link>
              <el-link
                  class="table_link_btn"
                  :underline="false"
                  type="primary"
                  @click="handleStatusChange(scope.row)"
                  v-hasPermi="['user:userInviteRewardConfig:operator']"
              ><span class="table_link_text">{{ scope.row.state === 0 ? '可用' : '不可用' }}</span></el-link>
<!--            <el-link-->
<!--              class="table_link_btn"-->
<!--              :underline="false"-->
<!--              type="primary"-->
<!--              @click="handleUpdate(scope.row)"-->
<!--              v-hasPermi="['user:user:operator']"-->
<!--              ><span class="table_link_text">修改</span></el-link-->
<!--            >-->
<!--            <el-link-->
<!--              class="table_link_btn"-->
<!--              :underline="false"-->
<!--              size="small"-->
<!--              type="primary"-->
<!--              @click="handleDelete(scope.row)"-->
<!--              v-hasPermi="['user:user:operator']"-->
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
<!--              <el-select-->
<!--                v-model="(form as any)[i2.name]"-->
<!--                style="width: 120px"-->
<!--                placeholder="请选择"-->
<!--                v-if="i2.type === 'radio'"-->
<!--              >-->
<!--                <el-option-->
<!--                  v-for="(o, k) in formOptions[i2.name]"-->
<!--                  :key="o"-->
<!--                  :label="o"-->
<!--                  :value="k"-->
<!--                ></el-option>-->
<!--              </el-select>-->
                <template v-if="i2.type === 'radio'">
                    <!-- 使用 el-input 以只读形式展示状态值 -->
                    <el-input
                        :value="formOptions[i2.name] ? (formOptions[i2.name][form[i2.name]] || '未知状态') : ''"
                        readonly
                    />
                </template>
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

<script lang="ts" name="user" setup>
import datas from "@/hooks/user/userInviteRewardConfig";
import stacky from "../../../utils/table-sticky";
import {
  formSearchs,
  formOptions,
  titles,
  formtitles,
  rules,
} from "@/data/user/userInviteRewardConfig";

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
  form,queryParams, queryRef, pageTableRef, formRef,
  title,loading, single, multiple, open, showSearch, total, dataList, 
  getList, resetQuery, cancel,submitForm, cleanSelect,
  handleQuery, handleAdd, handleSelectionChange,handleStatusChange, handleDelete, handleShowDetail, isShowBtn
} = datas();
</script>
