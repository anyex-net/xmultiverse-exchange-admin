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
            <el-form-item label="用户ID" prop="userId">
                <el-input
                    v-model="queryParams.userId"
                    placeholder="请输入"
                    clearable
                    style="width: 240px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
                <el-input
                    v-model="queryParams.nickname"
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
                    v-hasPermi="['openim:registerDefaultFriends:operator']"
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
                    v-hasPermi="['openim:registerDefaultFriends:operator']"
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
                    label="用户ID"
                    prop="userId"
                />
                <el-table-column
                    label="用户头像"
                    prop=""
                >
                    <template #default="scope">
                        <img v-if="scope.row.faceUrl=='headUrl'" src="../../../../assets/images/touxiang.png"
                             style="width: 30px; height: 30px;border-radius: 5px" />
                        <el-image
                            v-else
                            style="width: 30px; height: 30px;border-radius: 5px"
                            :src="scope.row.faceUrl"></el-image>

                    </template>
                </el-table-column>
                <el-table-column
                    label="用户昵称"
                    prop="nickname"
                />

                <el-table-column
                    label="操作"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <!--                        <el-link-->
                        <!--                            class="table_link_btn"-->
                        <!--                            :underline="false"-->
                        <!--                            type="primary"-->
                        <!--                            @click="handleUpdate(scope.row)"-->
                        <!--                            v-hasPermi="['shop:shop:operator']"-->
                        <!--                        ><span class="table_link_text">修改</span></el-link-->
                        <!--                        >-->
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['openim:registerDefaultFriends:operator']"
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

        <!-- 添加默认好友 -->
        <el-dialog
            :title="title"
            v-model="open"
            width="1200px"
            append-to-body
            @close="cleanSelect()"
        >
            <div class="userS">
                <div class="userS_left">
                    <div class="userS_left_item">
                        <p>用户ID</p>
                        <el-input
                            @change="getSearch"
                            style="width: 300px"
                            placeholder="请输入用户id"
                            v-model="queryParams1.id">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>

                    <el-table
                        size="small"
                        :row-key="getRowKeys"
                        v-loading="loading"
                        ref="mutipleTable"
                        :row-style="tableRowClassName"
                        :data="userList"
                        @select="handleSelectionChange1"
                        @select-all="selectAll"
                    >
                        <el-table-column :reserve-selection="true" type="selection" width="55" align="center" />
                        <el-table-column
                            label="用户头像"
                            prop=""
                            min-width="100px"
                        >
                            <template #default="scope">
                                <img v-if="scope.row.headUrl=='headUrl'" src="../../../../assets/images/touxiang.png"
                                     style="width: 30px; height: 30px;border-radius: 5px" />
                                <el-image
                                    v-else
                                    style="width: 30px; height: 30px;border-radius: 5px"
                                    :src="scope.row.headUrl"></el-image>

                            </template>
                        </el-table-column>
                        <el-table-column
                            label="用户昵称"
                            prop="accountName"
                            min-width="120px"
                        />
                        <el-table-column
                            label="用户ID"
                            prop="userId"
                            min-width="120px"
                        />
                    </el-table>

                    <pagination
                        v-show="totalUser > 0"
                        :total="totalUser"
                        :layout="'total,  prev, pager, next'"
                        v-model:page="queryParams1.current"
                        v-model:limit="queryParams1.size"
                        @pagination="getUser()"
                    />
                </div>
                <div class="userS_left">
                    <div class="userS_left_item">已选择成员:{{ secondaryTableData.length }}</div>
                    <el-table
                        size="small"
                        :row-key="getRowKeys"
                        ref="mutipleTable1"
                        :data="secondaryTableData"
                        @select="handleSelectionChange2"
                        @select-all="selectAll2"
                        :reserve-selection="true"
                    >
                        <el-table-column :reserve-selection="true" type="selection" width="55" align="center" />
                        <el-table-column
                            label="用户头像"
                            prop=""
                            min-width="100px"
                        >
                            <template #default="scope">
                                <img v-if="scope.row.headUrl=='headUrl'" src="../../../../assets/images/touxiang.png"
                                     style="width: 30px; height: 30px;border-radius: 5px" />
                                <el-image
                                    v-else
                                    style="width: 30px; height: 30px;border-radius: 5px"
                                    :src="scope.row.headUrl"></el-image>

                            </template>
                        </el-table-column>
                        <el-table-column
                            label="用户昵称"
                            prop="accountName"
                            min-width="120px"
                        />
                        <el-table-column
                            label="用户ID"
                            prop="userId"
                            min-width="120px"
                        />
                    </el-table>
                </div>
            </div>
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

<script lang="ts" name="registerDefaultFriends" setup>
import RegisterDefaultFriends from "@/api/request/openim/register/registerDefaultFriends";
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
    queryParams1,
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
    typeList,
    userList,
    totalUser,
    getSearch,
    getUser,
    handleSelectionChange1,
    mutipleTable,
    getRowKeys,
    tableRowClassName,
    mutipleTable1,
    handleSelectionChange2,
    secondaryTableData,
    selectAll,
    selectAll2,
} = RegisterDefaultFriends();
</script>
<style lang="scss" scoped>
.userS {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .userS_left {
        width: 47%;

        .userS_left_item {
            font-size: 14px;
            margin-bottom: 20px;
        }
    }
}

</style>
