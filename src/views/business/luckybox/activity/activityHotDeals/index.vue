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
      <el-form-item label="名称" prop="activityName">
        <el-input
          v-model="queryParams.activityName"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="产品spu" prop="spuId">
        <el-select
          v-model="queryParams.spuId"
          @change="getSelects"
          placeholder="请选择"
          style="width: 240px"
        >
          <el-option
            v-for="item in spuLists"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品sku" prop="skuId">
        <el-select
          v-model="queryParams.skuId"
          clearable
          @change="handleQuery()"
          placeholder="请选择"
          style="width: 240px"
        >
          <el-option
            v-for="item in skuList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- prettier-ignore -->
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          v-hasPermi="['activity:activityHotDeals:operator']"
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
          v-hasPermi="['activity:activityHotDeals:operator']"
          >删除
        </el-button>
      </el-col>
      <!-- prettier-ignore -->
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="名称"
          prop="activityName"
          fixed
          min-width="120px"
        />
        <el-table-column label="活动ID" fixed prop="id" min-width="140px" />
        <el-table-column label="商品ID" fixed prop="skuId" min-width="140px" />
        <el-table-column label="产品ID" fixed prop="spuId" min-width="140px" />
        <el-table-column
          label="是否上架"
          min-width="90px"
          align="left"
          key="status"
          prop="status"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              class="mb-2"
              :active-value="true"
              :inactive-value="false"
              style="
                --el-switch-on-color: #00cd00;
                --el-switch-off-color: #cdba96;
              "
              @change="handleStatusChange($event, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="activityPrice" min-width="100px">
          <template #default="scope">
            <span>{{ scope.row.activityPrice.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="尾款金额"
          prop="balancePayment"
          min-width="100px"
        >
          <template #default="scope">
            <span>{{ scope.row.balancePayment.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="一轮总份数"
          prop="activitySumNum"
          min-width="100px"
        />
        <el-table-column
          label="一轮机器人份数"
          min-width="130"
          prop="activityRobotNum"
        />
        <el-table-column
          label="总轮数"
          prop="activitySumRound"
          min-width="100px"
        />
        <el-table-column
          label="总库存"
          prop="activitySumStock"
          min-width="100px"
        />
        <el-table-column
          label="开始时间"
          prop="activityStartTime"
          min-width="150"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.activityStartTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="结束时间"
          prop="activityEndTime"
          min-width="150"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.activityEndTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" prop="status" min-width="100px">
          <template #default="scope">
            <span v-if="scope.row.status">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>

        <el-table-column
          label="当前轮数"
          prop="actCurrentRound"
          min-width="100px"
        />
        <el-table-column
          label="当前轮已购买份数"
          min-width="130"
          prop="actCurrentPurchasedNum"
        />
        <el-table-column
          label="当前轮已参加账户数"
          min-width="130"
          prop="actCurrentAccountNum"
        />
        <el-table-column label="备注" prop="remark" min-width="120px" />
        <el-table-column label="创建时间" prop="createTime" min-width="150">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['activity:activityHotDeals:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['activity:activityHotDeals:operator']"
              ><span class="table_link_text">删除</span></el-link
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
        label-width="130px"
      >
        <el-form-item label="名称" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="产品spu" prop="spuId">
          <el-select
            v-model="form.spuId"
            @change="getSelect"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in spuLists"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品sku" prop="skuId">
          <el-select
            v-model="form.skuId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in skuList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前轮已购买份数" prop="actCurrentPurchasedNum">
          <el-input
            type="number"
            v-model="form.actCurrentPurchasedNum"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="当前轮已参加账户数" prop="actCurrentAccountNum">
          <el-input
            type="number"
            v-model="form.actCurrentAccountNum"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="当前轮数" prop="actCurrentRound">
          <el-input
            type="number"
            v-model="form.actCurrentRound"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="价格" prop="activityPrice">
          <el-input
            type="number"
            v-model="form.activityPrice"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="尾款金额" prop="balancePayment">
          <el-input
            type="number"
            v-model="form.balancePayment"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="一轮机器人份数" prop="activityRobotNum">
          <el-input
            type="number"
            v-model="form.activityRobotNum"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="一轮总份数" prop="activitySumNum">
          <el-input
            type="number"
            v-model="form.activitySumNum"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="总轮数" prop="activitySumRound">
          <el-input
            type="number"
            v-model="form.activitySumRound"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="总库存" prop="activitySumStock">
          <el-input
            type="number"
            v-model="form.activitySumStock"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="activityStartTime">
          <el-date-picker
            style="width: 340px"
            v-model="form.activityStartTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="x"
            placeholder="请选择"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="activityEndTime">
          <el-date-picker
            style="width: 340px"
            v-model="form.activityEndTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="x"
            placeholder="请选择"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="请输入"
          />
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
  </div>
</template>

<script lang="ts" name="activityHotDeals" setup>
import ActivityHotDeals from "@/hooks/business/luckybox/activity/activityHotDeals";
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
    submitForm,
    handleDelete,
    pageTableRef,
    cleanSelect,
    skuList,
    spuLists,
    getSelect,
    getSelects,handleStatusChange
} = ActivityHotDeals();
</script>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}

::v-deep .el-input__wrapper {
  width: 100%;
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
