<template>
<div>
    <div class="box1">
        <textarea @click="getTextIndex" v-model="sentence" />
    </div>

    <div class="box2">
        <div style="margin-top: 20px">
            <!-- <el-tag v-for="(result,index) in results" :key="result.id" type="success" closable @close="handleClose(result,index)">
            {{result.entity}}
            </el-tag> -->

            <Poptip trigger="hover" content="点击进行操作">
                <Button
                style="margin:10px"
                v-for="(result) in results"
                :key="result.id"
                @click="click(result.id)">
                {{result.entity}}
                </Button>
            </Poptip>


        </div>
    </div>
<!-- 
    <div class="box2">
        <div style="margin-top: 20px">
            <el-radio-group v-model="padding" @change="handleSelectType">
                <el-radio-button  v-for=" type in entityTypes" :label="type.id"  :key="type.name"  >
                    {{type.name}}
                </el-radio-button>
            </el-radio-group>
        </div>
    </div> -->

    <div class="btn">
        <el-button type="primary" round @click='handleSave'>save</el-button>
        <el-button type="primary" round @click="getSentence">next</el-button>
    </div>

    <Modal
      v-model="modalSwitch"
      title="选择实体类型"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <div style="margin-top: 20px">
        <Select v-model="padding" style="width:200px" @on-change="handleSelectType">
          <Option
            v-for="type in entityTypes"
            :value="type.id"
            :key="type.name"
            >{{ type.name }}</Option>
        </Select>
        <Poptip
          confirm
          title="Are you sure you want to delete this item?"
          @on-ok="deleteTag">
          <Button>Delete</Button>
        </Poptip>
      </div>
    </Modal>


</div>
</template>
<script>
export default {
    data() {
        return {
            //iview
            modalSwitch: false,

            // default
            entityTypes: [],
            padding: [],
            
            //init
            sentence: '',
            sentence_id: 0,
            pos: '',
            results: [],
            order: 0,
            currentEntityId: 0,



        };

    },
    created() {
        this.getSentence();
        this.listEntityTypes();
    },

    methods: {
        ok() {
            this.$Message.info("tag的type选择成功!");
        },
        cancel() {
            this.$Message.info("取消成功!");
        },
        click(entityId) {
            this.currentEntityId = entityId; 
            this.modalSwitch = true;
        },
        deleteTag() {
            let self = this;
            let result = this.results.filter(item => {
                return item['id'] !== self.currentEntityId
            })
            this.clear()
            this.results = result
            this.modalSwitch = false;
        },
        getTextIndex (e) {
            let target = e.target, start;
            if (target.selectionStart != 'undefined') {
                start = target.selectionStart;
            } else {
                    start = '0'
                }        
            // console.log(index);
            let selectedText = this.getSelectionText()
            let end = selectedText.length + start

            if (start == end) {
                return 0;
            }

            // selected object
            var sel = { id: this.order, name: selectedText };

            for (let i = 0; i < this.results.length; i++) {
                if (this.results[i].entity === selectedText) {
                    this.$message.error('请勿重复选择');
                    return 0;
                }
            }

            this.results.push({
                id: this.order,
                tag_id: 0,
                sentence_id: this.sentence_id,
                entity: selectedText, 
                pos: `${start},${end}`,
                type_id: 0
            });
            this.order++;

            // console.log(this.results)
           
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
        // getSelectionText() {
        //    let selectedText = ''
        //    if (window.getSelection) {
        //       selectedText = window.getSelection().toString();
        //    } else if (document.selection && document.selection.createRange) {
        //       selectedText = document.selection.createRange().text;
        //  }
        //  return selectedText;
        // },

        // handleClose(entity) {
        //     let result = this.results.filter(item => {
        //         return item['id'] !== entity.id
        //     })
        //     this.results = result
        //     console.log(this.results)
        // },


        handleSelectType(value) {
            let self = this
            let res = this.results.filter(item => {
                if(item.id === self.currentEntityId){
                    item.type_id = value
                    return item
                }else{
                    return false
                }
            })

            if(!res){
                this.$message.error("handleSelectType function error! Set entity type failed!")
            }
            // }else{
            //     console.log(this.results);
            // }
        },

        check(){
            let res = this.results.filter(item => {
                if(item.type_id == 0){
                    return item
                }
            })
            if(res.length != 0){
                this.$message.error("存在未选择类型的实体");
                return false;
            }else{
                return true;
            }
        },
        handleSave() {
            let self = this;
            if(!this.check()){
                return 0
            }

            this.results.filter(item => {
                self.save(
                    item.id,
                    item.tag_id,
                    item.entity,
                    item.sentence_id,
                    item.type_id,
                    item.pos
                );
            })


            
            console.log(this.results);
        },

        clear(){
            this.currentEntityId = 0
        },


        init(){
            this.sentence = ''
            this.sentence_id = 0
            this.pos= ''
            this.results= []
            this.order= 0
            this.currentEntityId = 0
        },
        async listEntityTypes() {
            const resp = await this.$http.get('/Entity/ListType')
            if (resp.data.success) {
                this.entityTypes = resp.data.data;
            } else {
                console.log(resp.data);
                this.$message.error(resp.data.msg);
            }
        },
        async getSentence() {
            this.init();
            let post_data = { referer: "entity" };
            const resp = await this.$http.post('/Sentence/Get', post_data)
            if (resp.data.success) {
                this.sentence = resp.data.data[0].content;
                this.sentence_id = resp.data.data[0].id
            } else {
                console.log(resp.data);
                this.$message.error(resp.data.msg);
            }
        },
        async save(id,tag_id, entity, sentence_id, type, pos) {
            let post_data = {
                tag_id: tag_id,
                entity: entity,
                sentence_id: sentence_id,
                pos: pos,
                type_id: type
            };
            const resp = await this.$http.post("/Entity/Save", post_data);
            if (resp.data.success) {
                this.results.filter(item => {
                    if(item.id == id){
                        item.tag_id = resp.data.data.tag_id
                    }
                })
            } else {
                console.log(resp.data);
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
