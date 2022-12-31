// когда пользователь пишет слово "рубай" в чате, бот отвечает "привет"
const {Telegraf} = require("telegraf");
const axios = require("axios");
const bot = new Telegraf("5349322670:AAGgL_PuGYb8T6CHxy_ZqY4BlMOnn8WaC64");
// 5349322670:AAGgL_PuGYb8T6CHxy_ZqY4BlMOnn8WaC64
//5609369539:AAFVT7jURIg_gpFTAQA5kZ8rZ6qlSz8aGbk - тестовый бот
// 315793010 - id моего аккаунта

const API_KEY = "a1a5763c6ce3ed3ae0df7930f0d187b2";

bot.start((ctx) => ctx.reply("Привет!"));
bot.hears("/random", (ctx) =>
{
	let randomId = Math.floor(Math.random() * 300);
	ctx.reply(`https://picsum.photos/id/${randomId}/400/600/`);
});
bot.command("weather", (ctx) =>
{
	const location = "Vladikavkaz";
	getWeather(location, ctx);
});

bot.on("sticker", (ctx) =>
{
	if (ctx.message.sticker.emoji === "👍")
	{
		ctx.reply("👌");
	}
});
const strigoi = ["strigoi", "стригой", "стриг", "strig", "стригой", "sстригой", "сtригой", "stригой", "cTrigoi", "cтригой", "стrигой", "стригoй", "стрNгой", "стриrой"];
const rubai = ['рубай', 'рубай.', 'рубай,', "рубс", "рубенс", "rubai", "rubs", "rubens", "Рубай", "Рубай.", "Рубай,", "Рубс", "Рубенс", "Rubai", "Rubs", "Rubens", "рубчик"];
function checkRubai(ctx)
{
	if (rubai.includes(ctx.message.text))
	{
		ctx.telegram.sendAudio(ctx.message.chat.id, {source: "strigoi.mp3"}, {reply_to_message_id: ctx.message.message_id});
	}
}
bot.on("message", (ctx) =>
{
	sendYou(ctx);
	checkRubai(ctx);
	const message = ctx.update.message;
	// check if the message text contains "strigoi"
	if (message.text && strigoi.some((word) => message.text.toLowerCase().includes(word)))
	{
		// send a photo to the user
		ctx.replyWithPhoto({source: "strigoi.jpg"}, {reply_to_message_id: ctx.message.message_id});
	}
});


// function to send the New Year's greeting
function sendMessage()
{
	bot.telegram.sendMessage(-1001695052259, "С новым годом Pediki, люблю вас и обнимаю до хруста! 🎉🎊🎈");
}

// schedule the message to be sent at 00:01 on 1.1.23
const targetDate = new Date("01/01/23 00:01:00");
const timeUntilTargetDate = targetDate - Date.now();
setTimeout(sendMessage, timeUntilTargetDate);

async function getWeather(location, ctx)
{
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;
	try
	{
		const response = await axios.get(url);
		const data = response.data;
		// get the temperature and forecast
		let temperature = data.main.temp;
		temperature = Math.round(temperature - 273.15);
		const forecast = data.weather[0].description;
		// send the forecast to the user
		ctx.reply(`🌤️ *The weather in ${location}*:
						*Forecast:* ${forecast}
						*Temperature:* ${temperature}°C`);
	}
	catch (error)
	{
		console.error(error);
	}
}

async function sendYou(ctx)
{
	if (arrXu.includes(ctx.message.text))
	{
		await ctx.reply("сам иди на хуй", {reply_to_message_id: ctx.message.message_id});
	}
}

let arrXu = ["иди на хуй", "иди нахуй", "пошел на хуй", "пошел нахуй", "нахуй иди", "на хуй иди", "пошёл нахуй", "пошёл на хуй", "нахуй пошёл", "на хуй пошёл"];


bot.launch();







