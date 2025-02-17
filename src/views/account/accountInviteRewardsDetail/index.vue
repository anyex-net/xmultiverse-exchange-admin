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
      <el-form-item label="状态" prop="status">
        <el-select
          style="width: 215px"
          v-model="queryParams.status"
          @change="handleQuery"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
          label="被邀请人账户ID"
          align="center"
          min-width="150px"
          prop="inviteActId"
        />
        <el-table-column label="被邀请人头像" align="center" min-width="120px">
          <template #default="scope">
            <el-image
              v-if="scope.row.inviteActHead != 'headUrl'"
              style="width: 30px; height: 30px; border-radius: 5px"
              :src="scope.row.inviteActHead"
              :preview-src-list="[scope.row.inviteActHead]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="被邀请人昵称"
          align="center"
          min-width="130px"
          prop="inviteActNick"
        />
        <el-table-column
          label="邀请人数"
          align="center"
          min-width="120px"
          prop="inviteCnt"
        />
        <el-table-column
          label="奖励级别"
          align="center"
          min-width="120px"
          prop="rewardsLevel"
        />
        <el-table-column
          label="奖励金额"
          align="center"
          min-width="120px"
          prop="inviteAward"
        />
        <el-table-column
          label="顺序号"
          align="center"
          min-width="120px"
          prop="inviteActSeq"
        />
        <el-table-column
          label="状态"
          align="center"
          min-width="120px"
          prop="status"
        >
          <template #default="scope">
            <span v-if="scope.row.status == 0">未发放</span>
            <span v-if="scope.row.status == 1">已发放</span>
            <span v-if="scope.row.status == -1">无需发放</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          align="center"
          min-width="160px"
          prop="remark"
        />
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
              v-hasPermi="['account:accountInviteRewardsDetail:operator']"
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
              label="被邀请人账户ID"
              prop="inviteActId"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.inviteActId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="被邀请人头像"
              prop="inviteActHead"
              style="font-weight: 600"
            >
              <span class="mRbox"
                ><el-image
                  v-if="form.inviteActHead != 'headUrl'"
                  style="width: 40px; height: 40px; border-radius: 5px"
                  :src="form.inviteActHead"
                  :preview-src-list="[form.inviteActHead]"
                  :initial-index="1"
                  :z-index="99999"
                  :preview-teleported="true"
              /></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="被邀请人昵称"
              prop="inviteActNick"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.inviteActNick }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="邀请人数"
              prop="inviteCnt"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.inviteCnt }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="奖励级别"
              prop="rewardsLevel"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.rewardsLevel }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="奖励金额"
              prop="inviteAward"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.inviteAward }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="顺序号"
              prop="inviteActSeq"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.inviteActSeq }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="状态"
              prop="inviteActSeq"
              style="font-weight: 600"
            >
              <span class="mRbox" v-if="form.status == 0">未发放</span>
              <span class="mRbox" v-if="form.status == 1">已发放</span>
              <span class="mRbox" v-if="form.status == -1">无需发放</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" style="font-weight: 600">
              <span class="mRbox">{{ form.remark }}</span>
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
import AccountInviteRewardsDetail from "@/hooks/account/accountInviteRewardsDetail";
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
    statusList
} = AccountInviteRewardsDetail();
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
