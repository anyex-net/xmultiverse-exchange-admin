<template>
    <div class="app-container">
        <el-form
            size="small"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            v-show="showSearch"
            label-width="70px"
        >
            <el-form-item label="奖品名称" prop="prizeName">
                <el-input
                    v-model="queryParams.prizeName"
                    placeholder="请输入"
                    clearable
                    style="width: 240px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="游戏名称" prop="gameId">
                <el-select v-model="queryParams.gameId"  clearable placeholder="请选择"    @change="handleQuery()" style="width: 240px">
                    <el-option  v-for="item in gameType" :key="item.id"
                                :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <!-- prettier-ignore -->
            <form-search @reset="resetQuery()" @search="handleQuery()" />
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="handleAdd"
                    v-hasPermi="['game:gamePrize:operator']"
                >新增</el-button
                >
            </el-col>

            <el-col :span="1.5" >
                <el-button
                    type="danger"
                    plain
                    size="small"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['game:gamePrize:operator']"
                >删除</el-button
                >
            </el-col>
            <!-- prettier-ignore -->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList()" />
        </el-row>
        <div class="self-table" >
            <el-table
                size="small"
                stripe
                v-loading="loading"
                ref="pageTableRef"
                :data="configList"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column
                    label="游戏ID"
                    prop="gameId"
                    min-width="150px"
                    fixed
                />
                <el-table-column
                    label="奖品名称"
                    prop="prizeName"
                    min-width="120px"
                />
                <el-table-column
                    label="成本"
                    prop="cost"
                    min-width="100px"
                />
                <el-table-column
                    label="商品价格"
                    prop="price"
                    min-width="100px"
                />
                <el-table-column
                    label="百份中奖数量"
                    prop="percentWinningAmount"
                    min-width="100px"
                />
                <el-table-column
                    label="奖励金额"
                    prop="rewardBalance"
                    min-width="100px"
                />
                <el-table-column
                    label="奖品图片"
                    prop="prizeImgUrl"
                    min-width="100px"
                >
                    <template #default="scope">
                        <el-image
                            v-if="scope.row.prizeImgUrl!=''"
                            style="width: 40px; height: 40px"
                            :src="uploadUrl+scope.row.prizeImgUrl"
                            :preview-src-list="[uploadUrl+scope.row.prizeImgUrl]"
                            :initial-index="1"
                            :z-index="99999"
                            :preview-teleported="true"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="是否启用"
                    prop="status"
                    min-width="100px"
                >
                    <template #default="scope">
                        <el-switch
                            v-model="scope.row.status"
                            class="mb-2"
                            :active-value="true"
                            :inactive-value="false"
                            style="--el-switch-on-color: #00CD00; --el-switch-off-color: #CDBA96"
                            @change="handleStatusChange($event, scope.row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="备注"
                    prop="remark"
                    min-width="120px"
                />
                <el-table-column
                    label="创建时间"
                    prop="createTime"
                    min-width="140px"
                ><template #default="scope">
                    <span >{{ parseTime(scope.row.createTime) }}</span>
                </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="100px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            type="primary"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['game:gamePrize:operator']"
                        ><span class="table_link_text">修改</span></el-link
                        >
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['game:gamePrize:operator']"
                        ><span class="table_link_text">删除</span></el-link
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.current"
            v-model:limit="queryParams.size"
            @pagination="getList()"
        />

        <!-- 添加或修改游戏奖品对话框 -->
        <el-dialog
            :title="title"
            v-model="open"
            width="500px"
            append-to-body
            @close="cleanSelect()"
        >
            <el-form
                size="small"
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="120px"
            >
                <el-form-item label="游戏名称" prop="gameId">
                    <el-select v-model="form.gameId" placeholder="请选择" style="width: 400px">
                        <el-option  v-for="item in gameType" :key="item.id"
                                   :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="奖品名称" prop="prizeName">
                    <el-input
                        v-model="form.prizeName"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="成本" prop="cost">
                    <el-input
                        type="number"
                        v-model="form.cost"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                    <el-input
                        type="number"
                        v-model="form.price"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="百份中奖数量" prop="percentWinningAmount">
                    <el-input
                        type="number"
                        v-model="form.percentWinningAmount"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="奖励金额" prop="rewardBalance">
                    <el-input
                        type="number"
                        v-model="form.rewardBalance"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="奖品图片" prop="prizeImgUrl">
                    <!--                    :http-request="handleUpdateForm"-->
                    <el-upload ref="upload" class="upload-demo" accept=".png, .jpg,.jpeg,.gif,.webp,.jfif"
                               :auto-upload="false" :on-change="doChange"    :action="uploadUrl"  :data="uploadParams" :show-file-list="false">
                        <div v-if="form.prizeImgUrl ==''" class="img_upload">
                            <el-icon class="icon">
                                <Plus />
                            </el-icon>
                        </div>
                        <div v-else class="img_upload">
                            <img class="img1" :src="uploadUrl+form.prizeImgUrl" alt="">
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="false">未启用</el-radio>
                        <el-radio :label="true">启用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        type="textarea"
                        v-model="form.remark"
                        placeholder="请输入"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <!-- prettier-ignore -->
                    <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
                    <el-button size="small" @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" name="goodsBrand" setup>
import GamePrize from "@/api/request/business/luckybox/game/gamePrize";
import stacky from "@/utils/table-sticky";

const {getContainer,clearListener,initFixedHeader,updateFixedRight,resizeChange,getFixedDom,setFixedStyle,clearFixedStyle,headerDragend,scrollEvent,getTableXy,getDom,updateHeaderHeight,tablexy,fixedRightDom,fixedLeftDom,scrollDom,parentDom,tableWidth,timerList,tableDom,containerDom,__opened,parent,setScrollXWidth} =stacky();
// prettier-ignore
const {
    loading, single, multiple, open, showSearch, total, configList, title, queryParams, queryFormRef, form, formRef, rules,
    getList, cancel,handleQuery, resetQuery, handleAdd, handleSelectionChange, handleUpdate, submitForm, handleDelete, pageTableRef, cleanSelect,handleUpdateForm,handleStatusChange,uploadParams,doChange,upload,uploadUrl,gameType
} = GamePrize();
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
    width: 130px;
    height: 130px;
    border: 1px dashed #c1c1c1;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
        font-size: 30px;
        color: #c1c1c1;

    }

    .img1 {
        width: 130px;
        height: 130px;
    }

}
</style>
