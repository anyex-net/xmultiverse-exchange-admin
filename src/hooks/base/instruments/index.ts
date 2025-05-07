import { ElForm, ElTable } from "element-plus";
import {
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  nextTick,
  toRaw,
} from "vue";
import {
  listDatas,
  getDatas,
  addDatas,
  delDatas,
  // allCurrencies,
} from "@/api/base/instruments";
import { isStrings } from "@/utils/validate";
import { formDefault, searchDefault } from "@/data/base/instruments";
import { QuillEditor } from "@vueup/vue-quill";
import { getSuffix, randomString } from "@/utils/dateTime";
import { uploadPolicy } from "@/api/news/news";

export default () => {
  const { proxy } = getCurrentInstance() as any;
  // <
  // user<userForm, userQueryParams, userElTreeProps, userType>
  // >
  const state = reactive({
    form: JSON.parse(JSON.stringify(formDefault)),
    queryParams: {
      current: 1,
      size: 10,
      ...searchDefault,
    },
    dataList: [], //用户表格数据
    title: "", // 弹出层标题
    showSearch: true, //显示搜索条件
    loading: true, //遮罩层
    open: false, // 是否显示弹出层
    multiple: true, // 非多个禁用
    single: true, //非单个禁用
    total: 0, //总条数
    ids: [], //选中数组
    isShowBtn:true,
    uploadUrl: import.meta.env.VITE_upload_url,
    uploadParams: {
      key: "",
      name: "",
      policy: "",
      OSSAccessKeyId: "",
      success_action_status: 200,
      signature: "",
    },
  });
  const queryRef = ref<InstanceType<typeof ElForm>>();
  const formRef = ref<InstanceType<typeof ElForm>>();
  const pageTableRef = ref<InstanceType<typeof ElTable>>();
  const quillEditor = ref<any>("");
  const formA1 = ref();
  const quill = quillEditor.value;
  const uploadQuill = ref<any>();
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
  const {
    form,
    queryParams,
    dataList,
    title,
    showSearch,
    loading,
    open,
    multiple,
    single,
    total,
    ids,
    isShowBtn,
    uploadUrl,
    uploadParams
  } = toRefs(state);

  const doInitPolicy = () => {
    handleUpdateForm1();
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
                "exoss/" + randomString(10) + getSuffix(uploadParams.value.name);
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
  const cleanSelect = () => {
    pageTableRef.value?.clearSelection();
  };

  // 查询用户列表数据
  const getList = async () => {
    loading.value = true;
    const obj = JSON.parse(JSON.stringify(queryParams.value));
    // delete obj.current;
    // delete obj.size;
    await listDatas(obj).then((response: any) => {
      loading.value = false;
      if (response.code == 200) {
        dataList.value = response.data.records.map((i: any) => ({
          ...i,
          listTime: new Date(+i.listTime).toLocaleString(),
          createTime: new Date(+i.createTime).toLocaleString(),
          updateTime: i.updateTime
            ? new Date(+i.updateTime).toLocaleString()
            : "--",
        }));
        total.value = response.data.total;
      }
    });
  };
  getList();
  //   多选框选中数据
  const handleSelectionChange = (selection: any) => {
    ids.value = selection.map((item: any) => item.id);
    multiple.value = !selection.length;
    single.value = selection.length != 1;
  };

  // 搜索按钮操作
  const handleQuery = () => {
    getList();
  };
  // 重置按钮操作
  const resetQuery = () => {
    proxy.resetForm(queryRef);
    handleQuery();
  };

  // 取消按钮
  const cancel = () => {
    reset();
    cleanSelect();
    open.value = false;
  };
  // 表单重置
  const reset = () => {
    form.value = JSON.parse(JSON.stringify(formDefault));
    proxy.resetForm(formRef);
  };
  // 新增按钮操作
  const handleAdd = () => {
    reset();
    open.value = true;
    isShowBtn.value = true;
    title.value = "添加平台交易产品";
  };
  /** 详情页 */
  const handleShowDetail = (row: any) => {
    reset();
    const configId = row.id || ids.value;
    getDatas(configId).then((response: any) => {
      form.value = response.data;
      open.value = true;
      title.value = "详情";
      isShowBtn.value = false;
      proxy.setTableRowSelected(pageTableRef, row, true);
    });
  };
  /** 修改按钮操作 */
  const handleUpdate = async (row: any) => {
    reset();
    const userId = row.id || ids.value;
    await getDatas(userId).then((response: any) => {
      if (response.code === 200) {
        form.value = response.data;
        isShowBtn.value = true;
      }
    });

    open.value = true;
    title.value = "修改平台交易产品";
  };
  // 提交按钮
  const submitForm = async () => {
    await formRef.value?.validate((valid: boolean) => {
      if (valid) {
        const obj = form.value;
        console.log(obj);
        if (form.value.id != "") {
          delete obj.createTime;
          delete obj.updateTime;
          addDatas(obj).then((response: any) => {
            if (response.code === 200) {
              proxy.$modal.msgSuccess("修改成功");
              open.value = false;
              handleQuery();
            }
            if (response.code === 2002) {
              proxy.$modal.msgError(response.message);
            }
          });
        } else {
          addDatas(obj).then((response: any) => {
            if (response.code === 200) {
              proxy.$modal.msgSuccess("新增成功");
              open.value = false;
              handleQuery();
            }
            if (response.code === 2002) {
              proxy.$modal.msgError(response.message);
            }
          });
        }
      }
    });
  };

  /** 删除按钮操作 */
  const handleDelete = (row: any) => {
    // 设置当前被选中
    proxy.setTableRowSelected(pageTableRef, row, true);
    const arrIds = row.id || ids.value;
    proxy.$modal
      .confirm("是否确认删除id为" + arrIds + "的数据项?")
      .then(() => {
        const query = {} as any;
        if (row.id == undefined) {
          query.value = {
            ids: isStrings(arrIds),
          };
        } else {
          query.value = {
            ids: arrIds,
          };
        }
        return delDatas(query.value);
      })
      .then((response: any) => {
        if (response.code === 200) {
          proxy.$modal.msgSuccess("删除成功");
          getList();
        }
      })
      .catch(() => {
        proxy.setTableRowSelected(pageTableRef, row, false);
      });
  };

  //状态
  const handleStatusChange = async (val: any, row: any) => {
    // proxy.setTableRowSelected(pageTableRef, row, true);
    // const text = val === true ? "启用" : "停用";
    // // prettier-ignore
    // await proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?',"警告")
    //         .then(() => {
    //             changeUserStatus(row.id).then(res=>{
    //                 if (res.code==200){
    //                     proxy.$modal.msgSuccess('操作成功');
    //                 }
    //             });
    //         })
    //         .catch(() => {
    //             proxy.setTableRowSelected(pageTableRef, row, false);
    //             row.active = row.active === false ? true : false;
    //             return;
    //         });
    //updateUserStatus(row.userId, val);
  };

  return {
    form,
    queryParams,
    queryRef,
    pageTableRef,
    formRef,
    title,
    showSearch,
    single,
    multiple,
    open,
    loading,
    dataList,
    total,
    getList,
    resetQuery,
    submitForm,
    cancel,
    cleanSelect,
    handleQuery,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleSelectionChange,
    handleStatusChange,
    handleShowDetail,
    isShowBtn,
    uploadUrl,
    uploadParams,
    doInitPolicy,
    handleUpdateForm1,
    uploadPolicy,
    doChange1,
    onBeforeUpload,
    afterUploadQuill,
    editorOption,
    uploadQuill,
    quillEditor
  };
};
