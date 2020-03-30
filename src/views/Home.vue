<template>
<div>
    <el-container class="container">
        <el-header>
            <Icon @click="goback" class="icon" type="md-arrow-round-back" />
            知识图谱打标平台
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</div>
</template>

<script>
export default {
    methods:{
        goback(){
            this.$router.back(-1)
        }
    }
}
</script>

<style>
.container {
    width: 95%;
    height: 100%;
    position: absolute;
    top: 5%;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto
}

.el-header {
    height: 40px !important;
    line-height: 40px !important
}

.el-header,
.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /* line-height: 400px; */
}

.icon {
    font-size: 40px;
    width: 80px;
    position: absolute;
    top: 0px;
    left: 0;
    background-color:cadetblue;
}

.icon:hover {
    background-color:#eee;
    cursor:pointer;
}
</style>
