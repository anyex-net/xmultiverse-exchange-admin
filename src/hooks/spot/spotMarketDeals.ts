import { ElForm, ElTable,ElMessage } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
import {
    listDatas,
} from "@/api/spot/spotMarketDeals";
import { formDefault, searchDefault } from "@/data/fund/balances";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
        form: JSON.parse(JSON.stringify(formDefault)),
        forms: [
            {
                title: "id",
                name: "id",
            },
            {
                title: "方向",
                name: "type",
            },
            {
                title:"价格",
                name: "price"
            },
            {
                title:"数量",
                name: "amount"
            },
            {
                title: "时间",
                name: "time"
            }],
        queryParams: {
            current: 1,
            size: 10,
            market: "BIEXBCH",
            lastId: 1,
            limit: 10
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
        forms,
    } = toRefs(state);

    const cleanSelect = () => {
        pageTableRef.value?.clearSelection();
    };

    // 转换为目标格式
    const formattedRes = (res:any,forms:any) => {
        if (!forms || typeof forms[Symbol.iterator] !== 'function') {
            forms = []; // 或者根据具体情况设置其他默认值
        }
        return Object.entries(res).map(([, values]) => {
            let result = {
            };

            // 根据forms表单里的字段添加属性
            for (let form of forms) {
                if (form.name !== undefined && values[form.name] !== undefined) {
                    result[form.name] = values[form.name];
                }
            }
            // console.log(JSON.stringify(forms,null,4))
            return result;
        });
    }
    // 查询用户列表数据
    const getList = async () => {
        if (!queryParams.value.market) {
            ElMessage.error('交易对为必填项，请输入后重试');
            return; // 停止函数执行
        }
        if (!queryParams.value.limit) {
            ElMessage.error('数量限制为必填项，请输入后重试');
            return; // 停止函数执行
        }
        if (!queryParams.value.lastId) {
            ElMessage.error('最后ID为必填项，请输入后重试');
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
                    const data = formattedRes(res,state.forms)
                    // console.log(JSON.stringify(data, null, 4));
                    dataList.value = data.map((i: any) => ({
                        ...i,
                        time: i.time
                            ? new Date(+i.time*1000).toLocaleString()
                            : "--",
                        type: i.type == 'buy' ? '买':'卖'
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
