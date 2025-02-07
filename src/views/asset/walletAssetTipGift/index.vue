<template>
  <div class="app-container">
    <el-form
      size="small"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <!-- <el-form-item label="状态" prop="status">
        <el-select
          style="width: 215px"
          v-model="queryParams.status"
          @change="handleQuery"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="来源账户ID" prop="fromAccountId">
        <el-input
          v-model="queryParams.fromAccountId"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="去处账户ID" prop="toAccountId">
        <el-input
          v-model="queryParams.toAccountId"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          v-hasPermi="['asset:walletAssetTipGift:operator']"
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
          v-hasPermi="['asset:walletAssetTipGift:operator']"
          >删除
        </el-button>
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
        <el-table-column label="ID" fixed prop="id" min-width="140px" />
        <el-table-column label="交易编号" prop="trxNo" min-width="160px" />
        <el-table-column label="金额" prop="trxBalance" />
        <el-table-column label="手续费" prop="trxFee" />
        <el-table-column
          label="来源账户ID"
          prop="fromAccountId"
          min-width="150px"
        />
        <el-table-column
          label="去处账户ID"
          prop="toAccountId"
          min-width="150px"
        />
        <el-table-column label="货币" prop="currency" />
        <el-table-column label="状态" prop="status" min-width="140px">
          <template #default="scope">
            <span v-if="scope.row.status == '1'">已送出待接收</span>
            <span v-if="scope.row.status == '2'">已接收</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="创建时间" prop="createTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleDetail1(scope.row)"
              v-hasPermi="['asset:walletAssetTipGift:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
            <!-- <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['asset:walletAssetTipGift:operator']"
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
      width="450px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form size="small" ref="formRef" :model="form">
        <el-form-item label="ID" prop="id" style="font-weight: 600">
          <span class="mRbox">{{ form.id }}</span>
        </el-form-item>
        <el-form-item label="交易编号" prop="trxNo" style="font-weight: 600">
          <span class="mRbox">{{ form.trxNo }}</span>
        </el-form-item>
        <el-form-item label="金额" prop="trxBalance" style="font-weight: 600">
          <span class="mRbox">{{ form.trxBalance }}</span>
        </el-form-item>
        <el-form-item label="手续费" prop="trxFee" style="font-weight: 600">
          <span class="mRbox">{{ form.trxFee }}</span>
        </el-form-item>
        <el-form-item
          label="来源账户ID"
          prop="fromAccountId"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.fromAccountId }}</span>
        </el-form-item>
        <el-form-item
          label="去处账户ID"
          prop="toAccountId"
          style="font-weight: 600"
        >
          <span class="mRbox">{{ form.toAccountId }}</span>
        </el-form-item>
        <el-form-item label="货币" prop="currency" style="font-weight: 600">
          <span class="mRbox">{{ form.currency }}</span>
        </el-form-item>
        <el-form-item label="状态" prop="status" style="font-weight: 600">
          <span class="mRbox" v-if="form.status == '1'">已送出待接收</span>
          <span class="mRbox" v-if="form.status == '2'">已接收</span>
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
    </el-dialog>
  </div>
</template>

<script lang="ts" name="walletAssetTipGift" setup>
import WalletAssetTipGift from "@/api/request/asset/walletAssetTipGift";
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
    typeList,
    rules,
    getList,
    cancel,
    handleQuery,
    resetQuery,
    handleAdd,
    handleSelectionChange,
    handleDetail1,
    submitForm,
    handleDelete,
    pageTableRef,
    cleanSelect,
    uploadParams,
    uploadUrl,
    isShowTooltip,
    onMouseOver,
    iconChange,
    iconUpload,
    statusList,
    cuList,
} = WalletAssetTipGift();
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
  width: 90px;
  height: 90px;
  border: 1px dashed #c1c1c1;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    font-size: 30px;
    color: #c1c1c1;
  }

  .img1 {
    width: 90px;
    height: 90px;
  }
}

.img_upload1 {
  width: 90px;
  height: 90px;
  //border: 1px dashed #c1c1c1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  position: relative;
  margin-bottom: 10px;

  .icon {
    font-size: 30px;
    color: #c1c1c1;
  }

  .img1 {
    width: 90px;
    height: 90px;
  }

  .close {
    display: none;
  }
}

.img_upload1:hover {
  cursor: pointer;

  .close {
    position: absolute;
    top: 0;
    right: 0;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}

.mRbox {
  width: 100%;
  font-weight: 400;
  margin-left: 30px;
  border-bottom: 1px dotted #dfdcdc;
  display: flex;
  justify-content: flex-end;
}
</style>
