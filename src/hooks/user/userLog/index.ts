import { ElForm, ElTable } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
import {
  listData,
  getData,
} from "@/api/user/userLog";
import { formDefault, searchDefault } from "@/data/user/userCertKyc";

export default () => {
  const { proxy } = getCurrentInstance() as any;
  const state = reactive({
    form: JSON.parse(JSON.stringify(formDefault)),
    queryParams: {
      current: 1,
      size: 10,
      ...searchDefault,
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
    isShowBtn:true,
    uploadUrl: import.meta.env.VITE_upload_url,
  });
  const queryRef = ref<InstanceType<typeof ElForm>>();
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
    uploadUrl
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
    await listData(obj).then((response: any) => {
      loading.value = false;
      if (response.code == 200) {
        dataList.value = response.data.records.map((i: any) => ({
          ...i,
          createTime: new Date(+i.createTime).toLocaleString(),
          updateTime: i.updateTime
            ? new Date(+i.updateTime).toLocaleString()
            : "--",
        }));
        total.value = response.data.total;
      }
    });
  };
  getList();
  //   多选框选中数据
  const handleSelectionChange = (selection: any) => {
    ids.value = selection.map((item: any) => item.id);
    multiple.value = !selection.length;
    single.value = selection.length != 1;
  };

  // 搜索按钮操作
  const handleQuery = () => {
    getList();
  };
  // 重置按钮操作
  const resetQuery = () => {
    proxy.resetForm(queryRef);
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
  /** 详情页 */
  const handleShowDetail = (row: any) => {
    reset();
    const configId = row.id || ids.value;
    getData(configId).then((response: any) => {
      form.value = response.data;
      open.value = true;
      title.value = "详情";
      isShowBtn.value = false;
      proxy.setTableRowSelected(pageTableRef, row, true);
    });
  };

  return {
    form,
    queryParams,
    queryRef,
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
    handleSelectionChange,
    handleShowDetail,
    isShowBtn,
    uploadUrl
  };
};
