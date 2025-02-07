import { ref, reactive, toRefs, getCurrentInstance, onMounted, nextTick } from "vue";
// prettier-ignore
import { listSnsActivity, getSnsActivity, delSnsActivity, saveSnsActivity } from "@/api/social/snsActivity";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
import { uploadPolicy } from "@/api/business/luckybox/goods/goodsBrand";
import { getSuffix, randomString } from "@/utils/dateTime";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const upload = ref<any>();
    const state = reactive({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            title: null,
            content: null,
            imgurl: null,
            activitytag: null,
            openurl: null,
            status: null,
            createtime: null,
            updatetime: null,
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
        title1:"",
        open1:false,
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {
            id:null,
            title: null,
            content: null,
            imgUrl: null,
            activityTag: null,
            openUrl: null,
            status: 0,
            createTime:null,
            remark:null,
            updateTime:null,
        },
        // 表单校验
        rules: {
            title: [
                { required: true, message: "标题不能为空", trigger: "blur" },
            ],
            content: [
                { required: true, message: "内容不能为空", trigger: "blur" },
            ],
            imgUrl: [
                { required: true, message: "主图地址不能为空", trigger: "blur" },
            ],
            activityTag: [
                { required: true, message: "活动标签不能为空", trigger: "blur" },
            ],
            status: [
                { required: true, message: "状态不能为空", trigger: "change" },
            ],
        },
        uploadParams: {
            key: "",
            name: "",
            policy: "",
            OSSAccessKeyId: "",
            success_action_status: 200,
            signature: "",
        },
        uploadUrl: import.meta.env.VITE_upload_url,
        statusList:[
            {
                id:0,
                name:'未发布'
            },
            {
                id:1,
                name:'已发布'
            }
        ]
    });
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const isShowTooltip = ref<boolean>(true);

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
        uploadParams,
        uploadUrl,
        statusList,
        title1,
        open1
    } = toRefs(state);

    /** 查询列表 */
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
        listSnsActivity(queryParams.value).then((response) => {
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
            title: null,
            content: null,
            imgUrl: null,
            activityTag: null,
            openUrl: null,
            status:0,
            createTime:null,
            remark:null,
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
        title.value = "添加";
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
        const configId = row.id || ids.value;
        getSnsActivity(configId).then((response) => {
            form.value = response.data;
            open.value = true;
            title.value = "修改";
            proxy.setTableRowSelected(pageTableRef, row, true);
        });
    };
    //查看详情
    const handleDetails=(row: any)=>{
        reset();
        const configId = row.id || ids.value;
        getSnsActivity(configId).then((response) => {
            form.value = response.data;
            open1.value = true;
            title1.value = "详情";
            proxy.setTableRowSelected(pageTableRef, row, true);
        });
    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != null) {
                    saveSnsActivity(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();
                        }
                    });
                } else {
                    saveSnsActivity(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("新增成功");
                            open.value = false;
                            getList();
                        }
                    });
                }
            }
        });
    };
    /** 删除按钮操作 */
    const handleDelete = (row: any) => {
        const configIds = row.id || ids.value;
        const query = {} as any;
        if (row.id == undefined) {
            query.value = {
                ids: isStrings(configIds),
            };
        } else {
            query.value = {
                ids: configIds,
            };
        }
        proxy.setTableRowSelected(pageTableRef, row, true);
        // prettier-ignore
        proxy.$modal.confirm("是否确认删除编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delSnsActivity(query.value);
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("删除成功");
                }
            })
            .catch(() => {
                cleanSelect();
            });
    };
    const onMouseOver = (target: any) => {
        // 判断是否开启tooltip功能
        if (target.scrollWidth > target.clientWidth) {
            isShowTooltip.value = false;
        } else {
            isShowTooltip.value = true;
        }
    };
    //图片
    const handleUpdateForm = () => {
        uploadPolicy().then((res: any) => {
            if (res.code == 200) {
                uploadParams.value.policy = res.data.policy;
                uploadParams.value.signature = res.data.signature;
                uploadParams.value.OSSAccessKeyId = res.data.accessid;
                uploadUrl.value = res.data.host;
                uploadParams.value.key = "wivpal/" + randomString(10) + getSuffix(uploadParams.value.name);
                nextTick(() => {
                    upload.value.submit();
                    setTimeout(() => {
                        // @ts-ignore
                        form.value.imgUrl =uploadUrl.value+uploadParams.value.key;
                    }, 1000);

                    if (upload.value) {
                        upload.value.clearFiles();
                    }
                });

            }
        }).catch();
    };
    const doChange = (file: any) => {
        uploadParams.value.name = file.raw.name;
        handleUpdateForm();

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
        submitForm,
        handleDelete,
        pageTableRef,
        cleanSelect,
        isShowTooltip,
        onMouseOver,
        uploadParams,
        doChange,
        uploadUrl,
        upload,
        handleUpdateForm,
        statusList,
        handleDetails,
        title1,
        open1
    };
};

