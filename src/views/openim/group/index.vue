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
            <el-form-item label="群名称" prop="groupName">
                <el-input
                    v-model="queryParams.groupName"
                    placeholder="请输入"
                    clearable
                    style="width: 240px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="群组ID" prop="groupID">
                <el-input
                    v-model="queryParams.groupID"
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
                    v-hasPermi="['openim:group:operator']"
                >新建群组
                </el-button>
            </el-col>
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
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column label="群组头像" prop="faceURL">
                    <template #default="scope">
                        <el-image
                            v-if="scope.row.groupInfo.faceURL!=''"
                            style="width: 30px; height: 30px"
                            :src="uploadUrl+scope.row.groupInfo.faceURL"
                            :preview-src-list="[uploadUrl+scope.row.groupInfo.faceURL]"
                            :initial-index="1"
                            :z-index="99999"
                            :preview-teleported="true"
                        />

                        <img v-else src="../../../assets/images/touxiang.png" style="width: 30px; height: 30px" />
                    </template>
                </el-table-column>
                <el-table-column label="群名称" prop="groupInfo.groupName" />
                <el-table-column label="群组ID" prop="groupInfo.groupID" />
                <el-table-column label="群人数" prop="groupInfo.memberCount" />
                <el-table-column label="群主ID" prop="groupOwnerUserID" />
                <el-table-column label="创建时间" prop="createTime" min-width="150px">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.groupInfo.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    fixed="right"
                    class-name="small-padding fixed-width"
                    min-width="150px"
                >
                    <template #default="scope">
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            type="primary"
                            @click="groupMembers(scope.row)"
                            v-hasPermi="['openim:group:operator']"
                        ><span class="table_link_text">群成员</span></el-link
                        >
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            type="primary"
                            @click="groupSettings(scope.row)"
                            v-hasPermi="['openim:group:operator']"
                        ><span class="table_link_text">群聊设置</span></el-link
                        >
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            type="primary"
                            @click="disAll(scope.row)"
                            v-hasPermi="['openim:group:operator']"
                        >
                            <span class="table_link_text" v-if="scope.row.groupInfo.status == '0'"
                                  style="color: #ff0000;">全体禁言</span>
                            <span class="table_link_text" v-if="scope.row.groupInfo.status == '3'">取消禁言</span>
                        </el-link
                        >
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="deleteGroup1(scope.row)"
                            v-hasPermi="['openim:group:operator']"
                        ><span class="table_link_text">解散</span></el-link
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
        <!-- 新建群组 -->
        <el-drawer
            v-model="open"
            title="添加群组"
            :before-close="cancel"
            :append-to-body="false"
            size="500px"
        >

            <el-form
                size="small"
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="120px"
            >
                <el-row>
                    <el-form-item
                        label="群组头像"
                        prop="faceUrl"
                        style="width: 100%; font-weight: 600"
                    >
                        <el-upload
                            ref="iconUpload"
                            class="upload-demo"
                            accept=".png, .jpg,.jpeg,.gif,.webp,.jfif"
                            :auto-upload="false"
                            :on-change="iconChange"
                            :action="uploadUrl"
                            :data="uploadParams"
                            :show-file-list="false"
                        >
                            <div v-if="form.groupInfo.faceURL ==''" class="img_upload">
                                <el-icon class="icon">
                                    <Plus />
                                </el-icon>
                            </div>
                            <div v-else class="img_upload">
                                <img class="img1" :src="uploadUrl + form.groupInfo.faceURL" alt="" />
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-row>
                <el-form-item label="群组名称" prop="groupInfo.groupName">
                    <el-input v-model="form.groupInfo.groupName" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="群主" prop="ownerUserID">
                    <div class="ttp" @click="getOwner">
                        <el-tag
                            class="ttp_tab"
                            v-for="item in ownerUserList"
                            :key="item.id"
                            type="info"

                        >
                            {{ item.accountName}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="管理员" prop="adminUserIDs">
                    <div class="ttp" @click="getAdminUser">
                        <el-tag
                            class="ttp_tab"
                            v-for="item in adminUserList"
                            :key="item.id"
                            type="info"

                        >
                            {{ item.accountName}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="群成员" prop="memberUserIDs">
                    <div class="ttp" @click="getMemberUser">
                        <el-tag
                            class="ttp_tab"
                            v-for="item in memberUserList"
                            :key="item.id"
                            type="info"

                        >
                            {{ item.accountName}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="群验证" prop="groupInfo.needVerification">
                    <el-select style="width: 100%" v-model="form.groupInfo.needVerification" placeholder="请选择">
                        <el-option
                            v-for="item in needList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加好友" prop="groupInfo.applyMemberFriend">
                    <el-select style="width: 100%" v-model="form.groupInfo.applyMemberFriend" placeholder="请选择">
                        <el-option
                            v-for="item in applyList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="查看资料" prop="groupInfo.lookMemberInfo">
                    <el-select style="width: 100%" v-model="form.groupInfo.lookMemberInfo" placeholder="请选择">
                        <el-option
                            v-for="item in lookList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="群公告" prop="notification">
                    <el-input
                        v-model="form.groupInfo.notification"
                        placeholder="请输入"
                        type="textarea"
                        :rows="4"
                    />
                </el-form-item>
                <el-form-item label="群简介" prop="introduction">
                    <el-input
                        v-model="form.groupInfo.introduction"
                        placeholder="请输入"
                        type="textarea"
                        :rows="4"
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
        </el-drawer>
<!--        群聊设置-->
        <el-drawer
            v-model="setOpen"
            title="群聊设置"
            :before-close="setCancel"
            :append-to-body="false"
            size="500px"
        >
            <el-form
                size="small"
                ref="formRef1"
                :model="form1"
                :rules="rules1"
                label-width="120px"
            >
                <el-row>
                    <el-form-item
                        label="群组头像"
                        prop="faceUrl"
                        style="width: 100%; font-weight: 600"
                    >
                        <el-upload
                            ref="iconUpload1"
                            class="upload-demo"
                            accept=".png, .jpg,.jpeg,.gif,.webp,.jfif"
                            :auto-upload="false"
                            :on-change="iconChange1"
                            :action="uploadUrl"
                            :data="uploadParams"
                            :show-file-list="false"
                        >
                            <div v-if="form1.groupInfoForSet.faceURL ==''" class="img_upload">
                                <el-icon class="icon">
                                    <Plus />
                                </el-icon>
                            </div>
                            <div v-else class="img_upload">
                                <img class="img1" :src="uploadUrl + form1.groupInfoForSet.faceURL" alt="" />
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-row>
                <el-form-item label="群组名称" prop="groupInfoForSet.groupName">
                    <el-input v-model="form1.groupInfoForSet.groupName" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="群组ID"  prop="groupInfoForSet.groupID">
                    <el-input readonly v-model="form1.groupInfoForSet.groupID" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="群验证" prop="groupInfoForSet.needVerification">
                    <el-select style="width: 100%" v-model="form1.groupInfoForSet.needVerification" placeholder="请选择">
                        <el-option
                            v-for="item in needList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加好友" prop="groupInfoForSet.applyMemberFriend">
                    <el-select style="width: 100%" v-model="form1.groupInfoForSet.applyMemberFriend" placeholder="请选择">
                        <el-option
                            v-for="item in applyList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="查看资料" prop="groupInfoForSet.lookMemberInfo">
                    <el-select style="width: 100%" v-model="form1.groupInfoForSet.lookMemberInfo" placeholder="请选择">
                        <el-option
                            v-for="item in lookList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="群公告" prop="groupInfoForSet.notification">
                    <el-input
                        v-model="form1.groupInfoForSet.notification"
                        placeholder="请输入"
                        type="textarea"
                        :rows="4"
                    />
                </el-form-item>
                <el-form-item label="群简介" prop="groupInfoForSet.introduction">
                    <el-input
                        v-model="form1.groupInfoForSet.introduction"
                        placeholder="请输入"
                        type="textarea"
                        :rows="4"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <!-- prettier-ignore -->
                    <el-button size="small" type="primary" @click="setSubmitForm">确 定</el-button>
                    <el-button size="small" @click="setCancel">取 消</el-button>
                </div>
            </template>
        </el-drawer>
        <!-- 选择群主-->
        <el-dialog
            v-model="open2"
            width="1200px"
            append-to-body
            :close-on-click-modal="false"
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
                        class="el-table1"
                        size="small"
                        :row-key="getRowKeys"
                        v-loading="loading"
                        ref="mutipleTable"
                        :header-cell-class-name="headerCellStyle"
                        :row-style="tableRowClassName"
                        :data="userList"
                        @select="handleSelectionChange1"
                        @select-all="selectAll"

                    >
                        <el-table-column :reserve-selection="true"  :selectable="isCheckboxDisabled"   type="selection" width="55" align="center" />

                        <el-table-column
                            label="用户头像"
                            prop=""
                            min-width="100px"
                        >
                            <template #default="scope">
                                <img  v-if="scope.row.headUrl=='headUrl'" src="../../../assets/images/touxiang.png"  style="width: 30px; height: 30px;border-radius: 5px" />
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
                                <img  v-if="scope.row.headUrl=='headUrl'" src="../../../assets/images/touxiang.png"  style="width: 30px; height: 30px;border-radius: 5px" />
                                <el-image
                                    v-else
                                    style="width: 30px; height: 30px;border-radius:5px"
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
                    <el-button size="small" type="primary" @click="submitForm1">确 定</el-button>
                    <el-button size="small" @click="cancel1">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 选择管理员-->
        <el-dialog
            v-model="open3"
            width="1200px"
            append-to-body
            :close-on-click-modal="false"
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
                        ref="adminTable"
                        :row-style="tableRowClassName1"
                        :data="userList"
                        @select="adminSelectionChange"
                        @select-all="adminselectAll"
                    >
                        <el-table-column :selectable="isCheckboxDisabled1"  :reserve-selection="true" type="selection" width="55" align="center" />
                        <el-table-column
                            label="用户头像"
                            prop=""
                            min-width="100px"
                        >
                            <template #default="scope">
                                <img  v-if="scope.row.headUrl=='headUrl'" src="../../../assets/images/touxiang.png"  style="width: 30px; height: 30px;border-radius: 5px" />
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
                    <div class="userS_left_item">已选择成员:{{ adminTableData.length }}</div>
                    <el-table
                        size="small"
                        :row-key="getRowKeys"
                        ref="adminTable1"
                        :data="adminTableData"
                        @select="adminSelectionChange1"
                        @select-all="adminselectAll1"
                        :reserve-selection="true"
                    >
                        <el-table-column :reserve-selection="true" type="selection" width="55" align="center" />
                        <el-table-column
                            label="用户头像"
                            prop=""
                            min-width="100px"
                        >
                            <template #default="scope">
                                <img  v-if="scope.row.headUrl=='headUrl'" src="../../../assets/images/touxiang.png"  style="width: 30px; height: 30px;border-radius: 5px" />
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
                    <el-button size="small" type="primary" @click="submitForm2">确 定</el-button>
                    <el-button size="small" @click="cancel2">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 选择群成员-->
        <el-dialog
            v-model="open4"
            width="1200px"
            append-to-body
            :close-on-click-modal="false"
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
                        ref="memberTable"
                        :row-style="tableRowClassName2"
                        :data="userList"
                        @select="memberSelectionChange"
                        @select-all="memberselectAll"
                    >
                        <el-table-column :selectable="isCheckboxDisabled2" :reserve-selection="true" type="selection" width="55" align="center" />

                        <el-table-column
                            label="用户头像"
                            prop=""
                            min-width="100px"
                        >
                            <template #default="scope">
                                <img  v-if="scope.row.headUrl=='headUrl'" src="../../../assets/images/touxiang.png"  style="width: 30px; height: 30px;border-radius: 5px" />
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
                    <div class="userS_left_item">已选择成员:{{ memberTableData.length }}</div>
                    <el-table
                        size="small"
                        :row-key="getRowKeys"
                        ref="memberTable1"
                        :data="memberTableData"
                        @select="memberSelectionChange1"
                        @select-all="memberselectAll1"
                        :reserve-selection="true"
                    >
                        <el-table-column :reserve-selection="true" type="selection" width="55" align="center" />
                        <el-table-column
                            label="用户头像"
                            prop=""
                            min-width="100px"
                        >
                            <template #default="scope">
                                <img  v-if="scope.row.headUrl=='headUrl'" src="../../../assets/images/touxiang.png"  style="width: 30px; height: 30px;border-radius: 5px" />
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
                    <el-button size="small" type="primary" @click="submitForm3">确 定</el-button>
                    <el-button size="small" @click="cancel3">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" name="group" setup>
import groupList from "@/api/request/openim/group";
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
    total2,
    configList,
    title,
    title2,
    queryParams,
    queryFormRef,
    form,
    formRef,
    rules,
    getList,
    deleteGroup1,
    cancel,
    cancel2,
    handleQuery,
    resetQuery,
    handleAdd,
    handleSelectionChange,
    handleUpdate,
    submitForm,
    pageTableRef,
    cleanSelect,
    open2,
    uploadParams,
    uploadUrl,
    isShowTooltip,
    onMouseOver,
    queryId,
    disAll,
    iconChange,
    iconUpload,
    showListFriends,
    needList,
    applyList,
    lookList,
    ownerUserList,
    adminUserList,
    memberUserList,
    queryParams1,
    userList,
    totalUser,
    secondaryTableData,
    mutipleTable,
    mutipleTable1,
    getSearch,
    selectAll2,
    selectAll,
    handleSelectionChange1,
    handleSelectionChange2,
    getRowKeys,
    tableRowClassName,
    getOwner,
    cancel1,
    getUser,
    open3,
    open4,
    adminSelectionChange,
    adminselectAll,
    adminTableData,
    adminselectAll1,
    adminSelectionChange1,
    adminTable1,
    submitForm1,
    adminTable,
    submitForm2,
    getAdminUser,
    getMemberUser,
    memberSelectionChange,
    memberselectAll,
    memberTable,
    memberSelectionChange1,
    memberselectAll1,
    memberTable1,
    memberTableData,
    submitForm3,
    cancel3,
    headerCellStyle,
    isCheckboxDisabled,
    isCheckboxDisabled1,
    isCheckboxDisabled2,
    tableRowClassName1,
    tableRowClassName2,
    setOpen,
    setCancel,
    setSubmitForm,
    groupSettings,
    form1,
    iconUpload1,
    iconChange1,
    rules1,
    formRef1,
    groupMembers
} = groupList();
</script>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
    -moz-appearance: textfield !important;
}
.el-table1{
  ::v-deep .el-checkbox.el-checkbox--small .el-checkbox__inner{
      border-radius: 50% !important;

  }
    ::v-deep .hiddenCheck > .cell .el-checkbox__inner {
        display: none;
    }


}
.img_upload {
    width: 90px;
    height: 90px;
    border: 1px dashed #c1c1c1;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
        font-size: 30px;
        color: #c1c1c1;
    }

    .img1 {
        width: 90px;
        height: 90px;
    }
}

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

.ttp {
    width: 100%;
    height: 25px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    padding: 0 5px;
    white-space: nowrap; /* 确保文本在一行内显示 */
    overflow: hidden; /* 隐藏溢出的内容 */
    text-overflow: ellipsis; /* 使用省略号表示文本溢出 */
    .ttp_tab {
        margin-right: 5px;
    }
}

.img_upload1 {
    width: 90px;
    height: 90px;
    //border: 1px dashed #c1c1c1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    position: relative;
    margin-bottom: 10px;

    .icon {
        font-size: 30px;
        color: #c1c1c1;
    }

    .img1 {
        width: 90px;
        height: 90px;
    }

    .close {
        display: none;
    }
}

.img_upload1:hover {
    cursor: pointer;

    .close {
        position: absolute;
        top: 0;
        right: 0;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        box-sizing: border-box;
        width: 18px;
        height: 18px;
        cursor: pointer;
    }
}
</style>
