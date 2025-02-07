<template>
    <el-form size="small" ref="formRef"  :model="user" :rules="rules" label-width="160px">
        <el-form-item :label="$t('username')" prop="userName">
            <el-input v-model="user.userName" />
        </el-form-item>
        <el-form-item :label="$t('cellphoneNumber')" prop="phone">
            <el-input v-model="user.phone" maxlength="11" />
        </el-form-item>
<!--        <el-form-item :label="$t('mail') " prop="email">-->
<!--            <el-input v-model="user.email" maxlength="50" />-->
<!--        </el-form-item>-->
        <el-form-item :label="$t('sex')">
            <el-radio-group v-model="user.gender">
                <el-radio :label="false">{{ $t('male') }}</el-radio>
                <el-radio :label="true">{{ $t('female') }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <!-- prettier-ignore -->
            <el-button type="primary" size="small" @click="submit()">{{ $t('save') }}</el-button>
            <!-- prettier-ignore -->
            <el-button type="danger" size="small" @click="close()">{{ $t('close') }}</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang='ts' setup>
import { ref, getCurrentInstance, watch } from 'vue'
import { updateUserProfile } from "@/api/system/user";
import { ElForm } from "element-plus";
import useTagsViewStore from '@/store/modules/tagsView';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const props = defineProps({
    user: {
        type: Object,
        default: {}
    },
})
const { proxy } = getCurrentInstance() as any;
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = ref<any>({});
watch(i18n.locale, () => {
    setFormRules();
})

const setFormRules = () => {
    rules.value = {
        userName: [
            {
                required: true,
                message: i18n.t('enternickname'),
                trigger: "blur",
            },
        ],
        phone: [
            {
                required: true,
                message: i18n.t('enterphone'),
                trigger: "blur",
            },
            {
                pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                message: i18n.t('correctmobile'),
                trigger: "blur",
            },
        ],
    }
}
setFormRules();
const submit = () => {
    formRef.value?.validate((valid: boolean) => {
        if (valid) {
            updateUserProfile(props.user).then((response: any) => {
                if (response.code ===200) {
                    proxy.$modal.msgSuccess(response.message)
                }
            })
        }
    })
}
const close = () => {
    useTagsViewStore().delView(proxy.$route);
    proxy.$router.push({ path: "/index" });
}
</script>

<style lang="scss" scoped></style>
