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
      listImuser,
      getImuser,
      addImuser,
      deluserFriend,
      uploadPolicy,
      logoutUser,
      userFriend
  } from "@/api/openim/imuser";
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
      userId: "",
      accountName: "",
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
  const showListFriends = ref([]);
  const title2 = ref<any>('关系链');
  const open2 = ref<boolean>(false);
  const total2 = ref(0);
  const queryId= ref({
    current: 1,
    size: 50,
    userId: ""
  });
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
    listImuser(queryParams.value).then((response) => {
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
  const cleanSelect2 = () => {
    pageTableRef.value?.clearSelection();
  };
  // 取消按钮
  const cancel = () => {
    open.value = false;
    reset();
    cleanSelect();
  };
  // 取消按钮
  const cancel2 = () => {
    open2.value = false;
    cleanSelect2();
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
    getImuser(configId).then((response: any) => {
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
  /** 强制下线操作 */
  const logoutIt = (row: any) => {
    const configId = row.id;
    ElMessageBox.confirm("确定强制下线此用户吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        logoutUser({ userId: configId }).then((response: any) => {
          if (response.code == 200) {
            proxy.$modal.msgSuccess("操作成功");
            getList();
          }
        });
      })
      .catch(() => {});
  };
  /** 删除用户操作 */
  const deleUser = (row: any,row2:any) => {
    ElMessageBox.confirm("确定删除此用户吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deluserFriend({friendUserID:row,ownerUserID:row2}).then((response: any) => {
          if (response.code == 200) {
            proxy.$modal.msgSuccess("删除成功");
            getfriendList()
          }
        });
      })
      .catch(() => {});
  };
  const getfriendList = () =>{
   userFriend(queryId.value).then((response: any) => {
     if (response.code == 200) {
       showListFriends.value = response.data.records;
       open2.value = true;
       total2.value=response.data.total
     }
   });
  }
  /** 查询好友操作 */
  const findUserFriend = (row: any) => {
    queryId.value.userId = row.userId;
    getfriendList()
  };
  /** 提交按钮 */
  const submitForm = async () => {
    await formRef.value?.validate((valid: boolean) => {
      if (valid) {
        var obj = {
          id: form.value.id,
          faceUrl: form.value.faceUrl,
          userId: form.value.userId,
          nickname: form.value.nickname,
        };
        if (form.value.id != "") {
          addImuser(obj).then((response) => {
            if (response.code === 200) {
              proxy.$modal.msgSuccess("修改成功");
              open.value = false;
              getList();
            }
          });
        } else {
          addImuser(obj).then((response) => {
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
  //用户头像
  const handleUpdateImage = () => {
    uploadPolicy()
      .then((res: any) => {
        if (res.code == 200) {
          uploadParams.value.policy = res.data.policy;
          uploadParams.value.signature = res.data.signature;
          uploadParams.value.OSSAccessKeyId = res.data.accessid;
          uploadParams.value.key =
            "exoss/" + randomString(10) + getSuffix(uploadParams.value.name);
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
    showListFriends,
    loading,
    single,
    multiple,
    open,
    open2,
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
    cancel,
    cancel2,
    reset,
    handleQuery,
    resetQuery,
    handleAdd,
    logoutIt,
    queryId,
    findUserFriend,
    handleSelectionChange,
    handleUpdate,
    submitForm,
    pageTableRef,
    cleanSelect,
    cleanSelect2,
    uploadParams,
    uploadUrl,
    upload,
    isShowTooltip,
    onMouseOver,
    iconChange,
    iconUpload,
    deleUser,
    getfriendList
  };
};
