<template lang="pug">
  main#chatroom
    #set_name_modal(:class='hasName ? "close" : ""')
      .set_name_container
        .set_name_head
          p 請輸入名稱
        form.set_name_body
          input(type="text", v-model='userName', required)
          button(@click.prevent='setName') 確定
    .container
      .main_pannel
        .pannel_head
          .pannel_head_controls
            i.close
            i.min
            i.max
          .pannel_head_user
            .pannel_head_user_avatar
            .pannel_head_user_name
              h4 {{userName}}
        .pannel_body
          template(v-for='msg in msgList')
            .message_block.other_msg(v-if='msg.userName !== userName')
              .message_container
                .massage_other_avatar
                .massage_content
                  .massage_other_name
                    h6 {{msg.userName}}
                  .massage_text
                    p {{msg.message}}
                    span.time {{msg.timeStamp}}
            .message_block.my_msg(v-else)
              .message_container
                .massage_content
                  .massage_text
                    p {{msg.message}}
                    span.time {{msg.timeStamp}}

        .pannel_footer
          textarea#msg_input(@keypress.enter='sendMsg($event)')

</template>

<script>
  const msgData = firebase.database().ref('/messages/')
  export default {
    name: 'ChatRoom',
    data () {
      return {
        userName: '',
        msgList: [],
        hasName: false
      }
    },
    methods: {
      setName() {
        this.hasName = true
      },
      getTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const format = hours >= 12 ? "下午" : "上午";
        return `${format} ${hours}:${minutes}`;
      },
      sendMsg(e) {
        const msgBody =  document.querySelector('.pannel_body')
        let msg = document.querySelector('#msg_input').value

        // shift + enter 換行不發送
        if (e.shiftKey) {
          return false

        // 空文字不發送 
        } else if (msg.length <= 1 && msg.trim() === '') {
          e.preventDefault()
          return false
        }

        // 推上 firebase
        msgData.push({
          userName: this.userName,
          message: msg,
          timeStamp: this.getTime()
        })
      
        document.querySelector('#msg_input').value = ''
        e.preventDefault()

        // scroll msgbody to bottom
        setTimeout(() => {
          msgBody.scrollTop = msgBody.scrollHeight
        }, 500)
      }
    },
    mounted() {
      const getData = () => {
        return new Promise((res, rej) => {
          res( 
            msgData.on('value', (logs) => {
              this.msgList = logs.val()
              // for (const item in logs.val()) {
              // }
            })
          )
        })
      }

      getData().then(() => {
        const msgBody =  document.querySelector('.pannel_body')
        msgBody.scrollTop = msgBody.scrollHeight
      })
    },
    updated() {
      const msgBody =  document.querySelector('.pannel_body')
      msgBody.scrollTop = msgBody.scrollHeight
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/app.scss';
</style>
