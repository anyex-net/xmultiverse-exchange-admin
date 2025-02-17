import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
// prettier-ignore
import { listAppVersion, getAppVersion, addAppVersion, delAppVersion } from "@/api/common/appVersion";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<appVersion<appVersionForm, appVersionQueryParams>>({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            deviceType: '',
            // remark: '',
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
        title: '',
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {
            id: '',
            appVersion: "",
            buildVersion: "",
            canSupport: "",
            checkStatus:"",
            deviceType:"",
            remark:"",
        },
        // 表单校验
        rules: {
            appVersion: [
                {
                    required: true,
                    message: "版本号不能为空",
                    trigger: "blur",
                },
            ],
            buildVersion: [
                {
                    required: true,
                    message: "build版本号不能为空",
                    trigger: "blur",
                },
            ],
            deviceType: [
                {
                    required: true,
                    message: "设备类型不能为空",
                    trigger: "blur",
                },
            ],
        },
        deviceList:[
            {
                id:'android',
                name:'android',
            },
            {
                id:'ios',
                name:'ios',
            }
        ]
    })
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const { queryParams, loading, ids, single, multiple, showSearch, total, configList, title, open, form, rules ,deviceList} = toRefs(state);

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
        listAppVersion(queryParams.value).then((response) => {
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
            id:'',
            appVersion: "",
            buildVersion: "",
            canSupport: false,
            checkStatus:false,
            deviceType:"",
            remark:"",
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
        title.value = "添加app版本";
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
        getAppVersion(configId).then((response) => {
            form.value = response.data;
            open.value = true;
            title.value = "修改app版本";
            proxy.setTableRowSelected(pageTableRef, row, true);
        });
    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != '') {
                    addAppVersion(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();
                        }
                    });
                } else {
                    addAppVersion(form.value).then((response) => {
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
        const query={} as any
        if (row.id == undefined) {
            query.value = {
                ids: isStrings(configIds)
            }
        } else {
            query.value = {
                ids: configIds
            }
        }
        proxy.setTableRowSelected(pageTableRef, row, true);
        // prettier-ignore
        proxy.$modal.confirm('是否确认删除app版本编号为"' + configIds + '"的数据项?', "警告")
            .then(() => {
                return delAppVersion(query.value);
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
        loading, single, multiple, open, showSearch, total, configList, title, queryParams, queryFormRef, form, formRef, rules,
        getList, cancel, reset, handleQuery, resetQuery, handleAdd, handleSelectionChange, handleUpdate, submitForm, handleDelete, pageTableRef, cleanSelect,deviceList
    };
};
