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
            <el-form-item label="用户ID" prop="userId">
                <el-input
                    v-model="queryParams.userId"
                    placeholder="请输入"
                    clearable
                    style="width: 120px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="币种" prop="currency">
                <el-input
                    v-model="queryParams.currency"
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
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="handleAdd"
                    v-hasPermi="['base:userInstTradeFee:operator']"
                >新增</el-button
                >
            </el-col>

<!--            <el-col :span="1.5">-->
<!--                <el-button-->
<!--                    type="danger"-->
<!--                    plain-->
<!--                    size="small"-->
<!--                    :disabled="multiple"-->
<!--                    @click="handleDelete"-->
<!--                    v-hasPermi="['base:userInstTradeFee:operator']"-->
<!--                >删除</el-button-->
<!--                >-->
<!--            </el-col>-->
<!--            &lt;!&ndash; prettier-ignore &ndash;&gt;-->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
        </el-row>

        <div class="self-table">
            <el-table
                size="small"
                stripe
                v-loading="loading"
                ref="pageTableRef"
                :data="dataList"
            >

                <el-table-column
                    :label="i.title"
                    :prop="i.name"
                    min-width="150px"
                    v-for="i in forms"
                    :key="i.name"
                />
                <!--        <el-table-column-->
                <!--          label="操作"-->
                <!--          min-width="120px"-->
                <!--          fixed="right"-->
                <!--          class-name="small-padding fixed-width"-->
                <!--        >-->
                <!--          <template #default="scope">-->
                <!--              <el-link-->
                <!--                  class="table_link_btn"-->
                <!--                  :underline="false"-->
                <!--                  type="primary"-->
                <!--                  @click="handleShowDetail(scope.row)"-->
                <!--                  v-hasPermi="['fund:balances:data']"-->
                <!--              ><span class="table_link_text">详情</span></el-link-->
                <!--              >-->
                <!--          </template>-->
                <!--        </el-table-column>-->
            </el-table>
        </div>
        <!--        <pagination-->
        <!--            v-show="total > 0"-->
        <!--            :total="total"-->
        <!--            v-model:page="queryParams.current"-->
        <!--            v-model:limit="queryParams.size"-->
        <!--            @pagination="getList()"-->
        <!--        />-->

        <el-dialog
            :title="title"
            v-model="open"
            width="800px"
            append-to-body
            @close="cleanSelect()"
        >
            <el-form :model="form" label-width="100px">
                <!-- 动态生成表单项 -->
                <div v-for="param in updateParams" :key="param.name">
                    <el-form-item :label="param.title">
                        <!-- 根据不同的字段类型选择合适的表单控件 -->
                        <el-input v-model="form[param.name]"
                                  :placeholder="'请输入' + param.title"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <!-- prettier-ignore -->
                    <el-button size="small" type="primary" @click="submitForm(form)">确 定</el-button>
                    <el-button size="small" @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" name="balances" setup>
import balances from "@/hooks/spot/spotBalancesUpdate";

// prettier-ignore
const {
    loading, single, multiple, open, showSearch, total, dataList, title, queryParams, queryFormRef, form, formRef,
    getList, cancel, handleQuery, resetQuery, pageTableRef, cleanSelect, forms,updateParams,handleAdd,submitForm
} = balances();
</script>
