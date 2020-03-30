<template>
  <div>
    <el-button type="primary" class="start btn" @click="handleChangex">开始打标</el-button>
    <el-button type="primary" class="view btn" @click="handleChangey">查看类型</el-button>
    <el-button type="primary" class="history btn" @click="handleChang">历史数据</el-button>
    <div class="box">
      <div class="box1">
        <div class="title">
          <span id="idTitle">ID</span>
          <h4 class="done">已打标的句子</h4>
        </div>
        <div>
          <ul>
            <li v-for="sentence in sentencesDone" :key="sentence.kid">
              <span class="id">{{sentence.id}}</span>
              <span class="content">{{sentence.content}}</span>
            </li>
          </ul>
        </div>
      </div>

    <div class="paginationClass">
        <el-pagination
        @size-change="handleSizeChangeDone"
        @current-change="handleCurrentChangeDone" :current-page="currentPageDone"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSizeDone" layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </div>

      <div class="box2">
        <div class="title">
          <span id="idTitle">ID</span>
          <h4 class="undone">未打标的句子</h4>
        </div>
        <div>
          <ul>
            <li v-for="sentence in sentencesDoing" :key="sentence.kid">
              <span class="id">{{sentence.id}}</span>
              <span class="content">{{sentence.content}}</span>
            </li>
          </ul>
        </div>
      </div>

    <div class="paginationClass">
            <el-pagination
            @size-change="handleSizeChangeDoing"
            @current-change="handleCurrentChangeDoing" :current-page="currentPageDoing"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSizeDoing" layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
    </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        sentencesDoing: [],
        sentencesDone: [],

        // pages
        currentPageDoing: 1,
        pageSizeDoing:20,

        currentPageDone: 1,
        pageSizeDone: 20,
    }
  },
  created() {
    this.listEntitySentencesDone()
    this.listEntitySentencesDoing()
  },
  methods: {
    handleChang() {
      this.$router.push('/entityHistory')
    },
    handleChangex() {
      this.$router.push('/taggingEntity')
    },
    handleChangey() {
      this.$router.push('/entityType')
    },

    handleSizeChangeDone: function(pageSize) { // 每页条数切换
        this.pageSizeDone = pageSize
        this.handleCurrentChangeDone(this.currentPageDone);
    },
    handleCurrentChangeDone: function(currentPage) {//页码切换
        this.currentPageDone = currentPage
        this.listEntitySentencesDone(this.currentPageDone,this.pageSizeDone)
    },

    handleSizeChangeDoing: function(pageSize) { // 每页条数切换
        this.pageSizeDoing = pageSize
        this.handleCurrentChangeDoing(this.currentPage);
    },
    handleCurrentChangeDoing: function(currentPage) {//页码切换
        this.currentPageDoing = currentPage
        this.listEntitySentencesDoing(this.currentPageDoing,this.pageSizeDoing)
    },

    async listEntitySentencesDoing(page=1,pageSize=20) {
      let post_data = { referer: 'entity', page: page - 1, limit: pageSize }
      const resp = await this.$http.post('/Sentence/Doing', post_data)
      if (resp.data.success) {
        this.sentencesDoing = resp.data.data
      } else {
        this.$message.error(resp.data.msg)
        console.log(resp.data)
      }
    },
    async listEntitySentencesDone(page=1,pageSize=20) {
      let post_data = { referer: 'entity', page: page -     1, limit: pageSize }
      const resp = await this.$http.post('/Sentence/Done', post_data)
      if (resp.data.success) {
        this.sentencesDone = resp.data.data
      } else {
        console.log(resp.data)
        this.$message.error(resp.data.msg)
      }
    }
  }
}
</script>

<style scoped>
.btn {
  width: 120px;
}

.start {
  position: relative;
  /* top: -180px; */
  left: -240px;
}
.view {
  position: relative;
  left: -20px;
}
.history {
  position: relative;
  /* top: -180px; */
  right: -240px;
}
.title {
  margin-top: -10px;
}
.box1,
.box2 {
  margin-top: 20px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  /* margin-right: 20px */
}

ul li .id {
  flex: 1;
  display: inline-block;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
}

ul li:nth-child(1) {
  border-top: 1px solid #ccc;
}
.box1 #idTitle,
.box2 #idTitle {
  position: relative;
  left: -430px;
}

ul li .content {
  flex: 10;
}

.box {
  width: 80%;
  margin: 0 auto;
}

.box .done {
  color: green;
  /* line-height: 40px; */
  display: inline-block;
  line-height: 5em;
}

ul {
  margin-top: -20px;
  /* margint: -40px; */
}

ul li {
  list-style: none;
  line-height: 30px;
  border-bottom: 1px solid #ccc;
  display: flex;
}

.box2 .undone {
  color: red;
  /* line-height: 40px; */
  display: inline-block;
  line-height: 5em;
}
</style>