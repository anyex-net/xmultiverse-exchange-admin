<template>
  <div class="app-container">
    <div class="cardList">
      <div class="title1">
        <div class="leftTitle">需要邀请码注册</div>
        <div class="rightTitle">
          {{ configList["needInvitationCodeRegister"] == "0" ? "否" : "是" }}
        </div>
      </div>
      <div class="title1">
        <div class="leftTitle">非好友发送消息</div>
        <div class="rightTitle">
          {{ configList["allowSendMsgNotFriend"] == "0" ? "否" : "是" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="appConfig" setup>
import appConfig1 from "@/hooks/openim/app/appConfig";
const {
  loading,
  open,
  queryFormRef,
  formRef,
  getList,
  isShowTooltip,
  onMouseOver,
  configList,
  iconUpload,
} = appConfig1();
</script>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}

.img_upload {
  width: 90px;
  height: 90px;
  border: 1px dashed #c1c1c1;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    font-size: 30px;
    color: #c1c1c1;
  }

  .img1 {
    width: 90px;
    height: 90px;
  }
}

.img_upload1 {
  width: 90px;
  height: 90px;
  //border: 1px dashed #c1c1c1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  position: relative;
  margin-bottom: 10px;

  .icon {
    font-size: 30px;
    color: #c1c1c1;
  }

  .img1 {
    width: 90px;
    height: 90px;
  }

  .close {
    display: none;
  }
}

.img_upload1:hover {
  cursor: pointer;

  .close {
    position: absolute;
    top: 0;
    right: 0;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}
.cardList {
  margin-bottom: 30px;
  border-radius: 5px;
  -webkit-box-shadow: 3px -1px 26px 0px rgba(232, 232, 232, 1);
  -moz-box-shadow: 3px -1px 26px 0px rgba(232, 232, 232, 1);
  box-shadow: 3px -1px 26px 0px rgba(232, 232, 232, 1);
  padding: 20px;
  box-sizing: border-box;
  .title1 {
    display: flex;
    margin-bottom: 20px;
    .leftTitle {
      width: 130px;
      font-size: 14px;
      margin: 0 30px 20px 0;
    }
    .rightTitle {
      font-size: 14px;
      color: #6e6e6e;
      margin-right: 15px;
    }
  }
}
</style>
