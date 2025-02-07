import {
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  nextTick,
} from "vue";
// prettier-ignore
import {
      listconfigList,
  } from "@/api/openim/app/appConfig/appConfig";
import { ElForm, ElTable } from "element-plus";

export default () => {
  const { proxy } = getCurrentInstance() as any;
  const upload = ref<any>();
  const iconUpload = ref<any>();
  const state = reactive({
    // 遮罩层
    loading: false
  });

  const queryFormRef = ref<InstanceType<typeof ElForm>>();
  const formRef = ref<InstanceType<typeof ElForm>>();
  const pageTableRef = ref<InstanceType<typeof ElTable>>();
  const isShowTooltip = ref<boolean>(true);
  const configList:any = ref([])
  const {
    loading,
  } = toRefs(state);

  /** 查询列表 */
  const getList = () => {
    listconfigList({}).then((response) => {
              if (response.code === 200) {
                configList.value = response.data
              }
          });
  };
  onMounted(() => {
    getList();
  });
  const onMouseOver = (target: any) => {
    // 判断是否开启tooltip功能
    if (target.scrollWidth > target.clientWidth) {
      isShowTooltip.value = false;
    } else {
      isShowTooltip.value = true;
    }
  };
  return {
    loading,
    open,
    queryFormRef,
    formRef,
    getList,
    upload,
    isShowTooltip,
    onMouseOver,
    configList,
    iconUpload,
  };
};
