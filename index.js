// когда пользователь пишет слово "рубай" в чате, бот отвечает "привет"
const { Telegraf } = require("telegraf");
const axios = require("axios");
const bot = new Telegraf("5349322670:AAGgL_PuGYb8T6CHxy_ZqY4BlMOnn8WaC64");
// 5349322670:AAGgL_PuGYb8T6CHxy_ZqY4BlMOnn8WaC64
//5609369539:AAFVT7jURIg_gpFTAQA5kZ8rZ6qlSz8aGbk - тестовый бот
//5970563248:AAEM-Exx2s7Et1ifpZEqGQf6DyiJAnzA7sM - strigoiMusicBot
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
bot.on("message", (ctx) =>
{
	sendYou(ctx);
	checkMessageDziba(ctx);
	// checkRubai(ctx);
	// checkMessageFromUser(ctx);
	// checkMessageFromRubai(ctx);

	const message = ctx.update.message;
	// check if the message text contains "strigoi"
	if (message.text.toLowerCase().trim() && strigoi.some((word) => message.text.toLowerCase().trim().includes(word)))
	{
		// send a photo to the user
		ctx.replyWithPhoto({ source: "strigoi.jpg" }, { reply_to_message_id: ctx.message.message_id });
	}
});

const strigoi = ["strigoi", "стригой", "стриг", "strig", "стригой", "sстригой", "сtригой", "stригой", "cTrigoi", "cтригой", "стrигой", "стригoй", "стрNгой", "стриrой"];
const rubai = ['рубай', 'рубай.', 'рубай,', "рубс", "рубенс", "rubai", "rubs", "rubens", "Рубай", "Рубай.", "Рубай,", "Рубс", "Рубенс", "Rubai", "Rubs", "Rubens", "рубчик"];
const arrXu = ["иди на хуй", "иди нахуй", "пошел на хуй", "пошел нахуй", "нахуй иди", "на хуй иди", "пошёл нахуй", "пошёл на хуй", "нахуй пошёл", "на хуй пошёл", "хуй"];
const sirena = ['@news_sirena', '@sirenanews_bot'];
const dziba = ['дзыб','дзеб',"цепан","ципан","дзиб","ципа","Дзэб"]


function checkRubai(ctx)
{
	const message = ctx.update.message;
	if (message.text && rubai.some((word) => message.text.includes(word)))
	{
		ctx.telegram.sendAudio(ctx.message.chat.id, { source: "strigoi.mp3" }, { reply_to_message_id: ctx.message.message_id });
	}
}

// function to send the New Year's greeting
function sendMessage()
{
	bot.telegram.sendMessage(-1001695052259, "О, с новым годом пацаны!!! 🎉🎊🎈");
}
// Schedule the sendMessage function to run every day at 00:00
const now = new Date();

// Calculate the time until midnight
const timeUntilMidnight = (24 - now.getHours()) * 60 * 60 * 1000 + (60 - now.getMinutes()) * 60 * 1000 + (60 - now.getSeconds()) * 1000;

// Schedule the sendMessage function to run at midnight
setTimeout(() =>
{
	setInterval(sendMessage, 24 * 60 * 60 * 1000);
}, timeUntilMidnight);



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
	let message = ctx.message.text;
	message.trim();
	message = message.toLowerCase();
	if (arrXu.includes(message))
	{
		await ctx.reply("сам иди на хуй", { reply_to_message_id: ctx.message.message_id });
	}
}

async function checkMessageDziba(ctx)
{
	let message = ctx.update.message;
	message = message.text.toLowerCase();
	message = message.replace(/\s/g, '');

	if (dziba.some((word) => message.includes(word)))
	{
		await ctx.replyWithPhoto({source: "dziba.jpg" }, { reply_to_message_id: ctx.message.message_id });
		await ctx.reply("Военкор Дзэбоев на месте. Путин наш президент, враг будет разгромлен, Народ обоссан", { reply_to_message_id: ctx.message.message_id });
	}
}


async function checkMessageFromUser(ctx)
{
	const message = ctx.update.message;
	if(message.forward_from_chat)
	{
		if(message.forward_from_chat.id === -1001607140386)
		{
			ctx.telegram.deleteMessage(message.chat.id, message.message_id);
			ctx.reply("This message has been deleted due to spreading fake information. SIRENA BAD!");
		}
	}
}

async function checkMessageFromRubai(ctx)
{
	let message = ctx.update.message;
	if(message.text && sirena.some((word) => message.text.includes(word)))
	{
		ctx.telegram.deleteMessage(message.chat.id, message.message_id);
		ctx.reply("This message has been deleted due to spreading fake information. SIRENA BAD!");
	}
}

bot.launch();







