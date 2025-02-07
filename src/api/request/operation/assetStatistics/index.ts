import {ref, reactive, toRefs, getCurrentInstance, onMounted} from "vue";
// prettier-ignore
import {listDeposit, listWithdraw, listFlow} from "@/api/operation/assetStatistics";
import {ElForm, ElTable} from "element-plus";
import echarts from "@/api/request/operation/echart/echart";
import {parseTime} from "@/utils/dateTime";

export default () => {
    const {proxy} = getCurrentInstance() as any;
    const state = reactive({
        // 查询参数
        queryParams: {
            type: 1,
            // @ts-ignore
            dt:[''+parseTime(new Date()).toString().substring(0, 10),''+parseTime(new Date()).toString().substring(0, 10)],
            // @ts-ignore
            date: parseTime(new Date()).toString().substring(0, 10)+'~'+parseTime(new Date()).toString().substring(0, 10)
        },
        depositData: {
            xx: [],
            yy: []
        },
        withdrawData: {
            xx: [],
            yy: []
        },
        flowsData: {
            xx: [],
            yy: [],
            gameSpinRewardYy: [],
            activityTreasureHuntYy: [],
            activityHotDealsYy: []
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
        form: {},
        // 表单校验
        rules: {},
        typeList: [
            {
                id: 1,
                name: '按日期',
            },
            {
                id: 2,
                name: "上周",
            },
            {
                id: 3,
                name: "上个月",
            },
            {
                id: 4,
                name: "前三个月",
            },
            {
                id: 5,
                name: "前六个月",
            }
        ],
    });
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
        typeList,
        depositData,
        withdrawData,
        flowsData,
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
        if (queryParams.value.type === 1) {
            if (queryParams.value.dt === null|| queryParams.value.dt.length<2) {
                // @ts-ignore
                queryParams.value.dt =  [''+parseTime(new Date()).toString().substring(0, 10),''+parseTime(new Date()).toString().substring(0, 10)];
                // @ts-ignore
                queryParams.value.date = parseTime(new Date()).toString().substring(0, 10)+'~'+parseTime(new Date()).toString().substring(0, 10);
            }
            else
            {
                queryParams.value.date = queryParams.value.dt[0]+'~'+queryParams.value.dt[1];
            }
        } else {
            queryParams.value.dt =[];
            // @ts-ignore
            queryParams.value.date = '';
        }
        loading.value = true;
        // prettier-ignore
        listDeposit(queryParams.value).then((response: any) => {
            if (response.code === 200) {
                depositData.value = response.data;
                resetDepositChart();
            }
        });

        listWithdraw(queryParams.value).then((response: any) => {
            if (response.code === 200) {
                withdrawData.value = response.data;
                resetWithdrawChart();
            }
        });

        listFlow(queryParams.value).then((response: any) => {
            if (response.code === 200) {
                flowsData.value = response.data;
                resetFlowsChart();
            }
        });
    };

    const resetDepositChart = (): void => {
        var chartDom = document.getElementById("depositChart")!;
        var myChart = echarts.init(chartDom);
        var option = {
            title: {
                text: "充值统计",
            },
            tooltip: {},
            legend: {
                data: ["充值统计"],
            },
            xAxis: {
                data: depositData.value.xx,
            },
            yAxis: {},
            series: [
                {
                    name: "google",
                    type: "line",
                    data: depositData.value.yy,
                }
            ],
        };
        myChart.setOption(option);
    }

    const resetWithdrawChart = (): void => {
        var chartDom = document.getElementById("withdrawChart")!;
        var myChart = echarts.init(chartDom);
        var option = {
            title: {
                text: "提现统计",
            },
            tooltip: {},
            legend: {
                data: ["提现统计"],
            },
            xAxis: {
                data: withdrawData.value.xx,
            },
            yAxis: {},
            series: [
                {
                    name: "google",
                    type: "line",
                    data: withdrawData.value.yy,
                }
            ],
        };
        myChart.setOption(option);
    }

    const resetFlowsChart = (): void => {
        var chartDom = document.getElementById("flowChart")!;
        var myChart = echarts.init(chartDom);
        var option = {
            title: {
                text: "支出统计",
            },
            tooltip: {},
            legend: {
                data: ["转盘", "一元夺宝", "半价商品"],
            },
            xAxis: {
                data: flowsData.value.xx,
            },
            yAxis: {},
            series: [
                {
                    name: "转盘",
                    type: "line",
                    data: flowsData.value.gameSpinRewardYy,
                },
                {
                    name: "一元夺宝",
                    type: "line",
                    data: flowsData.value.activityTreasureHuntYy,
                },
                {
                    name: "半价商品",
                    type: "line",
                    data: flowsData.value.activityHotDealsYy,
                }
            ],
        };
        myChart.setOption(option);
    }


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
        form.value = {};
        proxy.resetForm(formRef);
    };
    /** 搜索按钮操作 */
    /** 搜索按钮操作 */
    const handleQuery = () => {
        getList();
    };
    /** 重置按钮操作 */
    const resetQuery = () => {
        queryParams.value = {
            type: 1,
            // @ts-ignore
            dt: [''+parseTime(new Date()).toString().substring(0, 10),''+parseTime(new Date()).toString().substring(0, 10)],
            // @ts-ignore
            date: parseTime(new Date()).toString().substring(0, 10)+'~'+parseTime(new Date()).toString().substring(0, 10),
        };
        proxy.resetForm(queryFormRef);
        handleQuery();
    };
    /** 新增按钮操作 */
    const handleAdd = () => {
        reset();
        title.value = "添加店铺";
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
        pageTableRef,
        cleanSelect,
        typeList
    };
};
