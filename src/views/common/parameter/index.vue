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
            <el-form-item label="参数大类" prop="division">
                <el-input
                    v-model="queryParams.division"
                    placeholder="请输入参数大类"
                    clearable
                    style="width: 240px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="描述" prop="remark">
                <el-input
                    v-model="queryParams.remark"
                    placeholder="请输入描述"
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
                    v-hasPermi="['common:parameter:operator']"
                >新增</el-button
                >
            </el-col>

            <el-col :span="1.5" >
                <el-button
                    type="danger"
                    plain
                    size="small"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['common:parameter:operator']"
                >删除</el-button
                >
            </el-col>
            <!-- prettier-ignore -->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
        </el-row>
        <div class="self-table" >
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
                    label="系统名字"
                    prop="systemName"
                    min-width="120px"
                    fixed
                />
                <el-table-column
                    label="参数名字"
                    prop="parameterName"
                    min-width="140px"
                >
                    <template #default="scope">
                        <el-tooltip :disabled="isShowTooltip" :content="scope.row.parameterName" placement="top">
                            <!-- 单行省略样式、鼠标移入事件 -->
                            <div class="singe-line" @mouseover="onMouseOver($event.target)">{{ scope.row.parameterName }}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    label="参数大类"
                    prop="division"
                    min-width="120px"
                />
                <el-table-column
                    label="参数类型"
                    prop="type"
                    min-width="120px"
                />
                <el-table-column
                    label="参数值"
                    prop="value"
                    min-width="140px"
                >
                    <template #default="scope">
                        <el-tooltip :disabled="isShowTooltip" :content="scope.row.value" placement="top">
                            <!-- 单行省略样式、鼠标移入事件 -->
                            <div class="singe-line" @mouseover="onMouseOver($event.target)">{{ scope.row.value }}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    label="参数值值域"
                    prop="valueBound"
                    min-width="120px"
                />
                <el-table-column
                    label="参数备注"
                    prop="remark"
                    min-width="120px"
                >
                    <template #default="scope">
                        <el-tooltip :disabled="isShowTooltip" :content="scope.row.remark" placement="top">
                            <!-- 单行省略样式、鼠标移入事件 -->
                            <div class="singe-line" @mouseover="onMouseOver($event.target)">{{ scope.row.remark }}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    prop="remark"
                    min-width="150px"
                ><template #default="scope">
                        <span >{{ parseTime(scope.row.createDate) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="120px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            type="primary"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['common:parameter:operator']"
                        ><span class="table_link_text">修改</span></el-link
                        >
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['common:parameter:operator']"
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
                <el-form-item label="系统名称" prop="systemName">
                    <el-input
                        v-model="form.systemName"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="参数名称" prop="parameterName">
                    <el-input
                        v-model="form.parameterName"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="参数大类" prop="division">
                    <el-input
                        v-model="form.division"
                        placeholder="请输入"
                    />
                </el-form-item>

                <el-form-item label="参数类型" prop="type">
                    <el-input
                        v-model="form.type"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="参数值" prop="value">
                    <el-input
                        v-model="form.value"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="参数值值域" prop="valueBound">
                    <el-input
                        v-model="form.valueBound"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="参数描述" prop="remark">
                    <el-input
                        v-model="form.remark"
                        type="textarea"
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

<script lang="ts" name="parameter" setup>
import Parameter from "@/api/request/common/parameter";
import stacky from "../../../utils/table-sticky";

const {getContainer,clearListener,initFixedHeader,updateFixedRight,resizeChange,getFixedDom,setFixedStyle,clearFixedStyle,headerDragend,scrollEvent,getTableXy,getDom,updateHeaderHeight,tablexy,fixedRightDom,fixedLeftDom,scrollDom,parentDom,tableWidth,timerList,tableDom,containerDom,__opened,parent,setScrollXWidth} =stacky();
// prettier-ignore
const {
    loading, single, multiple, open, showSearch, total, configList, title, queryParams, queryFormRef, form, formRef, rules,
    getList, cancel,handleQuery, resetQuery, handleAdd, handleSelectionChange, handleUpdate, submitForm, handleDelete, pageTableRef, cleanSelect, isShowTooltip, onMouseOver,
} = Parameter();
</script>
