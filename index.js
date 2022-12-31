// когда пользователь пишет слово "рубай" в чате, бот отвечает "привет"
const {Telegraf} = require("telegraf");
const axios = require("axios");
const bot = new Telegraf("5349322670:AAGgL_PuGYb8T6CHxy_ZqY4BlMOnn8WaC64");
// 5349322670:AAGgL_PuGYb8T6CHxy_ZqY4BlMOnn8WaC64
//5609369539:AAFVT7jURIg_gpFTAQA5kZ8rZ6qlSz8aGbk - тестовый бот
// 315793010 - id моего аккаунта

const API_KEY = "a1a5763c6ce3ed3ae0df7930f0d187b2";


bot.start((ctx) => ctx.reply("Привет!"));
bot.hears('/random', (ctx) =>
{
	let randomId = Math.floor(Math.random() * 300);
	ctx.reply(`https://picsum.photos/id/${randomId}/400/600/`)
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

bot.on("voice", (ctx) =>
{
	if (ctx.message.voice.duration > 18)
	{
		ctx.reply(`${ctx.message.voice.duration} сек слушать это, ${ctx.message.from.first_name} да ну тебя...`);
	}
});
bot.on("message", (ctx) =>
{
	hendler(ctx);
	sendYou(ctx);
});

// function to send the New Year's greeting
function sendMessage() {
  bot.telegram.sendMessage(315793010, "С новым годом Pediki, люблю вас и обнимаю до хруста! 🎉🎊🎈");
}

// schedule the message to be sent at 00:01 on 1.1.23
const targetDate = new Date('01/01/23 00:01:00');
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

async function hendler(ctx)
{
	if (includesStrigoi(ctx.message.text))
	{
		await ctx.telegram.sendPhoto(ctx.message.chat.id, {source: "strigoi.jpg"}, {reply_to_message_id: ctx.message.message_id});
	}
	else if (includesRub(ctx.message.text || ""))
	{
		await ctx.telegram.sendAudio(ctx.message.chat.id, {source: "strigoi.mp3"}, {reply_to_message_id: ctx.message.message_id});
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

// искать в сообщении слово "руб" убирать пробелы и приводить к нижнему регистру
function includesRub(text)
{
	return text.toLowerCase().replace(/\s/g, "").includes("руба");
}

// искать в сообщения слово которое может совпадать с любым словом из массива strigoi убирать пробелы повтрряющиеся буквы и приводить к нижнему регистру
function includesStrigoi(text)
{
	let strigoi = ["strigoi", "стригой", "стриг", "strig", "стригой", "sстригой", "сtригой", "stригой", "cTrigoi", "cтригой", "стrигой", "стригoй", "стрNгой", "стриrой"];
	
	let strigoiText = text.toLowerCase().replace(/\s/g, "").replace(/(.)\1+/g, "$1");
	
	for (let i = 0; i < strigoi.length; i++)
	{
		if (strigoiText.includes(strigoi[i]))
		{
			return true;
		}
	}
	
	return false;
}


bot.launch();







