<template>
    <div>
        <div class="user-info-head" @click="editCropper()">
            <img :src="options.img" :title="$t('clicktoupload')" class="img-circle img-lg" />
        </div>
        <el-dialog :title="title" v-model="open" width="800px" append-to-body @opened="modalOpened">
            <el-row>
                <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                    <vue-cropper ref="cropper" :img="options.img" :info="true" :autoCrop="options.autoCrop"
                        :autoCropWidth="options.autoCropWidth" :autoCropHeight="options.autoCropHeight"
                        :fixedBox="options.fixedBox" @realTime="realTime" v-if="visible" />

                </el-col>
                <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                    <div class="avatar-upload-preview">
                        <img :src="options.previews.url" :style="options.previews.img" />
                    </div>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :lg="2" :md="2">
                    <el-upload action="#" :http-request="requestUpload" :show-file-list="false"
                        :before-upload="beforeUpload">
                        <el-button size="small">
                            {{$t('select')}}
                            <i class="upload -right"></i>
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :lg="{ span: 1, offset: 2 }" :md="2">
                    <el-button icon="plus" size="small" @click="changeScale(1)"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button icon="minus" size="small" @click="changeScale(-1)"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button icon="refresh-left" size="small" @click="rotateLeft()"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button icon="refresh-right" size="small" @click="rotateRight()"></el-button>
                </el-col>
                <el-col :lg="{ span: 2, offset: 6 }" :md="2">
                    <!-- prettier-ignore -->
                    <el-button type="primary" size="small" @click="uploadImg()">{{$t('submit')}}</el-button>
                </el-col>
            </el-row>

        </el-dialog>
    </div>
</template>

<script lang='ts' name="userAvatar" setup>
import useUserStore from '@/store/modules/user';
import { ref, getCurrentInstance, reactive,watch } from 'vue'
import { uploadAvatar, updateUserProfile } from "@/api/system/userInfo";
import {useI18n} from 'vue-i18n';
const i18n=useI18n();
const props = defineProps({
    user: {
        type: Object,
        default: {}
    }
});
const { proxy } = getCurrentInstance() as any;
//    是否显示弹出层
const open = ref<boolean>(false);
//
const visible = ref<boolean>(false);
//    弹出层标题
const title = ref<string>(i18n.t('modifyAvatar'));
watch(i18n.locale,()=>{
    title.value=i18n.t('modifyAvatar')
})
const options = reactive<any>({
    img: useUserStore().avatar,//裁剪图片地址
    autoCrop: true,//是否默认生成截图框
    autoCropWidth: 200,//默认生成截图宽度
    autoCropHeight: 200,//默认生成截图高度
    fixedBox: true,//固定截图框大小 不允许改变
    previews: {
        url: '',
        img: '',
    },
    avatarFile: '',
});
//    编辑头像
const editCropper = () => {
    open.value = true
}
//    打开弹出层结束时的问题
const modalOpened = () => {
    visible.value = true;
}
// 覆盖默认上传行为
const requestUpload: any = (pram: any) => {
    options.avatarFile = pram.file
};
// 向左旋转
const rotateLeft = () => {
    proxy.$refs.cropper.rotateLeft();
}
// 图片缩放
const changeScale = (num: any) => {
    num = num || 1;
    proxy.$refs.cropper.changeScale(num);
}
// 向右旋转
const rotateRight = () => {
    proxy.$refs.cropper.rotateRight();
};
// 上传预处理
const beforeUpload = (file: any) => {
    if (file.type.indexOf("image/") == -1) {
        proxy.$modal.msgError(i18n.t('formatisincorrect'));
    } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            options.img = reader.result;
        }
    }
}
// 上传图片
const uploadImg = () => {
    proxy.$refs.cropper.getCropBlob(() => {
        let formData = new FormData();
        formData.append("file", options.avatarFile);
        uploadAvatar(formData).then((response: any) => {
            if (response.code === 200) {
                open.value = false;
                options.img = response.data.url;
                useUserStore().avatar = options.img;
                visible.value = false;
                let obj = {
                    id:props.user.id,
                    filePath:response.data.filePath
                }
                updateUserProfile(obj).then(res => {
                    if(res.code===202){
                        proxy.$modal.msgSuccess(i18n.t('modifiedSuccessfully'));
                    }

                })
            }
        })
    })
}
// 实时预览
const realTime = (data: any) => {
    options.previews = data;
}
</script>

<style lang="scss" scoped>

.user-info-head {
	position: relative;
	display: inline-block;
	height: 120px;
    line-height: 120px;
}

.user-info-head:hover:after {
	content: "+";
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	color: #eee;
	background: rgba(0, 0, 0, 0.5);
	font-size: 24px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	cursor: pointer;
	line-height: 110px;
	border-radius: 50%;
}
</style>
