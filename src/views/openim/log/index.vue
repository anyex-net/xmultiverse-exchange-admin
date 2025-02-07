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
      <el-form-item label="用户ID" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
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
        <el-table-column label="用户ID" prop="userID" />
        <el-table-column label="用户昵称" prop="nickname" />
        <el-table-column label="系统型号" prop="systemType" />
        <el-table-column label="版本号" prop="version" />
        <el-table-column label="发送平台" prop="platform" />
        <el-table-column label="创建时间" prop="createTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
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
              @click="handleLink(scope.row)"
              v-hasPermi="['asset:walletAssetTipGift:operator']"
              ><span class="table_link_text">下载</span></el-link
            >
            <!-- <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['asset:walletAssetTipGift:operator']"
              ><span class="table_link_text">删除</span></el-link
            > -->
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
      width="450px"
      append-to-body
      @close="cleanSelect()"
      :close-on-click-modal="false"
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
            label="用户头像"
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
              <div v-if="form.faceUrl == ''" class="img_upload">
                <el-icon class="icon">
                  <Plus />
                </el-icon>
              </div>
              <div v-else class="img_upload">
                <img class="img1" :src="uploadUrl + form.faceUrl" alt="" />
              </div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="form.userId"
            placeholder="请输入"
            type="number"
            :disabled="form.id !== ''"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!-- prettier-ignore -->
          <!-- <el-button size="small" type="primary" @click="submitForm">确 定</el-button> -->
          <el-button size="small" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="log" setup>
import logaa from "@/api/request/openim/log";
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
    handleLink,
    pageTableRef,
    cleanSelect,
    uploadParams,
    uploadUrl,
    isShowTooltip,
    onMouseOver,
    iconChange,
    iconUpload
} = logaa();
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
