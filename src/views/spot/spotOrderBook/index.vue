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
            <el-form-item label="交易对" prop="market">
                <el-input
                    v-model="queryParams.market"
                    placeholder="请输入"
                    clearable
                    style="width: 120px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="交易方向" prop="side">
                <el-select
                    v-model="queryParams.side"
                    placeholder="请选择"
                    clearable
                    style="width: 120px;"
                    @change="handleQuery()">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="偏移量" prop="offset">
                <el-input
                    v-model="queryParams.offset"
                    placeholder="请输入"
                    clearable
                    style="width: 120px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="数量限制" prop="limit">
                <el-input
                    v-model="queryParams.limit"
                    placeholder="请输入"
                    clearable
                    style="width: 120px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <form-search @reset="resetQuery()" @search="handleQuery()" />
        </el-form>

        <div class="self-table">
            <el-table
                size="small"
                stripe
                v-loading="loading"
                ref="pageTableRef"
                :data="dataList"
                @selection-change="handleSelectionChange"
            >

                <el-table-column
                    :label="i.title"
                    :prop="i.name"
                    min-width="150px"
                    v-for="i in forms"
                    :key="i.name"
                />
            </el-table>
        </div>
<!--        <pagination-->
<!--            v-show="total > 0"-->
<!--            :total="total"-->
<!--            v-model:page="queryParams.current"-->
<!--            v-model:limit="queryParams.size"-->
<!--            @pagination="getList()"-->
<!--        />-->

        <!-- 添加或修改参数配置对话框 -->
        <!--    <el-dialog-->
        <!--      :title="title"-->
        <!--      v-model="open"-->
        <!--      width="1000px"-->
        <!--      append-to-body-->
        <!--      @close="cleanSelect()"-->
        <!--    >-->
        <!--      <el-form-->
        <!--        size="small"-->
        <!--        ref="formRef"-->
        <!--        :model="form"-->
        <!--        :rules="rules"-->
        <!--        label-width="100px"-->
        <!--      >-->
        <!--        <el-row v-for="(i, k) in formtitles" :key="k">-->
        <!--          <el-col :span="12" v-for="i2 in i" :key="i2.name">-->
        <!--            <el-form-item :label="i2.title" :prop="i2.name">-->
        <!--              <el-input-->
        <!--                v-model="(form as any)[i2.name]"-->
        <!--                :placeholder="'请输入' + i2.title"-->
        <!--                maxlength="30"-->
        <!--              />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--      </el-form>-->
        <!--      <template #footer>-->
        <!--        <div class="dialog-footer">-->
        <!--          &lt;!&ndash; prettier-ignore &ndash;&gt;-->
        <!--          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>-->
        <!--          <el-button size="small" @click="cancel">取 消</el-button>-->
        <!--        </div>-->
        <!--      </template>-->
        <!--    </el-dialog>-->
    </div>
</template>

<script lang="ts" name="balances" setup>
import balances from "@/hooks/spot/spotOrderBook";
import { formSearchs, titles, formtitles, rules } from "@/data/fund/balances";

// prettier-ignore
const {
    loading, single, multiple, open, showSearch, total, dataList, title, queryParams, queryFormRef, form, formRef,
    getList, cancel, handleQuery, resetQuery, pageTableRef, cleanSelect, forms,options
} = balances();
</script>
