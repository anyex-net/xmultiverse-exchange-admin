import {
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  nextTick,
} from "vue";
// prettier-ignore
import {
      listNotifyAccount,
      getNotifyAccount,
      uploadPolicy,
  } from "@/api/openim/log";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
import { getSuffix, randomString } from "@/utils/dateTime";

export default () => {
  const { proxy } = getCurrentInstance() as any;
  const upload = ref<any>();
  const iconUpload = ref<any>();
  const state = reactive({
    // 查询参数
    queryParams: {
      current: 1,
      size: 50,
      userId: "",
    },
    // 遮罩层
    loading: false,
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
    // 是否显示弹出层
    open: false,
    // 表单参数
    form: {
      id: "",
      nickname: "",
      keyword: "",
    },
    // 表单校验
    rules: {
      faceUrl: [
        {
          required: true,
          message: "用户头像不能为空",
          trigger: "blur",
        },
      ],
      userID: [
        {
          required: true,
          message: "用户Id不能为空",
          trigger: "blur",
        },
      ],
      nickname: [
        {
          required: true,
          message: "用户昵称不能为空",
          trigger: "blur",
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
  const {
    queryParams,
    loading,
    ids,
    single,
    multiple,
    showSearch,
    total,
    configList,
    title,
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
    listNotifyAccount(queryParams.value).then((response) => {
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
      nickname: "",
      userId: "",
      faceUrl: "",
    };
    proxy.resetForm(formRef);
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
                      return delNotifyAccount(query.value);
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
  /** 下载按钮操作 */
  const handleLink = (row: any) => {
    window.open(row.url);
  };
  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    title.value = "新增";
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
    reset();
    const configId = row.id || ids.value;
    getNotifyAccount(configId).then((response: any) => {
      // form.value = response.data;
      form.value.id = response.data.id;
      form.value.faceUrl = response.data.faceUrl;
      form.value.userId = response.data.userId;
      form.value.nickname = response.data.nickname;
      open.value = true;
      title.value = "修改";
      proxy.setTableRowSelected(pageTableRef, row, true);
    });
  };
  //用户头像
  const iconChange = (file: any) => {
    uploadParams.value.name = file.raw.name;
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
  return {
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
    handleDelete,
    handleLink,
    getList,
    cancel,
    reset,
    handleQuery,
    resetQuery,
    handleAdd,
    handleSelectionChange,
    handleUpdate,
    pageTableRef,
    cleanSelect,
    uploadParams,
    uploadUrl,
    upload,
    isShowTooltip,
    onMouseOver,
    iconChange,
    iconUpload,
  };
};
