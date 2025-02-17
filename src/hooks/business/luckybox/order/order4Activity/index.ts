import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
// prettier-ignore
import { listOrderArr, getOrderArr } from "@/api/business/luckybox/order/order4Activity";
import { ElForm, ElTable } from "element-plus";
export default () => {
  const { proxy } = getCurrentInstance() as any;
  const state = reactive({
    // 查询参数
    queryParams: {
      current: 1,
      size: 50,
      paymentStatus: "",
      isLotteryDrawn: "",
      isWinning: "",
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
      accountId:"",
      activityCurrentRound:"",
      activityId:"",
      activitySumNum:"",
      activitySumRound:"",
      activityType: "",
      balanceDeductionAmount:"",
      createTime:"",
      isLotteryDrawn: "",
      isWinning: "",
      orderActBalancePayment:"",
      orderActPrice:"",
      orderActPurchaseNum:"",
      orderStatus: "",
      orderSumBalance:"",
      orderTxNo: "",
      paymentActualAmount:"",
      paymentDesc: "",
      paymentNo: "",
      paymentStatus: "",
      paymentTime:"",
      remark: "",
      updateTime:"",
      activitySkuPrice:""
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
        id: "0",
        name: "未开奖",
      },
      {
        id: "1",
        name: "已开奖",
      }
    ],
    typeList1: [
      {
        id: "0",
        name: "未中奖",
      },
      {
        id: "1",
        name: "已中奖",
      }
    ],
    typeList2: [
      {
        id: "0",
        name: "待开奖",
      },
      {
        id: "1",
        name: "未中奖",
      },
      {
        id: "2",
        name: "已开奖待支付",
      },
      {
        id: "3",
        name: "已支付待发货",
      },
      {
        id: "4",
        name: "缺货等值现金冲抵",
      }
    ],
    typeList3: [
      {
        id: "-1",
        name: "不用支付",
      },
      {
        id: "0",
        name: "未支付",
      },
      {
        id: "1",
        name: "已支付",
      }
    ]
  });
  const queryFormRef = ref<InstanceType<typeof ElForm>>();
  const formRef = ref<InstanceType<typeof ElForm>>();
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
    form,
    rules,
    langType,
    typeList,
    typeList1,
    typeList2,
    typeList3
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
    listOrderArr(queryParams.value).then((response) => {
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
      accountId:"",
      activityCurrentRound:"",
      activityId:"",
      activitySumNum:"",
      activitySumRound:"",
      activityType: "",
      balanceDeductionAmount:"",
      createTime:"",
      isLotteryDrawn: "",
      isWinning: "",
      orderActBalancePayment:"",
      orderActPrice:"",
      orderActPurchaseNum:"",
      orderStatus: "",
      orderSumBalance:"",
      orderTxNo: "",
      paymentActualAmount:"",
      paymentDesc: "",
      paymentNo: "",
      paymentStatus: "",
      paymentTime:"",
      remark: "",
      updateTime:"",
      activitySkuPrice:""
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
    getOrderArr(configId).then((response: any) => {
      form.value = response.data;
      open.value = true;
      title.value = "详情";
      proxy.setTableRowSelected(pageTableRef, row, true);
    });
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
        typeList,typeList1,typeList2,typeList3
    };
};
