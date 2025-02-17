import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
// prettier-ignore
import { listBankArr, getBankArr } from "@/api/account/accountReceivingBank";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";

export default () => {
  const { proxy } = getCurrentInstance() as any;
  const state = reactive({
    // 查询参数
    queryParams: {
      current: 1,
      size: 50,
      tplKey: "",
      title: "",
      accountId: ""
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
    // 参数表格数据
    configList: [],
    // 弹出层标题
    title: "",
    // 是否显示弹出层
    open: false,
    // 表单参数
    form: {
      id: "",
      accountType:"",
      accountNo:"",
      accountName:"",
      bankName:"",
      iban:"",
      cnic:"",
      email:"",
      mobile:"",
      remark: "",
      createTime:"",
      updateTime:""
    },
    // 表单校验
    rules: {
      tel: [
        {
          required: true,
          message: "电话不能为空",
          trigger: "blur",
        },
      ],
      address: [
        {
          required: true,
          message: "地址不能为空",
          trigger: "blur",
        },
      ],
      city: [
        {
          required: true,
          message: "城市不能为空",
          trigger: "blur",
        },
      ],
    },
    langType: [
      {
        id: "en_US",
        name: "英文",
      },
      {
        id: "zh_CN",
        name: "简体",
      },
      {
        id: "zh_HK",
        name: "繁体",
      },
    ],
    typeList: [
      {
        id: "email",
        name: "邮件",
      },
      {
        id: "sms",
        name: "短信",
      },
    ],
  });
  const queryFormRef = ref<InstanceType<typeof ElForm>>();
  const formRef = ref<InstanceType<typeof ElForm>>();
  const pageTableRef = ref<InstanceType<typeof ElTable>>();
  const isShowTooltip=ref<boolean>(true);
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
    langType,
    typeList,
  } = toRefs(state);

  /** 查询参数列表 */
  const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
    loading.value = true;
    // prettier-ignore
    listBankArr(queryParams.value).then((response) => {
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
      accountType:"",
      accountNo:"",
      accountName:"",
      bankName:"",
      iban:"",
      cnic:"",
      email:"",
      mobile:"",
      remark: "",
      createTime:"",
      updateTime:""
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
    title.value = "添加店铺";
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
    getBankArr(configId).then((response: any) => {
      form.value = response.data;
      open.value = true;
      title.value = "详情";
      proxy.setTableRowSelected(pageTableRef, row, true);
    });
  };
  const onMouseOver=(target: any)=>{
    // 判断是否开启tooltip功能
    if (target.scrollWidth > target.clientWidth) {
      isShowTooltip.value = false;
    } else {
      isShowTooltip.value = true;
    }
  }

  onMounted(() => {
    getList();
  });

  // prettier-ignore
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
        handleUpdate,
        pageTableRef,
        cleanSelect,
        langType,
        typeList,
    isShowTooltip,
    onMouseOver,
    };
};
