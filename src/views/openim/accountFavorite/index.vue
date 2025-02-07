<template>
    <div class="app-container">
        <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch"
                 label-width="90px">
            <el-form-item label="账户ID" prop="accountId">
                <el-input v-model="queryParams.accountId"
                          placeholder="请输入账户ID"
                          clearable
                          @keyup.enter="handleQuery"
                          @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="来源" prop="source">
                <el-input v-model="queryParams.source"
                          placeholder="请输入来源"
                          clearable
                          @keyup.enter="handleQuery"
                          @change="handleQuery()"
                />
            </el-form-item>
<!--            <el-form-item label="账户ID" prop="status">-->
<!--                <el-select style="width: 215px" v-model="queryParams.status" @change="handleQuery"-->
<!--                           placeholder="请选择" clearable>-->
<!--                    <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.id" />-->
<!--                </el-select>-->
<!--            </el-form-item>-->
            <form-search @reset="resetQuery()" @search="handleQuery()" />
        </el-form>

        <el-row :gutter="10" class="mb8">

            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <div class="self-table">
            <el-table size="small" v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
                <el-table-column label="账户ID" align="center" fixed min-width="150px" prop="accountId" />

                <el-table-column label="标签" align="center" min-width="120px" prop="favoriteType" >
<!--                    <template #default="scope">-->
<!--                       <span v-if="scope.row.favoriteType=='TEXT'">文本</span>-->
<!--                        <span v-if="scope.row.favoriteType=='IMAGE'">图片视频</span>-->
<!--                        <span v-if="scope.row.favoriteType=='LINK'">链接</span>-->
<!--                        <span v-if="scope.row.favoriteType=='FILE'">文件</span>-->
<!--                        <span v-if="scope.row.favoriteType=='MSG'">聊天记录</span>-->
<!--                    </template>-->
                </el-table-column>
                <el-table-column label="应用类型" align="center" min-width="120px" prop="functionType" />
                <el-table-column label="来源" align="center" min-width="120px" prop="source" />
                <el-table-column label="内容" align="center" min-width="200px" prop="content" >
                    <template #default="scope">
                        <el-tooltip :disabled="isShowTooltip" :content="scope.row.content" placement="top">
                            <!-- 单行省略样式、鼠标移入事件 -->
                            <div class="singe-line" @mouseover="onMouseOver($event.target)">{{ scope.row.content }}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" min-width="160px" prop="remark" />
                <el-table-column label="创建时间" align="center" min-width="150px" prop="createTime" >
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center" min-width="150px" prop="updateTime" >
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" min-width="150px" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-link class="table_link_btn" :underline="false" type="primary"
                                 @click="handleUpdate(scope.row)" v-hasPermi="['account:accountFavorite:operator']"><span
                            class="table_link_text">详情</span></el-link>
                        <!--                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"-->
                        <!--                               v-hasPerm="['account:accountinvitestatistics:remove']">删除-->
                        <!--                    </el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.current"
            v-model:limit="queryParams.size"
            @pagination="getList"
        />

        <!-- 添加或修改账户邀请统计对话框 -->
        <el-dialog :title="title" v-model="open" width="700px" append-to-body @close="cleanSelect()">
            <el-form ref="formRef" size="small" :model="form" >
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="账户ID" prop="accountId" style="font-weight: 600;">
                            <span class="mRbox">{{ form.accountId }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="内容" prop="content" style="font-weight: 600;">
                            <span class="mRbox">{{ form.content }}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="标签" prop="favoriteType" style="font-weight: 600;">
                            <span class="mRbox">{{ form.favoriteType }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="应用类型" prop="functionType" style="font-weight: 600;">
                            <span class="mRbox">{{ form.functionType }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="来源" prop="source" style="font-weight: 600;">
                            <span class="mRbox">{{ form.source }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark" style="font-weight: 600;">
                            <span class="mRbox">{{ form.remark }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="创建时间" prop="createTime" style="font-weight: 600;">
                            <span class="mRbox">{{ parseTime(form.createTime) }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="更新时间" prop="updateTime" style="font-weight: 600;">
                            <span class="mRbox">{{parseTime(form.updateTime) }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

        </el-dialog>
    </div>
</template>

<script lang="ts" name="accountFavorite" setup>
import AccountFavorite from "@/api/request/openim/accountFavorite";
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
    handleDelete,
    pageTableRef,
    cleanSelect,
    statusList,
    isShowTooltip,
    onMouseOver
} = AccountFavorite();
</script>
<style lang="scss" scoped>
.mRbox {
    width: 90%;
    font-weight: 400;
    margin-left: 30px;
    border-bottom: 1px dotted #dfdcdc;
    text-align: right;
    //background: pink;
}
</style>
