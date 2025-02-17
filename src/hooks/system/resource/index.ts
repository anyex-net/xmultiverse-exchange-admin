import { ElForm, ElTable } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance, nextTick, onMounted } from "vue";
import { listResource, getResource, addResource, delResource} from "@/api/system/resource";
export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<menu<menuForm,menuQueryParams,menuElTreeProps>>({
        showSearch: true,//显示搜索条件
        queryParams: { // 查询参数
            resName: '',
        },
        refreshTable: true, // 重新渲染表格状态
        loading: true,//遮罩层
        menuList: [],//菜单表格数据
        isExpandAll: false,//是否展开，默认全部折叠
        title: "", // 弹出层标题
        open: false,  // 是否显示弹出层
        form: {  // 表单参数
            id: '',//主键id
            parentId:'',//上级资源
            resCode: '',//资源编码
            resName: '',//资源名称
            resShortUrl:'',//资源短地址
            resUrl: '',//资源地址
            type:false,//类型（菜单0、权限1）
            icon: '',//图标
            resDest: '',//资源描述
            sortNum: '',//排序号
        },
        // 表单校验
        rules: {
            resCode: [
                { required: true, message: "资源编码不能为空", trigger: "blur" }
            ],
            resName: [
                { required: true, message: "资源名称不能为空", trigger: "blur" }
            ],
            sortNum: [
                { required: true, message: "排序不能为空", trigger: "blur" }
            ],
            resShortUrl: [
                { required: true, message: "资源短地址不能为空", trigger: "blur" }
            ],
            resUrl: [
                { required: true, message: "资源地址不能为空", trigger: "blur" }
            ],
            type: [
                { required: true, message: "类型不能为空", trigger: "blur" }
            ],
        },
        menuOptions: [], // 菜单树选项
        elTreeProps: {
            value: "id",
            label: "resName",
            children: "children",
        },
        showChooseIcon: false,
    })
    const queryRef = ref<InstanceType<typeof ElForm>>();
    const menuRef = ref<InstanceType<typeof ElForm>>();
    const iconSelectRef = ref();
    const { queryParams, showSearch, refreshTable, loading, menuList, isExpandAll, title, open, form, rules, menuOptions, elTreeProps, showChooseIcon } = toRefs(state);
    // 查询资源下拉树结构
    const getTreeselect = async() => {
        menuOptions.value = [];
     await listResource().then((response) => {
            if (response.code === 200) {
                const data = response.data;
                menuOptions.value=data;
                // const menu = { id: 1, resName: '主类目', children: [] };
                // menu.children = data;
                // menuOptions.value.push(menu);
            }
        })
    }
    // 查询资源列表数据
    const getList = async () => {
        loading.value = true;
        await listResource(queryParams.value).then((response) => {

            loading.value = false;
            if (response.code == 200) {
                menuList.value = response.data;
            }
        })
    };
    getList();

    // 取消按钮
    const cancel = () => {
        reset();
        open.value = false;
    };
    // 表单重置
    const reset = () => {
        form.value = {
            id: '',//主键id
            parentId:'',//上级资源
            resCode: '',//资源编码
            resName: '',//资源名称
            resShortUrl:'',//资源短地址
            resUrl: '',//资源地址
            type: false,//类型（菜单0、权限1）
            icon: '',//图标
            resDest: '',//资源描述
            sortNum: 0,//排序号
        };
        proxy.resetForm(menuRef)
    }
    //   展示下拉图标
    const showSelectIcon = () => {
        iconSelectRef.value?.reset();
        showChooseIcon.value = true;
    };
    // 选择图标
    const selected = (name: string) => {
        form.value.icon = name;
        showChooseIcon.value = false;
    }
    // 图标外层点击隐藏下拉列表
    const hideSelectIcon = () => {
        showChooseIcon.value = false;
    }
    // 搜索按钮操作
    const handleQuery = () => {
        getList();
    }
    // 重置按钮操作
    const resetQuery = () => {
        proxy.resetForm(queryRef);
        handleQuery();
    }
    // 新增按钮操作
    const handleAdd = (row: any) => {
        reset();
        if (row != null && row.id) {
            form.value.parentId = row.id
        } else {
            form.value.parentId = '';
        }
        getTreeselect();
        open.value = true;
        title.value = "添加资源";

    };
    /** 展开/折叠操作 */
    const toggleExpandAll = () => {
        refreshTable.value = false;
        isExpandAll.value = !isExpandAll.value;
        nextTick(() => {
            refreshTable.value = true;
        })
    };
    /** 修改按钮操作 */
    const handleUpdate = (row: any) => {
        reset();
        getTreeselect();
        getResource(row.id).then(res=>{
            if (res.code==200){
                form.value =res.data;
                open.value = true;
                title.value = "修改资源";
            }
        })

    };
    // 提交按钮
    const submitForm = async () => {
        await menuRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != '') {
                    addResource(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            handleQuery();
                        }
                    })
                } else {
                    addResource(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("新增成功");
                            open.value = false;
                            handleQuery();
                        }
                    })
                }
            }
        })
    };
    /** 删除按钮操作 */
    const handleDelete = (row: any) => {
      proxy.$modal.confirm('是否确认删除名称为'+row.resName+'的数据项?').then(()=>{
        return delResource(row.id)
      }).then((response:any)=>{
        if(response.code===200){
            proxy.$modal.msgSuccess("删除成功");
            getList();
        }
        if(response.code===2002){
            proxy.$modal.msgSuccess("存在子节点,请优先删除子节点");
            getList();
        }
      }).catch(()=>{ })
    };
    return { queryParams, showSearch, queryRef, resetQuery, handleQuery, handleAdd, toggleExpandAll, refreshTable, loading, menuList, isExpandAll, handleUpdate, handleDelete, title, open, menuRef, form, rules, menuOptions, elTreeProps, showChooseIcon, showSelectIcon, iconSelectRef, selected, hideSelectIcon, submitForm, cancel }
}
