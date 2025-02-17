import { ref, reactive, toRefs, getCurrentInstance, onMounted } from "vue";
// prettier-ignore
import { listLogLogin, delLogLogin,cacheCleanAll,cacheCleanMybatis,cacheCleanSession} from "@/api/system/cache";
import { ElForm, ElTable } from "element-plus";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<operatelog<operatelogQueryParams>>({
        // 查询参数
        queryParams: {
            // current: 1,
            // size: 50,
            redisKey: '',
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
        //登录日志表格数据
        operateList: [],
        dateRange:[],//日期时间
    })
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const { queryParams, loading, ids, single, multiple, showSearch, total, operateList,dateRange} = toRefs(state);

    /** 查询缓存列表 */
    const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
        loading.value = true;
        // prettier-ignore
        listLogLogin(proxy.addDateRange(queryParams.value)).then((response:any) => {
            if (response.code === 200) {
                operateList.value=[];
                // operateList.value = response.data;
               Object.keys(response.data).forEach((key:any)=>{
                   var obj:any={
                       key:key,
                       value:response.data[key] as keyof typeof response.data
                   }
                   // @ts-ignore
                   operateList.value.push(obj);
               })
                // total.value = response.data.total;
                loading.value = false;
            }

        });
    };
    // 选择日期时间
    const dataTime=(e:any)=>{
        // queryParams.value.startDate=e[0];
        // queryParams.value.endDate=e[0];
    }


    /** 搜索按钮操作 */
    const handleQuery = () => {
        // queryParams.value.pageNum = 1;
        getList();
    };
    /** 重置按钮操作 */
    const resetQuery = () => {
        // queryParams.value.startDate='';
        // queryParams.value.endDate='';
        dateRange.value=[];
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
        const dictTypeIds = row.key;
        const query = {} as any
        query.value = {
            redisKey: dictTypeIds
        }
        proxy.setTableRowSelected(pageTableRef, row, true);
        // prettier-ignore
        proxy.$modal.confirm('是否确认删除缓存key为"' + dictTypeIds + '"的数据项?', "警告")
            .then(() => {
                return delLogLogin(query.value);
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
    //清楚所有缓存
    const handleCleanAll=()=>{
        proxy.$modal.confirm('是否确认清楚所有缓存?', "警告")
            .then(() => {
                return cacheCleanAll();
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("操作成功");
                }
            })
            .catch(() => {

            });
    };
    //清除mybatis缓存
    const handleCleanMybatis=()=>{
        proxy.$modal.confirm('是否确认清除mybatis缓存?', "警告")
            .then(() => {
                return cacheCleanMybatis();
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("操作成功");
                }
            })
            .catch(() => {

            });
    };
    //清除session缓存
    const handleCleanSession=()=>{
        proxy.$modal.confirm('是否确认清除session缓存?', "警告")
            .then(() => {
                return cacheCleanSession();
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("操作成功");
                }
            })
            .catch(() => {

            });
    }
    onMounted(() => {
        getList();

    });

    // prettier-ignore
    return {
        loading, single, multiple, showSearch, total, operateList,queryParams, queryFormRef, getList,  handleQuery, resetQuery, handleSelectionChange, handleDelete, pageTableRef,dateRange,dataTime,handleCleanAll,handleCleanMybatis,handleCleanSession
    };
};
