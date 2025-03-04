import { ElForm, ElTable,ElMessage } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
import {
    listDatas,
} from "@/api/spot/spotBalances";
import { updateDatas } from "@/api/spot/spotBalancesUpdate";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    // <
    // user<userForm, userQueryParams, userElTreeProps, userType>
    // >
    const state = reactive({
        forms: [
            {
                title: "用户ID",
                name: "userId",
            },
            {
                title: "币种",
                name: "currency",
            },
            {
                title:"冻结",
                name: "freeze"
            },
            {
                title: "可用",
                name: "available"
            }],
        queryParams: {
            current: 1,
            size: 10,
            userId: 1,
            currency: "",
        },
        updateParams:[
        //     {
        //     userId: 1,
        //     currency: "BTC",
        //     business: "",
        //     businessId: 1,
        //     change: 100,
        //     detail: 0,
        // },
            {
                title: "用户Id",
                name: "userId",
            },
            {
                title: "币种",
                name: "currency",
            },
            {
                title: "业务",
                name: "business",
            },
            {
                title: "业务Id",
                name: "businessId",
            },
            {
                title: "变更数量",
                name: "change",
            },
            // {
            //     title: "详情",
            //     name: "detail",
            // },
            ],
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
        forms,
        updateParams
    } = toRefs(state);

    const cleanSelect = () => {
        pageTableRef.value?.clearSelection();
    };
    const form = reactive({
        userId: null,
        currency: '',
        business: '',
        businessId: Date.now(),
        change: null,
        detail: null,
    });

    const formattedRes = (res:any,userId:number) => {
        return  Object.entries(res).map(([currency, values]) => ({
            userId: userId,
            currency: currency,
            freeze: values.freeze,
            available: values.available
        }));
    }
    // 查询用户列表数据
    const getList = async () => {
        if (!queryParams.value.userId) {
            ElMessage.error('用户ID为必填项，请输入后重试');
            return; // 停止函数执行
        }
        loading.value = true;
        const obj = JSON.parse(JSON.stringify(queryParams.value));
        const userId = obj.userId;
        delete obj.current;
        delete obj.size;
        await listDatas(obj).then((response: any) => {
            loading.value = false;
            if (response.code == 200) {
                if (response.data.error == null){
                    // console.log(JSON.stringify("=====================" + response.data.result));
                    const data = formattedRes(response.data.result,userId);
                    // console.log(JSON.stringify(data, null, 4));
                    dataList.value = data.map((i: any) => ({
                        ...i,
                        updateTime: i.updateTime
                            ? new Date(+i.updateTime).toLocaleString()
                            : "--",
                    }));
                    // total.value = response.data.total;
                }else {
                    ElMessage.error('参数错误：'+response.data.error.message)
                }
            }
        });
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
        // form.value = JSON.parse(JSON.stringify(formDefault));
        proxy.resetForm(formRef);
    };
    // 新增按钮操作
    const handleAdd = () => {
        reset();
        open.value = true;
        title.value = "添加";
    };
    // /** 详情页 */
    const handleUpate = (row:any) => {

        console.log(JSON.stringify(row, null, 4));
        form.userId = row.userId;
        form.currency = row.currency;
        form.business = row.business;
        form.change = row.change;
        form.detail = row.detail;
        open.value = true;
    };
    /** 修改按钮操作 */
    const submitForm = async (form: any) => {
        await updateDatas(form).then((response: any) => {
            if (response.code === 200) {
                if (response.data.error == null){
                    proxy.$modal.msgSuccess('操作成功');
                    open.value = false;
                    getList();
                }else {
                    ElMessage.error('参数错误：'+response.data.error.message)
                }
            }
        });
    };
    onMounted(() => {
        getList();
    });

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
        cancel,
        cleanSelect,
        handleQuery,
        forms,
        handleUpate,
        updateParams,
        submitForm,
        handleAdd
    };
};
