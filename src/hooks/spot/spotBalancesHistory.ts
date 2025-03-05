import { ElForm, ElTable, ElMessage } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
import {
    listDatas,
} from "@/api/spot/spotBalancesHistory";
import { formDefault, searchDefault } from "@/data/fund/balances";

export default () => {
    const { proxy } = getCurrentInstance() as any;

    const state = reactive({
        form: JSON.parse(JSON.stringify(formDefault)),
        forms: [
            {
                title: "用户ID",
                name: "userId",
            },
            {
                title: "偏移位置",
                name: "offset",
            },
            {
                title: "数量限制",
                name: "limit",
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
                title: "余额",
                name: "balance",
            },
            {
                title: "变更数量",
                name: "change",
            },
            {
                title: "详情",
                name: "detail",
            },
            {
                title: "时间",
                name: "time",
            }],
        queryParams: {
            current: 1,
            size: 10,
            userId: 1,
            currency: "BTC",
            business: "",
            offset: 1,
            limit: 100,
            startTime: 0,
            endTime: 0,
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
        forms,
    } = toRefs(state);

    const cleanSelect = () => {
        pageTableRef.value?.clearSelection();
    };
    // 转换为目标格式
    const formattedRes = (res: any, userId: number, limit: number, offset: number) => {
        return Object.entries(res).map(([, values]) => ({
            userId: userId,
            offset: offset,
            limit: limit,
            currency: values.asset,
            business: values.business,
            balance: values.balance,
            change: values.change,
            detail: JSON.stringify(values.detail, null, 4),
            time: (new Date(values.time * 1000)).toLocaleString(),
        }));
    };
    // 查询用户列表数据
    const getList = async () => {
        if (!queryParams.value.userId) {
            ElMessage.error("用户ID为必填项，请输入后重试");
            return; // 停止函数执行
        }
        if (!queryParams.value.currency) {
            ElMessage.error("币种为必填项，请输入后重试");
            return; // 停止函数执行
        }
        if (!queryParams.value.limit) {
            ElMessage.error("数量限制为必填项，请输入后重试");
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
                    const res = response.data.result;
                    const offset = res.offset;
                    const limit = res.limit;
                    const data = formattedRes(res.records,userId,limit,offset);
                    // console.log(JSON.stringify(data, null, 4));
                    dataList.value = data.map((i: any) => ({
                        ...i,
                        updateTime: i.updateTime
                            ? new Date(+i.updateTime).toLocaleString()
                            : "--",
                    }));
                    // total.value = response.data.total;
                }else {
                    ElMessage.error("参数错误："+response.data.error.message);
                }
            }
        });
    };
    // getList();

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
    // // 新增按钮操作
    // const handleAdd = () => {
    //     reset();
    //     open.value = true;
    //     title.value = "添加";
    // };
    // /** 详情页 */
    // const handleShowDetail = (row: any) => {
    //     reset();
    //     const configId = row.id || ids.value;
    //     getDatas(configId).then((response: any) => {
    //         form.value = response.data;
    //         open.value = true;
    //         title.value = "详情";
    //         isShowBtn.value = false;
    //         proxy.setTableRowSelected(pageTableRef, row, true);
    //     });
    // };
    // /** 修改按钮操作 */
    // const handleUpdate = async (row: any) => {
    //     reset();
    //     const userId = row.id || ids.value;
    //     await getDatas(userId).then((response: any) => {
    //         if (response.code === 200) {
    //             form.value = response.data;
    //             isShowBtn.value = true;
    //         }
    //     });

    //     open.value = true;
    //     title.value = "修改";
    // };
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
    };
};
