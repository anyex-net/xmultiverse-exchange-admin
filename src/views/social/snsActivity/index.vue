<template>
  <div class="app-container">
    <el-form
      size="small"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          style="width: 200px"
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter="handleQuery"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="活动标签" prop="activitytag">
        <el-input
          style="width: 200px"
          v-model="queryParams.activitytag"
          placeholder="请输入活动标签"
          clearable
          @keyup.enter="handleQuery"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          style="width: 200px"
          @change="handleQuery"
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <form-search @reset="resetQuery()" @search="handleQuery()" />
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          size="small"
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['social:snsActivity:operator']"
          >新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          size="small"
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleListDelete"
          v-hasPermi="['social:snsActivity:operator']"
          >删除
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getPage"
      ></right-toolbar>
    </el-row>
    <div class="self-table">
      <el-table
        size="small"
        v-loading="loading"
        :data="configList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="标题"
          fixed
          align="center"
          prop="title"
          min-width="130px"
        />
        <el-table-column label="主图" align="center" min-width="100px">
          <template #default="scope">
            <el-image
              v-if="scope.row.imgUrl != ''"
              style="width: 40px; height: 40px; border-radius: 5px"
              :src="scope.row.imgUrl"
              :preview-src-list="[scope.row.imgUrl]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="活动标签"
          align="center"
          prop="activityTag"
          min-width="130px"
        />
        <el-table-column
          label="链接地址"
          align="center"
          prop="openUrl"
          min-width="150px"
        />
        <el-table-column
          label="状态"
          align="center"
          prop="status"
          min-width="100px"
        >
          <template #default="scope">
            <span v-if="scope.row.status == 0">未发布</span>
            <span v-if="scope.row.status == 1">已发布</span>
          </template>
        </el-table-column>
        <el-table-column
          label="内容"
          align="center"
          prop="content"
          min-width="150px"
        >
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.content"
              placement="top"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.content }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
          min-width="150px"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          min-width="150px"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          min-width="150px"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          class-name="small-padding fixed-width"
          min-width="130px"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleDetails(scope.row)"
              v-hasPermi="['social:snsActivity:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['social:snsActivity:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['social:snsActivity:operator']"
              ><span class="table_link_text">删除</span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改社交活动对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form
        ref="formRef"
        size="small"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="活动标签" prop="activityTag">
              <el-input
                v-model="form.activityTag"
                placeholder="请输入活动标签"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="链接地址" prop="openUrl">
              <el-input v-model="form.openUrl" placeholder="请输入链接地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <el-input
                autosize
                type="textarea"
                v-model="form.content"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主图" prop="imgUrl">
              <!--                    :http-request="handleUpdateForm"-->
              <el-upload
                ref="upload"
                class="upload-demo"
                accept=".png, .jpg,.jpeg,.gif,.webp,.jfif"
                :auto-upload="false"
                :on-change="doChange"
                :action="uploadUrl"
                :data="uploadParams"
                :show-file-list="false"
              >
                <div v-if="form.imgUrl == null" class="img_upload">
                  <el-icon class="icon">
                    <Plus />
                  </el-icon>
                </div>
                <div v-else class="img_upload">
                  <img class="img1" :src="form.imgUrl" alt="" />
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                autosize
                type="textarea"
                v-model="form.remark"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :value="0">未发布</el-radio>
                <el-radio :value="1">已发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加或修改社交活动对话框 -->
    <el-dialog :title="title1" v-model="open1" width="500px" append-to-body>
      <el-form ref="formRef" size="small" :model="form">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title" style="font-weight: 600">
              <span class="mRbox">{{ form.title }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="活动标签"
              prop="activityTag"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.activityTag }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="链接地址"
              prop="openUrl"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ form.openUrl }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content" style="font-weight: 600">
              <span class="mRbox">{{ form.content }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主图" prop="imgUrl" style="font-weight: 600">
              <span class="mRbox"
                ><el-image
                  v-if="form.imgUrl != 'headUrl'"
                  style="width: 40px; height: 40px; border-radius: 5px"
                  :src="form.imgUrl"
                  :preview-src-list="[form.imgUrl]"
                  :initial-index="1"
                  :z-index="99999"
                  :preview-teleported="true"
              /></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" style="font-weight: 600">
              <span class="mRbox">{{ form.remark }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status" style="font-weight: 600">
              <span class="mRbox" v-if="form.status == 0">未发布</span>
              <span class="mRbox" v-if="form.status == 1">已发布</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="创建时间"
              prop="status"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ parseTime(form.createTime) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="更新时间"
              prop="status"
              style="font-weight: 600"
            >
              <span class="mRbox">{{ parseTime(form.updateTime) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="notice" setup>
import SnsActivity from "@/hooks/social/snsActivity";
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
    submitForm,
    handleDelete,
    pageTableRef,
    cleanSelect,
    handleUpdateForm,
    uploadParams,
    doChange,
    upload,
    uploadUrl,
    isShowTooltip,
    onMouseOver,
    statusList,
    handleDetails,
    title1,
    open1
} = SnsActivity();
</script>
<style scoped lang="scss">
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}

.img_upload {
  width: 100px;
  height: 100px;
  border: 1px dashed #c1c1c1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  margin-top: 20px;

  .icon {
    font-size: 30px;
    color: #c1c1c1;
  }

  .img1 {
    width: 130px;
    height: 130px;
    border-radius: 5px;
  }
}
.mRbox {
  width: 100%;
  font-weight: 400;
  margin-left: 30px;
  border-bottom: 1px dotted #dfdcdc;
  text-align: right;
}
</style>
