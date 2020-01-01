<template>
  <el-row>
    <el-col :span="10">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[5,10,25, 50, 100]"
            :page-size="sizeRange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="test.length">
        </el-pagination>
    </el-col>
</el-row>
</template>

<script>
export default {
    name:"pagination",
    data(){
        return{
            currentPage4: 1,
            sizeRange:5,
        }
    },
    props:{
        test:Array
    },
    methods:{
        handleSizeChange(val) {
            this.sizeRange = val;
            this.$emit('handleSizeChange',val);
        },
        handleCurrentChange(val) {
            this.currentPage4 = val;
            this.$emit('handleCurrentChange',val);
        },

    }
}
</script>

<style>

</style>