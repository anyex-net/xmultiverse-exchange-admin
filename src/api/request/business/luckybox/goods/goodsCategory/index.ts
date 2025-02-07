import { ref, reactive, toRefs, getCurrentInstance, onMounted ,nextTick} from "vue";
// prettier-ignore
import { getGoodsCategory, addGoodsCategory, delGoodsCategory,getGoodsCategoryTree,getbrandList,getFindByGoodsCategoryId,saveGoodsBrand } from "@/api/business/luckybox/goods/goodsCategory";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<goodsCategory<goodsCategoryForm, goodsCategoryQueryParams,goodsCategoryForm1>>({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            name: "",
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
        // 商品分类表格数据
        configList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        open1:false,
        // 是否展开,默认全部折叠
        isExpandAll: false,
        refreshTable: true,//重新渲染表格状态
        // 表单参数
        form: {
            id: "",
            name: "",
            sort: "",
            parentId: "",
        },
        form1:{
            id: "",
            goodsBrandIds:[],
            name:"",
        },
        // 表单校验
        rules: {
            name: [
                {
                    required: true,
                    message: "分类名称不能为空",
                    trigger: "blur",
                },
            ],
        },
        rules1:{
            goodsBrandIds: [
                {
                    required: true,
                    message: "商品品牌不能为空",
                    trigger: "blur",
                },
            ],
        },
        brandList: [],//商品品牌
        treeOptions:[],//上级分类
    });
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const formRef1 = ref<InstanceType<typeof ElForm>>();
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
        brandList,
        treeOptions,
        open1,form1,rules1,isExpandAll,refreshTable
    } = toRefs(state);

    /** 查询商品分类列表 */
    const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
        loading.value = true;
        // prettier-ignore
        getGoodsCategoryTree(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data;
                // total.value = response.data.total;
                loading.value = false;
            }

        });
    };
    //获取上级分类树形菜单
   const listTree=()=>{
        getGoodsCategoryTree().then(res=>{
            if (res.code==200){
                treeOptions.value=res.data;
            }
        })
    };
    listTree();
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
            name: "",
            sort: "",
            parentId: "",
        };
        form1.value={
            id: "",
            goodsBrandIds:[],
            name:"",
        }
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
        title.value = "添加商品分类";
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
        getGoodsCategory(configId).then((response: any) => {
            form.value = response.data;
            open.value = true;
            title.value = "修改商品分类";
            proxy.setTableRowSelected(pageTableRef, row, true);
        });
    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != "") {
                    addGoodsCategory(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();
                        }
                    });
                } else {
                    addGoodsCategory(form.value).then((response) => {
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
        proxy.$modal.confirm("是否确认删除商品分类编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delGoodsCategory(query.value);
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

    //关联品牌
    const handlebrand=(row:any)=>{
        form1.value.id=row.id;
        form1.value.name=row.name;
        //获取所有商品品牌
        getbrandList().then(res=>{
            if (res.code==200){
                brandList.value=res.data;
                getFindByGoodsCategoryId(row.id).then(res=>{
                    if (res.code==200){
                        form1.value.goodsBrandIds=[]
                        res.data.forEach((v:any)=>{
                            form1.value.goodsBrandIds.push(v.id)
                        })
                    }
                })
            }
        })
        open1.value=true;
    }
    //保存品牌分类
    const submitForm1=async ()=>{
        await formRef1.value?.validate((valid: boolean) => {
            if (valid) {
                form1.value.goodsBrandIds=form1.value.goodsBrandIds.toString();
                saveGoodsBrand(form1.value).then((response) => {
                    if (response.code === 200) {
                        proxy.$modal.msgSuccess("操作成功");
                        open1.value = false;
                        getList();
                    }
                });
            }
        });
    }
    //取消品牌分类弹框
    const cancel1=()=>{
        open1.value=false;
        reset();
    }
    // 展开折叠
    const toggleExpandAll = () => {
        refreshTable.value = false;
        isExpandAll.value = !isExpandAll.value;
        nextTick(() => {
            refreshTable.value = true;
        });
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
        submitForm,
        handleDelete,
        pageTableRef,
        cleanSelect,
        brandList,
        treeOptions,
        handlebrand,formRef1,
        open1,form1,rules1,submitForm1,cancel1,isExpandAll,toggleExpandAll,refreshTable
    };
};
