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
      <el-form-item label="用户ID/群昵称" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <!--            <el-form-item label="群昵称" prop="groupID">-->
      <!--                <el-input-->
      <!--                    v-model="queryParams.groupID"-->
      <!--                    placeholder="请输入"-->
      <!--                    clearable-->
      <!--                    style="width: 240px"-->
      <!--                    @keyup.enter.native="handleQuery()"-->
      <!--                    @change="handleQuery()"-->
      <!--                />-->
      <!--            </el-form-item>-->
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
          >添加群成员
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
        <el-table-column label="用户头像" prop="faceURL">
          <template #default="scope">
            <img
              v-if="scope.row.faceURL == 'headUrl' || scope.row.faceURL == ''"
              src="../../../../assets/images/touxiang.png"
              style="width: 30px; height: 30px"
            />
            <el-image
              v-else
              style="width: 30px; height: 30px"
              :src="uploadUrl + scope.row.faceURL"
              :preview-src-list="[uploadUrl + scope.row.faceURL]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column label="用户ID" prop="userID" />
        <el-table-column label="群员角色" prop="roleLevel">
          <template #default="scope">
            <span v-if="scope.row.roleLevel == 100">群主</span>
            <span v-if="scope.row.roleLevel == 60">群管理员</span>
            <span v-if="scope.row.roleLevel == 20">普通群员</span>
          </template>
        </el-table-column>
        <el-table-column label="群昵称" prop="nickname" />
        <el-table-column label="入群时间" prop="createTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.joinTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入群方式" prop="">
          <template #default="scope">
            <span v-if="scope.row.joinSource == 1">管理员邀请</span>
            <span v-if="scope.row.joinSource == 2">邀请入群</span>
            <span v-if="scope.row.joinSource == 3">搜索加入</span>
            <span v-if="scope.row.joinSource == 4">扫码</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          class-name="small-padding fixed-width"
          min-width="130px"
        >
          <template #default="scope">
            <el-link
              v-if="scope.row.roleLevel == 100"
              class="table_link_btn"
              :underline="false"
              type="info"
              v-hasPermi="['openim:group:operator']"
              ><span class="table_link_text">设置群身份</span></el-link
            >

            <el-link
              v-else
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="groupIdentity(scope.row)"
              v-hasPermi="['openim:group:operator']"
              ><span class="table_link_text">设置群身份</span></el-link
            >

            <el-link
              class="table_link_btn"
              :underline="false"
              type="info"
              v-if="scope.row.roleLevel == 100"
              v-hasPermi="['openim:group:operator']"
              ><span class="table_link_text">禁言</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="forbiddenSpeech(scope.row)"
              v-if="scope.row.roleLevel != 100 && scope.row.muteEndTime == 0"
              v-hasPermi="['openim:group:operator']"
              ><span class="table_link_text">禁言</span></el-link
            >
            <el-link
              v-if="scope.row.roleLevel != 100 && scope.row.muteEndTime != 0"
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="disAll(scope.row)"
              v-hasPermi="['openim:group:operator']"
            >
              <span class="table_link_text">取消禁言</span>
            </el-link>
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="deleteGroup1(scope.row)"
              v-hasPermi="['openim:group:operator']"
              ><span class="table_link_text">移除</span></el-link
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
    <!-- 设置群身份 -->
    <el-drawer
      v-model="open"
      title="设置群身份"
      :before-close="cancel"
      :append-to-body="false"
      size="400px"
    >
      <el-radio-group
        v-model="form.roleLevel"
        style="display: flex; flex-direction: column; align-items: flex-start"
      >
        <div v-for="(item, index) in needList" :key="index">
          <el-radio :label="item.id" size="large">{{ item.name }}</el-radio>
        </div>
      </el-radio-group>
      <div style="display: flex; justify-content: flex-end; margin-top: 30px">
        <el-button
          v-if="form.roleLevel != roleLevel"
          size="small"
          type="primary"
          @click="submitForm"
          >确 定</el-button
        >
      </div>
    </el-drawer>
    <!--   禁言-->
    <el-drawer
      v-model="setOpen"
      title="群聊设置"
      :before-close="setCancel"
      :append-to-body="false"
      size="400px"
    >
      <el-radio-group
        v-model="form1.mutedSeconds"
        style="display: flex; flex-direction: column; align-items: flex-start"
      >
        <div v-for="(item, index) in lookList" :key="index">
          <el-radio :label="item.id" size="large">{{ item.name }}</el-radio>
        </div>
      </el-radio-group>
      <div style="margin: 20px 0">
        <div style="margin-bottom: 20px; font-size: 14px">自定义时长</div>
        <el-input
          v-model="form1.mutedSeconds"
          placeholder="请输入自定义时长"
          clearable
        />
      </div>
      <div style="display: flex; justify-content: flex-end">
        <!-- prettier-ignore -->
        <el-button size="small" type="primary" @click="setSubmitForm">确 定</el-button>
        <el-button size="small" @click="setCancel">取 消</el-button>
      </div>
    </el-drawer>
    <!-- 添加群成员-->
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
              v-model="queryParams1.id"
            >
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
            <el-table-column
              :selectable="isCheckboxDisabled1"
              :reserve-selection="true"
              type="selection"
              width="55"
              align="center"
            />
            <el-table-column label="用户头像" prop="" min-width="100px">
              <template #default="scope">
                <el-image
                  v-if="scope.row.headUrl != 'headUrl'"
                  style="width: 30px; height: 30px; border-radius: 10px"
                  :src="scope.row.headUrl"
                ></el-image>
                <img
                  style="width: 30px; height: 30px; border-radius: 10px"
                  v-else
                  src="../../../../assets/images/touxiang.png"
              /></template>
            </el-table-column>
            <el-table-column
              label="用户昵称"
              prop="accountName"
              min-width="120px"
            />
            <el-table-column label="用户ID" prop="userId" min-width="120px" />
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
          <div class="userS_left_item">
            已选择成员:{{ adminTableData.length }}
          </div>
          <el-table
            size="small"
            :row-key="getRowKeys"
            ref="adminTable1"
            :data="adminTableData"
            @select="adminSelectionChange1"
            @select-all="adminselectAll1"
            :reserve-selection="true"
          >
            <el-table-column
              :reserve-selection="true"
              type="selection"
              width="55"
              align="center"
            />
            <el-table-column label="用户头像" prop="" min-width="100px">
              <template #default="scope">
                <el-image
                  v-if="scope.row.headUrl != 'headUrl'"
                  style="width: 30px; height: 30px; border-radius: 10px"
                  :src="scope.row.headUrl"
                ></el-image>
                <img
                  style="width: 30px; height: 30px; border-radius: 10px"
                  v-else
                  src="../../../../assets/images/touxiang.png"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="用户昵称"
              prop="accountName"
              min-width="120px"
            />
            <el-table-column label="用户ID" prop="userId" min-width="120px" />
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
  </div>
</template>

<script lang="ts" name="groupMember" setup>
import groupMember from "@/hooks/openim/group/groupMember";
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
    submitForm,
    pageTableRef,
    cleanSelect,
    open2,
    uploadUrl,
    isShowTooltip,
    onMouseOver,
    queryId,
    disAll,
    iconUpload,
    showListFriends,
    needList,
    lookList,
    ownerUserList,
    adminUserList,
    queryParams1,
    userList,
    totalUser,
    getSearch,
    getRowKeys,
    getUser,
    open3,
    open4,
    adminSelectionChange,
    adminselectAll,
    adminTableData,
    adminselectAll1,
    adminSelectionChange1,
    adminTable1,
    adminTable,
    submitForm2,
    isCheckboxDisabled1,
    tableRowClassName1,
    setOpen,
    setCancel,
    setSubmitForm,
    forbiddenSpeech,
    form1,
    iconUpload1,
    rules1,
    formRef1,
    groupIdentity,
    form2,
    roleLevel
} = groupMember();
</script>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
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
  border: 1px solid #dcdfe6;
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
