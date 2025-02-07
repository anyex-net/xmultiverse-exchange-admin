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
      <el-form-item label="发送者ID" prop="sendID">
        <el-input
          v-model="queryParams.sendID"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="接收者ID" prop="recvID">
        <el-input
          v-model="queryParams.recvID"
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
        <!-- <el-table-column label="ID" fixed prop="id" /> -->
        <!-- <el-table-column label="用户头像" prop="faceUrl">
          <template #default="scope">
            <el-image
              style="width: 40px; height: 40px"
              :src="uploadUrl + scope.row.faceUrl"
              :preview-src-list="[uploadUrl + scope.row.faceUrl]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
            />
          </template>
        </el-table-column> -->
        <el-table-column label="消息内容" prop="content" min-width="150px">
          <template #default="scope">
            <!-- 文本类型 -->
            <span v-if="JSON.parse(scope.row.content).content">{{
              JSON.parse(scope.row.content).content
            }}</span>
            <!-- 文本类型 -->
            <span v-if="JSON.parse(scope.row.content).detail">-</span>
            <!-- 图片类型 -->
            <span v-if="JSON.parse(scope.row.content).bigPicture?.url">
              <el-image
                v-if="JSON.parse(scope.row.content).bigPicture?.url"
                style="width:30px; height: 30px;border-radius: 5px"
                :src="JSON.parse(scope.row.content).bigPicture?.url"
                :preview-src-list="[
                  JSON.parse(scope.row.content).bigPicture?.url,
                ]"
                :initial-index="1"
                :z-index="99999"
                :preview-teleported="true"
              />
            </span>
            <span v-if="JSON.parse(scope.row.content).sourceUrl" style="color:#1677ff;font-weight: 600;cursor: pointer;" @click="gotoOpen(JSON.parse(scope.row.content).sourceUrl)">
              [文件下载]
            </span>
          </template>
        </el-table-column>
        <el-table-column label="发送者昵称" prop="recvNickname" />
        <el-table-column label="发送者ID" prop="sendID" />
        <el-table-column label="接收者ID" prop="recvID" />
        <el-table-column label="会话类型" prop="sessionType" />
        <el-table-column label="消息类型" prop="contentType" />
        <el-table-column label="发送时间" prop="sendTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否有效" prop="valid" min-width="90px">
                    <template #default="scope">
                        <span v-if="scope.row.valid">是</span>
                        <span v-else>否</span>
                    </template>
        </el-table-column> -->
        <el-table-column
          label="操作"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              v-hasPermi="['openim:userMessage:operator']"
              @click="toFalse(scope.row)"
              ><span class="table_link_text">撤回</span></el-link
            >
          </template>
          <!-- :disabled="scope.row.status == '0'" -->
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
  </div>
</template>

<script lang="ts" name="userMessage" setup>
import userMessage from "@/api/request/openim/message/userMessage";
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
    toFalse,
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
    pageTableRef,
    cleanSelect,
    uploadParams,
    uploadUrl,
    isShowTooltip,
    onMouseOver,
    iconChange,
    gotoOpen,
    iconUpload
} = userMessage();
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
