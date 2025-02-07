import { ref, reactive, toRefs, getCurrentInstance, onMounted, nextTick } from "vue";
// prettier-ignore
import { listDictionary, addDictionary, delDictionary,getDictionary } from "@/api/common/dictionary";
import { ElForm } from "element-plus";


export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<dictionary<dictionaryForm, dictionaryQueryParams>>({
        // 查询字典
        queryParams: {
            name: '',//字典名称
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
            parentId:'',
            id: '',
            active:true,
            code: "",
            lang: "",
            sortNum:0,
            name:"",
            dest:''
        },
        // 表单校验
        rules: {
            parentId: [
                { required: false, message: "上级字典不能为空", trigger: "blur" }
            ],
            name: [
                { required: true, message: "字典名称不能为空", trigger: "blur" }
            ],
            active: [
                { required: true, message: "启用标识不能为空", trigger: "blur" }
            ],
            code: [
                { required: true, message: "编码不能为空", trigger: "blur" }
            ],
            lang: [
                { required: true, message: "语言不能为空", trigger: "blur" }
            ],
        },
    })
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const isShowTooltip=ref<boolean>(true);
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
        listDictionary(queryParams.value).then((response) => {
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
            parentId:'',
            id: '',
            active:true,
            code: "",
            lang: "",
            sortNum:0,
            name:"",
            dest:''
        };
        proxy.resetForm(formRef);
    };
    /** 搜索按钮操作 */
    const handleQuery = () => {
        getList();
    };
    /** 查询字典下拉树结构 */
    const getTreeselect = async () => {
        await listDictionary().then(response => {
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
        title.value = "添加字典";
        open.value = true;
    };
    /** 修改按钮操作 */
    const handleUpdate = (item: any) => {
        reset();
        getTreeselect();
        getDictionary(item.id).then(res=>{
            if (res.code==200){
                form.value= res.data;
                open.value = true;
                title.value = "修改字典";
            }
        })

    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != '') {
                    addDictionary(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();

                        }
                        if (response.code === 1005) {
                            proxy.$modal.msgError("数据重复异常");

                        }
                    });
                } else {
                    addDictionary(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("新增成功");
                            open.value = false;
                            getList();

                        }
                        if (response.code === 1005) {
                            proxy.$modal.msgError("数据重复异常");

                        }
                    });
                }
            }
        });
    };
    /** 删除按钮操作 */
    const handleDelete = (row: any) => {

        // prettier-ignore
        proxy.$modal.confirm('是否确认删除字典编号为"' + row.id + '"的数据项?', "警告")
            .then(() => {
                return delDictionary(row.id);
            })
            .then((response:any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("删除成功");
                }
                if (response.code === 8201) {
                    proxy.$modal.msgError("存在子节点，当前节点无法删除");
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
    const onMouseOver=(target: any)=>{
        // 判断是否开启tooltip功能
        if (target.scrollWidth > target.clientWidth) {
            isShowTooltip.value = false;
        } else {
            isShowTooltip.value = true;
        }
    }
    // prettier-ignore
    return {
        loading, single, multiple, open, showSearch, total, deptList, title, queryParams, queryFormRef, form, formRef, rules,
        getList, cancel, reset, handleQuery, resetQuery, handleAdd, handleUpdate, submitForm, handleDelete, toggleExpandAll, refreshTable, isExpandAll, AreaOptions, isShowTooltip,
        onMouseOver,
    };
};
