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
    listGroupMembers,
    addGroupmember,
    groupSetRole,
    memberForbidden,
    delGroupMember,
} from "@/api/openim/group";
import { userRegisterDefaultFriend } from "@/api/openim/register/registerDefaultFriends";
import { ElForm, ElTable, ElMessageBox } from "element-plus";
import { getSuffix, randomString } from "@/utils/dateTime";
import { useRoute } from "vue-router";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const upload = ref<any>();
    const iconUpload = ref<any>();
    const iconUpload1 = ref<any>();
    const route = useRoute();
    const state = reactive({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            groupID: "",
            keyword: "",
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
        // 商品品牌表格数据
        configList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {
            roleLevel: "",//群身份
            groupID: "",
            userID: "",
        },
        // 表单参数
        form1: {
            groupID: "",
            mutedSeconds:0,
            userID: "",
            status:1,
        },
        form2: {
            groupID: "",
            invitedUserIDs: [],
            reason: "",
        },
        // 表单校验
        rules: {},
        // 表单校验
        rules1: {
            "groupInfo.groupName": [
                {
                    required: true,
                    message: "群组名称不能为空",
                    trigger: "blur",
                },
            ],
        },
        uploadUrl: import.meta.env.VITE_upload_url,
        needList: [
            {
                id: 20,
                name: "普通群员",
            },
            {
                id: 60,
                name: "群管理员",
            },
            {
                id: 100,
                name: "群主",
            },

        ],//群身份
        lookList: [
            {
                id: 600,
                name: "10分钟",
            },
            {
                id: 3600,
                name: "1小时",
            },
            {
                id: 43200,
                name: "12小时",
            },
            {
                id: 86400,
                name: "1天",
            },
        ],//禁言
        ownerUserList: [],//群主
        adminUserList: [],//管理员
        queryParams1: {
            current: 1,
            size: 20,
            id: null,
        },
        userList: [],
        totalUser: 0,
        adminTableData: [],
        roleLevel: 0,//群身份

    });

    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const formRef1 = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const isShowTooltip = ref<boolean>(true);
    const showListFriends = ref([]);
    const title2 = ref<any>("关系链");
    const open2 = ref<boolean>(false);
    const open3 = ref<boolean>(false);
    const open4 = ref<boolean>(false);
    const setOpen = ref<boolean>(false);
    const total2 = ref(0);
    const queryId = ref({
        current: 1,
        size: 50,
        userId: "",
    });
    const adminTable = ref<InstanceType<typeof ElTable>>();
    const adminTable1 = ref<InstanceType<typeof ElTable>>();
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
        needList,
        lookList,
        ownerUserList,
        adminUserList,
        queryParams1,
        userList,
        totalUser,
        adminTableData,
        form1,
        rules1,
        form2,
        roleLevel,
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

        // @ts-ignore
        queryParams.value.groupID = route.query.groupID;
        loading.value = true;
        // prettier-ignore
        listGroupMembers(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data.records;
                total.value = response.data.total;
                loading.value = false;
            }

        });
    };

    const getUser = () => {
        loading.value = true;
        userRegisterDefaultFriend(queryParams1.value).then(res => {
            if (res.code == 200) {
                loading.value = false;
                userList.value = res.data.records;
                totalUser.value = res.data.total;
                if (open3.value) {
                    userList.value.forEach((item: any) => {
                        if (configList.value.findIndex((v: any) => v.userID == item.userId) >= 0) {
                            item.checked = false;
                        } else {
                            item.checked = true;
                        }
                    });
                }

            }
        });
    };
    const getSearch = () => {
        queryParams1.value.current = 1;
        getUser();
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
    // 取消按钮
    const cancel2 = () => {
        open3.value = false;
    };
    // 取消按钮
    const setCancel = () => {
        setOpen.value = false;
    };
    // 表单重置
    const reset = () => {
        form.value = {
            roleLevel: "",//群身份
            groupID: "",
            userID: "",
        };
        ownerUserList.value = [];
        adminUserList.value = [];
        form2.value = {
            groupID: "",
            invitedUserIDs: [],
            reason: "",
        };
        if (userList.value.length != 0) {
            adminTable.value!.clearSelection();
        }
        adminTableData.value = [];
        proxy.resetForm(formRef);
        // 表单参数
        form1.value = {
            groupID: "",
            mutedSeconds:0,
            userID: "",
            status:1,
        };
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
        open3.value = true;
        getUser();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: any) => {
        ids.value = selection.map((item: any) => item.id);
        single.value = selection.length != 1;
        multiple.value = !selection.length;
    };

    //全选 群成员
    const adminselectAll = (selection: any) => {
        adminTableData.value = selection;
        nextTick(() => {
            adminTableData.value.forEach((item: any) => {
                adminTable1.value!.toggleRowSelection(item, true);
            });
        });
    };
    //管理员
    const adminSelectionChange = (selection: any) => {
        adminTableData.value = selection;
        nextTick(() => {
            adminTableData.value.forEach((item: any) => {
                adminTable1.value!.toggleRowSelection(item, true);
            });
        });

    };
    //已选 群成员
    const adminselectAll1 = (selection: any) => {
        adminTableData.value = selection;
        nextTick(() => {
            userList.value.forEach((item: any, index) => {
                if (adminTableData.value.findIndex((v: any) => v.id == item.id) >= 0) {
                    adminTable.value!.toggleRowSelection(item, true);

                } else {
                    adminTable.value!.clearSelection();
                }
            });
        });
    };
    // 已选 群成员
    const adminSelectionChange1 = (selection: any) => {
        adminTableData.value = selection;
        nextTick(() => {
            userList.value.forEach((item: any, index) => {
                if (adminTableData.value.findIndex((v: any) => v.id == item.id) >= 0) {
                    adminTable.value!.toggleRowSelection(item, true);
                } else {
                    adminTable.value!.toggleRowSelection(item, false);
                }
            });
        });

    };

    const getRowKeys = (row: any) => {
        return row.id;
    };

    // @ts-ignore
    const tableRowClassName1 = ({ row }) => {
        const checkIdList = adminTableData.value.map((item: any) => item.id);
        if (checkIdList.includes(row.id)) {
            return {
                backgroundColor: "#E6F7FF",
            };
        }
    };

    //选择管理员 确定按钮
    const submitForm2 = () => {
        if (adminTableData.value.length == 0) {
            proxy.$modal.msgError("请选择群成员");
        } else {

            form2.value.groupID = queryParams.value.groupID;
            form2.value.invitedUserIDs = [];
            adminTableData.value.forEach((v: any) => {
                // @ts-ignore
                form2.value.invitedUserIDs.push(v.userId);
            });
            addGroupmember(form2.value).then((response) => {
                if (response.code === 200) {
                    proxy.$modal.msgSuccess("操作成功");
                    open3.value = false;
                    getList();
                }
            });
        }

    };
    //判断复选框禁用 管理员
    const isCheckboxDisabled1 = (row: any) => {
        return row.checked;
    };

    /** 删除群组操作 */
    const deleteGroup1 = (row: any) => {
        ElMessageBox.confirm("确定要移除该成员吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                var obj={
                    groupID:row.groupID,
                    kickedUserIDs:[row.userID]
                }
                delGroupMember(obj).then(
                    (response: any) => {
                        if (response.code == 200) {
                            proxy.$modal.msgSuccess("操作成功");
                            getList();
                        }
                    },
                );
            })
            .catch(() => {
            });
    };
    //群聊设置
    const forbiddenSpeech = (row: any) => {
        reset();
        setOpen.value = true;
        form1.value.groupID=row.groupID;
        form1.value.userID=row.userID;
        form1.value.status=1;
    };
    //      设置群身份
    const groupIdentity = (row: any) => {
        reset();
        open.value = true;
        form.value.roleLevel = row.roleLevel;
        roleLevel.value = row.roleLevel;
        form.value.groupID = row.groupID;
        form.value.userID = row.userID;
    };
    /** 全体禁言操作 */
    const disAll = (row: any) => {
        form1.value.userID=row.userID;
        form1.value.groupID=row.groupID;
        form1.value.status=0;
        form1.value.mutedSeconds=0;

        ElMessageBox.confirm("确定要取消禁言吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                memberForbidden(form1.value).then((response: any) => {
                    if (response.code == 200) {
                        proxy.$modal.msgSuccess("操作成功");
                        getList();
                    }
                });
            })
            .catch(() => {
            });
    };
    /** 查询好友操作 */
    const findUserFriend = (row: any) => {
        queryId.value.userId = row.userId;
    };
    /** 提交按钮 */
    const submitForm = async () => {
        groupSetRole(form.value).then((response) => {
            if (response.code === 200) {
                proxy.$modal.msgSuccess("操作成功");
                open.value = false;
                getList();
            }
        });
    };
    /** 禁言提交按钮 */
    const setSubmitForm = async () => {
        if ( form1.value.mutedSeconds<60){
            proxy.$modal.msgError("请设置至少60秒禁言");
        }else{
            memberForbidden(form1.value).then((response) => {
                if (response.code === 200) {
                    proxy.$modal.msgSuccess("操作成功");
                    setOpen.value = false;
                    getList();
                }
            });
        }

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
        showListFriends,
        loading,
        single,
        multiple,
        open,
        open2,
        showSearch,
        total,
        total2,
        configList,
        title,
        title2,
        queryParams,
        queryFormRef,
        form,
        disAll,
        formRef,
        rules,
        getList,
        cancel,
        cancel2,
        reset,
        handleQuery,
        resetQuery,
        handleAdd,
        queryId,
        findUserFriend,
        handleSelectionChange,
        submitForm,
        pageTableRef,
        cleanSelect,
        uploadUrl,
        upload,
        isShowTooltip,
        onMouseOver,
        iconUpload,
        deleteGroup1,
        needList,
        lookList,
        ownerUserList,
        adminUserList,
        queryParams1,
        userList,
        totalUser,
        getSearch,
        getRowKeys,
        getUser,
        open3,
        open4,
        adminSelectionChange,
        adminselectAll,
        adminTableData,
        adminselectAll1,
        adminSelectionChange1,
        adminTable,
        adminTable1,
        submitForm2,
        isCheckboxDisabled1,
        tableRowClassName1,
        setOpen,
        setCancel,
        setSubmitForm,
        forbiddenSpeech,
        form1,
        iconUpload1,
        rules1,
        formRef1,
        groupIdentity,
        form2,
        roleLevel,
    };
};
