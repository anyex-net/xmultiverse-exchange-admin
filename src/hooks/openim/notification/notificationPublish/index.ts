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
      getListNotify,
      uploadPolicy,
      tokenGet,
      upload1,
      uploada1,
      sendNotifyAddress
  } from "@/api/openim/notification/notificationPublish";
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
      size: 20,
      userId: "",
      nickname: "",
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
      sendID: "",
      hash: "",
      senderFaceURL: "",
      recvIDs: [],
      isSendAll: false,
      content: {
        text: "",
        externalUrl: "1",
        mixType: 0,
        notificationName: "系统通知",
        notificationType: 1,
        pictureElem: {
          snapshotPicture: {
            url: "",
            height: 100,
            width: 100,
            type: "image",
          },
          bigPicture: {
            url: "",
            height: 100,
            width: 100,
            type: "image",
          },
          sourcePath: "",
          sourcePicture: {
            url: "",
            height: 100,
            width: 100,
            type: "image",
          },
        },
      },
      senderPlatformID: 5,
      groupID: "",
      isOnlineOnly: false,
      notOfflinePush: false,
      senderNickname: "",
      contentType: "1400",
      sessionType: "4",
      offlinePushInfo: {
        desc: "",
        ex: "",
        iOSBadgeCount: true,
        iOSPushSound: "default",
        title: "System Notification",
      },
    },
    // 表单校验
    rules: {
      sendID: [
        {
          required: true,
          message: "通知账号不能为空",
          trigger: "change",
        },
      ],
      "content.text": [
        {
          required: true,
          message: "通知内容不能为空",
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
  const selectList: any = ref([]);
  const Token1: any = ref("");
  const showListClear: any = ref([]);
  const uploadForm: any = ref({
    cause: "",
    contentType: "",
    hash: "",
    maxParts: -1,
    name: "",
    partSize: "",
    size: "",
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
    listNotifyAccount(queryParams.value).then((response) => {
      if (response.code === 200) {
        configList.value = response.data.records;
        total.value = response.data.total;
        loading.value = false;
      }
    });
  };
  // 查询通知账号列表
  const getListNotifya1 = () => {
    loading.value = true;
    getListNotify().then((response: any) => {
      if (response.code === 200) {
        selectList.value = response.data;
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
  const goChange = (e: any) => {
    const cc1: any = selectList.value.filter((x: any) => {
      return x.userId == e;
    });
    form.value.senderNickname = cc1[0].nickname;
    form.value.senderFaceURL = cc1[0].faceUrl;
  };
  // 表单重置
  const reset = () => {
    form.value = {
      sendID: "",
      hash: "",
      senderFaceURL: "",
      recvIDs: [],
      isSendAll: false,
      content: {
        externalUrl: "1",
        mixType: 0,
        notificationName: "系统通知",
        notificationType: 1,
        text: "",
        pictureElem: {
          snapshotPicture: {
            url: "",
            height: 100,
            width: 100,
            type: "image",
          },
          bigPicture: {
            url: "",
            height: 100,
            width: 100,
            type: "image",
          },
          sourcePath: "",
          sourcePicture: {
            url: "",
            height: 100,
            width: 100,
            type: "image",
          },
        },
      },
      senderPlatformID: 5,
      groupID: "",
      isOnlineOnly: false,
      notOfflinePush: false,
      senderNickname: "",
      contentType: "1400",
      sessionType: "4",
      offlinePushInfo: {
        desc: "",
        ex: "",
        iOSBadgeCount: true,
        iOSPushSound: "default",
        title: "System Notification",
      },
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
  // 多选框选中数据
  const handleSelectionChange = (selection: any) => {
    showListClear.value = selection;
    ids.value = selection.map((item: any) => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  };
  //全选
  const selectAll = (selection: any) => {
    showListClear.value = selection;
    nextTick(() => {
      showListClear.value.forEach((item: any) => {
        pageTableRef.value!.toggleRowSelection(item, true);
      });
    });
  };
  const handleSelectionChange1 = (selection: any) => {
    showListClear.value = selection;
    nextTick(() => {
      showListClear.value.forEach((item: any) => {
        pageTableRef.value!.toggleRowSelection(item, true);
      });
    });
  };
  const getRowKeys = (row: any) => {
    return row.id;
  };
  // @ts-ignore
  const tableRowClassName = ({ row }) => {
    const checkIdList = showListClear.value.map((item: any) => item.id);
    if (checkIdList.includes(row.id)) {
      return {
        backgroundColor: "#E6F7FF",
      };
    }
  };
  // 反选数据
  const delArr = (select1: any) => {
    showListClear.value = showListClear.value.filter(
      (item: any) => item.id !== select1
    );
    nextTick(() => {
      configList.value.forEach((item: any) => {
        if (showListClear.value.findIndex((v: any) => v.id == item.id) >= 0) {
          pageTableRef.value!.toggleRowSelection(item, true);
        } else {
          pageTableRef.value!.toggleRowSelection(item, false);
        }
      });
    });
  };
  /** 发送通知 */
  const sendNotify = async () => {
    let ids = [] as any;
    showListClear.value.forEach((v: any) => {
      ids.push(v.userId);
    });
    form.value.recvIDs = ids;
    if (form.value.recvIDs.length < 1 && !form.value.isSendAll) {
      proxy.$modal.msgError("请选择接收用户");
    } else {
      await formRef.value?.validate((valid: boolean) => {
        if (valid) {
          if (
            form.value.content.pictureElem.bigPicture.url == "" ||
            form.value.content.pictureElem.bigPicture.url.length < 1
          ) {
            //  @ts-ignore
            delete form.value.content.pictureElem;
            form.value.content.mixType = 0
            sendNotifyAddress(JSON.stringify(form.value)).then(
              (response: any) => {
                if (response.code == 200) {
                  proxy.$modal.msgSuccess("发送成功");
                  // 重置表单
                  reset();
                  showListClear.value = [];
                  queryParams.value.current = 1;
                  queryParams.value.size = 20;
                  // 更新表格选中
                  nextTick(() => {
                    configList.value.forEach((item: any) => {
                      if (
                        showListClear.value.findIndex(
                          (v: any) => v.id == item.id
                        ) >= 0
                      ) {
                        pageTableRef.value!.toggleRowSelection(item, true);
                      } else {
                        pageTableRef.value!.toggleRowSelection(item, false);
                      }
                    });
                  });
                }
              }
            );
          } else {
            // 有图片
            form.value.content.pictureElem.snapshotPicture.url =
              form.value.content.pictureElem.bigPicture.url;
            form.value.content.pictureElem.sourcePicture.url =
              form.value.content.pictureElem.bigPicture.url;
              form.value.content.mixType = 1
            sendNotifyAddress(JSON.stringify(form.value)).then(
              (response: any) => {
                if (response.code == 200) {
                  proxy.$modal.msgSuccess("发送成功");
                  // 重置表单
                  reset();
                  showListClear.value = [];
                  queryParams.value.current = 1;
                  queryParams.value.size = 20;
                  // 更新表格选中
                  nextTick(() => {
                    configList.value.forEach((item: any) => {
                      if (
                        showListClear.value.findIndex(
                          (v: any) => v.id == item.id
                        ) >= 0
                      ) {
                        pageTableRef.value!.toggleRowSelection(item, true);
                      } else {
                        pageTableRef.value!.toggleRowSelection(item, false);
                      }
                    });
                  });
                }
              }
            );
          }
        }
      });
    }
  };
  //用户头像
  const handleUpdateImage = () => {
    // 上传文件
    // upload1(uploadForm.value, Token1.value).then((res: any) => {});
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
              form.value.content.pictureElem.bigPicture.url = uploadParams.value.key;
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
    console.log(file,3)
    if (
      file.raw.type == "image/png" ||
      file.raw.type == "image/jpeg" ||
      file.raw.type == "image/gif" ||
      file.raw.type == "image/webp" ||
      file.raw.type == "image/jpg"
    ) {
      uploadParams.value.name = file.raw.name;
      handleUpdateImage();
      // 上传文件
      // uploada1({ size: file.raw.size }, Token1.value).then((res) => {
      //   uploadForm.value.partSize = res.data.size;
      //   uploadForm.value.size = file.raw.size;
      //   uploadForm.value.contentType = file.raw.type;
      //   uploadForm.value.name = file.raw.name;
      //   console.log(uploadForm.value, 2);
      //   handleUpdateImage();
      // });
    } else {
      proxy.$modal.msgError("格式错误!");
    }
  };
  onMounted(() => {
    getList();
    getListNotifya1();
    // 上传前获取token
    // tokenGet().then((res: any) => {
    //   Token1.value = res.data;
    // });
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
    sendNotify,
    form,
    formRef,
    selectList,
    showListClear,
    rules,
    getList,
    cancel,
    reset,
    handleQuery,
    resetQuery,
    handleSelectionChange,
    delArr,
    pageTableRef,
    cleanSelect,
    uploadParams,
    goChange,
    uploadUrl,
    upload,
    isShowTooltip,
    onMouseOver,
    iconChange,
    iconUpload,
    tableRowClassName,
    handleSelectionChange1,
    selectAll,
    getRowKeys,
  };
};
