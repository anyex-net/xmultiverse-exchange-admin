import { ref, reactive, toRefs, getCurrentInstance, onMounted} from "vue";
// prettier-ignore
import { listGoodsSpu, getGoodsSpu, addGoodsSpu, delGoodsSpu,getGoodsCategoryTree,getbrandList} from "@/api/business/luckybox/goods/goodsSpu";
import { specGroupList} from "@/api/business/luckybox/goods/goodsSpecParam";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<goodsSpu<goodsSpuForm, goodsSpuQueryParams>>({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            title: "",
            brandId:"",
            categoryId:"",
            spgId:"",
            id: ""
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
        // 产品SPU表格数据
        configList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {
            id: "",
            brandId: "",//品牌ID
            categoryId: "",//分类ID
            saleable:false,//是否上架
            spgId:"",//品类ID
            subTitle:"",//副标题
            title:"",//标题
            valid:false,//是否有效
        },

        // 表单校验
        rules: {
            brandId: [
                {
                    required: true,
                    message: "品牌名称不能为空",
                    trigger: "blur",
                },
            ],
            categoryId: [
                {
                    required: true,
                    message: "分类名称不能为空",
                    trigger: "blur",
                },
            ],
            spgId: [
                {
                    required: true,
                    message: "品类名称不能为空",
                    trigger: "blur",
                },
            ],
            title: [
                {
                    required: true,
                    message: "标题不能为空",
                    trigger: "blur",
                },
            ],
            subTitle: [
                {
                    required: true,
                    message: "副标题不能为空",
                    trigger: "blur",
                },
            ],
        },
        brandList: [],//商品品牌
        treeOptions:[],//上级分类
        specList:[],//品类列表
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
        specList
    } = toRefs(state);

    /** 查询产品SPU列表 */
    const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
        loading.value = true;
        // prettier-ignore
        listGoodsSpu(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data.records;
                total.value = response.data.total;
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
        //查询所有商品品牌
        getbrandList().then(res=>{
            if (res.code==200){
                brandList.value=res.data
            }
        })
    //    查询所有品类参数
        specGroupList().then(res=>{
            if (res.code==200){
                specList.value=res.data
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
            brandId: "",//品牌ID
            categoryId: "",//分类ID
            saleable:false,//是否上架
            spgId:"",//品类ID
            subTitle:"",//副标题
            title:"",//标题
            valid:false,//是否有效
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
        title.value = "添加产品spu";
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
        getGoodsSpu(configId).then((response: any) => {
            form.value = response.data;
            open.value = true;
            title.value = "修改产品spu";
            proxy.setTableRowSelected(pageTableRef, row, true);
        });
    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != "") {
                    addGoodsSpu(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();
                        }
                    });
                } else {
                    addGoodsSpu(form.value).then((response) => {
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
        proxy.$modal.confirm("是否确认删除产品SPU编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delGoodsSpu(query.value);
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
        brandList,
        treeOptions,
        specList
    };
};
