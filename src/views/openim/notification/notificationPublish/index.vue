<template>
  <div class="appcontainer1">
    <div class="card12">
      <el-form
        size="small"
        ref="formRef"
        label-position="top"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
         <el-form-item label="通知账号" prop="sendID">
          <el-select
            v-model="form.sendID"
            placeholder="选择账号"
            style="width: 240px"
            clearable
            @change="goChange"
          >
            <el-option
              v-for="(item1, index) in selectList"
              :key="index"
              :label="item1.nickname"
              :value="item1.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="接收用户" prop="recvIDs" style="font-weight: bold">
          <div class="showCard1a">
            <div
              class="showC2"
              v-for="(item, index) in showListClear"
              :key="index"
            >
              <span class="showspan"
                >{{ item.accountName }}
                <el-icon class="showii" @click="delArr(item.id)"
                  ><Close
                /></el-icon>
              </span>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="附件(选填)"
          prop="content.pictureElem.bigPicture.url"
          style="width: 100%; font-weight: 600"
        >
          <el-upload
            ref="iconUpload"
            class="upload-demo"
            accept=".png, .jpg,.jpeg,.gif,.webp"
            :auto-upload="false"
            :on-change="iconChange"
            :action="uploadUrl"
            :data="uploadParams"
            :show-file-list="false"
          >
            <div
              v-if="form.content.pictureElem.bigPicture.url == ''"
              class="img_upload img2c"
            >
              +
            </div>
            <div v-else class="img_upload">
              <img
                class="img1"
                :src="uploadUrl + form.content.pictureElem.bigPicture.url"
                alt=""
              />
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="地址链接(选填)" prop="hash">
          <el-input v-model="form.hash" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="消息内容" prop="content.text">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5 }"
            v-model="form.content.text"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item prop="isSendAll">
          <el-checkbox
            v-model="form.isSendAll"
            label="发送给所有已注册用户"
            size="large"
          />
        </el-form-item>
      </el-form>
      <div class="btbtn">
        <el-button type="primary" class="btn1" @click="sendNotify" size="small"
          >发送
        </el-button>
      </div>
    </div>
    <div class="self-table showcard">
      <el-table
        size="small"
        :row-key="getRowKeys"
        v-loading="loading"
        ref="pageTableRef"
        :row-style="tableRowClassName"
        :data="configList"
        @select="handleSelectionChange1"
        @select-all="selectAll"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :reserve-selection="true"
        />
        <el-table-column label="ID" prop="id" min-width="140px" />
        <el-table-column label="用户头像" prop="headUrl" min-width="120px">
          <template #default="scope">
            <el-image
              style="width: 30px; height: 30px;border-radius: 5px"
              :src="scope.row.headUrl"
              :preview-src-list="[scope.row.headUrl]"
              :initial-index="1"
              :z-index="99999"
              :preview-teleported="true"
              v-if="scope.row.headUrl !== 'headUrl'"
            />
            <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column
          label="用户昵称"
          prop="accountName"
          min-width="120px"
        />
        <el-table-column label="用户ID" prop="userId" min-width="120px" />
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.current"
        v-model:limit="queryParams.size"
        @pagination="getList()"
      />
    </div>
  </div>
</template>

<script lang="ts" name="notificationPublish" setup>
import NotificationPublish from "@/api/request/openim/notification/notificationPublish";
import stacky from "@/utils/table-sticky";

const {
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
} = stacky();
const {
  loading,
  selectList,
  total,
  configList,
  queryParams,
  form,
  formRef,
  rules,
  goChange,
  getList,
  handleSelectionChange,
  pageTableRef,
  tableRowClassName,
  handleSelectionChange1,
  selectAll,
  getRowKeys,
  uploadParams,
  uploadUrl,
  iconChange,
  showListClear,
  delArr,
  iconUpload,
  sendNotify,
} = NotificationPublish();
</script>
<style lang="scss" scoped>
.appcontainer1 {
  display: flex;
  padding: 15px;
  box-sizing: border-box;
  .card12 {
    flex: 2;
    margin-right: 30px;
    .showCard1a {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 120px;
      align-items: top;
      overflow-y: auto;
      background-color: #fff;
      padding: 12px;
      border-radius: 5px;
      box-sizing: border-box;
      box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.05);
      .showC2 {
        padding: 10px 25px 10px 15px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 10px 10px 0;
        box-sizing: border-box;
        border: 1px solid rgba(0, 0, 0, 0.05);
        .showspan {
          display: flex;
          align-items: center;
          position: relative;
          display: block;
          color: #000;
          font-size: 12px;
          font-weight: 500;
          .showii {
            position: absolute;
            right: -18px;
            top: 50%;
            transform: translateY(-50%);
            color: #8c8b8b;
          }
          .showii:hover {
            cursor: pointer;
            color: #000;
          }
        }
      }
    }
  }

  .showcard {
    border-radius: 6px;
    flex: 1;
    background-color: #fff;
    box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.05);
    padding: 20px;
    box-sizing: border-box;
  }
}
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
.img2c {
  width: 90px;
  height: 40px;
  border-radius: 8px;
  font-weight: 400;
    font-size: 20px;
  border: 1px solid #c1c1c1;
    color:#c1c1c1;
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
.btbtn {
  display: flex;
  justify-content: center;
  .btn1 {
    width: 200px;
    height: 35px;
  }
}
</style>
