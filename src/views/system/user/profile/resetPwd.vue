<template>
    <el-form size="small" ref="formRef"  :model="user" :rules="rules" label-width="160px">
        <el-form-item :label="$t('oldpassword')" prop="oldPassword">
            <el-input v-model="user.oldPassword" :placeholder="$t('enteroldpassword')" type="password" show-password />
        </el-form-item>
        <el-form-item :label="$t('newpassword')" prop="newPassword">
            <el-input v-model="user.newPassword" :placeholder="$t('enternewpassword')" type="password" show-password />
        </el-form-item>
        <el-form-item :label="$t('confirmpassword')" prop="confirmPassword">
            <el-input v-model="user.confirmPassword" :placeholder="$t('pleaseConfirmpassword')" type="password" show-password />
        </el-form-item>
        <el-form-item>
            <!-- prettier-ignore -->
            <el-button type="primary" size="small" @click="submit">{{$t('save')}}</el-button>
            <!-- prettier-ignore -->
            <el-button type="danger" size="small" @click="close">{{$t('close')}}</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang='ts' name="restpwd" setup>
import { updateUserPwd } from "@/api/system/user";
import { ElForm } from "element-plus";
import { ref, getCurrentInstance, defineExpose ,watch} from 'vue'
import useTagsViewStore from "@/store/modules/tagsView";
import { useI18n} from 'vue-i18n';
const i18n=useI18n();
const { proxy } = getCurrentInstance() as any;
const formRef = ref<InstanceType<typeof ElForm>>();
const equalToPassword = (rule: any, value: any, callback: any) => {
    if (user.value.newPassword !== value) {
        callback(new Error(i18n.t('nottwopasswords')));
    } else {
        callback();
    }
}
const user = ref({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
})

// 表单校验
const rules = ref({});
watch(i18n.locale,()=>{
    setFormRules();
})
const setFormRules=()=>{
  rules.value={
    oldPassword: [
        {
            required: true,
            message: i18n.t('oldPasswordcannot'),
            trigger: "blur",
        },
    ],
    newPassword: [
        {
            required: true,
            message: i18n.t('newPasswordcannot'),
            trigger: "blur",
        },
        {
            min: 5,
            max: 20,
            message:i18n.t('characterslong'),
            trigger: "blur",
        },
    ],
    confirmPassword: [
        {
            required: true,
            message: i18n.t('confirmPasswordcannot'),
            trigger: "blur",
        },
        {
            required: true,
            validator: equalToPassword,
            trigger: "blur",
        },
    ],
  }
}
setFormRules();
const submit =() => {
    formRef.value?.validate((valid: boolean) => {
		if (valid) {
			// prettier-ignore
	   updateUserPwd(user.value.oldPassword, user.value.newPassword).then((response: any) => {
                if (response.code === 200) {
                    proxy.$modal.msgSuccess(response.message);
                    proxy.resetForm(formRef);
                }else{
                    proxy.$modal.msgError(response.message);
                }

            });
		}
	});
}
const close = () => {
    useTagsViewStore().delView(proxy.$route);
	proxy.$router.push({ path: "/index" });
}
const formReset = () => {
	formRef.value?.resetFields();
};
// 暴露方法
defineExpose({
	formReset,
});
</script>

<style lang="scss" scoped></style>
