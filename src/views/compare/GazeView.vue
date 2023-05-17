<template>
  <div>
    <el-container  style="height: 730px; border: 1px solid #eee; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
        <el-header style="font-size:40px; background-color: rgb(238, 241, 246)">全链路软解对比软件——凝视</el-header>
            <el-container>
                <!-- 侧边栏 -->
                <el-aside width="220px" style="border: 1px solid #eee">
                    <el-menu :default-openeds="['1']" :router=true>
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-menu"></i>压缩模式</template>
                            <el-menu-item index="1-1" route="/scan">扫描</el-menu-item>
                            <el-menu-item index="1-2" route="/gaze">凝视</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>

                <!-- 主模块 -->
                <el-main>
                    <!-- 粘贴文件夹路径 -->
                    <el-form :model="formInline" class="demo-form-inline">
                        <el-row gutter="10">
                            <el-col :span="10">
                                <el-form-item label="全链路" label-width="100px">
                                    <el-input v-model="formInline.srcDirPath" placeholder="请粘贴全链路文件夹路径"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="软解" label-width="100px">
                                    <el-input v-model="formInline.destDirPath" placeholder="请粘贴软解文件夹路径"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item>
                                    <el-button type="primary" @click="compare">对比<i class="el-icon-document-copy el-icon--right"></i></el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

          <!-- 表格 -->
                    <template>
                        <!-- <el-button @click="resetResFilter">清除对比结果过滤器</el-button> -->
                        <el-table
                            ref="filterTable"
                            :data="tableData"
                            height="550"
                            border
                            style="width: 100%"
                            @header-click="flushData">
                            <el-table-column
                            prop="id"
                            label="ID"
                            width="60">
                            </el-table-column>
                            <el-table-column
                            prop="res"
                            label="对比结果"
                            column-key="res_key"
                            :filters="[{text: '相等', value: 0}, {text: '压缩帧头不同', value: 1}, {text: '相机帧头不同', value: 2}, 
                                        {text: '压缩码流不同', value: 3}, {text: '相机帧尾不同', value: 4}, {text: '压缩帧尾不同', value: 5}, 
                                        {text: '对比源没找到', value: 6}, {text: '丢数据', value: 7}]"
                            :filter-method="filterHandler"
                            filter-placement="bottom-end"
                            width="150">
                            <template slot-scope="scope">
                                <span v-if="scope.row.res === 0"><el-tag type="success" disable-transitions>相等</el-tag></span>
                                <span v-else-if="scope.row.res === 1"><el-tag type="danger" disable-transitions>压缩帧头不同</el-tag></span>
                                <span v-else-if="scope.row.res === 2"><el-tag type="danger" disable-transitions>相机帧头不同</el-tag></span>
                                <span v-else-if="scope.row.res === 3"><el-tag type="danger" disable-transitions>压缩码流不同</el-tag></span>
                                <span v-else-if="scope.row.res === 4"><el-tag type="danger" disable-transitions>相机帧尾不同</el-tag></span>
                                <span v-else-if="scope.row.res === 5"><el-tag type="danger" disable-transitions>压缩帧尾不同</el-tag></span>
                                <span v-else-if="scope.row.res === 6"><el-tag type="warning" disable-transitions>对比源没找到</el-tag></span>
                                <span v-else-if="scope.row.res === 7"><el-tag type="danger" disable-transitions>丢数据</el-tag></span>
                                <span v-else><el-tag type="info" disable-transitions>异常</el-tag></span>
                            </template>
                            </el-table-column>
                            <el-table-column
                            prop="srcUrl"
                            label="全链路对比源路径"
                            width="440">
                            </el-table-column>
                            <el-table-column
                            prop="destUrl"
                            label="压缩码流路径"
                            width="440">
                            </el-table-column>
                            <el-table-column
                            prop="createTime"
                            label="对比时间"
                            sortable
                            width="168">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tableData: [],
      formInline: {
          // 全链路文件夹路径
          srcDirPath: "",
          // 软解文件夹路径
          destDirPath: "",
      },
    };
  },
  methods: {
        // 清楚过滤器
        resetResFilter() {
            this.$refs.filterTable.clearFilter('res_key');
        },
        // 筛选对比结果
        filterHandler(value, row) {
            return row.res === value;
        },
        // 刷新数据，点击任意表头
        flushData() {
            if (this.formInline.destDirPath != "") {

                this.formInline.srcDirPath = this.formInline.srcDirPath.replace(/\\/g, '/');
                this.formInline.destDirPath = this.formInline.destDirPath.replace(/\\/g, '/');
                // console.log(this.formInline.srcDirPath);
                // console.log(this.formInline.destDirPath);
                axios
                .post('/api/gazes/list/pre', {
                    srcDirPath: this.formInline.srcDirPath,
                    destDirPath: this.formInline.destDirPath,
                })
                .then((result) => {
                    // 回调成功，把查询到的数据给tableData
                    this.tableData = result.data.data;
                })
                .catch((error) => {
                    // 处理错误情况，直接打印
                    console.log(error);
                });

                // 已刷新数据
                this.$message({
                showClose: true,
                message: '已刷新数据',
                type: 'success'
                });
            } else {
                // 提示刷新失败
                this.$message({
                showClose: true,
                message: '未填写软解文件夹路径，刷新失败',
                type: 'error'
                });
            }
        },
        compare() {
            if (this.formInline.srcDirPath != "" && this.formInline.destDirPath != "") {

                this.formInline.srcDirPath = this.formInline.srcDirPath.replace(/\\/g, '/');
                this.formInline.destDirPath = this.formInline.destDirPath.replace(/\\/g, '/');
                // console.log(this.formInline.srcDirPath);
                // console.log(this.formInline.destDirPath);
                axios
                .post('/api/gazes/compare', {
                    srcDirPath: this.formInline.srcDirPath,
                    destDirPath: this.formInline.destDirPath,
                })
                .then((result) => {
                    // 回调成功，直接打印
                    console.log(result);
                })
                .catch((error) => {
                    // 处理错误情况，直接打印
                    console.log(error);
                });

                // 显示开始对比\
                this.$message({
                showClose: true,
                message: '开始对比全链路' + this.formInline.srcDirPath + '和软解' + this.formInline.destDirPath,
                type: 'success'
                });
            } else {
                // 提示刷新失败
                this.$message({
                showClose: true,
                message: '未填写全链路和软解文件夹路径',
                type: 'error'
                });
            }

        },
  },
}
</script>

<style>
</style>