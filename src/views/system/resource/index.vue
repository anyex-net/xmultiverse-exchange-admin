<template>
  <div class="app-container">
    <!--		<el-form size="small" :model="queryParams" ref="queryRef"  :inline="true" v-show="showSearch">-->
    <!--			<el-form-item label="资源名称" prop="title">-->
    <!--				<el-input v-model="queryParams.title" placeholder="请输入菜单名称" @keyup.enter="handleQuery()"-->
    <!--					@clear="handleQuery()" />-->
    <!--			</el-form-item>-->
    <!--			<form-search @reset="resetQuery()" @search="handleQuery()" />-->
    <!--		</el-form>-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:resource:operator']"
          type="primary"
          plain
          size="small"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain size="small" @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
      <right-toolbar
        :show="false"
        v-model:showSearch="showSearch"
        @queryTable="handleQuery()"
      />
    </el-row>
    <div class="self-table">
      <el-table
        size="small"
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        row-key="id"
        stripe
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <!-- prettier-ignore -->
        <el-table-column prop="resName" fixed label="资源名称" min-width="160" />
        <el-table-column prop="iconCls" label="图标" min-width="90">
          <template #default="scope">
            <span v-if="scope.row.iconCls">
              <svg-icon :icon-class="scope.row.iconCls" />
            </span>
          </template>
        </el-table-column>
        <!-- prettier-ignore -->
        <el-table-column prop="resCode" label="资源编码" min-width="150" />
        <el-table-column prop="type" label="类型" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.type"> 权限 </span>
            <span v-else> 菜单 </span>
          </template>
        </el-table-column>
        <el-table-column prop="resUrl" label="资源地址" min-width="150" />
        <el-table-column
          prop="resShortUrl"
          label="资源短地址"
          min-width="150"
        />
        <!-- prettier-ignore -->
        <el-table-column prop="sortNum" label="序号" min-width="90" />
        <el-table-column prop="resDest" label="资源描述" min-width="90" />
        <!-- prettier-ignore -->
        <el-table-column label="创建时间" min-width="150" prop="createDate">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createDate) }}</span>
                </template>
            </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="150"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-link
              v-hasPermi="['system:resource:operator']"
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleUpdate(scope.row)"
              ><span class="table_link_text">修改</span></el-link
            >
            <el-link
              v-hasPermi="['system:resource:operator']"
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleAdd(scope.row)"
              ><span class="table_link_text">新增</span></el-link
            >
            <el-link
              v-hasPermi="['system:resource:operator']"
              class="table_link_btn"
              :underline="false"
              type="primary"
              @click="handleDelete(scope.row)"
              ><span class="table_link_text">删除</span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="680px" append-to-body>
      <el-form
        ref="menuRef"
        :model="form"
        :rules="rules"
        label-width="110px"
        size="small"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级资源" prop="parentId">
              <!-- prettier-ignore -->
              <el-tree-select
								v-model="form.parentId"
								:data="menuOptions"
								:props="elTreeProps"
								value-key="id"
								placeholder="选择上级资源"
								check-strictly
                                style="width: 100%;"
                                :render-after-expand="false"
							/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="资源类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio :label="false">菜单</el-radio>
                <el-radio :label="true">权限</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资源图标" prop="icon">
              <el-popover
                placement="bottom-start"
                :width="560"
                v-model:visible="showChooseIcon"
                trigger="click"
                @show="showSelectIcon"
              >
                <template #reference>
                  <!-- prettier-ignore -->
                  <el-input v-model="form.icon" placeholder="点击选择图标" readonly >
										<template #prefix>
                                            <!-- prettier-ignore -->
											<svg-icon
												v-if="form.icon"
												:icon-class="form.icon"
												class="el-input__icon"
												style="height: 32px;width: 16px;"
											/>
                                            <!-- prettier-ignore -->
											<el-icon v-else style="height: 32px;width: 16px;"><search/></el-icon>
										</template>
									</el-input>
                </template>
                <!-- prettier-ignore -->
                <icon-select ref="iconSelectRef" @selected="selected"  />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源名称" prop="resName">
              <el-input v-model="form.resName" placeholder="请输入资源名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortNum">
              <el-input-number
                v-model="form.sortNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="资源编码" prop="resCode">
              <el-input v-model="form.resCode" placeholder="请输入资源编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源地址" prop="resUrl">
              <el-input
                v-model="form.resUrl"
                placeholder="请输入"
                maxlength="255"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源短地址" prop="resShortUrl">
              <el-input
                v-model="form.resShortUrl"
                placeholder="请输入资源短地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源描述" prop="resDest">
              <el-input
                type="textarea"
                v-model="form.resDest"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!-- prettier-ignore -->
          <el-button size="small" type="primary" @click="submitForm()">确 定</el-button>
          <el-button size="small" @click="cancel()">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="resource" setup>
import {} from "vue";

import Resource from "@/hooks/system/resource";
import IconSelect from "@/components/IconSelect/index.vue";
const {
  queryParams,
  showSearch,
  queryRef,
  resetQuery,
  handleQuery,
  handleAdd,
  toggleExpandAll,
  refreshTable,
  loading,
  menuList,
  isExpandAll,
  handleUpdate,
  handleDelete,
  title,
  open,
  menuRef,
  form,
  rules,
  menuOptions,
  elTreeProps,
  showChooseIcon,
  showSelectIcon,
  iconSelectRef,
  selected,
  hideSelectIcon,
  submitForm,
  cancel,
} = Resource();
</script>

<style lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      margin: 5px 0 -5px 10px;
      cursor: pointer;
      width: 30%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
