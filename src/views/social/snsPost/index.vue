<template>
    <div class="app-container">
        <el-form size="small" :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch"
                 label-width="70px">
            <el-form-item label="用户Id" prop="userId">
                <el-input v-model="queryParams.userId" placeholder="请输入" clearable style="width: 240px" @keyup.enter.native="handleQuery()" @change="handleQuery()" />
            </el-form-item>
            <el-form-item label="是否公开" prop="openness">
                <el-select style="width: 215px" v-model="queryParams.openness" @change="handleQuery"
                           placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="谁可以看" prop="viewer">
                <el-select style="width: 215px" v-model="queryParams.viewer" @change="handleQuery"
                           placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in typeViewer" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <form-search @reset="resetQuery()" @search="handleQuery()" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="danger" plain  size="small" :disabled="multiple" @click="handleDelete" v-hasPermi="['social:snsPost:operator']">删除</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
        </el-row>
        <div class="self-table">
            <el-table size="small" stripe v-loading="loading" ref="pageTableRef" :data="configList"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="用户Id" prop="userId" fixed min-width="100px" />
                <el-table-column label="帖子文本内容" prop="postTextContent" min-width="160px" />
                <el-table-column label="帖子图片" min-width="100px">
                    <template #default="scope">
                        <el-image
                            v-if="scope.row.postImageUrl!='postImageUrl'"
                            style="width: 50px; height: 50px"
                            :src="uploadUrl+scope.row.postImageUrl"
                            :preview-src-list="[uploadUrl+scope.row.postImageUrl]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="帖子视频" min-width="100px">
                    <template #default="scope">
                        <el-image
                            v-if="scope.row.postVideoUrl!='postVideoUrl'"
                            style="width: 50px; height: 50px"
                            :src="uploadUrl+scope.row.postVideoUrl"
                            :preview-src-list="[uploadUrl+scope.row.postVideoUrl]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="是否公开" min-width="100px">
                    <template #default="scope">
                        <span v-if="scope.row.openness==0">匿名</span>
                        <span v-if="scope.row.openness==1">公开</span>
                    </template>
                </el-table-column>
                <el-table-column label="谁可以看" min-width="100px">
                    <template #default="scope">
                        <span v-if="scope.row.viewer==0">公开</span>
                        <span v-if="scope.row.viewer==1">仅限好友</span>
                        <span v-if="scope.row.viewer==2">仅限粉丝</span>
                        <span v-if="scope.row.viewer==4">仅限自己</span>
                    </template>
                </el-table-column>
                <el-table-column label="位置经度" prop="lng" min-width="100px" />
                <el-table-column label="位置维度" prop="lat" min-width="100px" />
                <el-table-column label="收藏数量" prop="favoriteNum" min-width="100px" />
                <el-table-column label="点赞数量" prop="likeNum" min-width="100px" />
                <el-table-column label="评论数量" prop="commentNum" min-width="100px" />
                <el-table-column label="分享数量" prop="shareNum" min-width="100px" />
                <el-table-column label="备注" prop="remark" min-width="100px" />
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
                <el-table-column label="操作" fixed="right" min-width="140" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-link :underline="false" class="table_link_btn" type="primary"
                                 @click="handleUpdate(scope.row)">
                            <span class="table_link_text">详情</span>
                        </el-link>
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['social:snsPost:operator']"
                        ><span class="table_link_text">删除</span>
                        </el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current"
                    v-model:limit="queryParams.size"
                    @pagination="getList()" />
        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body @close="cleanSelect()">
            <el-form size="small" ref="formRef" :model="form" :rules="rules">
                <el-form-item label="用户Id" prop="userId" style="font-weight: 600;">
                    <span class="mRbox">{{ form.userId }}</span>
                </el-form-item>
                <el-form-item label="帖子文本内容" prop="postTextContent" style="font-weight: 600;">
                    <span class="mRbox">{{ form.postTextContent }}</span>
                </el-form-item>
                <el-form-item label="帖子图片" prop="postImageUrl" style="font-weight: 600;">
                    <div class="mRbox">
                        <el-image
                            v-if="form.postImageUrl!='postImageUrl'"
                            style="width: 50px; height: 50px"
                            :src="uploadUrl+form.postImageUrl"
                            :preview-src-list="[uploadUrl+form.postImageUrl]">
                        </el-image>
                    </div>
                </el-form-item>
                <el-form-item label="帖子视频" prop="postVideoUrl" style="font-weight: 600;">
                    <div class="mRbox">
                        <el-image
                            v-if="form.postVideoUrl!='postVideoUrl'"
                            style="width: 50px; height: 50px"
                            :src="uploadUrl+form.postVideoUrl"
                            :preview-src-list="[uploadUrl+form.postVideoUrl]">
                        </el-image>
                    </div>

                </el-form-item>
                <el-form-item label="是否公开" prop="openness" style="font-weight: 600;">
                    <span class="mRbox" v-if="form.openness==0">匿名</span>
                    <span class="mRbox" v-if="form.openness==1">公开</span>
                </el-form-item>
                <el-form-item label="谁可以看" prop="viewer" style="font-weight: 600;">
                    <span class="mRbox" v-if="form.viewer==0">公开</span>
                    <span class="mRbox" v-if="form.viewer==1">仅限好友</span>
                    <span class="mRbox" v-if="form.viewer==2">仅限粉丝</span>
                    <span class="mRbox" v-if="form.viewer==3">仅限自己</span>
                </el-form-item>
                <el-form-item label="位置经度" prop="lng" style="font-weight: 600;">
                    <span class="mRbox">{{ form.lng }}</span>
                </el-form-item>

                <el-form-item label="位置维度" prop="lat" style="font-weight: 600;">
                    <span class="mRbox">{{ form.lat }}</span>
                </el-form-item>

                <el-form-item label="收藏数量" prop="favoriteNum" style="font-weight: 600;">
                    <span class="mRbox">{{ form.favoriteNum }}</span>
                </el-form-item>
                <el-form-item label="点赞数量" prop="likeNum" style="font-weight: 600;">
                    <span class="mRbox">{{ form.likeNum }}</span>
                </el-form-item>
                <el-form-item label="评论数量" prop="commentNum" style="font-weight: 600;">
                    <span class="mRbox">{{ form.commentNum }}</span>
                </el-form-item>
                <el-form-item label="分享数量" prop="shareNum" style="font-weight: 600;">
                    <span class="mRbox">{{ form.shareNum }}</span>
                </el-form-item>

                <el-form-item label="备注" prop="remark" style="font-weight: 600;">
                    <span class="mRbox">{{ form.remark }}</span>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime" style="font-weight: 600;">
                    <span class="mRbox">{{ parseTime(form.createTime) }}</span>
                </el-form-item>
                <el-form-item label="更新时间" prop="updateTime" style="font-weight: 600;">
                    <span class="mRbox">{{ parseTime(form.updateTime) }}</span>
                </el-form-item>

            </el-form>
            <!-- <template #footer>
                <div class="dialog-footer">
                    <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
                    <el-button size="small" @click="cancel">取 消</el-button>
                </div>
            </template> -->
        </el-dialog>
    </div>
</template>

<script lang="ts" name="snsPost" setup>
import snsPost from "@/api/request/social/snsPost/index";
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
    pageTableRef,
    cleanSelect,
    typeList,
    uploadUrl,
    typeViewer,
    handleDelete,
} = snsPost();
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
</style>
