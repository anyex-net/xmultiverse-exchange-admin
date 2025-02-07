import { ref, reactive, toRefs, getCurrentInstance, onMounted, nextTick } from "vue";
// prettier-ignore
import {
    listRegisterDefaultFriend,
    userRegisterDefaultFriend,
    addRegisterDefaultFriend,
    delRegisterDefaultFriend,
} from "@/api/openim/register/registerDefaultFriends";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            userId: null,
            nickname: null,
        },
        queryParams1: {
            current: 1,
            size:10,
            id: null,
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
            ids: "",
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
                id: "email",
                name: "邮件",
            },
            {
                id: "sms",
                name: "短信",
            },
        ],
        userList: [],//用户列表
        totalUser: 0,
        secondaryTableData:[],

    });
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const mutipleTable =  ref<InstanceType<typeof ElTable>>();
    const mutipleTable1 =  ref<InstanceType<typeof ElTable>>();
    const {
        queryParams,
        queryParams1,
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
        userList,
        totalUser,
        secondaryTableData,
    } = toRefs(state);

    /** 查询参数列表 */
    const getList = () => {
        for (let key in queryParams.value) {
            if (queryParams.value.hasOwnProperty(key)) {
                if (queryParams.value[key] === "") {
                    queryParams.value[key] = null;
                }
            }
        }
        loading.value = true;
        // prettier-ignore
        listRegisterDefaultFriend(queryParams.value).then((response) => {
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
            ids:'',

        };
        secondaryTableData.value=[];

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
        // title.value = "添加店铺";
        open.value = true;
        getUser();


    };
    const getUser = () => {
        loading.value = true;
        userRegisterDefaultFriend(queryParams1.value).then(res => {
            if (res.code == 200) {
                loading.value = false;
                userList.value = res.data.records;
                totalUser.value = res.data.total;
               if (secondaryTableData.value.length==0){
                   mutipleTable.value!.clearSelection();
               }
            }
        });
    };
    const getSearch = () => {
        queryParams1.value.current = 1;
        getUser();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: any) => {
        ids.value = selection.map((item: any) => item.id);
        single.value = selection.length != 1;
        multiple.value = !selection.length;
    };
    //全选
    const selectAll=(selection:any)=>{
        secondaryTableData.value=selection;
        nextTick(() => {
            secondaryTableData.value.forEach((item: any) => {
                mutipleTable1.value!.toggleRowSelection(item, true);
            });
        });
    }
    const handleSelectionChange1 = (selection: any) => {
        secondaryTableData.value=selection;
        nextTick(() => {
            secondaryTableData.value.forEach((item: any) => {
                mutipleTable1.value!.toggleRowSelection(item, true);
            });
        });

    };

    const selectAll2=(selection:any)=>{
        secondaryTableData.value=selection;
        nextTick(()=>{
            userList.value.forEach((item:any, index) => {
                if (secondaryTableData.value.findIndex((v:any) => v.id == item.id) >= 0) {
                    mutipleTable.value!.toggleRowSelection(item, true);

                }else{
                    mutipleTable.value!.clearSelection();
                }
            });
        })
    }
    const handleSelectionChange2=(selection: any)=>{
        secondaryTableData.value=selection;
        nextTick(()=>{
            userList.value.forEach((item:any, index) => {
                if (secondaryTableData.value.findIndex((v:any) => v.id == item.id) >= 0) {
                    mutipleTable.value!.toggleRowSelection(item, true);
                }else{
                    mutipleTable.value!.toggleRowSelection(item, false);
                }
            });
        })

    };
    const getRowKeys = (row: any) => {
        return row.id;
    };
    // @ts-ignore
    const tableRowClassName = ({ row }) => {
        const checkIdList = secondaryTableData.value.map((item: any) => item.id);
        if (checkIdList.includes(row.id)) {
            return {
                backgroundColor: "#E6F7FF",
            };
        }
    };
    /** 修改按钮操作 */
    const handleUpdate = (row: any) => {
        reset();
        const configId = row.id || ids.value;
        // getshopArr(configId).then((response: any) => {
        //     form.value = response.data;
        //     open.value = true;
        //     title.value = "修改店铺";
        //     proxy.setTableRowSelected(pageTableRef, row, true);
        // });
    };
    /** 提交按钮 */
    const submitForm = async () => {
        if (secondaryTableData.value.length==0){
            proxy.$modal.msgError("请选择默认好友");
        }else{
            var ids=[] as any;
            secondaryTableData.value.forEach((v:any)=>{
                ids.push(v.id)
            })
            form.value.ids=isStrings(ids)
            addRegisterDefaultFriend(form.value).then((response) => {
                if (response.code === 200) {
                    proxy.$modal.msgSuccess("操作成功");
                    open.value=false;
                    getList();
                }
            });
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
        proxy.$modal.confirm("是否确认删除编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delRegisterDefaultFriend(query.value);
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
        queryParams1,
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
        langType,
        typeList,
        userList,
        totalUser,
        getSearch,
        getUser,
        handleSelectionChange1,
        mutipleTable,
        getRowKeys,
        tableRowClassName,
        mutipleTable1,
        handleSelectionChange2,
        secondaryTableData,
        selectAll,
        selectAll2
    };
};
