import { ElForm, ElTable } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
import {
    listDatas,
    getDatas,
    addDatas,
    delDatas,
    checkDatas,
    checkDataIsActive
    // allCurrencies,
} from "@/api/rwa/rwaInstSpvProduct";
import { isStrings } from "@/utils/validate";
import { formDefault, searchDefault } from "@/data/rwa/rwaInstSpvProduct";

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
        isShowBtn: true,
    });
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
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
    } = toRefs(state);

    const cleanSelect = () => {
        pageTableRef.value?.clearSelection();
    };

    // 查询用户列表数据
    const getList = async () => {
        loading.value = true;
        const obj = JSON.parse(JSON.stringify(queryParams.value));
        delete obj.current;
        delete obj.size;
        await listDatas(obj).then((response: any) => {
            loading.value = false;
            if (response.code == 200) {
                dataList.value = response.data.records.map((i: any) => ({
                    ...i,
                    createTime: new Date(+i.createTime).toLocaleString(),
                    updateTime: i.updateTime
                        ? new Date(+i.updateTime).toLocaleString()
                        : "--",
                    purchaseStartDate: i.purchaseStartDate
                        ? new Date(+i.purchaseStartDate).toLocaleString()
                        : "--",
                    purchaseEndDate: i.purchaseEndDate
                        ? new Date(+i.purchaseEndDate).toLocaleString()
                        : "--",
                    operationStarDate: i.operationStarDate
                        ? new Date(+i.operationStarDate).toLocaleString()
                        : "--",
                    operationEndDate: i.operationEndDate
                        ? new Date(+i.operationEndDate).toLocaleString()
                        : "--",
                    checkTime: i.checkTime
                        ? new Date(+i.checkTime).toLocaleString()
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
        proxy.resetForm(queryFormRef);
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
        title.value = "添加平台交易产品";
    };
    /** 详情页 */
    const handleShowDetail = (row: any) => {
        reset();
        const configId = row.id || ids.value;
        getDatas(configId).then((response: any) => {
            let data = response.data;
            if (data.checkTime) {
                data.checkTime = new Date(Number(data.checkTime)).toLocaleString();
            }
            data.purchaseStartDate = new Date(Number(data.purchaseStartDate)).toLocaleString();
            data.purchaseEndDate = new Date(Number(data.purchaseEndDate)).toLocaleString();
            data.operationStarDate = new Date(Number(data.operationStarDate)).toLocaleString();
            data.operationEndDate = new Date(Number(data.operationEndDate)).toLocaleString();
            form.value = data;
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
    const handleStatusChange = async (row: any, action: any) => {
        // 设置当前行选中状态为 true
        proxy.setTableRowSelected(pageTableRef, row, true);

        let text = "";
        let reason = "";

        switch (action) {
            case "3":
                text = "审核通过";
                break;
            case "2":
                text = "审核拒绝";
                break;
            // case "4":
            //     text = "保证金设置";
            //     reason = await proxy.$prompt("请输入保证金比例（仅限两位正整数）", "提示", {
            //         confirmButtonText: "确定",
            //         cancelButtonText: "取消",
            //         inputPattern: /^\d{2}$/, // 确保输入非空且为两位整数
            //         inputErrorMessage: "请输入有效的两位正整数作为保证金比例",
            //     }).then(({ value }) => value); // 返回用户输入的值
            //     break;
            case "5":
                text= "调整为可进行申购";
                break;
            case "6":
                text= "调整为发行失败";
                break;
            case "7":
                text= "调整为运营中";
                break;
            case "8":
                text= "调整为已到期";
                break;
            default:
                console.error("未知的操作类型");
                return;
        }

        await proxy.$modal.confirm(`确认要${text} "${row.productNo}" 产品吗?`, "警告")
            .then(async () => {
                checkDatas({ id: row.id, state: action, raiseMarginRatio: reason }).then((res: any) => {
                    if (res.code === 200) {
                        proxy.$modal.msgSuccess("操作成功");
                        // 刷新列表数据
                        getList();
                    }
                });
            })
            .catch(() => {
                // 如果用户取消操作，则恢复原来的选择状态
                proxy.setTableRowSelected(pageTableRef, row, false);
                // 取消操作时无需更改状态，因为状态保持不变
            });
    };

    //状态
    const handleIsActiveChange = async (row: any, action: any) => {
        // 设置当前行选中状态为 true
        proxy.setTableRowSelected(pageTableRef, row, true);

        let text = "";
        let reason = "";

        switch (action) {
            case 0:
                text = "下架";
                break;
            case 1:
                text = "上架";
                break;
        }

        await proxy.$modal.confirm(`确认要${text} "${row.productNo}" 产品吗?`, "警告")
            .then(async () => {
                checkDataIsActive({ id: row.id, isActive: action }).then((res: any) => {
                    if (res.code === 200) {
                        proxy.$modal.msgSuccess("操作成功");
                        // 刷新列表数据
                        getList();
                    }
                });
            })
            .catch(() => {
                // 如果用户取消操作，则恢复原来的选择状态
                proxy.setTableRowSelected(pageTableRef, row, false);
                // 取消操作时无需更改状态，因为状态保持不变
            });
    };

    return {
        form,
        queryParams,
        queryFormRef,
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
        handleIsActiveChange,
        handleShowDetail,
        isShowBtn,
    };
};
