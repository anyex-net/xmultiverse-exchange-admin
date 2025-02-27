import { ElForm, ElTable } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
import {
    listDatas
} from "@/api/spot/spotAssetList";
import { isStrings } from "@/utils/validate";
import { formDefault, searchDefault } from "@/data/fund/balances";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
        form: JSON.parse(JSON.stringify(formDefault)),
        forms: [
            {
            title: '币种名称',
            name: 'name'
        },
            {
                title: '币种精度',
                name: 'prec'
            }],
        queryParams: {
            current: 1,
            size: 10,
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
        isShowBtn:true
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
        forms
    } = toRefs(state);

    const cleanSelect = () => {
        pageTableRef.value?.clearSelection();
    };

    // 查询用户列表数据
    const getList = async () => {
        loading.value = true;
        const obj = JSON.parse(JSON.stringify(queryParams.value));
        delete obj.current;
        delete obj.size;
        await
            listDatas(obj).then((response: any) => {
            loading.value = false;
            if (response.code == 200) {
                dataList.value = response.data.result.map((i: any) => ({
                    ...i,
                    updateTime: i.updateTime
                        ? new Date(+i.updateTime).toLocaleString()
                        : "--",
                }));
                total.value = response.data.total;
            }
        });
    };
    getList();

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
    // 新增按钮操作
    const handleAdd = () => {
        reset();
        open.value = true;
        title.value = "添加";
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
        handleAdd,
        forms
    };
};
