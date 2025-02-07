import { ref, reactive, toRefs, getCurrentInstance, onMounted, nextTick } from "vue";
// prettier-ignore
import {
    listActivityHotDeals,
    getActivityHotDeals,
    addActivityHotDeals,
    delActivityHotDeals,
    spuList,
    getskuList,
    pullOffIt,putOnIt
} from "@/api/business/luckybox/activity/activityHotDeals";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<activityHotDeals<activityHotDealsForm, activityHotDealsParams>>({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            activityName: "",
            spuId: "",
            skuId: "",
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
        // 半价购买表格数据
        configList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {
            id: "",
            actCurrentAccountNum: "",
            actCurrentPurchasedNum: "",
            actCurrentRound: "",
            activityName: "",
            skuId: "",
            spuId: "",
            status: false,
            activityEndTime: "",
            activityPrice: "",
            activityRobotNum: "",
            activityStartTime: "",
            activitySumNum: "",
            activitySumRound: "",
            balancePayment: "",
            activitySumStock: "",
            remark: "",
        },

        // 表单校验
        rules: {
            activityName: [
                {
                    required: true,
                    message: "名称不能为空",
                    trigger: "blur",
                },
            ],
            spuId: [
                {
                    required: true,
                    message: "产品spu不能为空",
                    trigger: "blur",
                },
            ],
            skuId: [
                {
                    required: true,
                    message: "商品sku不能为空",
                    trigger: "blur",
                },
            ],
            actCurrentPurchasedNum: [
                {
                    required: true,
                    message: "当前轮已购买份数不能为空",
                    trigger: "blur",
                },
            ],
            actCurrentAccountNum: [
                {
                    required: true,
                    message: "当前轮已参加账户数不能为空",
                    trigger: "blur",
                },
            ],
            actCurrentRound: [
                {
                    required: true,
                    message: "当前轮数不能为空",
                    trigger: "blur",
                },
            ],
            activityPrice: [
                {
                    required: true,
                    message: "价格不能为空",
                    trigger: "blur",
                },
            ],
            balancePayment: [
                {
                    required: true,
                    message: "尾款金额不能为空",
                    trigger: "blur",
                },
            ],
            activityRobotNum: [
                {
                    required: true,
                    message: "一轮机器人份数不能为空",
                    trigger: "blur",
                },
            ],
            activitySumNum: [
                {
                    required: true,
                    message: "一轮总份数不能为空",
                    trigger: "blur",
                },
            ],
            activitySumRound: [
                {
                    required: true,
                    message: "总轮数不能为空",
                    trigger: "blur",
                },
            ],
            activitySumStock: [
                {
                    required: true,
                    message: "总库存不能为空",
                    trigger: "blur",
                },
            ],
            activityStartTime: [
                {
                    required: true,
                    message: "开始时间不能为空",
                    trigger: "blur",
                },
            ],
            activityEndTime: [
                {
                    required: true,
                    message: "结束时间不能为空",
                    trigger: "blur",
                },
            ],

        },
        skuList: [],//商品sku
        spuLists: [],//产品spu
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
        skuList,
        spuLists,
    } = toRefs(state);

    /** 查询半价购买列表 */
    const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
        loading.value = true;
        // prettier-ignore
        listActivityHotDeals(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data.records;
                total.value = response.data.total;
                loading.value = false;
            }

        });
    };


    //获取上级分类树形菜单
    const listTree = () => {
        spuList().then(res => {
            if (res.code == 200) {
                spuLists.value = res.data;
            }
        });
    };
    listTree();
    //商品sku
    const skuLists = (e: any) => {
        //查询所有商品sku
        getskuList(e).then(res => {
            if (res.code == 200) {
                skuList.value = res.data;
            }
        });
    };
    //选择产品spu
    const getSelect = (e: any) => {
        skuLists(e);
    };
    const getSelects = (e: any) => {
        handleQuery();
        skuLists(e);
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
            actCurrentAccountNum: "",
            actCurrentPurchasedNum: "",
            actCurrentRound: "",
            activityName: "",
            skuId: "",
            spuId: "",
            status: false,
            activityEndTime: "",
            activityPrice: "",
            activityRobotNum: "",
            activityStartTime: "",
            activitySumNum: "",
            activitySumRound: "",
            balancePayment: "",
            activitySumStock: "",
            remark: "",
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
        title.value = "添加半价购买";
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
        getActivityHotDeals(configId).then((response: any) => {
            form.value = response.data;
            form.value.activityEndTime = parseInt(form.value.activityEndTime);
            form.value.activityStartTime = parseInt(form.value.activityStartTime);
            open.value = true;
            title.value = "修改半价购买";
            skuLists(form.value.spuId);
            proxy.setTableRowSelected(pageTableRef, row, true);
        });
    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != "") {
                    addActivityHotDeals(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();
                        }
                    });
                } else {
                    addActivityHotDeals(form.value).then((response) => {
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
      //上架状态
  const handleStatusChange = async (val: any, row: any) => {
    proxy.setTableRowSelected(pageTableRef, row, true);
    const text = val === true ? "上架" : "下架";
    if (val === true) {
      // prettier-ignore
      await proxy.$modal.confirm('确认要' + text + '吗?',"提示")
        .then(() => {
            putOnIt(row.id).then(res=>{
                if (res.code==200){
                    proxy.$modal.msgSuccess('操作成功');
                    getList();
                }
            });
        })
        .catch(() => {
            proxy.setTableRowSelected(pageTableRef, row, false);
            row.status = row.status === false ? true : false;
            return;
        });
    } else {
      // prettier-ignore
      await proxy.$modal.confirm('确认要' + text + '吗?',"提示")
        .then(() => {
            pullOffIt(row.id).then(res=>{
                if (res.code==200){
                    proxy.$modal.msgSuccess('操作成功');
                    getList();
                }
            });
        })
        .catch(() => {
            proxy.setTableRowSelected(pageTableRef, row, false);
            row.status = row.status === false ? true : false;
            return;
        });
      //updateUserStatus(row.userId, val);
    }
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
        proxy.$modal.confirm("是否确认删除半价购买编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delActivityHotDeals(query.value);
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
        submitForm,
        handleDelete,
        pageTableRef,
        cleanSelect,
        skuList,
        spuLists,
        getSelect,
        getSelects,handleStatusChange
    };
};
