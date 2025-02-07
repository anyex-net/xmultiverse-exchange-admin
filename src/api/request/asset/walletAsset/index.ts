import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
// prettier-ignore
import {listWalletArr, getWalletArr, adjustWalletArr} from "@/api/asset/walletAsset";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
import {addActivityHotDeals} from "@/api/business/luckybox/activity/activityHotDeals";

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
    openAdjust: false,
    // 表单参数
    form: {
      id: "",
      accountId: "",
      balance: "",
      currency: "",
      frozenBal: "",
      remark: "",
      updateTime: "",
      createTime:""
    },
    formAdjust: {
      accountId: "",
      direction: "1",
      currency: "PKR",
      amount: ""
    },
    rulesAdjust: {
      accountId: [
        {
          required: true,
          message: "账户不能为空",
          trigger: "blur",
        },
      ],
      direction: [
        {
          required: true,
          message: "调整方向不能为空",
          trigger: "blur",
        },
      ],
      currency: [
        {
          required: true,
          message: "币种不能为空",
          trigger: "blur",
        },
      ],
      amount: [
        {
          required: true,
          message: "调整金额不能为空",
          trigger: "blur",
        },
      ],
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
    typeList: [{
      id: '1',
      name: '增加'
    },
      {
        id: '-1',
        name: '減少'
      }]
  });
  const queryFormRef = ref<InstanceType<typeof ElForm>>();
  const formRef = ref<InstanceType<typeof ElForm>>();
  const formAdjustRef = ref<InstanceType<typeof ElForm>>();
  const pageTableRef = ref<InstanceType<typeof ElTable>>();
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
    openAdjust,
    form,
    formAdjust,
    rules,
    rulesAdjust,
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
    listWalletArr(queryParams.value).then((response) => {
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

  const cancelAdjust = () => {
    openAdjust.value = false;
    formAdjust.value = {
      accountId: "",
      direction: "1",
      currency: "PKR",
      amount: ""
    };
    cleanSelect();
  };

  // 表单重置
  const reset = () => {
    form.value = {
      id: "",
      accountId: "",
      balance: "",
      currency: "",
      frozenBal: "",
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
    getWalletArr(configId).then((response: any) => {
      form.value = response.data;
      open.value = true;
      title.value = "详情";
      proxy.setTableRowSelected(pageTableRef, row, true);
    });
  };

  const handleUpdateAdjust = (row: any) => {
    reset();
    const configId = row.id || ids.value;
    getWalletArr(configId).then((response: any) => {
      formAdjust.value =
          {
            accountId: response.data.accountId + '',
            direction: "1",
            currency: "PKR",
            amount: ""
          }
      openAdjust.value = true;
      title.value = "资产调整";
      proxy.setTableRowSelected(pageTableRef, row, true);
    });
  };

  const submitForm = async () => {

  };

  onMounted(() => {
    getList();
  });

  // prettier-ignore
  return {
        loading,
        single,
        multiple,
        open,
        openAdjust,
        showSearch,
        total,
        configList,
        title,
        queryParams,
        queryFormRef,
        form,
        formAdjust,
        formRef,
        formAdjustRef,
        rules,
        rulesAdjust,
        getList,
        cancel,
        cancelAdjust,
        reset,
        handleQuery,
        resetQuery,
        handleAdd,
        handleSelectionChange,
        handleUpdate,
        handleUpdateAdjust,
        pageTableRef,
        cleanSelect,
        langType,
        typeList,
        submitForm
    };
};
