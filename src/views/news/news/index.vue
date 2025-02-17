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
      <el-form-item label="关键字" prop="keyword">
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          v-hasPermi="['news:news:operator']"
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
          v-hasPermi="['news:news:operator']"
          >删除
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" fixed prop="id" />
        <el-table-column label="主题图片" prop="topicImage">
          <template #default="scope">
            <el-image
              style="width: 40px; height: 40px"
              :src="uploadUrl + scope.row.topicImage"
              :preview-src-list="[uploadUrl + scope.row.topicImage]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建人姓名" prop="createName" />
        <el-table-column label="发布人姓名" prop="publishName" />
        <el-table-column label="浏览数量" prop="viewNum" />
        <el-table-column label="评论数量" prop="commentNum" />
        <el-table-column label="点赞数量" prop="likeNum" />
        <el-table-column label="收藏数量" prop="favoriteNum" />
        <el-table-column label="分享数量" prop="shareNum" />
        <el-table-column label="标题" prop="title" />
        <el-table-column label="内容" prop="content" min-width="70px">
          <template #default="scope">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="scope.row.content"
              placement="top"
              popper-class="tooltipWidth"
            >
              <!-- 单行省略样式、鼠标移入事件 -->
              <div class="singe-line" @mouseover="onMouseOver($event.target)">
                {{ scope.row.content }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="类别" prop="category" min-width="90px">
          <template #default="scope">
            <span v-if="scope.row.category == 'policy'">政策</span>
            <span v-if="scope.row.category == 'industry'">行业</span>
            <span v-if="scope.row.category == 'platform'">平台</span>
          </template>
        </el-table-column>
        <el-table-column label="关键字" prop="keyword" />
        <el-table-column label="摘要" prop="summary" />
        <el-table-column label="经度" prop="lng" />
        <el-table-column label="纬度" prop="lat" />
        <el-table-column label="是否轮播图" prop="isBanner" min-width="90px">
          <template #default="scope">
            <span v-if="scope.row.isBanner">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="是否固定" prop="isFixed" min-width="90px">
          <template #default="scope">
            <span v-if="scope.row.isFixed">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state" min-width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.state"
              class="mb-2"
              :active-value="1"
              :inactive-value="0"
              style="
                --el-switch-on-color: #00cd00;
                --el-switch-off-color: #cdba96;
              "
              @change="handleStatusChange($event, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="publishTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.publishTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" min-width="150px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150px"
          label="操作"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="detailA1(scope.row)"
              v-hasPermi="['news:news:operator']"
              ><span class="table_link_text">详情</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['news:news:operator']"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              class="table_link_btn"
              :underline="false"
              size="small"
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['news:news:operator']"
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
      v-loading="loading"
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
          <el-col :span="20">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="摘要" prop="summary">
              <el-input
                v-model="form.summary"
                placeholder="请输入"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="类别" prop="category" style="font-weight: 600">
              <el-select
                v-model="form.category"
                placeholder="请选择"
                style="width: 300px"
              >
                <el-option
                  v-for="item in listA3"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="10">
            <el-form-item label="关键字" prop="keyword">
              <el-input
                v-model="form.keyword"
                placeholder="请输入"
              /> </el-form-item
          ></el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item
              label="是否轮播图"
              prop="isBanner"
              style="font-weight: 600"
            >
              <el-select
                v-model="form.isBanner"
                placeholder="请选择"
                style="width: 300px"
              >
                <el-option
                  v-for="item in listA1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="10">
            <el-form-item label="是否固定" prop="isFixed">
              <el-select
                v-model="form.isFixed"
                placeholder="请选择"
                style="width: 300px"
              >
                <el-option
                  v-for="item in listA2"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <!-- <el-row>
          <el-form-item label="状态" prop="state">
                    <el-radio-group v-model="form.state">
                        <el-radio :label="0">未发布</el-radio>
                        <el-radio :label="1">已发布</el-radio>
                    </el-radio-group>
          </el-form-item>
        </el-row> -->
        <el-row>
          <el-form-item
            label="主题图片"
            prop="topicImage"
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
              <div v-if="form.topicImage == ''" class="img_upload">
                <el-icon class="icon">
                  <Plus />
                </el-icon>
              </div>
              <div v-else class="img_upload">
                <img class="img1" :src="uploadUrl + form.topicImage" alt="" />
              </div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="content" class="showI1">
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
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!-- prettier-ignore -->
          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
          <el-button size="small" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 文章详情页 -->
    <el-dialog
      v-loading="loadingA1"
      :title="titleA1"
      v-model="openA1"
      width="1200px"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="cardDetail">
        <el-form
          size="small"
          ref="formRef"
          :model="formA1"
          :rules="rules"
          label-width="120px"
        >
          <el-row>
            <el-col :span="20">
              <el-form-item label="标题:" class="showI1">{{
                formA1.title
              }}</el-form-item></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="摘要:" class="showI1">
                {{ formA1.summary }}
              </el-form-item></el-col
            >
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="类别:" class="showI1">
                <div v-if="formA1.category == 'policy'">政策</div>
                <div v-if="formA1.category == 'industry'">行业</div>
                <div v-if="formA1.category == 'platform'">平台</div>
              </el-form-item></el-col
            >
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="关键字:" class="showI1">
                {{ formA1.keyword }}</el-form-item
              ></el-col
            >
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="是否轮播图:" class="showI1">
                {{ formA1.isBanner ? "是" : "否" }}</el-form-item
              ></el-col
            >
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="是否固定:" class="showI1">
                {{ formA1.isFixed ? "是" : "否" }}
              </el-form-item></el-col
            >
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="是否发布:" class="showI1">
                {{ formA1.isFixed ? "已发布" : "未发布" }}
              </el-form-item></el-col
            >
          </el-row>
          <el-row>
            <el-form-item label="主题图片:" class="showI1">
              <div class="img_upload">
                <img class="img1" :src="uploadUrl + formA1.topicImage" alt="" />
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="内容:" class="showI1">
                <div
                  style="width: 100%"
                  v-html="formA1.content"
                  class="showDetail"
                ></div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="news" setup>
import {
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  nextTick,
  toRaw,
} from "vue";
import { ElForm, ElTable } from "element-plus";
import stacky from "@/utils/table-sticky";
import {
  listnewsNews,
  getnewsNews,
  newsUpdateStatuson,
  newsUpdateStatusoff,
  addnewsNews,
  delnewsNews,
  uploadPolicy,
} from "@/api/news/news";
import { isStrings } from "@/utils/validate";
import { getSuffix, randomString } from "@/utils/dateTime";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const { proxy } = getCurrentInstance() as any;
const iconUpload = ref<any>();
const state = reactive({
  // 查询参数
  queryParams: {
    current: 1,
    size: 50,
    keyword: "",
    title: "",
  },
  // 遮罩层
  loading: false,
  loadingA1: false,
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 显示搜索条件
  showSearch: true,
  // 总条数
  total: 0,
  // 商品品牌表格数据
  configList: [],
  // 弹出层标题
  title: "",
  // 详情
  titleA1: "",
  // 是否显示弹出层
  open: false,
  // 详情弹框
  openA1: false,
  // 表单参数
  form: {
    id: "",
    isBanner: "",
    isFixed: "",
    topicImage: "",
    category: "",
    keyword: "",
    title: "",
    summary: "",
    content: "",
    // state:""
  },
  // 表单校验
  rules: {
    topicImage: [
      {
        required: true,
        message: "主题图片不能为空",
        trigger: "blur",
      },
    ],
    keyword: [
      {
        required: true,
        message: "关键字不能为空",
        trigger: "blur",
      },
    ],
    title: [
      {
        required: true,
        message: "标题不能为空",
        trigger: "blur",
      },
    ],
    summary: [
      {
        required: true,
        message: "摘要不能为空",
        trigger: "blur",
      },
    ],
    content: [
      {
        required: true,
        message: "内容不能为空",
        trigger: "blur",
      },
    ],
    isBanner: [
      {
        required: true,
        message: "是否轮播图不能为空",
        trigger: "change",
      },
    ],
    isFixed: [
      {
        required: true,
        message: "是否固定不能为空",
        trigger: "change",
      },
    ],
    category: [
      {
        required: true,
        message: "类别不能为空",
        trigger: "change",
      },
    ],
  },
  // 上传参数
  uploadParams: {
    key: "",
    name: "",
    policy: "",
    OSSAccessKeyId: "",
    success_action_status: 200,
    signature: "",
  },
  uploadUrl: import.meta.env.VITE_upload_url,
});
const queryFormRef = ref<InstanceType<typeof ElForm>>();
const formRef = ref<InstanceType<typeof ElForm>>();
const pageTableRef = ref<InstanceType<typeof ElTable>>();
const isShowTooltip = ref<boolean>(true);
const quillEditor = ref<any>("");
const formA1 = ref();
const quill = quillEditor.value;
const editorOption = ref({
  modules: {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6] }], // custom button values
        ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
        ["blockquote", "code-block"], // 引用  代码块
        [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
        [{ script: "sub" }, { script: "super" }], // 上标/下标
        [{ indent: "-1" }, { indent: "+1" }], // 缩进
        [{ direction: "rtl" }], // 文本方向
        ["image", "video"],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: "" }],
        [{ align: "center" }],
        [{ align: "right" }],
        ["clean"],
      ],
      // 工具栏
      handlers: {
        image: (value: any) => {
          if (value) {
            // uploadQuill.value.click()
            // @ts-ignore
            document.querySelector(".upload-quill .el-button--primary").click();
          } else {
            quill.value.format("image", false);
          }
        },
        video: (value: any) => {
          if (value) {
            // @ts-ignore
            document.querySelector(".upload-quill .el-button--primary").click();
          } else {
            quill.value.format("video", false);
          }
        },
      },
    },
  },
});
const uploadQuill = ref<any>();
// 是否轮播图)
const listA1 = ref([
  { id: 0, name: "否" },
  { id: 1, name: "是" },
]);
// 是否固定
const listA2 = ref([
  { id: 0, name: "否" },
  { id: 1, name: "是" },
]);
// 类别
const listA3 = ref([
  { id: "policy", name: "政策" },
  { id: "industry", name: "行业" },
  { id: "platform", name: "平台" },
]);
// 状态
const listA4 = ref([
  { id: 0, name: "待发布" },
  { id: 1, name: "已发布" },
]);
const {
  queryParams,
  loading,
  loadingA1,
  ids,
  single,
  multiple,
  showSearch,
  total,
  configList,
  title,
  titleA1,
  openA1,
  open,
  form,
  rules,
  uploadParams,
  uploadUrl,
} = toRefs(state);

/** 查询列表 */
const getList = () => {
  for (let key in queryParams.value) {
    if (queryParams.value.hasOwnProperty(key)) {
      if (queryParams.value[key] === "") {
        queryParams.value[key] = null;
      }
    }
  }
  loading.value = true;
  // prettier-ignore
  listnewsNews(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data.records;
                total.value = response.data.total;
                loading.value = false;
            }

        });
};
const cleanSelect = () => {
  pageTableRef.value?.clearSelection();
};

//状态
const handleStatusChange = async (val: any, row: any) => {
  const text = val === 1 ? "发布" : "取消";
  await proxy.$modal
    .confirm('确认要"' + text + '"吗?', "警告")
    .then(() => {
      if (val == 1) {
        newsUpdateStatuson({ id: row.id }).then((res) => {
          if (res.code == 200) {
            proxy.$modal.msgSuccess("操作成功");
            getList();
          }
        });
      } else {
        newsUpdateStatusoff({ id: row.id }).then((res) => {
          if (res.code == 200) {
            proxy.$modal.msgSuccess("操作成功");
            getList();
          }
        });
      }
    })
    .catch(() => {
      getList();
      // proxy.setTableRowSelected(pageTableRef, row, false);
      // row.state = row.state === 1 ? true : false;
      return;
    });
};
// 取消按钮
const cancel = () => {
  open.value = false;
  reset();
  cleanSelect();
};
// 表单重置
const reset = () => {
  form.value = {
    id: "",
    isBanner: "",
    isFixed: "",
    topicImage: "",
    category: "",
    keyword: "",
    title: "",
    summary: "",
    content: "",
    // state:""
  };
  proxy.resetForm(formRef);
  if (quillEditor.value) {
    quillEditor.value.setHTML("");
  }
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.current = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  proxy.resetForm(queryFormRef);
  handleQuery();
};
/** 新增按钮操作 */
const handleAdd = () => {
  nextTick(() => {
    reset();
  });
  title.value = "";
  open.value = true;
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  ids.value = selection.map((item: any) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
/** 修改按钮操作 */
const handleUpdate = (row: any) => {
  loading.value = true;
  reset();
  const configId = row.id || ids.value;
  getnewsNews(configId).then((response: any) => {
    loading.value = false;
    form.value = response.data;
    if (quillEditor.value) {
      quillEditor.value.setHTML(response.data.content);
    }
    title.value = "修改";
    proxy.setTableRowSelected(pageTableRef, row, true);
    open.value = true;
  });
};
// 详情按钮
const detailA1 = (row: any) => {
  loadingA1.value = true;
  formA1.value = null;
  const useId = row.id || ids.value;
  getnewsNews(useId).then((response: any) => {
    loadingA1.value = false;
    formA1.value = response.data;
    if (quillEditor.value) {
      quillEditor.value.setHTML(response.data.content);
    }
    titleA1.value = "详情";
    proxy.setTableRowSelected(pageTableRef, row, true);
    openA1.value = true;
  });
};
/** 提交按钮 */
const submitForm = async () => {
  await formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (form.value.id != "") {
        addnewsNews(form.value).then((response) => {
          if (response.code === 200) {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          }
        });
      } else {
        addnewsNews(form.value).then((response) => {
          if (response.code === 200) {
            proxy.$modal.msgSuccess("新增成功");
            open.value = false;
            getList();
          }
        });
      }
    }
  });
};
/** 删除按钮操作 */
const handleDelete = (row: any) => {
  const configIds = row.id || ids.value;
  const query = {} as any;
  if (row.id == undefined) {
    query.value = {
      ids: isStrings(configIds),
    };
  } else {
    query.value = {
      ids: configIds,
    };
  }
  proxy.setTableRowSelected(pageTableRef, row, true);
  // prettier-ignore
  proxy.$modal.confirm("是否确认删除编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delnewsNews(query.value);
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("删除成功");
                }
            })
            .catch(() => {
                cleanSelect();
            });
};

//图片
const handleUpdateForm1 = () => {
  uploadPolicy()
    .then((res: any) => {
      if (res.code == 200) {
        uploadParams.value.policy = res.data.policy;
        uploadParams.value.signature = res.data.signature;
        uploadParams.value.OSSAccessKeyId = res.data.accessid;
        // uploadUrl.value= res.data.host;
        uploadParams.value.key =
          "wivpal/" + randomString(10) + getSuffix(uploadParams.value.name);
        nextTick(() => {
          uploadQuill.value.submit();
          setTimeout(() => {
            // form.value.imageUrl = uploadParams.value.key;
          }, 1000);

          if (uploadQuill.value) {
            uploadQuill.value.clearFiles();
          }
        });
      }
    })
    .catch();
};

//图片
const handleUpdateImage = () => {
  uploadPolicy()
    .then((res: any) => {
      if (res.code == 200) {
        uploadParams.value.policy = res.data.policy;
        uploadParams.value.signature = res.data.signature;
        uploadParams.value.OSSAccessKeyId = res.data.accessid;
        uploadParams.value.key =
          "wivpal/" + randomString(10) + getSuffix(uploadParams.value.name);
        nextTick(() => {
          iconUpload.value.submit();
          setTimeout(() => {
            form.value.topicImage = uploadParams.value.key;
          }, 2000);
          if (iconUpload.value) {
            iconUpload.value.clearFiles();
          }
        });
      }
    })
    .catch();
};
//图片
const iconChange = (file: any) => {
  uploadParams.value.name = file.raw.name;
  handleUpdateImage();
};
const doChange1 = (file: any) => {
  uploadParams.value.name = file.raw.name;
};
const onBeforeUpload = (file: any) => {
  //获取最后一个.的位置
  var index = file.name.lastIndexOf(".");
  //获取后缀
  var ext = file.name.substr(index + 1).toLowerCase();
  if (
    ["png", "jpg", "jpeg", "bmp", "gif", "webp", "psd", "svg", "tiff"].indexOf(
      ext
    ) != -1
  ) {
  } else {
    return new Promise(async (resolve: any, reject) => {
      if (ext != "mp4") {
        proxy.$modal.msgWarning("格式错误");
        return reject();
      }
      let duration: any = await getVideoDuration(file);
      // @ts-ignore
      if (duration <= 150) {
        resolve(); //放行
      } else {
        // @ts-ignore
        proxy.$modal.warning(
          "视频时长为：" +
            duration.toString().substr(0, 4) +
            "秒，请上传150秒以内的视频"
        );
        return reject(); //拦截
      }
    });
  }
};
// 获取视频时长
const getVideoDuration = (file: any) => {
  return new Promise(function (resolve, reject) {
    //做一些异步操作
    let url = URL.createObjectURL(file);
    let audioElement = new Audio(url);
    let duration = 0;
    audioElement.addEventListener("loadedmetadata", () => {
      duration = audioElement.duration; //时长为秒，小数，182.36
      resolve(duration);
    });
  });
};
const afterUploadQuill = () => {
  // 插入链接
  const quill = toRaw(quillEditor.value).getQuill();
  const length = quill.getSelection().index;
  if (
    uploadParams.value.name.indexOf("jpg") > -1 ||
    uploadParams.value.name.indexOf("png") > -1 ||
    uploadParams.value.name.indexOf("jpeg") > -1 ||
    uploadParams.value.name.indexOf("gif") > -1 ||
    uploadParams.value.name.indexOf("GIF") > -1
  ) {
    quill.insertEmbed(
      length,
      "image",
      uploadUrl.value + uploadParams.value.key
    );
  } else {
    quill.insertEmbed(
      length,
      "video",
      uploadUrl.value + uploadParams.value.key
    );
  }
  quill.setSelection(length + 1);
};

const doInitPolicy = () => {
  handleUpdateForm1();
};
onMounted(() => {
  getList();
});
const onMouseOver = (target: any) => {
  // 判断是否开启tooltip功能
  if (target.scrollWidth > target.clientWidth) {
    isShowTooltip.value = false;
  } else {
    isShowTooltip.value = true;
  }
};

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
</script>

<style>
.tooltipWidth {
  width: 1500px !important;
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
.showI1 {
  ::v-deep .el-form-item__label {
    font-weight: 600 !important;
  }
}
.showDetail {
  ::v-deep img {
    display: flex;
    max-width: 100%;
    margin: 0 auto;
  }
}
.cardDetail {
  height: 600px;
  overflow-y: auto;
}
</style>
