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
      <!-- <el-form-item label="币种" prop="currency">
                <el-input v-model="queryParams.currency" placeholder="请输入" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item> -->
      <el-form-item label="操作类型" prop="operType">
        <el-select
          style="width: 215px"
          v-model="queryParams.operType"
          @change="handleQuery"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in typeList3"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否中奖" prop="isWinning">
                <el-select style="width: 215px" v-model="queryParams.isWinning" @change="handleQuery" placeholder="请选择"
                    clearable>
                    <el-option v-for="(item, index) in typeList1" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item> -->
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="handleAdd"
                    v-hasPermi="['activity:activityOperRecord:operator']"
                >新增
                </el-button
                >
            </el-col>

            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    size="small"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['activity:activityOperRecord:operator']"
                >删除
                </el-button
                >
            </el-col> -->
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
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column
          label="活动ID"
          fixed
          prop="activityId"
          min-width="140px"
        />
        <el-table-column label="账户ID" prop="accountId" min-width="140px" />
        <el-table-column label="请求IP" prop="requestIp" min-width="100px" />
        <el-table-column label="操作类型" prop="operType" min-width="100px">
          <template #default="scope">
            <span v-if="scope.row.operType == 'browse'">浏览</span>
            <span v-if="scope.row.operType == 'favorite'">收藏</span>
            <span v-if="scope.row.operType == 'praise'">点赞</span>
            <span v-if="scope.row.operType == 'comment'">评论</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作内容"
          prop="operContent"
          min-width="100px"
        />
        <el-table-column label="创建时间" prop="createTime" min-width="140px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" min-width="140px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="90px"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['activity:activityOperRecord:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
            <!-- <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['activity:activityOperRecord:operator']"
                        ><span class="table_link_text">删除</span></el-link
                        > -->
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
      <el-form size="small" ref="formRef" :model="form" :rules="rules">
        <el-form-item label="请求IP" prop="requestIp" style="font-weight: 600">
          <span class="mRbox">{{ form.requestIp }}</span>
        </el-form-item>
        <el-form-item label="操作类型" prop="operType" style="font-weight: 600">
          <span class="mRbox" v-if="form.operType == 'browse'">浏览</span>
          <span class="mRbox" v-if="form.operType == 'favorite'">收藏</span>
          <span class="mRbox" v-if="form.operType == 'praise'">点赞</span>
          <span class="mRbox" v-if="form.operType == 'comment'">评论</span>
        </el-form-item>
        <el-form-item
          label="操作内容"
          prop="operContent"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.operContent }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="font-weight: 600">
          <span class="mRbox">{{ form.remark }}</span>
        </el-form-item>
        <el-form-item
          label="创建时间"
          prop="createTime"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ parseTime(form.createTime) }}</span>
        </el-form-item>
        <el-form-item
          label="更新时间"
          prop="updateTime"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ parseTime(form.updateTime) }}</span>
        </el-form-item>
      </el-form>
      <!-- <template #footer>
                <div class="dialog-footer">
                    <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
                    <el-button size="small" @click="cancel">取 消</el-button>
                </div>
            </template> -->
    </el-dialog>
  </div>
</template>

<script lang="ts" name="activityOperRecord" setup>
import activityOperRecord from "@/hooks/business/luckybox/activity/activityOperRecord";
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
    pageTableRef,
    cleanSelect,
    langType, typeList1, typeList3
} = activityOperRecord();
</script>

<style lang="scss" scoped>
.mRbox {
  width: 100%;
  font-weight: 400;
  margin-left: 30px;
  border-bottom: 1px dotted #dfdcdc;
  display: flex;
  justify-content: flex-end;
}
</style>
