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
      <el-form-item label="发送对象" prop="object">
        <el-input
          v-model="queryParams.object"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="消息类型" prop="type">
        <el-select
          style="width: 215px"
          v-model="queryParams.type"
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
      </el-form-item>
      <!--            <el-form-item label="创建时间" style="font-weight: bold">-->
      <!--                <el-date-picker v-model="dateRange" style="width: 240px" format="YYYY-MM-DD" value-format="YYYY-MM-DD"-->
      <!--                                type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"-->
      <!--                                @change="dataTime"></el-date-picker>-->
      <!--            </el-form-item>-->
      <!-- prettier-ignore -->
      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--            <el-col :span="1.5">-->
      <!--                <el-button type="danger" plain  size="small" :disabled="multiple" @click="handleDelete">删除-->
      <!--                </el-button>-->
      <!--            </el-col>-->
      <!-- prettier-ignore -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
    </el-row>
    <div class="self-table">
      <el-table
        size="small"
        stripe
        v-loading="loading"
        ref="pageTableRef"
        :data="operateList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="内容" prop="content" min-width="130">
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.content"
              placement="top"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.content }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="发送对象" prop="object" min-width="120">
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.object"
              placement="top"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.object }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="发送状态" prop="status" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.status == 1">成功</span>
            <span v-if="scope.row.status == 0">失败</span>
          </template>
        </el-table-column>
        <el-table-column label="消息类型" prop="type" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.type == 'email'">邮件</span>
            <span v-if="scope.row.type == 'sms'">短信</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="remark" min-width="150">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <!--             <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">-->
        <!--                    <template #default="scope">-->
        <!--                        <el-link class="table_link_btn" :underline="false" size="small" type="primary"-->
        <!--                            @click="handleDelete(scope.row)" ><span-->
        <!--                                class="table_link_text">删除</span></el-link>-->
        <!--&lt;!&ndash;                        v-hasPermi="['delete']"&ndash;&gt;-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      @pagination="getList()"
    />
  </div>
</template>

<script lang="ts" name="msgRecord" setup>
import Smslog from "@/hooks/common/msgRecord";
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
    showSearch,
    total,
    operateList,
    queryParams,
    queryFormRef,
    getList,
    handleQuery,
    resetQuery,
    handleSelectionChange,
    handleDelete,
    pageTableRef,
    dateRange,
    dataTime,
    typeList,
    isShowTooltip,
    onMouseOver,
} = Smslog();
</script>
