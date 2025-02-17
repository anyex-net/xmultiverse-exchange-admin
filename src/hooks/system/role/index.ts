import { ElForm, ElTable, ElTree } from "element-plus";
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
import {
    listRole,
    getRole,
    addRole,
    delRole,
    getJurisdictionList,
    unallocatedUserList,
    addRolepermission,
    exportExcel,
} from "@/api/system/role";
import { isStrings } from "@/utils/validate";
import { parseTime } from "@/utils/dateTime";
import { downLoan,downloadFile } from "@/utils/xlsx";
import htmlToPdf   from '@/utils/pdfForm';

import { downPDF } from '@/utils/pdfTable';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
export default () => {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<role<roleForm, roleQueryParams>>({
        showSearch: true,//显示搜索条件
        queryParams: { // 查询参数
            current: 1,
            size: 50,
            roleName: "",
        },
        loading: true,//遮罩层
        roleList: [],//角色表格数据
        title: "", // 弹出层标题
        open: false,  // 是否显示弹出层
        form: {  // 表单参数
            id: "",//
            roleName: "",//角色名称
            roleCode: "",//角色编码
            roleDest: "",
            needGa: false,//是否绑定ga
        },
        // 表单校验
        rules: {
            roleName: [
                { required: true, message: "角色名称不能为空", trigger: "blur" },
            ],
            roleCode: [
                { required: true, message: "角色编码不能为空", trigger: "blur" },
            ],
            needGa: [
                { required: true, message: "绑定Ga不能为空", trigger: "blur" },
            ],
        },
        multiple: true,	// 非多个禁用
        single: true,//非单个禁用
        total: 0,//总条数
        ids: [],//选中数组
        setJurisdictionShow: false,//分配权限弹框
        setJurisdictionTableData: [],//分配权限-表格数据
        setJurisdictionForm: {
            id: "",
            resourceIds: [],
        },//分配权限-表单
    });
    const queryRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const setJurisdictionTree = ref<InstanceType<typeof ElTree>>();
    const formPdf=ref<HTMLElement|null>(null);
    const {
        queryParams,
        showSearch,
        loading,
        roleList,
        title,
        open,
        form,
        rules,
        multiple,
        total,
        ids,
        single,
        setJurisdictionShow,
        setJurisdictionTableData,
        setJurisdictionForm,
    } = toRefs(state);
    const cleanSelect = () => {
        pageTableRef.value?.clearSelection();
    };
    // 查询角色列表数据
    const getList = async () => {
        loading.value = true;
        await listRole(queryParams.value).then((response) => {
            loading.value = false;
            if (response.code == 200) {
                roleList.value = response.data.records;
                total.value = response.data.total;
            }
        });
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
            id: "",//
            roleName: "",//姓名
            roleCode: "",//角色编码
            roleDest: "",
            needGa: false,//是否绑定ga
        };
        proxy.resetForm(formRef);
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
    // 新增按钮操作
    const handleAdd = () => {
        reset();
        open.value = true;
        title.value = "添加角色";

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
        const roleId = row.id || ids.value;
        await getRole(roleId).then((response) => {
            if (response.code === 200) {
                form.value.id = response.data.id;
                form.value.roleName = response.data.roleName;
                form.value.roleCode = response.data.roleCode;
                form.value.roleDest = response.data.roleDest;
                form.value.needGa = response.data.needGa;
            }
        });

        open.value = true;
        title.value = "修改角色";
    };

    // 提交按钮
    const submitForm = async () => {

        await formRef.value?.validate((valid: boolean) => {
            if (valid) {

                if (form.value.id != "") {
                    addRole(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            handleQuery();
                        }
                    });
                } else {
                    addRole(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("新增成功");
                            open.value = false;
                            handleQuery();
                        }
                    });
                }
            }
        });
    };
    /** 删除按钮操作 */
    const handleDelete = (row: any) => {
        // 设置当前被选中
        proxy.setTableRowSelected(pageTableRef, row, true);
        const arrIds = row.id || ids.value;
        proxy.$modal.confirm("是否确认删除id为" + arrIds + "的数据项?").then(() => {
            const query = {} as any;
            if (row.id == undefined) {
                query.value = {
                    ids: isStrings(arrIds),
                };
            } else {
                query.value = {
                    ids: arrIds,
                };
            }

            return delRole(query.value);
        }).then((response: any) => {
            if (response.code === 200) {
                proxy.$modal.msgSuccess("删除成功");
                getList();
            }

        }).catch(() => {
            proxy.setTableRowSelected(pageTableRef, row, false);
        });
    };
    // 分配权限
    const setJurisdiction = async (row: any) => {
        setJurisdictionForm.value.id = row.id;
        setJurisdictionShow.value = true;
        await getJurisdictionList().then((res: any) => {
            if (res.code === 200) {
                setJurisdictionTableData.value = res.data;
                unallocatedUserList(setJurisdictionForm.value.id).then(res2 => {
                    if (res2.code === 200) {
                        setJurisdictionForm.value.resourceIds = [];
                        if (res2.data.length != 0) {
                            res2.data.forEach((elem: any) => {
                                setJurisdictionForm.value.resourceIds.push(elem.id);
                                proxy.$refs.setJurisdictionTree.setCheckedKeys(setJurisdictionForm.value.resourceIds);
                            });

                        } else {
                            proxy.$refs.setJurisdictionTree.setCheckedKeys([]);
                        }
                    }

                });
            }
        });
    };

    // 分配权限选择
    const setJurisdictionTableDataSelect = () => {
        setJurisdictionForm.value.resourceIds = [];
        proxy.$refs.setJurisdictionTree.getCheckedNodes().forEach((elem: any) => {
            // console.log('elem',elem)
            // if (elem.leaf) {
            setJurisdictionForm.value.resourceIds.push(elem.id);

            // }
        });
    };
    // 分配权限提交按钮
    const submitForm1 = async () => {
        if (setJurisdictionForm.value.id != "") {
            var obj = {
                id: setJurisdictionForm.value.id,
                resourceIds: isStrings(setJurisdictionForm.value.resourceIds),
            };
            await addRolepermission(obj).then(response => {
                if (response.code === 200) {
                    proxy.$modal.msgSuccess("编辑成功");
                    setJurisdictionShow.value = false;
                    getList();
                }
                if (response.code === 2003) {
                    proxy.$modal.msgError("参数验证错误");
                }
            });
        }
    };
    const convertArray = (arr: Array<any>): Array<Array<string | number>> => {
// 初始化结果数组，包含表头
        const result: Array<Array<string | number>> = [["角色信息", "角色信息", "角色信息", "角色信息", "角色信息"], ["角色编号", "名称", "是否绑定GA", "角色描述", "创建时间"]];
// 遍历数组a，将每个对象的属性转换为数组，并添加到结果数组中
        arr.forEach((item: any) => {
            result.push([item.roleCode, item.roleName, item.needGa, item.roleDest, parseTime(item.createDate, "")]);
        });

        return result;
    };

    // 前端导出
    const handleExport = () => {
        // 假设你有一个表格数据的数组
        const data = convertArray(roleList.value);
        var time = new Date();
        // 下载文件
        downLoan(data, parseTime(time), 120, 10, "FF808080");
    };
    //后端导出
    const handleExport1=()=>{
        var time = new Date();
        exportExcel().then(res=>{
            downloadFile(res,parseTime(time))
        })
    };
    //   分配权限取消按钮
    const cancel1 = () => {
        setJurisdictionShow.value = false;

        cleanSelect();
    };
    const convertArrayPdf = (arr: Array<any>): Array<Array<string | number>> => {
// 初始化结果数组，包含表头
        const result: Array<Array<string | number>> = [];
// 遍历数组a，将每个对象的属性转换为数组，并添加到结果数组中
        arr.forEach((item: any) => {
            result.push([item.roleCode, item.roleName ,item.needGa, item.roleDest, parseTime(item.createDate, "")]);
        });

        return result;
    };
    //导出pdf
    const handleExportPdf= ()=>{
       let columns=["角色编号", "名称", "是否绑定GA", "角色描述", "创建时间"]
        const data = convertArrayPdf(roleList.value);

        var time = new Date();
        downPDF(data,columns,parseTime(time),'角色信息');

    };
     const handleExportPdfForm= ()=>{
         const date=new Date();
         htmlToPdf('表单','#myForm','角色信息',parseTime(date,''));

    }
    return {
        queryParams,
        showSearch,
        queryRef,
        resetQuery,
        handleQuery,
        handleAdd,
        pageTableRef,
        loading,
        roleList,
        handleUpdate,
        handleDelete,
        title,
        open,
        form,
        rules,
        submitForm,
        cancel,
        multiple,
        total,
        handleSelectionChange,
        getList,
        formRef,
        cleanSelect,
        single,
        setJurisdiction,
        setJurisdictionShow,
        setJurisdictionTableData,
        setJurisdictionTree,
        setJurisdictionTableDataSelect,
        submitForm1,
        cancel1,
        handleExport,
        handleExport1,
        handleExportPdf,
        handleExportPdfForm,
        formPdf
    };
}
