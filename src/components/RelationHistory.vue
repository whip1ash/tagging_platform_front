<template>
<div>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
        <span>标注实体:</span>
        <span class="content">2333</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <template>
  <el-table
    :data="entities.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      label="ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="Content"
      prop="sen_content">
    </el-table-column>
     <el-table-column
      label="头实体"
      prop="head_entity">
    </el-table-column>
    <el-table-column
      label="尾实体"
      prop="tail_entity">
    </el-table-column>
     <el-table-column
      label="关系类型"
      prop="type">
    </el-table-column>
    <el-table-column
      align="right">
    
    <template slot="header">
    </template>

    <template slot-scope="scope">
    <el-button size="mini" type='primary' @click="handleEdit(scope.$index, scope.row)">
        Edit</el-button>
    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
    </template>
    </el-table-column>
  </el-table>

   <div class="paginationClass">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </div>
</template>
    </div>
</template>
<script>
export default {
    data() {
        return {
            entities: [],
            centerDialogVisible: false,
            search: '',

            // pages
            currentPage: 1,
            pageSize:50,
        }
    },
    created() {
        this.list();
    },
    methods: {

        handleSizeChange: function(pageSize) { // 每页条数切换
            this.pageSize = pageSize
            this.handleCurrentChange(this.currentPage);
        },
        handleCurrentChange: function(currentPage) {//页码切换
            this.currentPage = currentPage
            this.list(this.currentPage,this.pageSize)
        },

        handleEdit(index, row) {
            this.centerDialogVisible = true;
            console.log(index, row);
        },
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该标记, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delete(row.id);
                this.$message({
                    type: 'success',
                    message: "删除成功"
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        async list(page = 1,pageSize = 50) {
            let post_data = { page: page-1, limit: pageSize };
            const resp = await this.$http.post("/Relation/List", post_data)
            if (resp.data.success) {
                this.entities = resp.data.data;
                //{"id": 19, "sentence_id_id": 2, "pos": "3,8", "entity": "asdfasddddddfsadf", "type_id": 11}
            } else {
                console.log(resp.data);
                this.$message.error(resp.data.msg);
            }
        },
        async  delete(id) {
            let self = this;
            let post_data = { "id": id };
            const resp=await this.$http.post("/Relation/Del", post_data); 
            if (!resp.data.success) {
                this.$message.error(resp.data.msg);
            }
            this.list();
        },
    }

}
</script>

<style scoped>

</style>

