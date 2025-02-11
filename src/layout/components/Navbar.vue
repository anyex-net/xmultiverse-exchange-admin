<template>
    <div class="navbar">
        <hamburger id="hamburger-container" class="hamburger-container" :is-active="isActive"
            @toggleClick="toggleSideBar" />
        <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!settingsStore.topNav" /> -->
        <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav"></top-nav>
        <div class="right-menu">
            <template v-if="appStore.device !== 'mobile'">
                <div class="togTop" @click="toggleLeage">
                    <img class="toggleText" src="../../assets/images/toggles.png" style="cursor: pointer;"/>
                </div>
                <header-search id="header-search" class="right-menu-item"></header-search>
                <screenfull id="screenfull" class="right-menu-item hover-effect" />
                <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
                    <size-select id="size-select" class="right-menu-item hover-effect" style="margin-top:13px" />
                </el-tooltip> -->
            </template>
            <div class="avatar-container">
                <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
                    <div class="avatar-wrapper">
                        <img :src="userStore.avatar" class="user-avatar" />
                        <el-icon><caret-bottom /></el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <router-link to="/userInfo/profile">
                                <el-dropdown-item>{{$t('Profile')}}</el-dropdown-item>
                            </router-link>
                            <el-dropdown-item command="setLayout">
                                <span>{{$t('layoutSet')}}</span>
                            </el-dropdown-item>
                            <el-dropdown-item divided command="logout">
                                <span>{{$t('LoginOut')}}</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

        </div>

    </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, watch, computed } from 'vue';
import { ElMessageBox } from "element-plus";
import Hamburger from "@/components/Hamburger/index.vue";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import TopNav from "@/components/TopNav/index.vue";
import HeaderSearch from "@/components/HeaderSearch/index.vue";
import Screenfull from "@/components/Screenfull/index.vue";
// import SizeSelect from "@/components/SizeSelect/index.vue";
import useAppStore from "@/store/modules/app";
import useUserStore from "@/store/modules/user";
import useSettingsStore from '@/store/modules/settings';
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore()
const settingsStore = useSettingsStore();
// 中英文翻译按钮
const toggleLeage = () => {
    if (locale.value === 'zh-cn') {
        locale.value = 'en';
        appStore.setLocal('en');
    } else {
        locale.value = 'zh-cn';
        appStore.setLocal('zh-cn')
    }
}
const isActive = computed(() => appStore.sidebar.opened);
function toggleSideBar() {
    appStore.toggleSideBar();
}
function handleCommand(command: string) {
    switch (command) {
        case "setLayout":
            setLayout();
            break;
        case "logout":
            logout();
            break;
        default:
            break;
    }
}
const emit = defineEmits(["setLayout"]);
function logout() {
    ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            userStore.logOut().then(() => {
                console.log('5555')
                router.push({ path: '/login' })
            });
        })
        .catch(() => { });
}
function setLayout() {
    emit("setLayout");
}

</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    background-color: #ffffff;
    .hamburger-container {
        line-height: 46px;
        height: 100%;
        // background-color: palegoldenrod;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }

    }

    .breadcrumb-container {
        float: left;
    }

    .topmenu-container {
        position: absolute;
        left: 50px;
        width: 80%;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;
        display: flex;

        // background-color: palegoldenrod;
        .togTop {
            display: inline-block;
            height: 50px;
            vertical-align: top;
            padding: 16px 0;
            margin-right: 10px;

            .toggleText {
                width: 18px;
                height: 18px;
                vertical-align: top;
            }
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 40px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                i {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
