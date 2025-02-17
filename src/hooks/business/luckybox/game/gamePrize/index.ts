import { ref, reactive, toRefs, getCurrentInstance, onMounted, nextTick } from "vue";
// prettier-ignore
import { listGamePrize, getGamePrize, gameList, addGamePrize, delGamePrize, uploadPolicy } from "@/api/business/luckybox/game/gamePrize";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
import { getSuffix, randomString } from "@/utils/dateTime";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const upload = ref<any>();
    const state = reactive<gamePrize<gamePrizeFom, gamePrizeQueryParams>>({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            prizeName: "",
            gameId: "",
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
        // 游戏管理奖品表格数据
        configList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {
            id: "",
            cost: "",//成本
            gameId: "",//游戏ID
            percentWinningAmount: "",//百份中奖数量
            price: "",//商品价格
            prizeImgUrl: "",//奖品图片Url
            prizeName: "",//奖品名称
            rewardBalance: "",//奖励金额
            status: false,//游戏是否启用(0未启用、1启用)
            remark: "",//备注
        },
        // 表单校验
        rules: {
            gameId: [
                {
                    required: true,
                    message: "游戏名称不能为空",
                    trigger: "blur",
                },
            ],
            prizeName: [
                {
                    required: true,
                    message: "奖品名称不能为空",
                    trigger: "blur",
                },
            ],
            cost: [
                {
                    required: true,
                    message: "成本不能为空",
                    trigger: "blur",
                },
            ],
            price: [
                {
                    required: true,
                    message: "商品价格不能为空",
                    trigger: "blur",
                },
            ],
            percentWinningAmount: [
                {
                    required: true,
                    message: "百份中奖数量不能为空",
                    trigger: "blur",
                },
            ],
            rewardBalance: [
                {
                    required: true,
                    message: "奖励金额不能为空",
                    trigger: "blur",
                },
            ],
            prizeImgUrl: [
                {
                    required: true,
                    message: "奖品图片不能为空",
                    trigger: "blur",
                },
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
        gameType: [],//游戏列表
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
        uploadParams,
        uploadUrl,
        gameType,
    } = toRefs(state);

    /** 查询管理奖品列表 */
    const getList = () => { for (let key in queryParams.value) {
      if (queryParams.value.hasOwnProperty(key)) {
        if (queryParams.value[key] === "") {
          queryParams.value[key] = null;
        }
      }
    }
        loading.value = true;
        // prettier-ignore
        listGamePrize(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data.records;
                total.value = response.data.total;
                loading.value = false;
            }

        });
    };
    //获取所有游戏列表
    const getGameList = () => {
        gameList().then(res => {
            if (res.code == 200) {
                gameType.value = res.data;
            }
        });
    };
    getGameList();
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
            id: "",
            cost: "",//成本
            gameId: "",//游戏ID
            percentWinningAmount: "",//百份中奖数量
            price: "",//商品价格
            prizeImgUrl: "",//奖品图片Url
            prizeName: "",//奖品名称
            rewardBalance: "",//奖励金额
            status: false,//游戏是否启用(0未启用、1启用)
            remark: "",//备注
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
        title.value = "添加游戏奖品";
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
        getGamePrize(configId).then((response: any) => {
            form.value = response.data;
            open.value = true;
            title.value = "修改游戏奖品";
            proxy.setTableRowSelected(pageTableRef, row, true);
        });
    };
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != "") {
                    addGamePrize(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();
                        }
                    });
                } else {
                    addGamePrize(form.value).then((response) => {
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
        proxy.$modal.confirm("是否确认删除游戏奖品编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delGamePrize(query.value);
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
                        form.value.prizeImgUrl = uploadParams.value.key;
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
    //状态
    const handleStatusChange = async (val: any, row: any) => {
        const text = val === true ? "启用" : "停用";
        // prettier-ignore
        await proxy.$modal.confirm("确认要\"" + text + "\"游戏奖品吗?", "警告")
            .then(() => {
                addGamePrize(row).then(res => {
                    if (res.code == 200) {
                        proxy.$modal.msgSuccess("操作成功");
                    }
                });
            })
            .catch(() => {
                row.status = row.status === true ? false : true;
                return;
            });
        //updateUserStatus(row.userId, val);
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
        handleUpdateForm,
        handleStatusChange,
        uploadParams,
        doChange, uploadUrl, upload, gameType,
    };
};
