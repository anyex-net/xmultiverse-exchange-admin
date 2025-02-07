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
      userMessageList,
      getNotifyAccount,
      revokeIt,
      uploadPolicy,
  } from "@/api/openim/message/userMessage";
import { ElForm, ElTable, ElMessageBox } from "element-plus";
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
      sendID: "",
      recvID: "",
      sessionType: "1",
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
      userId: "",
      faceUrl: "",
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
      userId: [
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
    userMessageList(queryParams.value).then((response) => {
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
  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    title.value = "新增";
    open.value = true;
  };
  /** 撤回消息 */
  const toFalse = (query: any) => {
    const aa1a: any = ref("");
    if (query.sendID >= query.recvID) {
      aa1a.value = "si_" + query.recvID + "_" + query.sendID;
    } else {
      aa1a.value = "si_" + query.sendID + "_" + query.recvID;
    }
    ElMessageBox.confirm("确定撤回消息吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        revokeIt({
          conversationID: aa1a.value,
          seq: query.seq,
          userID: query.sendID,
        }).then((response: any) => {
          if (response.code == 200) {
            proxy.$modal.msgSuccess("操作成功");
            getList();
          }
        });
      })
      .catch(() => {});
  };
  const gotoOpen = (e:any) => {
    window.open(e, "_self")
  };
  // 多选框选中数据
  const handleSelectionChange = (selection: any) => {
    ids.value = selection.map((item: any) => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  };
  //用户头像
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
              form.value.faceUrl = uploadParams.value.key;
            }, 1000);
            if (iconUpload.value) {
              iconUpload.value.clearFiles();
            }
          });
        }
      })
      .catch();
  };
  //用户头像
  const iconChange = (file: any) => {
    uploadParams.value.name = file.raw.name;
    handleUpdateImage();
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
    getList,
    cancel,
    reset,
    handleQuery,
    resetQuery,
    handleAdd,
    toFalse,
    handleSelectionChange,
    pageTableRef,
    cleanSelect,
    uploadParams,
    uploadUrl,
    upload,
    isShowTooltip,
    onMouseOver,
    iconChange,
    gotoOpen,
    iconUpload,
  };
};
