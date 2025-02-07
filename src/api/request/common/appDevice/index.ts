import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
// prettier-ignore
import { listAppDevice, delAppDevice } from "@/api/common/appDevice";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<operatelog<regionQueryParams>>({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            deviceName: "",
            // startDate:'',
            // endDate:'',
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
        //app设备表格数据
        operateList: [],
        dateRange: [],//日期时间
    });
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const {
        queryParams,
        loading,
        ids,
        single,
        multiple,
        showSearch,
        total,
        operateList,
        dateRange,
    } = toRefs(state);

    /** 查询app设备列表 */
    const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
        loading.value = true;
        // prettier-ignore
        listAppDevice(proxy.addDateRange(queryParams.value)).then((response) => {
            if (response.code === 200) {
                operateList.value = response.data.records;
                total.value = response.data.total;
                loading.value = false;
            }

        });
    };
    // 选择日期时间
    const dataTime = (e: any) => {
        // queryParams.value.startDate=e[0];
        // queryParams.value.endDate=e[0];
    };


    /** 搜索按钮操作 */
    const handleQuery = () => {
        queryParams.value.current = 1;
        getList();
    };
    /** 重置按钮操作 */
    const resetQuery = () => {
        // queryParams.value.startDate='';
        // queryParams.value.endDate='';
        dateRange.value = [];
        proxy.resetForm(queryFormRef);
        handleQuery();
    };

    // 多选框选中数据
    const handleSelectionChange = (selection: any) => {
        ids.value = selection.map((item: any) => item.id);
        single.value = selection.length != 1;
        multiple.value = !selection.length;
    };
    /** 删除按钮操作 */
    const handleDelete = (row: any) => {
        const dictTypeIds = row.id || ids.value;
        const query = {} as any;
        if (row.id == undefined) {
            query.value = {
                ids: isStrings(dictTypeIds),
            };
        } else {
            query.value = {
                ids: dictTypeIds,
            };
        }
        proxy.setTableRowSelected(pageTableRef, row, true);
        // prettier-ignore
        proxy.$modal.confirm("是否确认删除app设备编号为\"" + dictTypeIds + "\"的数据项?", "警告")
            .then(() => {
                return delAppDevice(query.value);
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("删除成功");
                }
            })
            .catch(() => {

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
        showSearch,
        total,
        operateList,
        queryParams,
        queryFormRef,
        getList,
        handleQuery,
        resetQuery,
        handleSelectionChange,
        handleDelete,
        pageTableRef,
        dateRange,
        dataTime,
    };
};
