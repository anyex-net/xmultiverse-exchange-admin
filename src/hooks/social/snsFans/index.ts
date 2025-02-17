import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
// prettier-ignore
import { listSnsFans ,getSnsFans,delSnsFans} from "@/api/social/snsFans";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            followerUserId: null,
            userId:null
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
        form: {
            id:null,
            userId:null,
            followerUserId:null,
            remark:null,
            createTime:null,
            updateTime:null,
        },
        // 表单校验
        rules: {
        },
        uploadUrl: import.meta.env.VITE_upload_url,

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
        uploadUrl,
    } = toRefs(state);

    /** 查询参数列表 */
    const getList = () => { for (let key in queryParams.value) {
        if (queryParams.value.hasOwnProperty(key)) {
            if (queryParams.value[key] === "") {
                queryParams.value[key] = null;
            }
        }
    }
        loading.value = true;
        // prettier-ignore
        listSnsFans(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data.records;
                total.value = response.data.total;
                loading.value = false;
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
        form.value = {
            id:null,
            userId:null,
            followerUserId:null,
            remark:null,
            createTime:null,
            updateTime:null,
        };
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
        getSnsFans(row.id).then((res:any)=>{
            if (res.code==200){
                form.value=res.data;
            }
        })
        open.value = true;
    };
    /** 删除按钮操作 */
    const handleDelete = (row: any) => {
        // 设置当前被选中
        proxy.setTableRowSelected(pageTableRef, row, true);
        const arrIds = row.id || ids.value;
        proxy.$modal.confirm('是否确认删除id为' + arrIds + '的数据项?').then(() => {
            const query = {} as any
            if (row.id == undefined) {
                query.value = {
                    ids: isStrings(arrIds)
                }
            } else {
                query.value = {
                    ids: arrIds
                }
            }
            return delSnsFans(query.value)
        }).then((response: any) => {
            if (response.code === 200) {
                proxy.$modal.msgSuccess("删除成功");
                getList();
            }

        }).catch(() => {
            // proxy.setTableRowSelected(pageTableRef, row, false);
            pageTableRef.value!.clearSelection()
        })
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
        uploadUrl,
        handleDelete,
    };
};
