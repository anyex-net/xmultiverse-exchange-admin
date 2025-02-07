<template>
    <div class="app-container">
        <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch" label-width="120px">
            <el-form-item label="中文名" prop="cnName">
                <el-input
                    v-model="queryParams.cnName"
                    placeholder="请输入"
                    clearable
                    style="width: 240px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
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
                        <el-col :span="1.5">
                            <el-button type="danger" v-hasPermi="['common:region:operator']" plain  size="small" :disabled="multiple" @click="handleDelete">删除
                            </el-button>
                        </el-col>
            <!-- prettier-ignore -->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
        </el-row>
        <div class="self-table">
            <el-table size="small" stripe  v-loading="loading" ref="pageTableRef" :data="operateList"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="中文名称" prop="cnName"  min-width="120"  />
                <el-table-column label="英文名称" prop="enName" min-width="120"  />
                <el-table-column label="区域" prop="area"  min-width="150" />
                <el-table-column label="排序" prop="sortNum" />
<!--                <el-table-column-->
<!--                    label="创建时间"-->
<!--                    prop="remark"-->
<!--                >-->
<!--                    <template #default="scope">-->
<!--                        <span>{{ parseTime(scope.row.createDate) }}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                             <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
                                    <template #default="scope">
                                        <el-link class="table_link_btn"  :underline="false" size="small" type="primary" v-hasPermi="['common:region:operator']" @click="handleDelete(scope.row)" ><span
                                                class="table_link_text">删除</span></el-link>
                                    </template>
                                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current"
                    v-model:limit="queryParams.size" @pagination="getList()" />
    </div>
</template>

<script lang="ts" name="region" setup>
import Region from "@/api/request/common/region";
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
} = Region();
</script>
