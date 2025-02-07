import { ref, reactive, toRefs,toRaw, getCurrentInstance, onMounted, nextTick, shallowRef } from "vue";
// prettier-ignore
import { listNotice, getNotice, addNotice, noticeUpdateStatus, delNotice, uploadPolicy } from "@/api/common/notice";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
import { getSuffix, randomString } from "@/utils/dateTime";
import { getRole } from "@/api/system/role";

export default () => {
    const { proxy } = getCurrentInstance() as any;
    const upload = ref<any>();
    const uploadQuill=ref<any>();
    const state = reactive<notice<noticeForm, noticeQueryParams>>({
        // 查询参数
        queryParams: {
            current: 1,
            size: 50,
            title: "",
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
        // 平台公告表格数据
        configList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        open1:false,
        // 表单参数
        form: {
            id: "",
            content: "",
            imageUrl: "",
            langType: "",
            status: false,
            title: "",
            remark: "",
        },
        // 表单校验
        rules: {
            title: [
                {
                    required: true,
                    message: "标题不能为空",
                    trigger: "blur",
                },
            ],
            langType: [
                {
                    required: true,
                    message: "语言类型不能为空",
                    trigger: "blur",
                },
            ],
            content: [
                {
                    required: true,
                    message: "内容不能为空",
                    trigger: "blur",
                },
            ],
            imageUrl: [
                {
                    required: true,
                    message: "图片不能为空",
                    trigger: "blur",
                },
            ],
        },
        langTypes: [
            {
                id: "en_US",
                name: "英文",
            },
            {
                id: "zh_CN",
                name: "简体",
            },
            {
                id: "zh_HK",
                name: "繁体",
            },
        ],
        uploadParams: {
            key: "",
            name: "",
            policy: "",
            OSSAccessKeyId: "",
            success_action_status: 200,
            signature: "",
        },
        uploadUrl: import.meta.env.VITE_upload_url,
    });
    const detailObj=ref<any>({})
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const formRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
    const isShowTooltip = ref<boolean>(true);
    const quillEditor=ref<any>('');
    const quill=quillEditor.value;

    const content = ref("");
    const editorOption = ref({
        modules: {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6] }], // custom button values
                    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
                    ['blockquote', 'code-block'], // 引用  代码块
                    [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
                    [{ script: 'sub' }, { script: 'super' }], // 上标/下标
                    [{ indent: '-1' }, { indent: '+1' }], // 缩进
                    [{ direction: 'rtl' }], // 文本方向
                    ['image', 'video'],
                    [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
                    // [{ 'font': [] }],
                    [{ 'align': '' }],
                    [{ 'align': 'center' }],
                    [{ 'align': 'right' }],
                    ['clean'],
                ],
                // 工具栏
                handlers: {
                    'image':(value:any)=> {
                        if (value) {
                            // uploadQuill.value.click()
                            // @ts-ignore
                            document.querySelector('.upload-quill .el-button--primary').click();
                        } else {
                           quill.value.format('image', false);
                        }
                    },
                    'video': (value:any)=> {
                        if (value) {

                       // @ts-ignore
                            document.querySelector('.upload-quill .el-button--primary').click();
                        } else {
                            quill.value.format('video', false);
                        }
                    }
                },
                // 图片缩放
                blotFormatter: {
                    // 可以在这里设置缩放样式
                    overlay: {
                       style: {
                           border: '2px solid red',
                       }
                    },
                    toolbar: {
                        mainClassName: 'blot-formatter__toolbar'
                    }
                }
            }
        }
    });


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
        langTypes,
        uploadParams,
        uploadUrl,
        open1
    } = toRefs(state);

    /** 查询平台公告列表 */
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
        listNotice(queryParams.value).then((response) => {
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
            id: "",
            content: "",
            imageUrl: "",
            langType: "",
            status: false,
            title: "",
            remark: "",
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
        title.value = "添加平台公告";
        if (quillEditor.value){
            quillEditor.value.setHTML('');
        }
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
        getNotice(configId).then((response: any) => {
            form.value = response.data;
            open.value = true;
            title.value = "修改平台公告";
            if (quillEditor.value){
                quillEditor.value.setHTML(response.data.content)
            }

            proxy.setTableRowSelected(pageTableRef, row, true);
        });
    };
    //查看详情
    const handleDetail= async (row: any)=>{
        open1.value=true;
        await getNotice(row.id).then((response) => {
            if (response.code === 200) {
                detailObj.value=response.data
            }
        })

    }
    /** 提交按钮 */
    const submitForm = async () => {
        await formRef.value?.validate((valid: boolean) => {
            if (valid) {
                if (form.value.id != "") {
                    addNotice(form.value).then((response) => {
                        if (response.code === 200) {
                            proxy.$modal.msgSuccess("修改成功");
                            open.value = false;
                            getList();
                        }
                    });
                } else {
                    addNotice(form.value).then((response) => {
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
        proxy.$modal.confirm("是否确认删除平台公告编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delNotice(query.value);
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
                // uploadUrl.value= res.data.host;
                uploadParams.value.key = "wivpal/" + randomString(10) + getSuffix(uploadParams.value.name);
                nextTick(() => {
                    upload.value.submit();
                    setTimeout(() => {
                        form.value.imageUrl = uploadParams.value.key;
                    }, 1000);

                    if (upload.value) {
                        upload.value.clearFiles();
                    }
                });

            }
        }).catch();
    };
    //图片
    const handleUpdateForm1 = () => {
        uploadPolicy().then((res: any) => {
            if (res.code == 200) {
                uploadParams.value.policy = res.data.policy;
                uploadParams.value.signature = res.data.signature;
                uploadParams.value.OSSAccessKeyId = res.data.accessid;
                // uploadUrl.value= res.data.host;
                uploadParams.value.key = "wivpal/" + randomString(10) + getSuffix(uploadParams.value.name);
                nextTick(() => {
                    uploadQuill.value.submit();
                    setTimeout(() => {
                        // form.value.imageUrl = uploadParams.value.key;
                    }, 1000);

                    if (uploadQuill.value) {
                        uploadQuill.value.clearFiles();
                    }
                });

            }
        }).catch();
    };
    const doChange = (file: any) => {
        uploadParams.value.name = file.raw.name;
        handleUpdateForm();

    };
    const doChange1 = (file: any) => {
        uploadParams.value.name = file.raw.name;
    };
    const onBeforeUpload=(file:any)=>{
        //获取最后一个.的位置
        var index= file.name.lastIndexOf(".");
        //获取后缀
        var ext = file.name.substr(index+1).toLowerCase();
        console.log(ext);
        if(['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext) != -1){

        }else{
            return new Promise(async (resolve:any, reject) => {
                if(ext != 'mp4'){
                    proxy.$modal.msgWarning('格式错误');
                    return reject();
                }
                let duration = await getVideoDuration(file);
                // @ts-ignore
                if (duration <= 150) {
                    resolve(); //放行
                } else {
                    // @ts-ignore
                    proxy.$modal.warning('视频时长为：'+duration.toString().substr(0,4) + '秒，请上传150秒以内的视频');
                    return reject();//拦截
                }
            });
        }
    };
    // 获取视频时长
   const getVideoDuration=(file:any)=> {
        return new Promise(function(resolve, reject) {
            //做一些异步操作
            let url = URL.createObjectURL(file)
            let audioElement = new Audio(url)
            let duration = 0
            audioElement.addEventListener('loadedmetadata', ()=> {
                duration = audioElement.duration //时长为秒，小数，182.36
                resolve(duration)
            })
        })
    };
   const afterUploadQuill=()=>{
       // 插入链接
       const quill = toRaw(quillEditor.value).getQuill();
       const length = quill.getSelection().index;
       if (uploadParams.value.name.indexOf('jpg') > -1 || uploadParams.value.name.indexOf('png') > -1 || uploadParams.value.name.indexOf('jpeg') > -1 || uploadParams.value.name.indexOf('gif') > -1 || uploadParams.value.name.indexOf('GIF') > -1) {
           quill.insertEmbed(length, 'image', uploadUrl.value + uploadParams.value.key);
       } else {
           quill.insertEmbed(length, 'video', uploadUrl.value  + uploadParams.value.key);
       }
       quill.setSelection(length + 1);
   };
//状态
    const handleStatusChange = async (val: any, row: any) => {
        const text = val === true ? "发布" : "不发布";
        // prettier-ignore
        await proxy.$modal.confirm("确认要\"" + text + "\"公告吗?", "警告")
            .then(() => {
                noticeUpdateStatus({ id: row.id, status: val }).then(res => {
                    if (res.code == 200) {
                        proxy.$modal.msgSuccess("操作成功");
                    }
                });
            })
            .catch(() => {
                proxy.setTableRowSelected(pageTableRef, row, false);
                row.status = row.status === true ? true : false;
                return;
            });
        //updateUserStatus(row.userId, val);
    };

    const doInitPolicy=()=>{
        handleUpdateForm1();
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
        langTypes,
        handleUpdateForm,
        handleStatusChange,
        uploadParams,
        doChange, uploadUrl, upload,
        isShowTooltip,
        onMouseOver,
        content,
        editorOption,
        doInitPolicy,
        quillEditor,
        doChange1,
        uploadQuill,
        onBeforeUpload,
        afterUploadQuill,
        handleDetail,
        open1,
        detailObj
    };
};
