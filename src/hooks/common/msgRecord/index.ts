import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
// prettier-ignore
import { listMsgRecord, delMsgRecord } from "@/api/common/msgRecord";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<operatelog<msgRecordQueryParams>>({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            object: "",
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
        //消息记录表格数据
        operateList: [],
        dateRange: [],//日期时间
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
    });
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const isShowTooltip=ref<boolean>(true);
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
        typeList,
    } = toRefs(state);

    /** 查询消息记录列表 */
    const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
        loading.value = true;
        // prettier-ignore
        listMsgRecord(proxy.addDateRange(queryParams.value)).then((response) => {
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
        proxy.$modal.confirm("是否确认删除消息记录编号为\"" + dictTypeIds + "\"的数据项?", "警告")
            .then(() => {
                return delMsgRecord(query.value);
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
    const onMouseOver=(target: any)=>{
        // 判断是否开启tooltip功能
        if (target.scrollWidth > target.clientWidth) {
            isShowTooltip.value = false;
        } else {
            isShowTooltip.value = true;
        }
    }
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
        typeList,
        isShowTooltip,
        onMouseOver,
    };
};
