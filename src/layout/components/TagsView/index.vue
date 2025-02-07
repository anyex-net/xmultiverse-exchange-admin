<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link v-for="tag in visbledViews" :key="tag.path" :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''" :to="{
					path: tag.path,
					query: tag.query,
				}" class="tags-view-item" :style="activeStyle(tag)" @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)">
        {{ generateTitle(tag) }}
        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
          <close class="close" style="width:1em;height: 1em;vertical-align: middle;" />
        </span>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <refresh-right style="width: 1em; height: 1em" /> {{$t('refreshpage')}}
        </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <close style="width: 1em; height: 1em" />{{ $t('currentClose')}}
      </li>
      <li @click="closeOthersTags">
        <circle-close style="width: 1em; height: 1em" /> {{$t('otherColse')}}
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <back style="width: 1em; height: 1em" /> {{$t('leftClose')}}
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <right style="width: 1em; height: 1em" /> {{$t('rightClose')}}
      </li>
      <li @click="closeAllTags(selectedTag)">
        <circle-close style="width: 1em; height: 1em" /> {{$t('allClose')}}
      </li>
    </ul>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed, nextTick, watch, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from "vue-router";
import ScrollPane from './ScrollPane.vue';
import { getNormalPath } from "@/utils/dateTime"
import useTagsViewStore from '@/store/modules/tagsView';
import useSettingsStore from '@/store/modules/settings';
import usePermissionStore from '@/store/modules/permission';
import {generateTitle} from "@/utils/auth"
const visible = ref(false);
const top = ref(0);
const left = ref(0);
const selectedTag=ref<{fullPath?:string,meta?:{path?:string,icon?:string,title?:string},name?:string,path?:string,title?:string}>({
  fullPath:"",
  meta:{
    path:"",
    icon:"",
    title:"",
  },
  name:"",
  path:"",
  title:""
});
const affixTags = ref([]);
const scrollPaneRef = ref<any | null>(null);
const { proxy } = getCurrentInstance() as any;
const route = useRoute();
const router = useRouter();
const visbledViews = computed(() => useTagsViewStore().visitedViews);
const routes = computed(() => usePermissionStore().routes);
const theme = computed(() => useSettingsStore().theme);
watch(route, () => {
  addTags();
  moveToCurrentTag();
});
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});
onMounted(() => {
  initTags();
  addTags();
})

function isActive(r: any) {
  return r.path === route.path
}
function activeStyle(tag: any) {
  if (!isActive(tag)) return {};
  return {
    "background-color": theme.value,
    "border-color": theme.value,
  }
}
function isAffix(tag: any) {
  return tag.meta && tag.meta.affix;
}
function isFirstView() {

  try {
    return (
      selectedTag.value.fullPath === visbledViews.value[1].fullPath || selectedTag.value.fullPath === "/index"
    );
  } catch (err) {
    return false;
  }
}
function isLastView() {
  try {
    return (
      selectedTag.value.fullPath === visbledViews.value[visbledViews.value.length - 1].fullPath
    );
  } catch (err) {
    return false;
  }
}
function filterAffixTags(routes: [], basePath = "") {
 let tags = [] as any;
  routes.forEach((route:any) => {

    if (route.meta && route.meta.affix) {
      const tagPath = getNormalPath(basePath + "/" + route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path);
      if(tempTags.length>=1){
        tags=[...tags,...tempTags];
      }

    }
  });
  return tags;
}
function initTags() {
  const res = filterAffixTags(routes.value);
  affixTags.value = res;
  for(const tag of res){
    if(tag.name){
      useTagsViewStore().addVisitedView(tag);
    }
  }
}
function addTags() {
  const { name } = route;
  if (name) {
    useTagsViewStore().addView(route);
  }
  return false;
}
function moveToCurrentTag() {
  nextTick(() => {
    for (const r of visbledViews.value) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r);
        if (r.fullPath !== route.fullPath) {
          useTagsViewStore().updateVisitedView(route);
        }
      }
    }
  })
}
function refreshSelectedTag(view: any) {
// proxy.$tag.updatePage(view)
proxy.$tab.refreshPage(view);
}
function closeSelectedTag(view: any) {
  proxy.$tab.closePage(view).then((visbledViews:any) => {
    if (isActive(view)) {
      toLastView(visbledViews.visitedViews, view)
    }
  })
}
function closeRightTags() {
  proxy.$tab.closeRightPage(selectedTag.value).then((visbledViews: any) => {
    if (!visbledViews.find((i: any) => i.fullPath === route.fullPath)) {
      toLastView(visbledViews);

    }
  });
}
function closeLeftTags() {
  proxy.$tab.closeLeftPage(selectedTag.value).then((visbledViews: any) => {
    if (!visbledViews.find((i: any) => i.fullPath === route.fullPath)) {
      toLastView(visbledViews.visitedViews)
    }
  })
}
function closeOthersTags() {
  router.push(selectedTag.value).catch(() => { });
  proxy.$tab.closeOtherPage(selectedTag.value).then(() => {
    moveToCurrentTag();
  })
}
function closeAllTags(view: any) {
  proxy.$tab.closeAllPage(view).then(( visbledViews:any ) => {
    if (affixTags.value.some((tag: any) => tag.path === route.path)) {
      return;
    }
    toLastView(visbledViews.visitedViews, view);
  })
}
function toLastView(visitedViews: any, view?: any) {
  const latestView = visitedViews.slice(-1)[0];

  if (latestView) {
    router.push(latestView.fullPath);

  } else {
    if (view.name === "Dashboard") {
      router.replace({ path: "/redirect" + view.fullPath });
    } else {
      router.push("/")
    }
  }
}
function openMenu(tag: any, e: any) {
  const menuMinWidth = 105;
  const offsetLeft = proxy.$el.getBoundingClientRect().left;
  const offsetWidth = proxy.$el.offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const l = e.clientX - offsetLeft + 15;
  if (l > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = l;
  }
  top.value = e.clientY;
  visible.value = true;
  selectedTag.value = tag;
}
function closeMenu() {
  visible.value = false;
}
const handleScroll = () => {
  closeMenu();
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }

  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
<style lang="scss" >
.tags-view-wrapper {
  .tags-view-item {
    .close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
        width: 12px !important;
        height: 12px !important;
      }
    }
  }
}
</style>
