import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
// prettier-ignore
import { listGoodsSpecParam, getGoodsSpecParam, addGoodsSpecParam, delGoodsSpecParam,specGroupList } from "@/api/business/luckybox/goods/goodsSpecParam";
import { listGoodsSpecGroup} from "@/api/business/luckybox/goods/goodsSpecGroup";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<goodsSpecParam<goodsSpecParamGroupForm, goodsSpecParamQueryParams>>({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            paramName: "",
            spgId:"",
        },
        // 查询参数
        queryParams1: {
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
        // 商品品牌参数表格数据
        configList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {
            id: "",
            isNumeric: false,
            paramName: "",
            spgId:"",
            paramValue:"",
            unit:"",
        },
        // 表单校验
        rules: {
            spgId: [
                {
                    required: true,
                    message: "商品品类不能为空",
                    trigger: "blur",
                },
            ],
            paramName: [
                {
                    required: true,
                    message: "参数名称不能为空",
                    trigger: "blur",
                },
            ],
        },
        specList:[],
        goodsspecList:[],//商品品类列表
        total1:0,
    });
    const queryFormRef1 = ref<InstanceType<typeof ElForm>>();
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
        specList,queryParams1,goodsspecList,total1
    } = toRefs(state);

    /** 查询商品品牌参数列表 */
    const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
        loading.value = true;
        // prettier-ignore
        listGoodsSpecParam(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data.records;
                total.value = response.data.total;
                loading.value = false;
            }

        });
    };
    const getList1=()=>{
        listGoodsSpecGroup(queryParams1.value).then((response) => {
            if (response.code === 200) {
                goodsspecList.value = response.data.records;
                total1.value = response.data.total;
                loading.value = false;
            }

        });
    }
    //查询所有商品品类
    const getSpecGroupList=()=>{
        specGroupList().then(res=>{
            if (res.code==200){
                specList.value=res.data;

            }
        })
    };
    getSpecGroupList();
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
            isNumeric: false,
            paramName: "",
            spgId:"",
            paramValue:"",
            unit:"",
        };
        proxy.resetForm(formRef);
    };
    /** 搜索按钮操作 */
    const handleQuery = () => {
        queryParams.value.current = 1;
        getList();
        getList1();
    };
    /** 重置按钮操作 */
    const resetQuery = () => {
        proxy.resetForm(queryFormRef);
        handleQuery();
    };
    /** 搜索按钮操作 */
    const handleQuery1 = () => {
        queryParams1.value.current = 1;
        getList1();
    };
    /** 重置按钮操作 */
    const resetQuery1 = () => {
        proxy.resetForm(queryFormRef1);
        handleQuery1();
    };
    /** 新增按钮操作 */
    const handleAdd = () => {
        reset();
        title.value = "添加商品品类参数";
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
        getGoodsSpecParam(configId).then((response: any) => {
            form.value = response.data;
            open.value = true;
            title.value = "修改商品品类参数";
            proxy.setTableRowSelected(pageTableRef, row, true);
        });
    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != "") {
                    addGoodsSpecParam(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();
                        }
                    });
                } else {
                    addGoodsSpecParam(form.value).then((response) => {
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
        proxy.$modal.confirm("是否确认删除商品品类参数编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delGoodsSpecParam(query.value);
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
    const handleCurrentChange=(val:any)=>{
        if(val){
            queryParams.value.spgId=val.id;
            getList();
        }
    }
    onMounted(() => {
        // getList();
        getList1();
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
        specList,queryParams1,goodsspecList,total1,handleCurrentChange,handleQuery1,resetQuery1,queryFormRef1,getList1
    };
};
