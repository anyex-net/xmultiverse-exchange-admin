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
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <!--            <el-form-item label="描述" prop="remark">-->
      <!--                <el-input-->
      <!--                    v-model="queryParams.remark"-->
      <!--                    placeholder="请输入描述"-->
      <!--                    clearable-->
      <!--                    style="width: 240px"-->
      <!--                    @keyup.enter.native="handleQuery()"-->
      <!--                    @change="handleQuery()"-->
      <!--                />-->
      <!--            </el-form-item>-->
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
          v-hasPermi="['common:notice:operator']"
          >新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['common:notice:operator']"
          >删除
        </el-button>
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
        <el-table-column label="标题" prop="title" min-width="120" fixed />
        <el-table-column label="语言类型" prop="langType" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.langType == 'en_US'">英文</span>
            <span v-if="scope.row.langType == 'zh_CN'">简体</span>
            <span v-if="scope.row.langType == 'zh_HK'">繁体</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content" min-width="150">
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              popper-class="tooltipwidth"
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
        <el-table-column label="图片" prop="imageUrl" min-width="120">
          <template #default="scope">
            <el-image
              style="width: 40px; height: 40px"
              :src="uploadUrl + scope.row.imageUrl"
              :preview-src-list="[uploadUrl + scope.row.imageUrl]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              class="mb-2"
              :active-value="true"
              :inactive-value="false"
              style="
                --el-switch-on-color: #00cd00;
                --el-switch-off-color: #cdba96;
              "
              @change="handleStatusChange($event, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="remark" min-width="150">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="120"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleDetail(scope.row)"
              v-hasPermi="['common:notice:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['common:notice:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['common:notice:operator']"
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
      width="800px"
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="语言类型" prop="langType">
          <el-select
            v-model="form.langType"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in langTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图片" prop="imageUrl">
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
            <div v-if="form.imageUrl == ''" class="img_upload">
              <el-icon class="icon">
                <Plus />
              </el-icon>
            </div>
            <div v-else class="img_upload">
              <img class="img1" :src="uploadUrl + form.imageUrl" alt="" />
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div style="width: 100%">
            <el-upload
              ref="uploadQuill"
              style="display: none"
              class="upload-quill"
              :action="uploadUrl"
              :data="uploadParams"
              :before-upload="onBeforeUpload"
              :on-success="afterUploadQuill"
              :on-change="doChange1"
              :auto-upload="true"
              :show-file-list="false"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
                @click="doInitPolicy()"
              ></el-button>
            </el-upload>
            <QuillEditor
              ref="quillEditor"
              contentType="html"
              class="ql-editor"
              style="width: 100%; height: 300px"
              v-model:content="form.content"
              :options="editorOption"
            />
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="false">未发布</el-radio>
            <el-radio :label="true">已发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
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
    <!--        详情-->
    <el-dialog title="详情" v-model="open1" width="800px" append-to-body>
      <div class="details">
        <div class="details_item">
          <p class="name">标题:</p>
          <p>{{ detailObj.title }}</p>
        </div>
        <div class="details_item">
          <p class="name">语言类型:</p>
          <p class="name1">
            <span v-if="detailObj.langType == 'en_US'">英文</span>
            <span v-if="detailObj.langType == 'zh_CN'">简体</span>
            <span v-if="detailObj.langType == 'zh_HK'">繁体</span>
          </p>
        </div>
        <div class="details_item">
          <p class="name">内容:</p>
          <p class="name1" v-html="detailObj.content"></p>
        </div>
        <div class="details_item">
          <p class="name">图片:</p>
          <p class="name1">
            <el-image
              style="width: 40px; height: 40px"
              :src="uploadUrl + detailObj.imageUrl"
              :preview-src-list="[uploadUrl + detailObj.imageUrl]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
            />
          </p>
        </div>
        <div class="details_item">
          <p class="name">状态:</p>
          <p class="name1">
            <span v-if="detailObj.status == true">已发布</span>
            <span v-if="detailObj.status == false">未发布</span>
          </p>
        </div>
        <div class="details_item">
          <p class="name">创建时间:</p>
          <p class="name1">{{ parseTime(detailObj.createDate) }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="notice" setup>
import Notice from "@/hooks/common/notice";
import stacky from "../../../utils/table-sticky";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

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
    langTypes,
    handleUpdateForm,
    handleStatusChange,
    uploadParams,
    doChange,
    upload,
    uploadUrl,
    isShowTooltip,
    onMouseOver,
    content,
    editorOption,
    doInitPolicy,
    quillEditor,
    doChange1,
    uploadQuill,
    onBeforeUpload,
    afterUploadQuill,
    handleDetail,
    open1,
    detailObj,
} = Notice();
</script>
<style>
.tooltipwidth {
  width: 1000px !important;
}
</style>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}

::v-deep .el-form-item__label {
  font-weight: 600;
}

.details {
  max-height: 600px;
  overflow: auto;
  .details_item {
    display: flex;
    border-bottom: 1px dashed #f1f1f1;
    padding-bottom: 10px;

    .name {
      width: 100px;
      margin-right: 10px;
    }
    .name1 {
      overflow: auto;
      width: 80%;
    }
  }
}
::v-deep img {
  max-width: 400px;
}
.img_upload {
  width: 130px;
  height: 130px;
  border: 1px dashed #c1c1c1;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    font-size: 30px;
    color: #c1c1c1;
  }

  .img1 {
    width: 130px;
    height: 130px;
  }
}
</style>
