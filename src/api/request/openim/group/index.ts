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
    listGroup,
    getGroup,
    updateGroup,
    addGroup,
    delGroup,
    allForbidden,
    uploadPolicy,
} from "@/api/openim/group";
import { userRegisterDefaultFriend } from "@/api/openim/register/registerDefaultFriends";
import { ElForm, ElTable, ElMessageBox } from "element-plus";
import { isStrings } from "@/utils/validate";
import { getSuffix, randomString } from "@/utils/dateTime";
import { useRouter } from "vue-router";
export default () => {
    const { proxy } = getCurrentInstance() as any;
    const upload = ref<any>();
    const iconUpload = ref<any>();
    const iconUpload1 = ref<any>();
    const router = useRouter();
    const state = reactive({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            groupID: "",
            groupName: "",
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
            adminUserIDs: [],
            groupInfo: {
                applyMemberFriend: 0,
                faceURL: "",
                groupName: null,
                groupType: 2,
                introduction: null,
                lookMemberInfo: 0,
                needVerification: 1,
                notification: null,
            },
            memberUserIDs: [],
            ownerUserID: null,
        },
        // 表单参数
        form1: {
            groupInfoForSet: {
                applyMemberFriend: 0,
                faceURL:'',
                groupID: null,
                groupName: null,
                introduction: null,
                lookMemberInfo: 0,
                needVerification: 1,
                notification: null,
            },
        },
        // 表单校验
        rules: {

            "groupInfo.groupName": [
                {
                    required: true,
                    message: "群组名称不能为空",
                    trigger: "blur",
                },
            ],
            ownerUserID: [
                {
                    required: true,
                    message: "群主不能为空",
                    trigger: "blur",
                },
            ],
            memberUserIDs: [
                {
                    required: true,
                    message: "群成员不能为空",
                    trigger: "blur",
                },
            ],
        },
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
        // 上传参数
        uploadParams: {
            key: "",
            name: "",
            policy: "",
            OSSAccessKeyId: "",
            success_action_status: 200,
            signature: "",
        },
        uploadUrl: import.meta.env.VITE_upload_url,
        needList: [
            {
                id: 0,
                name: "群成员邀请无需验证",
            },
            {
                id: 1,
                name: "需要发送验证消息",
            },
            {
                id: 2,
                name: "允许所有人加群",
            },
        ],//群验证
        applyList: [
            {
                id: 0,
                name: "允许群内添加好友",
            },
            {
                id: 1,
                name: "不允许群内添加好友",
            },
        ],//添加好友
        lookList: [
            {
                id: 0,
                name: "允许查看群成员资料",
            },
            {
                id: 1,
                name: "不允许查看群成员资料",
            },
        ],//查看资料
        ownerUserList: [],//群主
        adminUserList: [],//管理员
        memberUserList: [],//群成员
        queryParams1: {
            current: 1,
            size: 20,
            id: null,
        },
        userList: [],
        totalUser: 0,
        secondaryTableData: [],
        adminTableData: [],
        memberTableData: [],
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
    const mutipleTable = ref<InstanceType<typeof ElTable>>();
    const mutipleTable1 = ref<InstanceType<typeof ElTable>>();
    const adminTable = ref<InstanceType<typeof ElTable>>();
    const adminTable1 = ref<InstanceType<typeof ElTable>>();
    const memberTable = ref<InstanceType<typeof ElTable>>();
    const memberTable1 = ref<InstanceType<typeof ElTable>>();
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
        needList,
        applyList,
        lookList,
        ownerUserList,
        adminUserList,
        memberUserList,
        queryParams1,
        userList,
        totalUser,
        secondaryTableData,
        adminTableData,
        memberTableData,
        form1,
        rules1
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
        listGroup(queryParams.value).then((response) => {
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
                if (open2.value) {
                    var arr = [...adminUserList.value, ...memberUserList.value];
                    userList.value.forEach((item: any) => {
                        if (arr.findIndex((v: any) => v.id == item.id) >= 0) {
                            item.checked = false;
                        } else {
                            item.checked = true;
                        }
                    });
                }
                if (open3.value) {
                    var arr = [...ownerUserList.value, ...memberUserList.value];
                    userList.value.forEach((item: any) => {
                        if (arr.findIndex((v: any) => v.id == item.id) >= 0) {
                            item.checked = false;
                        } else {
                            item.checked = true;
                        }
                    });
                }
                if (open4.value) {
                    var arr = [...ownerUserList.value, ...adminUserList.value];
                    userList.value.forEach((item: any) => {
                        if (arr.findIndex((v: any) => v.id == item.id) >= 0) {
                            item.checked = false;
                        } else {
                            item.checked = true;
                        }
                    });
                }
            }
        });
    };
    // 选择群主
    const getOwner = () => {
        open2.value = true;
        getUser();

    };
    // 选择群主
    const getAdminUser = () => {
        open3.value = true;
        getUser();
    };
    const getMemberUser = () => {
        open4.value = true;
        getUser();
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
    const cancel1 = () => {
        open2.value = false;
    };
    // 取消按钮
    const cancel2 = () => {
        open3.value = false;
    };
    // 取消按钮
    const cancel3 = () => {
        open4.value = false;
    };
    // 取消按钮
    const setCancel = () => {
        setOpen.value = false;
    };
    // 表单重置
    const reset = () => {
        form.value = {
            adminUserIDs: [],
            groupInfo: {
                applyMemberFriend: 0,
                faceURL: "",
                groupName: null,
                groupType: 2,
                introduction: null,
                lookMemberInfo: 0,
                needVerification: 1,
                notification: null,
            },
            memberUserIDs: [],
            ownerUserID: null,

        };
        ownerUserList.value = [];
        adminUserList.value = [];
        memberUserList.value = [];
        secondaryTableData.value = [];
        adminTableData.value = [];
        memberTableData.value = [];
        if (userList.value.length != 0) {
            mutipleTable.value!.clearSelection();
            adminTable.value!.clearSelection();
            memberTable.value!.clearSelection();
        }
        proxy.resetForm(formRef);
    };
    //重置表单
    const reset1 = () => {
        // 表单参数
        form1.value = {
            groupInfoForSet: {
                applyMemberFriend: 0,
                faceURL: '',
                groupID: null,
                groupName: null,
                introduction: null,
                lookMemberInfo: 0,
                needVerification: 1,
                notification: null,
            },
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
        title.value = "新建群组";
        open.value = true;
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: any) => {
        ids.value = selection.map((item: any) => item.id);
        single.value = selection.length != 1;
        multiple.value = !selection.length;
    };
    //全选
    const selectAll = (selection: any) => {
        secondaryTableData.value = selection;
    };
    const handleSelectionChange1 = (selection: any) => {
        secondaryTableData.value = [];
        mutipleTable1.value!.clearSelection();
        selection.map((row: any, index: any) => {
            if (selection.length <= 1) {
                // @ts-ignore
                secondaryTableData.value.push(row);
                return;
            }
            mutipleTable.value!.toggleRowSelection(row, false);
            if (index === selection.length - 1) {
                // @ts-ignore
                secondaryTableData.value.push(row);
                mutipleTable.value!.toggleRowSelection(row, true);

            }
        });
        nextTick(() => {
            secondaryTableData.value.forEach((item: any) => {
                mutipleTable1.value!.toggleRowSelection(item, true);
            });
        });

    };
    const selectAll2 = (selection: any) => {

        secondaryTableData.value = selection;
        nextTick(() => {
            userList.value.forEach((item: any, index) => {
                if (secondaryTableData.value.findIndex((v: any) => v.id == item.id) >= 0) {
                    mutipleTable.value!.toggleRowSelection(item, true);

                } else {
                    mutipleTable.value!.clearSelection();
                }
            });
        });
    };
    const handleSelectionChange2 = (selection: any) => {
        secondaryTableData.value = selection;

        nextTick(() => {
            userList.value.forEach((item: any, index) => {
                if (secondaryTableData.value.findIndex((v: any) => v.id == item.id) >= 0) {
                    mutipleTable.value!.toggleRowSelection(item, true);
                } else {
                    mutipleTable.value!.toggleRowSelection(item, false);
                }
            });
        });

    };
    //全选 管理员
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
    //已选 管理员
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
    // 已选 管理员
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
    //群成员
    const memberselectAll = (selection: any) => {
        memberTableData.value = selection;
        nextTick(() => {
            memberTableData.value.forEach((item: any) => {
                memberTable1.value!.toggleRowSelection(item, true);
            });
        });
    };
    //群成员
    const memberSelectionChange = (selection: any) => {
        memberTableData.value = selection;
        nextTick(() => {
            memberTableData.value.forEach((item: any) => {
                memberTable1.value!.toggleRowSelection(item, true);
            });
        });

    };
    //已选 群成员
    const memberselectAll1 = (selection: any) => {
        memberTableData.value = selection;
        nextTick(() => {
            userList.value.forEach((item: any, index) => {
                if (memberTableData.value.findIndex((v: any) => v.id == item.id) >= 0) {
                    memberTable.value!.toggleRowSelection(item, true);

                } else {
                    memberTable.value!.clearSelection();
                }
            });
        });
    };
    // 已选 群成员
    const memberSelectionChange1 = (selection: any) => {
        memberTableData.value = selection;
        nextTick(() => {
            userList.value.forEach((item: any, index) => {
                if (memberTableData.value.findIndex((v: any) => v.id == item.id) >= 0) {
                    memberTable.value!.toggleRowSelection(item, true);
                } else {
                    memberTable.value!.toggleRowSelection(item, false);
                }
            });
        });

    };
    const getRowKeys = (row: any) => {
        return row.id;
    };
    // @ts-ignore
    const tableRowClassName = ({ row }) => {
        const checkIdList = secondaryTableData.value.map((item: any) => item.id);
        if (checkIdList.includes(row.id)) {
            return {
                backgroundColor: "#E6F7FF",
            };
        }
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
    // @ts-ignore
    const tableRowClassName2 = ({ row }) => {
        const checkIdList = memberTableData.value.map((item: any) => item.id);
        if (checkIdList.includes(row.id)) {
            return {
                backgroundColor: "#E6F7FF",
            };
        }
    };
    //选择群主 确定按钮
    const submitForm1 = () => {
        ownerUserList.value = secondaryTableData.value;
        open2.value = false;
        ownerUserList.value.forEach((v: any) => {
            form.value.ownerUserID = v.userId;
        });

    };
    //选择管理员 确定按钮
    const submitForm2 = () => {
        adminUserList.value = adminTableData.value;
        open3.value = false;
        form.value.adminUserIDs = [];
        adminUserList.value.forEach((v: any) => {
            // @ts-ignore
            form.value.adminUserIDs.push(v.userId);
        });
    };
    //选择群成员 确定按钮
    const submitForm3 = () => {
        memberUserList.value = memberTableData.value;
        open4.value = false;
        form.value.memberUserIDs = [];
        memberUserList.value.forEach((v: any) => {
            // @ts-ignore
            form.value.memberUserIDs.push(v.userId);
        });
    };
    //判断复选框禁用 群主
    const isCheckboxDisabled = (row: any) => {
        // var arr=Set<number>

        return row.checked;

    };
    //判断复选框禁用 管理员
    const isCheckboxDisabled1 = (row: any) => {

        return row.checked;

    };
    //判断复选框禁用 群成员
    const isCheckboxDisabled2 = (row: any) => {


        return row.checked;

    };
    /** 修改按钮操作 */
    const handleUpdate = (row: any) => {
        reset();
        const configId = row.id || ids.value;
        // getGroup(configId).then((response: any) => {
        //     // form.value = response.data;
        //     form.value.id = response.data.id;
        //     form.value.faceUrl = response.data.faceUrl;
        //     form.value.userId = response.data.userId;
        //     form.value.nickname = response.data.nickname;
        //     open.value = true;
        //     title.value = "修改";
        //     proxy.setTableRowSelected(pageTableRef, row, true);
        // });
    };
    /** 删除群组操作 */
    const deleteGroup1 = (row: any) => {
        ElMessageBox.confirm("确定解散群组吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                delGroup({ groupID: row.groupInfo.groupID }).then(
                    (response: any) => {
                        if (response.code == 200) {
                            proxy.$modal.msgSuccess("解散成功");
                            getList();
                        }
                    },
                );
            })
            .catch(() => {
            });
    };
    //群聊设置
    const groupSettings = (row: any) => {
        reset1();
        setOpen.value = true;
        form1.value.groupInfoForSet.applyMemberFriend=row.groupInfo.applyMemberFriend;
        form1.value.groupInfoForSet.faceURL=row.groupInfo.faceURL;
        form1.value.groupInfoForSet.groupID=row.groupInfo.groupID;
        form1.value.groupInfoForSet.groupName=row.groupInfo.groupName;
        form1.value.groupInfoForSet.introduction=row.groupInfo.introduction;
        form1.value.groupInfoForSet.lookMemberInfo=row.groupInfo.lookMemberInfo;
        form1.value.groupInfoForSet.needVerification=row.groupInfo.needVerification;
        form1.value.groupInfoForSet.notification=row.groupInfo.notification;
    };
    //      群成员
    const groupMembers=(row:any)=>{
        router.push({ path: '/group/groupMember' ,
            query:{
                groupID:row.groupInfo.groupID
            }})
    };
    /** 全体禁言操作 */
    const disAll = (row: any) => {
        if (row.groupInfo.status == "0") {
            ElMessageBox.confirm("确定开启全体禁言吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    allForbidden({ groupID: row.groupInfo.groupID, status: "1" }).then((response: any) => {
                        if (response.code == 200) {
                            proxy.$modal.msgSuccess("禁言成功");
                            getList();
                        }
                    });
                })
                .catch(() => {
                });
        } else if (row.groupInfo.status == "3") {
            ElMessageBox.confirm("确定取消全体禁言吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    allForbidden({ groupID: row.groupInfo.groupID, status: "0" }).then((response: any) => {
                        if (response.code == 200) {
                            proxy.$modal.msgSuccess("取消禁言成功");
                            getList();
                        }
                    });
                })
                .catch(() => {
                });
        }
    };
    /** 查询好友操作 */
    const findUserFriend = (row: any) => {
        queryId.value.userId = row.userId;
    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                addGroup(form.value).then((response) => {
                    if (response.code === 200) {
                        proxy.$modal.msgSuccess("操作成功");
                        open.value = false;
                        getList();
                    }
                });
            }
        });
    };
    /** 提交按钮 */
    const setSubmitForm = async () => {
        await formRef1.value?.validate((valid: boolean) => {
            if (valid) {
                updateGroup(form1.value).then((response) => {
                    if (response.code === 200) {
                        proxy.$modal.msgSuccess("操作成功");
                        setOpen.value = false;
                        getList();
                    }
                });
            }
        });
    };
    //用户头像
    const handleUpdateImage = () => {
        uploadPolicy()
            .then((res: any) => {
                if (res.code == 200) {
                    uploadParams.value.policy = res.data.policy;
                    uploadParams.value.signature = res.data.signature;
                    uploadParams.value.OSSAccessKeyId = res.data.accessid;
                    uploadParams.value.key =
                        "wivpal/" + randomString(10) + getSuffix(uploadParams.value.name);
                    nextTick(() => {
                        iconUpload.value.submit();
                        setTimeout(() => {
                            form.value.groupInfo.faceURL = uploadParams.value.key;
                        }, 1000);
                        if (iconUpload.value) {
                            iconUpload.value.clearFiles();
                        }
                    });
                }
            })
            .catch();
    };
    //用户头像
    const handleUpdateImage1 = () => {
        uploadPolicy()
            .then((res: any) => {
                if (res.code == 200) {
                    uploadParams.value.policy = res.data.policy;
                    uploadParams.value.signature = res.data.signature;
                    uploadParams.value.OSSAccessKeyId = res.data.accessid;
                    uploadParams.value.key =
                        "wivpal/" + randomString(10) + getSuffix(uploadParams.value.name);
                    nextTick(() => {
                        iconUpload1.value.submit();
                        setTimeout(() => {
                            form1.value.groupInfoForSet.faceURL = uploadParams.value.key;
                        }, 1000);
                        if (iconUpload1.value) {
                            iconUpload1.value.clearFiles();
                        }
                    });
                }
            })
            .catch();
    };
    // @ts-ignore
    const headerCellStyle = ({ columnIndex }) => {
        if (columnIndex === 0) {
            return "hiddenCheck";
        }
    };
    //用户头像
    const iconChange = (file: any) => {
        uploadParams.value.name = file.raw.name;
        handleUpdateImage();
    };
    //用户头像
    const iconChange1 = (file: any) => {
        uploadParams.value.name = file.raw.name;
        handleUpdateImage1();
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
        handleUpdate,
        submitForm,
        pageTableRef,
        cleanSelect,
        uploadParams,
        uploadUrl,
        upload,
        isShowTooltip,
        onMouseOver,
        iconChange,
        iconUpload,
        deleteGroup1,
        needList,
        applyList,
        lookList,
        ownerUserList,
        adminUserList,
        memberUserList,
        queryParams1,
        userList,
        totalUser,
        secondaryTableData,
        mutipleTable,
        mutipleTable1,
        getSearch,
        selectAll2,
        selectAll,
        handleSelectionChange1,
        handleSelectionChange2,
        getRowKeys,
        tableRowClassName,
        getOwner,
        cancel1,
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
        submitForm1,
        submitForm2,
        getAdminUser,
        getMemberUser,
        memberSelectionChange,
        memberselectAll,
        memberTable,
        memberSelectionChange1,
        memberselectAll1,
        memberTable1,
        memberTableData,
        submitForm3,
        cancel3,
        headerCellStyle,
        isCheckboxDisabled,
        isCheckboxDisabled1,
        isCheckboxDisabled2,
        tableRowClassName1,
        tableRowClassName2,
        setOpen,
        setCancel,
        setSubmitForm,
        groupSettings,
        form1,
        iconUpload1,
        iconChange1,
        rules1,
        formRef1,
        groupMembers
    };
};
