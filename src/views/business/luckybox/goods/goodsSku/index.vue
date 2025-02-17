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
      <el-form-item label="ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="商品标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery()"
          @change="handleQuery()"
        />
      </el-form-item>
      <el-form-item label="产品spu" prop="spuId">
        <el-select
          clearable
          v-model="queryParams.spuId"
          placeholder="请选择"
          @change="handleQuery()"
          style="width: 240px"
        >
          <el-option
            v-for="item in spuList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
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
          v-hasPermi="['goods:goodsSku:operator']"
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
          v-hasPermi="['goods:goodsSku:operator']"
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
        <el-table-column label="商品ID" fixed prop="id" min-width="150px" />
        <el-table-column label="商品标题" prop="title" min-width="150px">
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.title"
              placement="top"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.title }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="商品副标题" prop="subTitle" min-width="120px" />
        <el-table-column
          label="商品卖点"
          prop="sellingPoint"
          min-width="120px"
        />
        <el-table-column label="价格" prop="price" min-width="90px" />
        <el-table-column label="库存数量" prop="stock" min-width="90px" />
        <el-table-column
          label="是否上架"
          min-width="90px"
          align="left"
          key="saleable"
          prop="saleable"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.saleable"
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
        <el-table-column label="是否有效" prop="valid" min-width="90px">
          <template #default="scope">
            <span v-if="scope.row.valid">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="商品描述" prop="description" min-width="120px">
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.description"
              placement="top"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.description }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
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
              v-hasPermi="['goods:goodsSku:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['goods:goodsSku:operator']"
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
          <el-form-item label="商品图标" prop="iconImage" style="width: 100%">
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
              <div v-if="form.iconImage == ''" class="img_upload">
                <el-icon class="icon">
                  <Plus />
                </el-icon>
              </div>
              <div v-else class="img_upload">
                <img class="img1" :src="uploadUrl + form.iconImage" alt="" />
              </div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="商品主图" prop="mainImages" style="width: 100%">
            <div
              v-if="form.mainImages.length != 0 && change1Arr1"
              v-for="(item, index) in form.mainImages"
              :key="index"
              class="img_upload1"
            >
              <img class="img1" :src="uploadUrl + item" alt="" />
              <div class="close" @click="getCloseDel(item)">
                <el-icon :size="13">
                  <Close />
                </el-icon>
              </div>
            </div>
            <div v-else v-loading="!change1Arr1" class="img_upload1"></div>
            <div
              @click="getProduct"
              style="
                width: 90px;
                height: 90px;
                line-height: 110px;
                text-align: center;
                border: 1px dashed #d9d9d9;
                margin-bottom: 10px;
              "
            >
              <el-icon style="font-size: 30px; color: #999999" class="icon">
                <Plus />
              </el-icon>
            </div>
          </el-form-item>
          <div
            style="
              font-size: 12px;
              color: #999999;
              margin-left: 100px;
              margin-bottom: 15px;
            "
          >
            最多可以上传5张
          </div>
        </el-row>
        <el-row>
          <el-form-item
            label="商品详情图"
            prop="detailImages"
            style="width: 100%"
          >
            <div
              v-if="form.detailImages.length != 0 && change1Arr2"
              v-for="(item, index) in form.detailImages"
              :key="index"
              class="img_upload1"
            >
              <img class="img1" :src="uploadUrl + item" alt="" />
              <div class="close" @click="getCloseDel1(item)">
                <el-icon :size="13">
                  <Close />
                </el-icon>
              </div>
            </div>
            <div v-else v-loading="!change1Arr2" class="img_upload1"></div>
            <div
              @click="getProduct1"
              style="
                width: 90px;
                height: 90px;
                line-height: 110px;
                text-align: center;
                border: 1px dashed #d9d9d9;
                margin-bottom: 10px;
              "
            >
              <el-icon
                style="font-size: 30px; color: #999999; margin-bottom: 10px"
                class="icon"
              >
                <Plus />
              </el-icon>
            </div>
          </el-form-item>
          <div
            style="
              font-size: 12px;
              color: #999999;
              margin-left: 100px;
              margin-bottom: 15px;
            "
          >
            最多可以上传15张
          </div>
        </el-row>
        <el-form-item label="商品标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="商品副标题" prop="subTitle">
          <el-input
            v-model="form.subTitle"
            placeholder="请输入"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            v-model="form.price"
            placeholder="请输入"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input
            v-model="form.stock"
            placeholder="请输入"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="产品名称" prop="spuId">
          <el-select
            v-model="form.spuId"
            placeholder="请选择"
            style="width: 400px"
          >
            <el-option
              @click.native="getSpuSelect(item)"
              v-for="item in spuList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数" prop="param">
          <el-select
            v-model="param"
            multiple
            placeholder="请选择"
            @remove-tag="getClear"
            style="width: 400px"
          >
            <el-option
              v-for="item in specList"
              @click.native="getparamSelect(item)"
              :key="item.id"
              :label="item.paramName"
              :value="item.paramName"
            ></el-option>
          </el-select>
          <div class="canshu" v-if="form.param.length != 0">
            <div
              class="canshu_text"
              v-for="(item, index) in form.param"
              :key="index + 'i'"
            >
              <el-form-item
                :prop="'param.' + index + '.name'"
                :rules="rules1.name"
              >
                <el-input
                  style="width: 130px; margin-right: 5px"
                  readonly
                  v-model="item.name"
                  maxlength="20"
                  placeholder="标题"
                />
              </el-form-item>
              <el-form-item
                :prop="'param.' + index + '.label'"
                :rules="rules1.label"
              >
                <el-input
                  style="width: 170px"
                  v-model="item.label"
                  placeholder="请输入内容"
                >
                  <template #suffix>
                    <span>{{ item.unit }}</span>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="商品卖点" prop="sellingPoint">
          <el-input
            v-model="form.sellingPoint"
            placeholder="请输入"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="是否上架" prop="saleable">
          <el-radio-group v-model="form.saleable">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有效" prop="valid">
          <el-radio-group v-model="form.valid">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请输入"
            style="width: 400px"
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
    <!--        商品主图-->
    <el-dialog title="选择图片" v-model="open1" width="800px" append-to-body>
      <div
        style="text-align: center; width: 500px; margin: 0 auto"
        class="card111"
      >
        <el-upload
          :action="uploadUrl"
          :data="uploadParams"
          :before-upload="handleUpdateForm"
          v-model:file-list="fileList"
          :on-exceed="doChange"
          :show-file-list="true"
          :limit="5"
          ref="upload"
          class="upload-demo"
          multiple
          accept=".png, .jpg,.jpeg,.gif,.webp,.jfif"
          drag
        >
          <!--                      :http-request="handleUpdateForm"-->
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">将文件拖至此处 <em></em></div>
          <template #tip>
            <div class="el-upload__tip">
              可上传.png, .jpg,.jpeg,.gif,.webp,.jfif,最多可上传5张
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <!-- prettier-ignore -->
          <el-button size="small" type="primary" @click="submitFormUpdate1">确 定</el-button>
          <el-button size="small" @click="open1 = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--        商品详情图-->
    <el-dialog title="选择图片" v-model="open2" width="800px" append-to-body>
      <div
        style="text-align: center; width: 500px; margin: 0 auto"
        class="card111"
      >
        <el-upload
          :action="uploadUrl"
          :data="uploadParams"
          :before-upload="handleUpdateForm1"
          v-model:file-list="fileList1"
          :on-exceed="doChange"
          :show-file-list="true"
          :limit="15"
          ref="upload1"
          class="upload-demo"
          multiple
          accept=".png, .jpg,.jpeg,.gif,.webp,.jfif"
          drag
        >
          <!--                      :http-request="handleUpdateForm"-->
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">将文件拖至此处 <em></em></div>
          <template #tip>
            <div class="el-upload__tip">
              可上传.png, .jpg,.jpeg,.gif,.webp,.jfif,最多可上传5张
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <!-- prettier-ignore -->
          <el-button size="small" type="primary" @click="submitFormUpdate2">确 定</el-button>
          <el-button size="small" @click="open2 = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="goodsBrand" setup>
import GoodsSku from "@/hooks/business/luckybox/goods/goodsSku";
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
    submitForm,
    handleDelete,
    pageTableRef,
    cleanSelect,
    handleUpdateForm,
    uploadParams,
    doChange,
    upload,
    uploadUrl,
    spuList,
    specList,
    getSpuSelect,
    upload1,
    doChange1,
    fileList,
    open1,
    submitFormUpdate1,
    getProduct,
    getparamSelect,
    param,
    getClear,
    getCloseDel,
    getCloseDel1,
    rules1,
    mainImages,
    handleUpdateForm1,
    open2,
    submitFormUpdate2,
    getProduct1, fileList1, detailImages,
    isShowTooltip,
    onMouseOver,
    iconChange,
    iconUpload,change1Arr1,change1Arr2,handleStatusChange
} = GoodsSku();
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

.canshu {
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 400px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  border-radius: 5px;
  margin-top: 10px;

  .canshu_text {
    display: flex;
    //margin-right: 25px;
    margin-bottom: 18px;
    position: relative;

    .close_del {
      color: #ffffff;
      background-color: #999999;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -5px;
      right: -5px;
    }
  }

  .canshu_btn {
    width: 150px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #f6f6f6;
    color: rgba(0, 0, 0, 0.2);
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
  }
}

.card111 {
  .upload-demo {
    ::v-deep .el-upload-list--text {
      .el-upload-list__item-status-label {
        display: none;
      }
      .el-icon--close {
        display: none;
      }
    }
  }
}
</style>
