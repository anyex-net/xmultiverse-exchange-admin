import { ref, reactive, toRefs, getCurrentInstance, onMounted, nextTick } from "vue";
// prettier-ignore
import { listDept, addDept, delDept,getOrganization } from "@/api/system/organization";
import { ElForm } from "element-plus";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<dept<deptForm, deptQueryParams>>({
        // 查询参数
        queryParams: {
            orgName: '',//地区名称
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
        // 部门表格数据
        deptList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        refreshTable: true,//重新渲染表格状态
        // 是否展开,默认全部折叠
        isExpandAll: false,
        AreaOptions: [],//上级树形菜单
        // 表单参数
        form: {
            id: '',
            orgCode:'',
            orgName: "",
            parentId: 0,
            orgDest: "",
            sortNum:0

        },
        // 表单校验
        rules: {
            parentId: [
                { required: true, message: "上级机构不能为空", trigger: "blur" }
            ],
            orgName: [
                { required: true, message: "机构名称不能为空", trigger: "blur" }
            ],
            orgCode: [
                { required: true, message: "机构编码不能为空", trigger: "blur" }
            ],
            sortNum: [
                { required: true, message: "排序不能为空", trigger: "blur" }
            ],
        },
    })
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const { queryParams, loading, ids, single, multiple, showSearch, total, deptList, title, open, form, rules, refreshTable, isExpandAll, AreaOptions } = toRefs(state);

    /** 查询地区列表 */
    const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
        loading.value = true;
        // prettier-ignore
        listDept(queryParams.value).then((response) => {
            if (response.code === 200) {
                deptList.value = response.data;
                loading.value = false;
            }
        });
    };

    // 取消按钮
    const cancel = () => {
        open.value = false;
        reset();
    };
    // 表单重置
    const reset = () => {
        form.value = {
            id: '',
            orgCode:'',
            orgName: "",
            parentId: 0,
            orgDest: "",
            sortNum:0
        };
        proxy.resetForm(formRef);
    };
    /** 搜索按钮操作 */
    const handleQuery = () => {
        getList();
    };
    /** 查询部门下拉树结构 */
    const getTreeselect = async () => {
        await listDept().then(response => {
            if (response.code === 200) {
                AreaOptions.value = [];
                AreaOptions.value=response.data;
            }
        })
    }

    /** 重置按钮操作 */
    const resetQuery = () => {
        proxy.resetForm(queryFormRef);
        handleQuery();
    };
    /** 新增按钮操作 */
    const handleAdd = (row:any) => {
        reset();
        if(row!=undefined){
            form.value.parentId=row.parentId
        }
        getTreeselect();
        title.value = "添加机构";
        open.value = true;
    };
    /** 修改按钮操作 */
    const handleUpdate = (item: any) => {
        reset();
        getTreeselect();
        getOrganization(item.id).then(res=>{
            if (res.code==200){
                form.value.id = res.data.id;
                form.value.orgCode = res.data.orgCode;
                form.value.orgName = res.data.orgName;
                form.value.parentId = res.data.parentId;
                form.value.orgDest = res.data.orgDest;
                form.value.sortNum = res.data.sortNum;
                open.value = true;
                title.value = "修改机构";
            }
        })

    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != '') {
                    addDept(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();

                        }
                    });
                } else {
                    addDept(form.value).then((response) => {
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

        // prettier-ignore
        proxy.$modal.confirm('是否确认删除机构编号为"' + row.id + '"的数据项?', "警告")
            .then(() => {
                return delDept(row.id);
            })
            .then((response:any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("删除成功");
                }else{
                    proxy.$modal.msgError(response.message);
                }
            })
            .catch(() => {

            });
    };
    onMounted(() => {
        getList();

    });
    // 展开折叠
    const toggleExpandAll = () => {
        refreshTable.value = false;
        isExpandAll.value = !isExpandAll.value;
        nextTick(() => {
            refreshTable.value = true;
        });
    }

    // prettier-ignore
    return {
        loading, single, multiple, open, showSearch, total, deptList, title, queryParams, queryFormRef, form, formRef, rules,
        getList, cancel, reset, handleQuery, resetQuery, handleAdd, handleUpdate, submitForm, handleDelete, toggleExpandAll, refreshTable, isExpandAll, AreaOptions
    };
};
