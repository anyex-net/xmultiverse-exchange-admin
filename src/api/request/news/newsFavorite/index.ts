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
      listnewsFavorite,
      getnewsFavorite,
      addnewsFavorite,
      delnewsFavorite,
      uploadPolicy,
  } from "@/api/news/newsFavorite/newsFavorite";
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
        favoriteAccountId: "",
        newsId: "",
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
        trxNo: "",
        trxBalance: "",
        trxFee:"",
        status:"",
        fromAccountId:"",
        toAccountId:"",
        currency:"",
        remark:""
      },
      // 表单校验
      rules: {
        fromAccountId: [
          {
            required: true,
            message: "来源账户ID不能为空",
            trigger: "blur",
          },
        ],
        trxNo: [
          {
            required: true,
            message: "交易编号不能为空",
            trigger: "blur",
          },
        ],
        trxBalance: [
          {
            required: true,
            message: "金额不能为空",
            trigger: "blur",
          },
        ],
        trxFee: [
          {
            required: true,
            message: "手续费不能为空",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "状态不能为空",
            trigger: "blur",
          },
        ],
        toAccountId: [
          {
            required: true,
            message: "去处账户ID不能为空",
            trigger: "blur",
          },
        ],
        currency: [
          {
            required: true,
            message: "货币不能为空",
            trigger: "blur"
          },
        ]
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
    const statusList = ref([{
      id:false,
      name:"无效",
    },{
      id:true,
      name:"有效",
    }]);
    const cuList = ref([{
      id:"法币",
      name:"法币",
    },{
      id:"BTC",
      name:"BTC",
    },{
      id:"ETH",
      name:"ETH",
    },{
      id:"USD",
      name:"USD",
    }]);
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
      uploadUrl
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
      listnewsFavorite(queryParams.value).then((response) => {
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
        trxNo: "",
        trxBalance: "",
        trxFee:"",
        status:"",
        fromAccountId:"",
        toAccountId:"",
        currency:"",
        remark:""
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
    // 查看详情
    const handleDetail1 = (row: any) => {
      const configId = row.id || ids.value;
      getnewsFavorite(configId).then((response: any) => {
        form.value = response.data;
        open.value = true;
      });
    };
    /** 提交按钮 */
    const submitForm = async () => {
      await formRef.value?.validate((valid: boolean) => {
        if (valid) {
          if (form.value.id != "") {
            addnewsFavorite(form.value).then((response) => {
              if (response.code === 200) {
                proxy.$modal.msgSuccess("修改成功");
                open.value = false;
                getList();
              }
            });
          } else {
            addnewsFavorite(form.value).then((response) => {
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
                  return delnewsFavorite(query.value);
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
          handleSelectionChange,
          submitForm,
          handleDelete,
          pageTableRef,
          cleanSelect,
          uploadParams,
          uploadUrl,
          upload,
          isShowTooltip,
          statusList,
          handleDetail1,
          cuList,
          onMouseOver,
          iconChange,
          iconUpload
      };
  };
  