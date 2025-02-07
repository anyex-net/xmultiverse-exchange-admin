<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="6" :xs="24">
                <el-card class="box-card">
                    <template #header>
                        <div class="clearfix">
                            <span>{{$t('personalinformation')}}</span>
                        </div>
                    </template>
                    <div>
<!--                        <div class="text-center">-->
<!--                            <userAvatar :user="user" />-->
<!--                        </div>-->
                        <ul class="list-group list-group-striped">
                            <li class="list-group-item">
                                <span>
                                    <svg-icon icon-class="user" style="margin-right: 5px;" />{{$t('username')}}
                                </span>
                                <span class="pull-right">
                                    {{ user.userName
                                    }}
                                </span>
                            </li>
                            <li class="list-group-item">
                                <span>
                                    <svg-icon icon-class="user" style="margin-right: 5px;" />{{$t('cellphoneNumber')}}
                                </span>
                                <span class="pull-right">
                                    {{ user.phone}}
                                </span>
                            </li>
<!--                            <li class="list-group-item">-->
<!--                                <span>-->
<!--                                    <svg-icon icon-class="user" style="margin-right: 5px;" />{{$t('usermailbox')}}-->
<!--                                </span>-->
<!--                                <span class="pull-right">-->
<!--                                    {{ user.email }}-->
<!--                                </span>-->
<!--                            </li>-->
                            <li class="list-group-item">
                                <span>
                                    <svg-icon icon-class="user" style="margin-right: 5px;" />{{$t('datecreated')}}
                                </span>
                                <span class="pull-right">
                                    {{ parseTime(user.createTime) }}
                                </span>
                            </li>

                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18" :xs="24">
                <el-card>
                    <template #header>
                        <div class="clearfix">
                            <span>{{$t('basicInformationer')}}</span>
                        </div>
                    </template>
                    <el-tabs v-model="activeTab">
                        <el-tab-pane :label="$t('basicInformationer')" name="userinfo">
                            <userInfo :user="user" />
                        </el-tab-pane>
                        <el-tab-pane :label="$t('changepassword')" name="resetPwd">
                            <resetPwd   />
                        </el-tab-pane>
                    </el-tabs>
                </el-card>

            </el-col>
        </el-row>
    </div>
</template>

<script lang='ts' name="profile" setup>
import { ref, onMounted } from 'vue'
import userAvatar from "./userAvatar.vue";
import userInfo from "./userInfo.vue";
import resetPwd from "./resetPwd.vue";
import { getInfo } from "@/api/login";

const activeTab = ref<string>('userinfo')
const user = ref<{ realName: string; mobile: string; email: string; createTime: string }>({
    realName: '',
    mobile: '',
    email: '',
    createTime: '',
})
const getUser = () => {
    getInfo().then((response: any) => {
        if (response.code === 200) {
            user.value = response.data
        }

    })
}
onMounted(() => {
    getUser();
})
</script>

<style lang="scss" scoped></style>
