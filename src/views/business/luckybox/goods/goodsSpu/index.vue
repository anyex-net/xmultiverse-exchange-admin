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
            <el-form-item label="ID" prop="id">
                <el-input
                    v-model="queryParams.id"
                    placeholder="请输入"
                    clearable
                    style="width: 240px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input
                    v-model="queryParams.title"
                    placeholder="请输入"
                    clearable
                    style="width: 240px"
                    @keyup.enter.native="handleQuery()"
                    @change="handleQuery()"
                />
            </el-form-item>
            <el-form-item label="品牌名称" prop="brandId">
                <el-select v-model="queryParams.brandId"  clearable  @change="handleQuery()"  placeholder="请选择" style="width: 100%" >
                    <el-option v-for="item in brandList" :key="item.id" :label="item.name"  :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类名称" prop="categoryId">
                <el-tree-select  clearable  @change="handleQuery()" v-model="queryParams.categoryId" :data="treeOptions"
                                :props="{ value: 'id', label: 'name', children: 'children' }" value-key="id"
                                placeholder="请选择" check-strictly filterable :render-after-expand="false"
                                style="width: 100%;" />
            </el-form-item>
            <el-form-item label="品类名称" prop="spgId">
                <el-select v-model="queryParams.spgId" clearable  @change="handleQuery()"  placeholder="请选择" style="width: 100%" >
                    <el-option v-for="item in specList" :key="item.id" :label="item.name"  :value="item.id"></el-option>
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
                    v-hasPermi="['goods:goodsSpu:operator']"
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
                    v-hasPermi="['goods:goodsSpu:operator']"
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
                <el-table-column label="产品ID" fixed prop="id" min-width="150px" />
                <el-table-column
                    label="标题"
                    prop="title"
                    min-width="120px"
                />
                <el-table-column
                    label="副标题"
                    prop="subTitle"
                    min-width="120px"
                />
                <el-table-column
                    label="是否上架"
                    prop="saleable"
                    min-width="100px"
                >
                    <template #default="scope">
                        <span v-if="scope.row.saleable">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="是否有效"
                    prop="valid"
                    min-width="100px"
                >
                    <template #default="scope">
                        <span v-if="scope.row.valid">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    prop="createTime"
                    min-width="150px"
                ><template #default="scope">
                    <span >{{ parseTime(scope.row.createTime) }}</span>
                </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    fixed="right"
                    min-width="120px"
                    class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            type="primary"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['goods:goodsSpu:operator']"
                        ><span class="table_link_text">修改</span></el-link
                        >
                        <el-link
                            class="table_link_btn"
                            :underline="false"
                            size="small"
                            type="primary"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['goods:goodsSpu:operator']"
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

        <!-- 添加或修改商品分类对话框 -->
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
                <el-form-item label="品牌名称" prop="brandId">
                    <el-select v-model="form.brandId"  placeholder="请选择" style="width: 100%" >
                        <el-option v-for="item in brandList" :key="item.id" :label="item.name"  :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类名称" prop="categoryId">
                    <el-tree-select v-model="form.categoryId" :data="treeOptions"
                                    :props="{ value: 'id', label: 'name', children: 'children' }" value-key="id"
                                    placeholder="请选择" check-strictly filterable :render-after-expand="false"
                                    style="width: 100%;" />
                </el-form-item>
                <el-form-item label="品类名称" prop="spgId">
                    <el-select v-model="form.spgId"  placeholder="请选择" style="width: 100%" >
                        <el-option v-for="item in specList" :key="item.id" :label="item.name"  :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input
                        v-model="form.title"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="副标题" prop="subTitle">
                    <el-input
                        v-model="form.subTitle"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="是否上架" prop="saleable">
                    <el-radio-group v-model="form.saleable">
                        <el-radio :label="false">否</el-radio>
                        <el-radio :label="true">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否有效" prop="valid">
                    <el-radio-group v-model="form.valid">
                        <el-radio :label="false">否</el-radio>
                        <el-radio :label="true">是</el-radio>
                    </el-radio-group>
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

<script lang="ts" name="goodsCategory" setup>
import GoodsSpu from "@/api/request/business/luckybox/goods/goodsSpu";
import stacky from "@/utils/table-sticky";

const {getContainer,clearListener,initFixedHeader,updateFixedRight,resizeChange,getFixedDom,setFixedStyle,clearFixedStyle,headerDragend,scrollEvent,getTableXy,getDom,updateHeaderHeight,tablexy,fixedRightDom,fixedLeftDom,scrollDom,parentDom,tableWidth,timerList,tableDom,containerDom,__opened,parent,setScrollXWidth} =stacky();
// prettier-ignore
const {
    loading, single, multiple, open, showSearch, total, configList, title, queryParams, queryFormRef, form, formRef, rules,
    getList, cancel,handleQuery, resetQuery, handleAdd, handleSelectionChange, handleUpdate, submitForm, handleDelete, pageTableRef, cleanSelect,brandList,treeOptions,specList
} = GoodsSpu();
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
