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
            <el-form-item label="开始时间" prop="startTime">
                <el-input
                    v-model="queryParams.startTime"
                    placeholder="请输入"
                    clearable
                    style="width: 120px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-input
                    v-model="queryParams.endTime"
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
        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.current"
            v-model:limit="queryParams.size"
            @pagination="getList()"
        />

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
import balances from "@/hooks/spot/spotOrderFinished";
import { formSearchs, titles, formtitles, rules } from "@/data/fund/balances";

// prettier-ignore
const {
    loading, single, multiple, open, showSearch, total, dataList, title, queryParams, queryFormRef, form, formRef,
    getList, cancel, handleQuery, resetQuery, pageTableRef, cleanSelect, forms,options
} = balances();
</script>
