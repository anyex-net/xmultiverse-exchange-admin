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
              v-for="i in titles"
              :key="i.name"
              :label="i.title"
              min-width="150px"
          >
              <!-- 使用作用域插槽来处理不同的prop -->
              <template #default="scope">
                  <div v-if="['agentPassportImg1','agentPassportImg2','agentPassportImg3','companyRegistrImg','companyAmlCertificate'].includes(i.name)">
<!--                  <div v-if="i.name === 'companyRegistrImg'">-->
                      <el-image
                          style="width: 30px; height: 30px; border-radius: 5px"
                          :src="uploadUrl + scope.row[i.name]"
                          :preview-src-list="[uploadUrl + scope.row[i.name]]"
                          :initial-index="1"
                          :z-index="99999"
                          :preview-teleported="true"
                      />
                  </div>
                  <div v-else-if="i.name === 'state'">
                      {{ formOptions.state[scope.row[i.name]] || '未知状态' }}
                  </div>
                  <div v-else>{{ scope.row[i.name] }}</div>
              </template>
          </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="150px" />
        <el-table-column
          label="操作"
          min-width="160px"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleShowDetail(scope.row)"
              v-hasPermi="['rwa:rwaCertInstInvestor:data']"
              ><span class="table_link_text">详情</span></el-link
            >
              <div v-if="scope.row.state === '0'">
                  <!-- 待审核状态下的操作 -->
                  <el-link
                      class="table_link_btn"
                      :underline="false"
                      type="success"
                      @click="handleStatusChange(scope.row, 'approve')"
                      v-hasPermi="['rwa:rwaCertInstInvestor:check']"
                  >
                      <span class="table_link_text">审核通过</span>
                  </el-link>
                  <el-link
                      class="table_link_btn"
                      :underline="false"
                      type="danger"
                      @click="handleStatusChange(scope.row, 'reject')"
                      v-hasPermi="['rwa:rwaCertInstInvestor:check']"
                  >
                      <span class="table_link_text">审核拒绝</span>
                  </el-link>
              </div>
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
      width="1000px"
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
          <el-row v-for="(group, groupIndex) in formtitles" :key="groupIndex">
              <el-col :span="12" v-for="item in group" :key="item.name">
                  <el-form-item :label="item.title" :prop="item.name">
                <div v-if="item.type === 'radio'">
                    <el-select
                        v-model="(form as any)[item.name]"
                        style="width: 200px"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="(option, index) in formOptions[item.name]"
                            :key="index"
                            :label="option"
                            :value="index"
                        ></el-option>
                    </el-select>
                </div>
                <div v-else-if="['agentPassportImg1', 'agentPassportImg2', 'agentPassportImg3', 'companyRegistrImg', 'companyAmlCertificate'].includes(item.name)">
                    <el-image
                        style="width: 100px; height: auto; border-radius: 5px"
                        :src="uploadUrl + (form as any)[item.name]"
                        :preview-src-list="[uploadUrl + (form as any)[item.name]]"
                        :initial-index="1"
                        :z-index="99999"
                        :preview-teleported="true"
                    />
                </div>
                <div v-else>
                    <el-input
                        style="width: 200px"
                        v-model="(form as any)[item.name]"
                        :placeholder="'请输入' + item.title"
                        maxlength="30"
                    />
                </div>
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

<script lang="ts" name="rwaCertInstInvestor" setup>
import datas from "@/hooks/rwa/rwaCertInstInvestor";
import {
  formSearchs,
  titles,
  formOptions,
  formtitles,
  rules,
} from "@/data/rwa/rwaCertInstInvestor";

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
    handleStatusChange,
    handleShowDetail,
    isShowBtn,
    uploadUrl
} = datas();
</script>
