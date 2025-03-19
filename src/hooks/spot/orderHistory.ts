import { ElForm, ElTable, ElMessage } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
import {
    listHistory,
} from "@/api/spot/orderHistory";
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
                title: "币对",
                name: "market",
            },
            {
                title: "来源",
                name: "source",
            },
            {
                title: "t",
                name: "t",
            },
            {
                title: "价格",
                name: "price",
            },
            {
                title: "数量",
                name: "amount",
            },
            {
                title: "吃单费率",
                name: "takerFee",
            },
            {
                title: "挂单费率",
                name: "makerFee",
            },
            {
                title: "库存",
                name: "dealStock",
            },
            {
                title: "成交金额",
                name: "dealMoney",
            },
            {
                title: "成交费率",
                name: "dealFee",
            },
            {
                title: "创建时间",
                name: "createTime",
            },
            {
                title: "完成时间",
                name: "finishTime",
            }],
        queryParams: {
            current: 1,
            size: 10,
            tableName: 'order_history_0',
            userId: '',
        },
        tableNames:[],
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
        tableNames,
        forms,
    } = toRefs(state);

    const autoFor = () => {
        // 定义变量
        const prefix = 'order_history_'; // 表名前缀
        const start = 0;                   // 起始编号
        const end = 99;                     // 结束编号（包含）
        for (let i = start; i <= end; i++) {
            let tableName = `${prefix}${i}`;
            state.tableNames.push(tableName);
        }
    }

    autoFor();
    const cleanSelect = () => {
        pageTableRef.value?.clearSelection();
    };
    /** 查询列表 */
    const getList = () => {
        // 将queryParams中的空字符串值替换为null
        for (let key in queryParams.value) {
            if (queryParams.value.hasOwnProperty(key)) {
                if (queryParams.value[key] === "") {
                    queryParams.value[key] = null;
                }
            }
        }

        loading.value = true;

        listHistory(queryParams.value).then((response:any) => {
            if (response.code === 200) {
                dataList.value = response.data.records.map((record:any) => {
                    return {
                        ...record,
                        createTime: new Date(record.createTime * 1000).toLocaleString(), // 将时间戳转换为日期对象
                        finishTime: new Date(record.finishTime * 1000).toLocaleString(),
                    };
                });
                total.value = response.data.total;
                loading.value = false;
            } else {
                loading.value = false;
            }
        }).catch(error => {
            console.error("Error occurred while fetching data:", error);
            loading.value = false;
        });
    }

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
        tableNames
    };
};
