// когда пользователь пишет слово "рубай" в чате, бот отвечает "привет"
const { Telegraf } = require('telegraf');
const bot = new Telegraf('5609369539:AAFVT7jURIg_gpFTAQA5kZ8rZ6qlSz8aGbk');
bot.start((ctx) => ctx.reply('Привет!'));
// bot.command('pushme', (ctx) => {
// 	// отправить стикер в чат
// 	console.log(ctx.message);
// })
bot.on("message", (ctx) => {
	if (includesRub(ctx.message.text || "")) {
		ctx.reply(`https://picsum.photos/id/${randomInteger(1, 300)}/400/500`);
	}
});
bot.on('message', (ctx) => {
	if (ctx.message.voice.duration > 15) {
		ctx.reply("ну пиздец еще вот это слушать");
	}
});

bot.on('message', (ctx) => {
	if(ctx.message.sticker) {
		ctx.reply('Стикеры не приветствуются');
	}
});
function randomInteger(min, max) {
	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}
// искать в сообщении слово "руб" убирать пробелы и приводить к нижнему регистру
function includesRub(text) {
	return text.toLowerCase().replace(/\s/g, "").includes("руб");
}
bot.launch();






