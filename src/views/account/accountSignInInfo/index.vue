<template>
  <div class="app-container">
    <el-form
      size="small"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      v-show="showSearch"
      label-width="90px"
    >
      <el-form-item label="账户ID" prop="accountId">
        <el-input
          v-model="queryParams.accountId"
          placeholder="请输入账户ID"
          clearable
          @keyup.enter="handleQuery"
          @change="handleQuery()"
        />
      </el-form-item>
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <div class="self-table">
      <el-table
        size="small"
        v-loading="loading"
        :data="configList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="账户ID"
          align="center"
          fixed
          min-width="150px"
          prop="accountId"
        />
        <el-table-column
          label="总积分"
          align="center"
          min-width="100px"
          prop="totalPoints"
        />
        <el-table-column
          label="剩余积分"
          align="center"
          min-width="100px"
          prop="remainingPoints"
        />
        <el-table-column
          label="积分等级"
          align="center"
          min-width="100px"
          prop="pointsLevel"
        />
        <el-table-column
          label="总签到次数"
          align="center"
          min-width="100px"
          prop="totalSigninTimes"
        />
        <el-table-column
          label="最高签到次数"
          align="center"
          min-width="100px"
          prop="maxsSigninTimes"
        />
        <el-table-column
          label="本轮累计签到次数"
          align="center"
          min-width="130px"
          prop="currentSigninTimes"
        />
        <el-table-column
          label="最后一次签到日期"
          align="center"
          min-width="150px"
          prop="lastSigninDate"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastSigninDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          min-width="150px"
          prop="createTime"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          min-width="150px"
          prop="updateTime"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          min-width="150px"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['account:accountSignInInfo:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
            <!--                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"-->
            <!--                               v-hasPerm="['account:accountinvitestatistics:remove']">删除-->
            <!--                    </el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改账户邀请统计对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
      @close="cleanSelect()"
    >
      <el-form ref="formRef" size="small" :model="form">
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="账户ID"
              prop="accountId"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.accountId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="总积分"
              prop="totalPoints"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.totalPoints }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="剩余积分"
              prop="remainingPoints"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.remainingPoints }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="总签到次数"
              prop="pointsLevel"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.pointsLevel }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="最高签到次数"
              prop="totalSigninTimes"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.totalSigninTimes }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="本轮累计签到次数"
              prop="currentSigninTimes"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.currentSigninTimes }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="最后一次签到日期"
              prop="lastSigninDate"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ parseTime(form.lastSigninDate) }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="创建时间"
              prop="createTime"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ parseTime(form.createTime) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="更新时间"
              prop="updateTime"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ parseTime(form.updateTime) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="accountInviteRewardsDetail" setup>
import AccountSignInInfo from "@/hooks/account/accountSignInInfo";
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
    handleDelete,
    pageTableRef,
    cleanSelect,
} = AccountSignInInfo();
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
