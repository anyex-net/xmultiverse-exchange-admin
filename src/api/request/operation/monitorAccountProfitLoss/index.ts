import {ref, reactive, toRefs, getCurrentInstance, onMounted} from "vue";
// prettier-ignore
import {listAccountProfitLoss,statisticsAccountProfitLoss} from "@/api/operation/monitorAccountProfitLoss";
import {ElForm, ElTable} from "element-plus";

export default () => {
    const {proxy} = getCurrentInstance() as any;
    const state = reactive({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            id: ""
        },
        statisticsModel:{
                id: "",
                balance: "",
                frozenBal: "",
                sumDeposit: "",
                sumWithDraw: "",
                sumAdjustAdd: "",
                sumAdjustSub: "",
                updateTime: "",
                profitLoss: ""
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
                id: "1",
                name: "正常",
            },
            {
                id: "0",
                name: "异常",
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
        statisticsModel
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
        listAccountProfitLoss(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data.records;
                total.value = response.data.total;
                loading.value = false;
            }

        });
    };

    const getStatistics = () => {
        // prettier-ignore
        statisticsAccountProfitLoss().then((response) => {
            if (response.code === 200) {
                // @ts-ignore
                statisticsModel.value = response.data;
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
        form.value = {};
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
        getStatistics();
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
        typeList,
        statisticsModel
    };
};
