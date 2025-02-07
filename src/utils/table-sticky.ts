import {
  ref,
  onMounted,
  onDeactivated,
  onBeforeUnmount,
  onActivated,
  nextTick,
  watch,
  computed,
} from "vue";
import useAppStore from "@/store/modules/app";
/* 组件需要提供parent字段，指定表格的className（字符串） */
const rafThrottle = (fn: any) => {
  let locked = false;
  return function (...args: any) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame((_) => {
      fn.apply(null, args);
      locked = false;
    });
  };
};
export default () => {
  const tablexy = ref<any>({}); //表格的左边宽度信息
  const fixedRightDom = ref<any>(null); //右侧
  const fixedLeftDom = ref<any>(null); //左侧栏固定
  const scrollDom = ref<any>(null); //滚动的dom
  const parentDom = ref<any>(null); //表格的父元素dom
  const tableWidth = ref<number>(0);
  const timerList = ref<[] | any>([]);
  const tableDom = ref<any>(null);
  const containerDom = ref<any>(null);
  const appStore = useAppStore();
  const parent = "self-table";

  onMounted(() => {
    getContainer();
  });
  const getContainer = () => {
    containerDom.value = document.getElementsByClassName("main-container");
    clearListener();
    let timer = setTimeout(() => {
      initFixedHeader();
      clearTimeout(timer);
    }, 300);
    window.addEventListener("resize", resizeChange);
  };
  onDeactivated(() => {
    clearListener();
  });
  onBeforeUnmount(() => {
    clearListener();
    //取消监听窗口大小
    window.removeEventListener("resize", resizeChange);
  });
  onActivated(() => {
    initFixedHeader();
    updateFixedRight();
    window.addEventListener("resize", resizeChange);
    let timer = 0;
    timer = setTimeout(() => {
      let container = containerDom.value;
      if (container[0].scrollTop > 0) {
        container[0].scrollTop = container[0].scrollTop + 2;
      }
      clearTimeout(timer);
    }, 1000);
  });

  const activatedReload = () => {
    window.addEventListener("resize", resizeChange);
    let timer = setTimeout(() => {
      clearFixedStyle();
      initFixedHeader();
    }, 300);
    timerList.value.push(timer);
  };
  const reset = () => {
    clearFixedStyle();
  };
  // 窗口大小变化时，初始化
  const resizeChange = () => {
    headerDragend();
    let timer = setTimeout(() => {
      initFixedHeader();
      clearTimeout(timer);
    }, 300);
  };

  async function initFixedHeader(): Promise<void> {
    if (parent) {
      parentDom.value = document.getElementsByClassName(parent);
      if (parentDom.value && parentDom.value.length !== 0) {
        tableWidth.value = parentDom.value[0]
          .querySelector(".el-table__header-wrapper")
          .getBoundingClientRect().width;
        setScrollXWidth();
        tableDom.value = parentDom.value[0].getElementsByClassName(
          "el-table__header-wrapper"
        );
        scrollDom.value = document.querySelector(".main-container");
        scrollDom.value.addEventListener("scroll", scrollEvent);
      }
    }
  }
  // 清空监听事件
  const clearListener = () => {
    if (scrollDom.value) {
      scrollDom.value.removeEventListener("scroll", scrollEvent);
      window.removeEventListener("resize", resizeChange);
      clearFixedStyle();
      timerList.value.forEach((key: any) => {
        clearTimeout(key);
      });
    }
  };
  // 更新右侧固定栏
  const updateFixedRight = () => {
    let { fixedRightHeaderDom, dom } = getFixedDom();
    if (dom.classList.contains("fixed")) {
      let timer = setTimeout(() => {
        setFixedStyle({
          dom: fixedRightHeaderDom,
          left: fixedRightDom.value[0].getBoundingClientRect().left + "px",
          width: getComputedStyle(fixedRightDom.value[0]).width,
          scrollLeft: fixedRightHeaderDom.scrollWidth,
        });
        clearTimeout(timer);
      }, 100);
    }
  };
  const headerDragend = async () => {
    await updateWidth();
    await updateFixedRight();
    setScrollXWidth();
    // await this.updateHeaderHeight()
  };
  const setScrollXWidth = () => {
    let timer = setTimeout(() => {
      if (!parentDom.value)
        parentDom.value = document.getElementsByClassName(parent);
      if (parentDom.value.length == 0) return;
      let dom = parentDom.value[0].querySelector(".el-table__header");
      tableWidth.value = parentDom.value[0]
        .querySelector(".el-table__body-wrapper")
        .getBoundingClientRect().width;
      tableDom.value[0].style.width = tableWidth.value + "px";
      updateHeaderHeight();
      // headerWidth.value = dom.style.width;
      clearTimeout(timer);
    }, 200);
  };
  // 更新表格宽度，（拖拽改变宽度时使用）
  const updateWidth = () => {
    if (!parentDom.value)
      parentDom.value = document.getElementsByClassName(parent);
    const bodyWrapperDom = parentDom.value[0].getElementsByClassName(
      "el-table__body-wrapper"
    )[0];
    const width = getComputedStyle(bodyWrapperDom).width; //表格宽度
    // 给表格设置宽度。
    const tableParent = tableDom.value;
    if (tableParent != null) {
      for (let i = 0; i < tableParent.length; i++) {
        tableParent[i].style.width = width;
      }
    }
  };
  const getFixedDom = () => {
    let fixedRightHeaderDom, fixedRightBox, fixedLeftHeaderDom, fixedLeftBox;
    let dom = tableDom.value[0];
    if (fixedLeftDom.value && fixedLeftDom.value[0]) {
      let lefarr = fixedLeftDom.value[0].children;
      fixedLeftHeaderDom = lefarr[0];
      fixedLeftBox = lefarr[1];
    }
    if (fixedRightDom.value && fixedRightDom.value[0]) {
      let rightarr = fixedRightDom.value[0].children;
      fixedRightHeaderDom = rightarr[0];
      fixedRightBox = rightarr[1];
    }
    return {
      fixedRightHeaderDom,
      fixedRightBox,
      fixedLeftHeaderDom,
      fixedLeftBox,
      dom,
    };
  };
  // 更新表头高度，表头高度有可能改变
  const updateHeaderHeight = () => {
    nextTick(() => {
      tableDom.value = parentDom.value[0].getElementsByClassName(
        "el-table__header-wrapper"
      );
      let obj = tableDom.value[0].getBoundingClientRect();
      if (obj.height != tablexy.value.height) {
        tablexy.value.height = obj.height;
        let { dom } = getFixedDom();
        if (dom.classList.contains("fixed")) {
          let timer = setTimeout(() => {
            parentDom.value[0].getElementsByClassName(
              "el-table__fixed-body-wrapper"
            )[0].style.top = 0;
            let container = containerDom.value;
            if (container && container[0]) {
              container[0].scrollTop = container[0].scrollTop + 3;
            }
            clearTimeout(timer);
          }, 100);
        }
      }
    });
  };
  // 获取表格属性
  const getTableXy = () => {
    tablexy.value = tableDom.value[0].getBoundingClientRect();
    tablexy.value.height = tableDom.value[0].offsetHeight;
    // this.tablexy.height=0
    return tablexy.value;
  };
  const getDom = () => {
    if (!parentDom.value) {
      parentDom.value = document.getElementsByClassName(parent);
    }
  };
  // 设置一个变量
  let scrollAbc: any = false;
  //滚动事件
  const scrollEvent = rafThrottle(async (e: any) => {
    getDom();
    tableDom.value = parentDom.value[0].getElementsByClassName(
      "el-table__header-wrapper"
    );
    // if (this.tablexy.top == 0 || !this.tablexy.height || !this.tablexy.top) {
    //   await this.getTableXy()
    // }
    await getTableXy();
    // fixedRightDom.value = parentDom.value[0].getElementsByClassName("el-table__fixed-right");
    // fixedLeftDom.value = parentDom.value[0].getElementsByClassName("el-table__fixed");
    let { height, top, left } = tablexy.value;
    let scrollTop = e.target.scrollTop;
    let {
      fixedRightHeaderDom,
      fixedRightBox,
      fixedLeftHeaderDom,
      fixedLeftBox,
      dom,
    } = getFixedDom();
    if (scrollTop >= top - height / 2 - 10) {
      // 存在右侧固定表头
      if (fixedRightHeaderDom) {
        setFixedStyle({
          dom: fixedRightHeaderDom,
          left: fixedRightDom.value[0].getBoundingClientRect().left + "px",
          width: getComputedStyle(fixedRightDom.value[0]).width,
          scrollLeft: fixedRightHeaderDom.scrollWidth,
        });
        fixedRightBox.style.top = 0;
      }
      // 左侧固定
      if (fixedLeftHeaderDom) {
        setFixedStyle({
          dom: fixedLeftHeaderDom,
          left: left + "px",
          width: getComputedStyle(fixedLeftDom.value[0]).width,
          scrollLeft: 0,
        });
        fixedLeftBox.style.top = 0;
      }
      if (!scrollAbc) {
        dom.classList.add("fixed"); //加一个固定标识
        updateWidth();
        dom.style.position = "fixed";
        dom.style.zIndex = "2000";
        dom.style.top = 83 + "px"; //固定高度的距离
        dom.style.overflow = "hidden";
        setTimeout(() => {
          scrollAbc = true;
        }, 100);
      }
    } else {
      clearFixedStyle();
    }
  });
  //设置固定
  const setFixedStyle = (data: any) => {
    let { dom, scrollLeft, width, left } = data;
    dom.style.zIndex = "2000";
    dom.style.position = "fixed";
    dom.style.top = "83px";
    dom.scrollLeft = scrollLeft;
    dom.style.width = width;
    dom.style.overflow = "hidden";
    dom.style.left = left;
  };
  // 清除header固定
  const clearFixedStyle = () => {
    if (!tableDom.value) return;
    let { height, left } = tablexy.value;
    let {
      dom,
      fixedRightHeaderDom,
      fixedRightBox,
      fixedLeftHeaderDom,
      fixedLeftBox,
    } = getFixedDom();
    if (dom.classList.contains("fixed")) {
      if (fixedRightHeaderDom) {
        fixedRightBox.style.top = height + "px";
        fixedRightHeaderDom.removeAttribute("style");
      }
      if (fixedLeftHeaderDom) {
        fixedLeftHeaderDom.style.zIndex = "0";
        fixedLeftHeaderDom.style.position = "static";
        fixedLeftHeaderDom.style.top = 0 + "px";
        fixedLeftHeaderDom.style.left = left + "px";
        fixedLeftBox.style.top = getComputedStyle(dom).height;
      }
      if (scrollAbc) {
        dom.classList.remove("fixed");
        dom.style.position = "static";
        dom.style.top = "0";
        dom.style.zIndex = "0";
        setTimeout(() => {
          scrollAbc = false;
        }, 100);
      }
    }
  };
  const __opened = computed(() => appStore.sidebar.opened);
  watch(__opened, () => {
    if (__opened) {
      nextTick(() => {
        setScrollXWidth();
      });
    }
  });
  return {
    getContainer,
    clearListener,
    initFixedHeader,
    updateFixedRight,
    resizeChange,
    getFixedDom,
    setFixedStyle,
    clearFixedStyle,
    headerDragend,
    scrollEvent,
    getTableXy,
    getDom,
    updateHeaderHeight,
    tablexy,
    fixedRightDom,
    fixedLeftDom,
    scrollDom,
    parentDom,
    tableWidth,
    timerList,
    tableDom,
    containerDom,
    __opened,
    parent,
    setScrollXWidth,
  };
};
