<template>
<div>
    <div class="box1">
        <textarea @click="getTextIndex" v-model="sentence" />
    </div>

    <div class="box2">
        <div class="btn">
            <el-button type="primary" round @click="changeSelectedState">更改选择类型</el-button>
            当前类型为：{{selectedState}}
        </div>
        <div style="margin-top: 20px">
            <Tag
            color="blue"
            size="large">
              头实体：{{result.head_entity}}
              头实体位置：{{result.head_pos}}
            </Tag>

            <Tag
            color="blue" 
            size="large">
              尾实体：{{result.tail_entity}}
              尾实体位置：{{result.tail_pos}}
            </Tag>
        </div>
    </div>

    <div class="box2">
        <div style="margin-top: 20px">
            <el-radio-group v-model="padding" @change="handleSelectType">
                <el-radio-button  v-for=" type in relationTypes" :label="type.id"  :key="type.name"  >
                    {{type.name}}
                </el-radio-button>
            </el-radio-group>
        </div>
    </div>

    <div class="btn">
        <el-button type="primary" round @click="delSentence">delete this sentence</el-button>
        <el-button type="primary" round @click='deleteTag'>delete local tag</el-button>
        <el-button type="primary" round @click='handleSave'>save</el-button>
        <el-button type="primary" round @click="getSentence">next</el-button>
    </div>

</div>
</template>
<script>
export default {
    data() {
        return {
            selectedState: '头实体',

            // default
            relationTypes: [],
            padding: [],
            
            //init
            sentence: '',
            sentence_id: 0,
            pos: '',
            result: {},
            order: 0,
        };

    },
    created() {
        this.getSentence();
        this.listRelationTypes();
    },

    methods: {
        changeSelectedState(){
            if(this.order == 0){
                this.selectedState = '尾实体'
                this.order = 1
            }else{
                this.selectedState = '头实体'
                this.order = 0
            }
            
        },
        deleteTag() {
            let protected_key = ['tag_id','sentence_id']
            for(var k in this.result){
              protected_key.includes(k)?'':this.result[k]=''
            }
            this.padding = []
        },
        getTextIndex (e) {
          let head_entity = ''
          let head_pos = ''
          let tail_entity = ''
          let tail_pos = ''

          let target = e.target, start;
          if (target.selectionStart != 'undefined') {
              start = target.selectionStart;
          } else {
                  start = '0'
          }     

          let selectedText = this.getSelectionText()
          let end = selectedText.length + start

          if (start == end) {
              return 0;
          }

          if(this.order == 0){
            head_entity = selectedText
            head_pos = `${start},${end}`
            this.result.head_entity = head_entity
            this.result.head_pos = head_pos
            //手动切换
            // this.order++
          }else if(this.order == 1){
            tail_entity = selectedText
            tail_pos = `${start},${end}` 
            this.result.tail_entity = tail_entity
            this.result.tail_pos = tail_pos
            //手动切换
            // this.order = 0
          }else{
            this.$message.error("只能选择头实体和尾实体")
          }
          
          if(this.result.head_entity != '' && this.result.tail_entity != '' && this.result.head_entity == this.result.tail_entity){
            this.$message.error('头实体和尾实体不能相同')
            this.result.tail_entity = ''
            this.result.tail_pos = ''
            return 0
          } 
        },

        getSelectionText() {
            let selectedText=''
            if(window.getSelection) {
                selectedText= window.getSelection().toString();
            } else if(document.selection && document.selection.createRange) {
                selectedText= document.selection.createRange().text;
            }
            return selectedText;
        },


        handleSelectType(value) {
            this.result.type_id = value
            this.$message.info("设置关系类型成功！")
        },

        check(){
            let res = this.result;
            if(res.head_entity == '' || res.tail_entity == ''){
              this.$message.error("未选择头实体")
              return false
            }else if(res.tail_entity == '' || res.tail_pos == ''){
              this.$message.error("未选择尾实体")
              return false
            }else if(res.type_id == 0){
              this.$message.error("未选择关系类型")
            }else{
              return true
            }
        },
        handleSave() {
            if(!this.check()){
                return 0
            }
            // console.log(this.result)

            this.save(
                this.result.tag_id,
                this.result.sentence_id,
                this.result.head_entity,
                this.result.head_pos,
                this.result.tail_entity,
                this.result.tail_pos,
                this.result.type_id
            )
           
        },


        init(){
            this.sentence = ''
            this.sentence_id = 0
            this.result=  {
              tag_id:0,
              sentence_id:0,
              tail_entity:'',
              tail_pos:'',
              head_entity:'',
              head_pos:'',
              type_id:0
            }
            this.order= 0,
            this.padding = []
        },
        async listRelationTypes() {
            const resp = await this.$http.get('/Relation/ListType')
            if (resp.data.success) {
                this.relationTypes = resp.data.data;
            } else {
                // console.log(resp.data);
                this.$message.error(resp.data.msg);
            }
        },
        async getSentence() {
            this.init();
            let post_data = { referer: "relation" };
            const resp = await this.$http.post('/Sentence/Get', post_data)
            if (resp.data.success) {
                this.sentence = resp.data.data[0].content;
                this.result.sentence_id = resp.data.data[0].id
            } else {
                // console.log(resp.data);
                this.$message.error(resp.data.msg);
            }
        },
        async save(tag_id, sentence_id, head_entity, head_pos, tail_entity, tail_pos, type_id) {
            let post_data = {
                tag_id: tag_id,
                sentence_id: sentence_id,
                head_entity: head_entity,
                head_pos: head_pos,
                tail_entity: tail_entity,
                tail_pos: tail_pos,
                type_id: type_id
            };
            const resp = await this.$http.post("/Relation/Save", post_data);
            if (resp.data.success) {
                this.result.tag_id = resp.data.data.tag_id
                this.$message.info("保存成功")
            } else {
                // console.log(resp.data);
                this.$message.error("保存失败")
                this.$message.error(resp.data.msg);
            }
        },
        async delSentence(){
            let post_data = {id: this.result.sentence_id}
            const resp = await this.$http.post("/Sentence/Del", post_data);
            if (resp.data.success) {
                this.$message.info("删除该句话成功")
                this.getSentence();
            } else {
                // console.log(resp.data);
                this.$message.error(resp.data.msg);
            }
        }
    }
}
</script>
<style scoped>
.box1 {
    width: 80%;
    height: 300px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin: 0 auto
}

.box2 {
    width: 80%;
    height: 100px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin: 10px auto
}

.el-tag {
    margin-right: 5px;
    cursor: pointer;
    margin-top: 20px
}

.tag {
    margin-top: 20px;
    margin-right: 2px
}

textarea {
    margin-top: 30px;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    font-family: Arial, Helvetica, sans-serif;
    height: 85px;
    line-height: 30px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 80%;
    resize: none
}
</style>
