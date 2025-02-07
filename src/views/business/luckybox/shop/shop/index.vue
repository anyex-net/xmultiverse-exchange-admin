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
          <el-form-item label="ID" prop="id">
            <el-input
                v-model="queryParams.id"
                placeholder="请输入"
                clearable
                style="width: 240px"
                @keyup.enter.native="handleQuery()"
                @change="handleQuery()"
            />
          </el-form-item>
            <el-form-item label="城市" prop="city">
                <el-input
                    v-model="queryParams.city"
                    placeholder="请输入"
                    clearable
                    style="width: 240px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
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
                    v-hasPermi="['shop:shop:operator']"
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
                    v-hasPermi="['shop:shop:operator']"
                >删除
                </el-button
                >
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
                  label="ID"
                  prop="id"
                  min-width="150px"
                  fixed
              />
                <el-table-column
                    label="城市"
                    prop="city"
                    min-width="120px"
                    fixed
                />
                <el-table-column
                    label="地址"
                    prop="address"
                    min-width="150px"
                />
                <el-table-column
                    label="电话"
                    prop="tel"
                    min-width="120px"
                />

                <el-table-column
                    label="操作"
                    fixed="right"
                    min-width="100px"
                    class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            type="primary"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['shop:shop:operator']"
                        ><span class="table_link_text">修改</span></el-link
                        >
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['shop:shop:operator']"
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

        <!-- 添加或修改参数配置对话框 -->
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
                label-width="120px"
            >
                <el-form-item label="城市" prop="city">
                    <el-input
                        v-model="form.city"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input
                        v-model="form.address"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input
                        v-model="form.tel"
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

<script lang="ts" name="shop" setup>
import shop from "@/api/request/business/luckybox/shop/shop";
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
    langType,
    typeList
} = shop();
</script>
