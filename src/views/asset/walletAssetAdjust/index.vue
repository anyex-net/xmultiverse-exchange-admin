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
      <el-form-item label="账户ID" prop="accountId">
        <el-input
          v-model="queryParams.accountId"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="交易编号" prop="accountId">
        <el-input
          v-model="queryParams.adjustTrxNo"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <!--            <el-form-item label="币种" prop="currency">
                <el-input v-model="queryParams.currency" placeholder="请输入" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>-->
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleUpdateAdjust"
          v-hasPermi="['asset:walletAssetAdjust:operator']"
          >新增
        </el-button>
      </el-col>
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
          label="账户ID"
          fixed
          prop="accountId"
          min-width="140px"
        />
        <el-table-column label="调整类型" prop="adjustType" min-width="120px">
          <template #default="scope">
            <span
              v-if="scope.row.adjustType == 'assetAdjustAdd'"
              style="color: red"
              >调增</span
            >
            <span
              v-if="scope.row.adjustType == 'assetAdjustSub'"
              style="color: green"
              >调减</span
            >
          </template>
        </el-table-column>
        <el-table-column label="币种" prop="currency" min-width="120px" />
        <el-table-column
          label="交易编号"
          fixed
          prop="adjustTrxNo"
          min-width="140px"
        />
        <el-table-column
          label="调整金额"
          prop="adjustBalance"
          min-width="120px"
        >
          <template #default="scope">
            <span>{{ scope.row.adjustBalance.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="附件" prop="adjustBalance" min-width="120px">
          <template #default="scope">
            <el-image
              style="width: 30px; height: 30px; border-radius: 5px"
              :src="uploadUrl1 + scope.row.attachment"
              :preview-src-list="[uploadUrl1 + scope.row.attachment]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="120px" />
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
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <!-- <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['asset:walletAssetAdjust:operator']"
              ><span class="table_link_text">修改</span></el-link
            > -->
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['asset:walletAssetAdjust:operator']"
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
    <!-- 详情 -->
    <el-dialog title="详情" v-model="open1" width="500px" append-to-body>
      <el-form size="small" ref="formRef" :model="detailArr" :rules="rules">
        <el-form-item label="账户ID" style="font-weight: 600">
          <span class="mRbox">{{ detailArr.accountId }}</span>
        </el-form-item>
        <el-form-item label="调整类型" style="font-weight: 600">
          <span
            class="mRbox"
            v-if="detailArr.adjustType == 'assetAdjustAdd'"
            style="color: red"
            >调增</span
          >
          <span
            class="mRbox"
            v-if="detailArr.adjustType == 'assetAdjustSub'"
            style="color: green"
            >调减</span
          >
        </el-form-item>
        <el-form-item label="币种" style="font-weight: 600">
          <span class="mRbox">{{ detailArr.currency }}</span>
        </el-form-item>
        <el-form-item label="交易编号" style="font-weight: 600">
          <span class="mRbox">{{ detailArr.adjustTrxNo }}</span>
        </el-form-item>
        <el-form-item label="调整金额" style="font-weight: 600">
          <span class="mRbox">{{ detailArr.adjustBalance.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="附件" style="font-weight: 600">
          <span class="mRbox">
            <el-image
              style="width: 30px; height: 30px; border-radius: 5px"
              :src="uploadUrl1 + detailArr.attachment"
              :preview-src-list="[uploadUrl1 + detailArr.attachment]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
          /></span>
        </el-form-item>
        <el-form-item label="备注" style="font-weight: 600">
          <span class="mRbox">{{ detailArr.remark }}</span>
        </el-form-item>
        <el-form-item label="创建时间" style="font-weight: 600">
          <span class="mRbox">{{ parseTime(detailArr.createTime) }}</span>
        </el-form-item>
        <el-form-item label="更新时间" style="font-weight: 600">
          <span class="mRbox">{{ parseTime(detailArr.updateTime) }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="title"
      v-model="openAdjust"
      width="500px"
      append-to-body
      @close="cleanSelect()"
    >
      <el-form
        size="small"
        ref="formAdjustRef"
        :model="formAdjust"
        :rules="rulesAdjust"
        label-width="120px"
      >
        <el-form-item label="币种" prop="currency" style="font-weight: 600">
          <span>PKR</span>
        </el-form-item>
        <el-form-item label="账户ID" prop="accountId" style="font-weight: 600">
          <el-input
            style="width: 300px"
            type="number"
            v-model="formAdjust.accountId"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="调整方向"
          prop="direction"
          style="font-weight: 600"
        >
          <el-select
            v-model="formAdjust.direction"
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整金额" prop="amount" style="font-weight: 600">
          <el-input
            style="width: 300px"
            type="number"
            v-model="formAdjust.amount"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="附件"
          prop="attachment"
          style="width: 100%; font-weight: 600"
        >
          <el-upload
            ref="iconUpload1"
            class="upload-demo"
            accept=".png, .jpg,.jpeg,.gif,.webp"
            :auto-upload="false"
            :on-change="iconChange1"
            :action="uploadUrl1"
            :data="uploadParams1"
            :show-file-list="false"
          >
            <div v-if="formAdjust.attachment == ''" class="img_upload img2c">
              +
            </div>
            <div v-else class="img_upload">
              <img
                class="img1"
                :src="uploadUrl1 + formAdjust.attachment"
                alt=""
              />
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="font-weight: 600">
          <el-input
            style="width: 300px"
            type="text"
            v-model="formAdjust.remark"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" type="primary" @click="submitForm"
            >确 定</el-button
          >
          <el-button size="small" @click="cancelAdjust">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="walletAssetAdjust" setup>
import walletAssetAdjust from "@/hooks/asset/walletAssetAdjust";
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
    openAdjust,
    showSearch,
    total,
    configList,
    title,
    queryParams,
    queryFormRef,
    form,
    formAdjust,
    formRef,
    formAdjustRef,
    rules,
    rulesAdjust,
    getList,
    cancel,
    cancelAdjust,
    handleQuery,
    resetQuery,
    handleAdd,
    handleSelectionChange,
    handleUpdate,
    handleUpdateAdjust,
    pageTableRef,
    cleanSelect,
    langType,
    typeList,
    submitForm,
    uploadUrl1,
    iconChange1,
    iconUpload1,
    uploadParams1,
    open1,
    detailArr
} = walletAssetAdjust();
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
.img_upload {
  width: 90px;
  height: 90px;
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
.img2c {
  width: 90px;
  height: 40px;
  border-radius: 8px;
  font-weight: 400;
  font-size: 20px;
  border: 1px solid #c1c1c1;
  color: #c1c1c1;
}
</style>
