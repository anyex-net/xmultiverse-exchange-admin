import {ref, reactive, toRefs, getCurrentInstance, onMounted} from "vue";
// prettier-ignore
import {listRegister, listAppActivation, listSwitchRate} from "@/api/operation/accountStatistics";
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
        registerData: {
            xx: [],
            googleYy: [],
            transsionYy: [],
            luckyboxYy: []
        },
        activationData: {
            xx: [],
            googleYy: [],
            transsionYy: [],
            luckyboxYy: []
        },
        switchRateData: {
            xx: [],
            yy: [],
            googleYy: [],
            transsionYy: [],
            luckyboxYy: []
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
        registerData,
        activationData,
        switchRateData,
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
        listRegister(queryParams.value).then((response: any) => {
            if (response.code === 200) {
                registerData.value = response.data;
                resetRegisterChart();
            }
        });

        listAppActivation(queryParams.value).then((response: any) => {
            if (response.code === 200) {
                activationData.value = response.data;
                resetActivationChart();
            }
        });

        listSwitchRate(queryParams.value).then((response: any) => {
            if (response.code === 200) {
                switchRateData.value = response.data;
                resetSwitchChart();
            }
        });
    };

    const resetRegisterChart = (): void => {
        var chartDom = document.getElementById("registerChart")!;
        var myChart = echarts.init(chartDom);
        var option = {
            title: {
                text: "用户注册统计",
            },
            tooltip: {},
            legend: {
                data: ["google", "transsion", "luckybox"],
            },
            xAxis: {
                data: registerData.value.xx,
            },
            yAxis: {},
            series: [
                {
                    name: "google",
                    type: "line",
                    data: registerData.value.googleYy,
                }, {
                    name: "transsion",
                    type: "line",
                    data: registerData.value.transsionYy,
                },
                , {
                    name: "luckybox",
                    type: "line",
                    data: registerData.value.luckyboxYy,
                },
            ],
        };
        myChart.setOption(option);
    }


    const resetActivationChart = (): void => {
        var chartDom = document.getElementById("activationChart")!;
        var myChart = echarts.init(chartDom);
        var option = {
            title: {
                text: "安装激活统计",
            },
            tooltip: {},
            legend: {
                data: ["google", "transsion", "luckybox"],
            },
            xAxis: {
                data: activationData.value.xx,
            },
            yAxis: {},
            series: [
                {
                    name: "google",
                    type: "line",
                    data: activationData.value.googleYy,
                }, {
                    name: "transsion",
                    type: "line",
                    data: activationData.value.transsionYy,
                },
                , {
                    name: "luckybox",
                    type: "line",
                    data: activationData.value.luckyboxYy,
                },
            ],
        };
        myChart.setOption(option);
    }

    const resetSwitchChart = (): void => {
        var chartDom = document.getElementById("switchRateChart")!;
        var myChart = echarts.init(chartDom);
        let series_v;
        let legend_v;
        if (queryParams.value.type === 1) {
            series_v = [
                {
                    name: "google",
                    type: "bar",
                    data: switchRateData.value.xx,
                }
            ];
            legend_v = {
                data: [],
            };
        } else {
            series_v = [
                {
                    name: "google",
                    type: "bar",
                    data: switchRateData.value.googleYy,
                }, {
                    name: "transsion",
                    type: "bar",
                    data: switchRateData.value.transsionYy,
                },
                , {
                    name: "luckybox",
                    type: "bar",
                    data: switchRateData.value.luckyboxYy,
                },
            ];
           legend_v =  { data:["google", "transsion", "luckybox"]};
        }
        var option = {
            title: {
                text: "转化率统计",
            },
            tooltip: {},
            legend: legend_v,
            xAxis: {
                data: switchRateData.value.xx,
            },
            yAxis: {},
            series: series_v,
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
