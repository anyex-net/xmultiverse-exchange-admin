import { ElForm, ElTable } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
import {
    listDatas,
    getDatas,
    addDatas,
    delDatas,
    checkDatas
} from "@/api/user/userApi";
import { isStrings } from "@/utils/validate";
import { formDefault, searchDefault } from "@/data/user/userApi";
import { getCurrencies } from "@/api/base/currencies";

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
    const queryRef = ref<InstanceType<typeof ElForm>>();
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
        // delete obj.current;
        // delete obj.size;
        await listDatas(obj).then((response: any) => {
            loading.value = false;
            if (response.code == 200) {
                dataList.value = response.data.records.map((i: any) => ({
                    ...i,
                    closeTime: i.closeTime
                        ? new Date(+i.closeTime).toLocaleString()
                        : "",
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
        title.value = "添加用户";
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
                form.value = {
                    ...response.data,
                };
                isShowBtn.value = true;
            }
        });

        open.value = true;
        title.value = "修改用户";
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
    const handleStatusChange = async (row:any) => {
        // 设置当前行选中状态为 true
        proxy.setTableRowSelected(pageTableRef, row, true);

        // 根据 row.state 判断操作是冻结还是解冻
        const text = row.state === 0 ? "可用" : "不可用"; // 假设 'frozen' 代表已冻结状态
        await proxy.$modal.confirm(`确认要调整${text}吗?`, "警告")
            .then(async () => {
                // 假设 freezeDatas 接受一个对象，包含 userId 和 newState
                const newState = row.state === 0 ? 1 : 0; // 切换状态
                checkDatas({id: row.id, state: newState}).then((res:any) => {
                    if (res.code === 200){
                        proxy.$modal.msgSuccess('操作成功');
                        // 刷新列表数据
                        getList();
                    }
                });
            })
            .catch(() => {
                // 如果用户取消操作，则恢复原来的选择状态
                proxy.setTableRowSelected(pageTableRef, row, false);
                // 取消操作时切换回原来的状态
                row.state = row.state === '0' ? '0' : '1';
            });
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
    };
};
