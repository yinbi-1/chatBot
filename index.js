const { WechatyBuilder } = require('wechaty')
const qrcodeTerminal = require('qrcode-terminal');
const bot = WechatyBuilder.build();

const keywords = ['关键字1', '关键字2', '关键字3']
const groupNames = ['群聊名称1', '群聊名称2', '群聊名称3']

bot
.on('scan', function (qrcode){
    qrcodeTerminal.generate(qrcode, {small: true})
})
.on('login', function (user){
    console.log(`${user} login`)   
})
.on('logout', function (user){  
    console.log(`${user} logout`)  
})
.on('message', async m => {
    const contact = m.from()
    const room = m.room()
    if (room && groupNames.includes(await room.topic())) {
      const topic = await room.topic()
      console.log(`Room: ${topic} Contact: ${contact.name()} Message: ${m}`)
      // 判断是否为群消息
      if (await room.has(contact)) {
        // 获取文件传输助手的联系人
        const fileHelper = await bot.Contact.find({ name: '文件传输助手' })
        if (fileHelper) {
          // 转发消息到文件传输助手
            if (m.payload.type != 7) {
                const fileBox = await m.toFileBox();
                await fileHelper.say(fileBox);
                // await fileBox.toFile(fileBox.name);
            }else if (keywords.some(keyword => m.text().includes(keyword))){
                await fileHelper.say(m.text());
            }
        } else {
            console.log('文件传输助手未找到')
        }
      }
    }
  })
.start()