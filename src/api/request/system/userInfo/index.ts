import { ElForm, ElTable, ElTree } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
import {
    listUser,
    getUser,
    resetUserPwd,
    addUser,
    delUser,
    changeUserStatus,
} from "@/api/system/userInfo";
import { roleAll} from "@/api/system/role";
import { listDept } from "@/api/system/organization";
import { isStrings } from "@/utils/validate";
export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<user<userForm, userQueryParams, userElTreeProps, userType>>({
        showSearch: true,//显示搜索条件
        queryParams: { // 查询参数
            current: 1,
            size: 50,
            userName: '',
            phone: '',
            // startDate: '',
            // endDate: '',
        },
        loading: true,//遮罩层
        userList: [],//用户表格数据
        title: "", // 弹出层标题
        open: false,  // 是否显示弹出层
        form: {  // 表单参数
            id: '',//
            userName: '',//姓名
            passWord: '',//密码
            phone: '',//手机号
            roleIds: [],//角色
            orgId: '',//机构
            gender: false,// 0 男,1女
            active: false,//激活状态
        },
        // 表单校验
        rules: {
            userName: [
                { required: true, message: "用户名称不能为空", trigger: "blur" },
                { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
            ],
            passWord: [
                { required: true, message: "用户密码不能为空", trigger: "blur" },
                { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
            ],
            gender: [
                { required: true, message: "性别不能为空", trigger: "blur" },

            ],
            phone: [
                { required: true, message: "请输入手机号码", trigger: "blur" },
                {
                    pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                    message: "请输入正确的手机号码",
                    trigger: "blur"
                }
            ],
            orgId: [
                { required: true, message: "请选择机构", trigger: "change" }
            ],
            roleIds: [
                { required: true, message: "请选择角色", trigger: "change" }
            ]
        },
        elTreeProps: {
            value: "id",
            label: "orgName",
            children: "children",
        },
        multiple: true,	// 非多个禁用
        single: true,//非单个禁用
        total: 0,//总条数
        ids: [],//选中数组
        dateRange: [],//日期时间
        // 性别
        sysUserSex: [
            {
                id: false,
                name: '男'
            },{
                id: true,
                name: '女'
            },
        ],
        //   用户类型
        userTypes: [
            {
                id: 0,
                name: '公司员工'
            },
            {
                id: 1,
                name: '其他'
            }
        ],
        //   上级用户
        userParent: [],
        //   部门树选项
        deptOptions: [],
        //   角色选项
        postOptions: [],


    })
    const queryRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const { queryParams, showSearch, loading, userList, title, open, form, rules, elTreeProps, multiple, total, ids, dateRange, sysUserSex, userTypes, userParent, deptOptions, postOptions, single } = toRefs(state);

    // 查询部门下拉树结构
    const getTreeselect = async () => {
        await listDept().then((response) => {
            if (response.code === 200) {
                deptOptions.value = response.data;
            }
        })
    };
    // 获取角色
    const getRole = async () => {
        await roleAll().then((response) => {
            if (response.code === 200) {
                postOptions.value = response.data;
            }
        })
    };
    const cleanSelect = () => {
        pageTableRef.value?.clearSelection()
    };
    // 查询用户列表数据
    const getList = async () => {
        loading.value = true;
        await listUser(queryParams.value).then((response) => {
            loading.value = false;
            if (response.code == 200) {
                userList.value = response.data.records;
                total.value = response.data.total;
            }
        })
    };
    getList();
    // 取消按钮
    const cancel = () => {
        reset();
        cleanSelect();
        open.value = false;
    };
    // 表单重置
    const reset = () => {
        form.value = {
            id: '',//
            userName: '',//姓名
            passWord: '',//密码
            phone: '',//手机号
            roleIds: [],//角色
            orgId: '',//机构
            gender: false,// 0 男,1女
            active: false,//激活状态
        };
        proxy.resetForm(formRef)
    }
    // 搜索按钮操作
    const handleQuery = () => {
        getList();
    }
    // 重置按钮操作
    const resetQuery = () => {
        proxy.resetForm(queryRef);
        dateRange.value = [];
        // queryParams.value.startDate = '';
        // queryParams.value.endDate = '';
        handleQuery();
    }
    // 新增按钮操作
    const handleAdd = () => {
        reset();
        getTreeselect();
        getRole();
        open.value = true;
        title.value = "添加用户";

    };

    //   多选框选中数据
    const handleSelectionChange = (selection: any) => {
        ids.value = selection.map((item: any) => item.id);
        multiple.value = !selection.length;
        single.value = selection.length != 1;
    };
    /** 修改按钮操作 */
    const handleUpdate = async (row: any) => {
        reset();
        getTreeselect();
        getRole();
        const userId = row.id || ids.value
        await getUser(userId).then((response:any) => {
            if (response.code === 200) {
                form.value.id = response.data.id;
                form.value.userName = response.data.userName;
                form.value.phone = response.data.phone;
                form.value.orgId = response.data.orgId;
                form.value.gender = response.data.gender;
                form.value.active = response.data.active;
                form.value.roleIds=[];
                response.data.roleList.forEach((v:any)=>{
                    form.value.roleIds.push(v.id)
                })

            }
        })

        open.value = true;
        title.value = "修改用户";
    };
    // 提交按钮
    const submitForm = async () => {

        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                var obj={
                    id:  form.value.id,
                    userName:form.value.userName,
                    phone: form.value.phone,
                    passWord: form.value.passWord,
                    roleIds:form.value.roleIds.toString() ,
                    orgId: form.value.orgId,
                    gender: form.value.gender,
                    active:form.value.active
                }
                if (form.value.id != '') {
                    addUser(obj).then((response:any) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            handleQuery();
                        }
                        if (response.code === 2002){
                            proxy.$modal.msgError(response.message);
                        }
                    })
                } else {
                    addUser(obj).then((response:any) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("新增成功");
                            open.value = false;
                            handleQuery();
                        }
                        if (response.code === 2002){
                            proxy.$modal.msgError(response.message);
                        }
                    })
                }
            }
        })
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
            return delUser(query.value)
        }).then((response: any) => {
            if (response.code === 200) {
                proxy.$modal.msgSuccess("删除成功");
                getList();
            }

        }).catch(() => {
            proxy.setTableRowSelected(pageTableRef, row, false);
        })
    };
    // 选择时间
    const dataTime = (e: any) => {
        // queryParams.value.startDate = e[0];
        // queryParams.value.endDate = e[1];
    }
    // 重置密码按钮操作
    const handleResetPwd = async (row: { userName: string; id: number }) => {
        proxy.setTableRowSelected(pageTableRef, row, true);
        await proxy.$modal.prompt('请输入' + row.userName + '的新密码', "提示").then(({ value }: any) => {
            resetUserPwd(row.id, value).then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.setTableRowSelected(pageTableRef, row, false);
                    proxy.$modal.msgSuccess('重置密码成功');
                }
            })
        }).catch(() => {
            proxy.setTableRowSelected(pageTableRef, row, false);
        })
    }

    //状态
    const handleStatusChange = async (val: any, row: any) => {
        proxy.setTableRowSelected(pageTableRef, row, true);
        const text = val === true ? "启用" : "停用";
        // prettier-ignore
        await proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?',"警告")
            .then(() => {
                changeUserStatus(row.id).then(res=>{
                    if (res.code==200){
                        proxy.$modal.msgSuccess('操作成功');
                    }
                });
            })
            .catch(() => {

                proxy.setTableRowSelected(pageTableRef, row, false);
                row.active = row.active === false ? true : false;
                return;
            });
        //updateUserStatus(row.userId, val);
    };

    return { queryParams, showSearch, queryRef, resetQuery, handleQuery, handleAdd, pageTableRef, loading, userList, handleUpdate, handleDelete, title, open, form, rules, elTreeProps, submitForm, cancel, multiple, total, handleSelectionChange, getList, formRef, cleanSelect, dateRange, dataTime, handleResetPwd, sysUserSex, userTypes, userParent, deptOptions, postOptions, single ,handleStatusChange}
}
