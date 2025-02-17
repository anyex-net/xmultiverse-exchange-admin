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
    listGoodsSku,
    getGoodsSku,
    addGoodsSku,
    delGoodsSku,
    uploadPolicy,
    spuLists,
    specParamList,
    pullOffGoods,putOnGoods
} from "@/api/business/luckybox/goods/goodsSku";
import { ElForm, ElTable } from "element-plus";
import { isStrings } from "@/utils/validate";
import { getSuffix, randomString } from "@/utils/dateTime";

export default () => {
  const { proxy } = getCurrentInstance() as any;
  const upload = ref<any>();
  const upload1 = ref<any>();
  const iconUpload = ref<any>();
  const state = reactive<any>({
    // 查询参数
    queryParams: {
      current: 1,
      size: 50,
      title: "",
      spuId: "",
      id: "",
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
    open1: false,
    open2: false,
    // 表单参数
    form: {
      id: "",
      iconImage: "",
      detailImages: [],
      mainImages: [],
      param: [],
      price: "",
      saleable: false,
      spuId: "",
      title: "",
      valid: false,
      description: "",
      sellingPoint: "",
      subTitle: "",
      stock: "",
      spgId: "",
    },
    mainImages: [],
    detailImages:[],
    // 表单校验
    rules: {
      title: [
        {
          required: true,
          message: "商品标题不能为空",
          trigger: "blur",
        },
      ],
      subTitle: [
        {
          required: false,
          message: "商品副标题不能为空",
          trigger: "blur",
        },
      ],
      mainImages: [
        {
          required: true,
          message: "商品主图不能为空",
          trigger: "blur",
        },
      ],
      iconImage: [
        {
          required: true,
          message: "商品图标不能为空",
          trigger: "blur",
        },
      ],
      detailImages: [
        {
          required: true,
          message: "商品详情图不能为空",
          trigger: "blur",
        },
      ],
      price: [
        {
          required: true,
          message: "价格不能为空",
          trigger: "blur",
        },
      ],
      stock: [
        {
          required: true,
          message: "库存数量不能为空",
          trigger: "blur",
        },
      ],
      spuId: [
        {
          required: true,
          message: "产品名称不能为空",
          trigger: "blur",
        },
      ],
      param: [
        {
          required: true,
          message: "参数不能为空",
          trigger: "blur",
        },
      ],
    },
    rules1: {
      label: [{ required: true, message: "参数值不能为空", trigger: "blur" }],
      name: [{ required: true, message: "参数标题不能为空", trigger: "blur" }],
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
    spuList: [], //产品列表
    specList: [], //品类参数列表
    fileList: [],
    fileList1: [],
    param: [],
  });

  const queryFormRef = ref<InstanceType<typeof ElForm>>();
  const formRef = ref<InstanceType<typeof ElForm>>();
  const pageTableRef = ref<InstanceType<typeof ElTable>>();
  const isShowTooltip = ref<boolean>(true);
  const change1Arr1 = ref<boolean>(true);
  const change1Arr2 = ref<boolean>(true);
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
    spuList,
    specList,
    fileList,
    open1,
    param,
    rules1,
    mainImages,
    open2,
    fileList1,
    detailImages,
  } = toRefs(state);

  /** 查询商品品牌列表 */
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
    listGoodsSku(queryParams.value).then((response) => {
            if (response.code === 200) {
                configList.value = response.data.records;
                total.value = response.data.total;
                loading.value = false;
            }

        });
  };
  //查询所有spu数据列表
  const getspuList = () => {
    spuLists().then((res) => {
      if (res.code == 200) {
        spuList.value = res.data;
      }
    });
  };
  getspuList();
  //查询产品参数
  const getSpecParamList = (spgId: any) => {
    specParamList(spgId).then((res) => {
      if (res.code == 200) {
        specList.value = res.data;
      }
    });
  };
  //选择产品名称
  const getSpuSelect = (item: any) => {
    getSpecParamList(item.spgId);
  };
  //  参数
  const getparamSelect = (item: any) => {
    let isShow = param.value.findIndex((val: any) => val == item.paramName);
    //判断去重法
    if (isShow === -1) {
      form.value.param = form.value.param.filter((v: any) => {
        return param.value.includes(v.name);
      });
    } else {
      var obj = {
        name: item.paramName,
        label: "",
        unit: item.unit,
      };
      form.value.param.push(obj);
    }
  };
  //删除参数
  const getClear = (e: any) => {
    form.value.param = form.value.param.filter((i: any) => {
      return e != i.name;
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
      iconImage: "",
      detailImages: [],
      mainImages: [],
      param: [],
      price: "",
      saleable: false,
      spuId: "",
      title: "",
      valid: false,
      description: "",
      sellingPoint: "",
      subTitle: "",
      stock: "",
      spgId: "",
    };
    param.value = [];
    detailImages.value = [];
    mainImages.value = [];
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
    title.value = "添加商品SKU";
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
    getGoodsSku(configId).then((response: any) => {
      // form.value = response.data;
      form.value.param = [];
      param.value = [];
      form.value.id = response.data.id;
      form.value.iconImage = response.data.iconImage;
      form.value.detailImages = JSON.parse(response.data.detailImages);
      form.value.mainImages = JSON.parse(response.data.mainImages);
      form.value.price = response.data.price;
      form.value.stock = response.data.stock;
      form.value.saleable = response.data.saleable;
      form.value.spuId = response.data.spuId;
      form.value.title = response.data.title;
      form.value.description = response.data.description;
      form.value.valid = response.data.valid;
      form.value.subTitle = response.data.subTitle;
      form.value.spgId = response.data.spgId;
      form.value.sellingPoint = response.data.sellingPoint;
      mainImages.value = form.value.mainImages;
      detailImages.value = form.value.detailImages;
      const params = JSON.parse(response.data.param);
      const params1 = Object.assign([], params);
      transformArray(params1);
      getSpecParamList(form.value.spgId);
      form.value.param = transformArray(params1);
      form.value.param.forEach((v: any) => {
        param.value.push(v.name);
      });
      open.value = true;
      title.value = "修改商品SKU";
      proxy.setTableRowSelected(pageTableRef, row, true);
    });
  };
  const transformArray = (arr: any) => {
    var arr1: any = [];
    arr.forEach((item: any) => {
      Object.keys(item).forEach(function (key) {
        if (key !== "单位") {
          var name = key;
          var label = item[key];
          var unit = item["单位"];
          arr1.push({
            name: name,
            label: label,
            unit: unit,
          });
        }
      });
    });

    return arr1;
  };
  /** 提交按钮 */
  const submitForm = async () => {
    await formRef.value?.validate((valid: boolean) => {
      if (valid) {
        const params = form.value.param.reduce((result: any, item: any) => {
          result.push({
            [item.name]: item.label,
            ["单位"]: item.unit,
          });
          return result;
        }, []);
        let params1 = Object.assign({}, params);
        var obj = {
          id: form.value.id,
          iconImage: form.value.iconImage,
          detailImages: JSON.stringify(form.value.detailImages),
          mainImages: JSON.stringify(form.value.mainImages),
          param: JSON.stringify(params1),
          price: form.value.price,
          saleable: form.value.saleable,
          spuId: form.value.spuId,
          title: form.value.title,
          valid: form.value.valid,
          description: form.value.description,
          sellingPoint: form.value.sellingPoint,
          subTitle: form.value.subTitle,
          stock: form.value.stock,
        };
        if (form.value.id != "") {
          addGoodsSku(obj).then((response) => {
            if (response.code === 200) {
              proxy.$modal.msgSuccess("修改成功");
              open.value = false;
              getList();
            }
          });
        } else {
          addGoodsSku(obj).then((response) => {
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
    proxy.$modal.confirm("是否确认删除商品SKU编号为\"" + configIds + "\"的数据项?", "警告")
            .then(() => {
                return delGoodsSku(query.value);
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
  //商品主图图片
  const handleUpdateForm = (file: any) => {
    change1Arr1.value = false;
    return new Promise((resolve, reject) => {
      uploadPolicy()
        .then((res: any) => {
          if (res.code == 200) {
            uploadParams.value.name = file.name;
            uploadParams.value.policy = res.data.policy;
            uploadParams.value.signature = res.data.signature;
            uploadParams.value.OSSAccessKeyId = res.data.accessid;
            uploadParams.value.key =
              "wivpal/" + randomString(10) + getSuffix(file.name);
            mainImages.value.push(uploadParams.value.key);
            setTimeout(() => {
              change1Arr1.value = true;
            }, 2000);
            resolve(true);
          }
        })
        .catch((error) => {
          // @ts-ignore
          reject(new Error(false)); // 停止上传
        });
    });
  };
  //详情图
  const handleUpdateForm1 = (file: any) => {
    change1Arr2.value = false;
    return new Promise((resolve, reject) => {
      uploadPolicy()
        .then((res: any) => {
          if (res.code == 200) {
            uploadParams.value.name = file.name;
            uploadParams.value.policy = res.data.policy;
            uploadParams.value.signature = res.data.signature;
            uploadParams.value.OSSAccessKeyId = res.data.accessid;
            uploadParams.value.key =
              "wivpal/" + randomString(10) + getSuffix(file.name);
            detailImages.value.push(uploadParams.value.key);
            setTimeout(() => {
              change1Arr2.value = true;
            }, 2000);
            resolve(true);
          }
        })
        .catch((error) => {
          // @ts-ignore
          reject(new Error(false)); // 停止上传
        });
    });
  };
  // 商品主图
  const doChange = (file: any) => {
    proxy.$modal.msgError("最多可以上传5张商品主图");
  };
  //删除商品主图
  const getCloseDel = (item: any) => {
    form.value.mainImages = form.value.mainImages.filter((v: any) => {
      return item != v;
    });
    mainImages.value = mainImages.value.filter((v: any) => {
      return item != v;
    });
  };
  //商品详情图
  const doChange1 = (file: any) => {
    proxy.$modal.msgError("最多可以上传15张商品详情图");
  };
  //删除商品详情图
  const getCloseDel1 = (item: any) => {
    form.value.detailImages = form.value.detailImages.filter((v: any) => {
      return item != v;
    });
    detailImages.value = detailImages.value.filter((v: any) => {
      return item != v;
    });
  };
  const getProduct = () => {
    if (form.value.mainImages.length >= 5) {
      proxy.$modal.msgError("最多只能上传5张商品主图");
    } else {
      open1.value = true;
      fileList.value = [];
      form.value.mainImages.forEach((v: any) => {
        var obj = {
          name: v,
          url: uploadUrl + v,
        };
        fileList.value.push(obj);
      });
    }
  };
  const getProduct1 = () => {
    if (form.value.detailImages.length >= 15) {
      proxy.$modal.msgError("最多只能上传15张详情图");
    } else {
      open2.value = true;
      fileList1.value = [];
      form.value.detailImages.forEach((v: any) => {
        var obj = {
          name: v,
          url: uploadUrl + v,
        };
        fileList1.value.push(obj);
      });
    }
  };
  //商品主图
  const submitFormUpdate1 = () => {
    open1.value = false;
    form.value.mainImages = mainImages.value;
  };
  //商品详情图
  const submitFormUpdate2 = () => {
    open2.value = false;
    form.value.detailImages = detailImages.value;
  };
  //商品图标
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
              form.value.iconImage = uploadParams.value.key;
            }, 1000);
            if (iconUpload.value) {
              iconUpload.value.clearFiles();
            }
          });
        }
      })
      .catch();
  };
  //商品图标
  const iconChange = (file: any) => {
    uploadParams.value.name = file.raw.name;
    handleUpdateImage();
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
  //上架状态
  const handleStatusChange = async (val: any, row: any) => {
    proxy.setTableRowSelected(pageTableRef, row, true);
    const text = val === true ? "上架" : "下架";
    if (val === true) {
      // prettier-ignore
      await proxy.$modal.confirm('确认要' + text + '吗?',"提示")
        .then(() => {
            putOnGoods(row.id).then(res=>{
                if (res.code==200){
                    proxy.$modal.msgSuccess('操作成功');
                    getList();
                }
            });
        })
        .catch(() => {
            proxy.setTableRowSelected(pageTableRef, row, false);
            row.saleable = row.saleable === false ? true : false;
            return;
        });
    } else {
      // prettier-ignore
      await proxy.$modal.confirm('确认要' + text + '吗?',"提示")
        .then(() => {
            pullOffGoods(row.id).then(res=>{
                if (res.code==200){
                    proxy.$modal.msgSuccess('操作成功');
                    getList();
                }
            });
        })
        .catch(() => {
            proxy.setTableRowSelected(pageTableRef, row, false);
            row.saleable = row.saleable === false ? true : false;
            return;
        });
      //updateUserStatus(row.userId, val);
    }
  };
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
        uploadParams,
        doChange,
        uploadUrl,
        upload,
        spuList,
        specList,
        getSpuSelect,
        upload1,
        doChange1,
        fileList,
        open1,
        submitFormUpdate1,
        getProduct,
        getparamSelect,
        param,
        getClear,
        getCloseDel,
        getCloseDel1,
        rules1,
        mainImages,
        handleUpdateForm1,
        open2,
        submitFormUpdate2,
        getProduct1,
        fileList1,
        detailImages,
        isShowTooltip,
        onMouseOver,
        iconChange,
        iconUpload,change1Arr1,change1Arr2,handleStatusChange
    };
};
