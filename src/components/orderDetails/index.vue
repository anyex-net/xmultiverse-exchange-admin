<template>
 <div>
     <div class="title">用户信息</div>
     <el-table size="small" stripe  v-loading="loading" :data="userInfo" >
         <el-table-column label="用户名" prop="realName" min-width="110"/>
         <el-table-column label="手机号码" prop="mobileNumber" min-width="160"/>
         <el-table-column label="银行名称" prop="bankName" min-width="120"/>
         <el-table-column label="账户名称" prop="accountName" min-width="150"/>
         <el-table-column label="银行账号" prop="accountNumber" min-width="90"/>
     </el-table>
     <div class="title">用户地址</div>
     <el-table size="small" stripe  v-loading="loading" :data="addressList" >
         <el-table-column label="用户名" prop="name" min-width="110"/>
         <el-table-column label="手机号码" prop="mobile" min-width="160"/>
         <el-table-column label="是否默认地址" prop="isDefault" min-width="90">
             <template #default="scope">
                 <span v-if="scope.row.isDefault==0">否</span>
                 <span v-if="scope.row.isDefault==1">是</span>
             </template>
         </el-table-column>
         <el-table-column label="地址" prop="address" min-width="120">
             <template #default="scope">
                 <span>{{scope.row.area }}{{scope.row.address }}{{scope.row.landmark }}</span>
             </template>
         </el-table-column>
     </el-table>
     <div class="title">我的团队</div>
     <div class="recommend">
         <div class="recommend_title">一级</div>
         <div class="recommend_item">
             <div class="recommend_item_con"><span>推荐总人数</span> <span>{{ firstNum }}</span></div>
             <div class="recommend_item_con"><span>推荐总金额</span> <span>{{ firstTotal }}</span></div>
         </div>
         <div class="recommend_title">二级</div>
         <div class="recommend_item">
             <div class="recommend_item_con"><span>推荐总人数</span> <span>{{ secondNum }}</span></div>
             <div class="recommend_item_con"><span>推荐总金额</span> <span>{{ secondTotal }}</span></div>
         </div>
         <div class="recommend_title">三级</div>
         <div class="recommend_item">
             <div class="recommend_item_con"><span>推荐总人数</span> <span>{{ thirdNum }}</span></div>
             <div class="recommend_item_con"><span>推荐总金额</span> <span>{{ thirdTotal }}</span></div>
         </div>
     </div>
     <el-table
         size="small"
         :data="custLeave"
         style="width: 100%"
         row-key="id"
         :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
     >
         <el-table-column
             prop="name"
             label="用户名">
         </el-table-column>
         <el-table-column  label="用户头像"  prop="name">
             <template #default="scope">
                 <div slot="reference">
                     <el-image
                         style="width: 50px; height: 50px"
                         :src="scope.row.avatarUrl"
                         :preview-src-list="[scope.row.avatarUrl]"
                         :initial-index="1"
                         :z-index="99999"
                         :preview-teleported="true"
                         fit="cover"
                     />
                 </div>
             </template>
         </el-table-column>
         <el-table-column
             prop="mobile"
             label="手机号码">
         </el-table-column>
         <el-table-column
             prop="level"
             label="级别">
         </el-table-column>
         <el-table-column
             prop="registerTime"
             label="注册时间">
         </el-table-column>
     </el-table>
 </div>
</template>

<script lang='ts' setup>
import { ref,onMounted } from 'vue'
import { orderCustomer, orderAddress } from "@/api/biz/order";
import {allCustLevel} from "@/api/cust/custall";
const props = defineProps({
    customerId: {
        type: Number,
        default: '',
    },
})
const loading=ref<boolean>(false);
const userInfo=ref<any[]>([]);
const addressList=ref<any[]>([]);
const custLeave=ref<[]>([]);
const firstNum=ref<number>(0);
const firstTotal=ref<number>(0);
const secondNum=ref<number>(0);
const secondTotal=ref<number>(0);
const thirdNum=ref<number>(0);
const thirdTotal=ref<number>(0);
const getList=()=>{
    userInfo.value=[];
    addressList.value=[];
    loading.value=true;
    orderCustomer(props.customerId).then(res=>{
       loading.value=false;
        if(res.code==200){
           userInfo.value.push(res.data)
        }
    })
    orderAddress(props.customerId).then(res=>{
        if(res.code==200){
            addressList.value=res.data;
        }
    })
    allCustLevel(props.customerId).then(res=>{
        if (res.code==200){
            custLeave.value=res.data.list;
            firstNum.value=res.data.firstNum;
            firstTotal.value=res.data.firstTotal;
            secondNum.value=res.data.secondNum;
            secondTotal.value=res.data.secondTotal;
            thirdNum.value=res.data.thirdNum;
            thirdTotal.value=res.data.thirdTotal;
        }
    })
}
onMounted(()=>{
    getList();
})
console.log('customerId',props.customerId)

</script>

<style lang="scss" scoped>
.title{
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin: 20px 0;
}
.recommend {
    margin-bottom: 10px;

    .recommend_title {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
    }

    .recommend_item {
        display: flex;
        margin: 5px;

        .recommend_item_con {
            width: 200px;
            display: flex;
            justify-content: space-between;
            padding: 20px 10px;
            font-size: 12px;
            box-sizing: border-box;
            margin-right: 10px;
            border: 1px solid #f5f5f5;
        }
    }
}
</style>
