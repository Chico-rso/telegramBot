// 315793010 - id моего аккаунта
import
{
	getWeather,
	checkMessageDziba,
	checkMessageStrigoi,
	// answerChatGpt,
	sendYou,
	getMotivationalQuote,
	getInterestingFact,
	getRandomGif,
	// searchVideo,
	// checkRubai
} from "./modules/index.js";

import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { google } from 'googleapis';
const youtube = google.youtube({
	version: 'v3',
	auth: process.env.YOUTUBE_API_KEY, // Замените на ваш API-ключ
});


dotenv.config();

const testApiKey = process.env.TEST_BOT_API;

const bot = new Telegraf(testApiKey);
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

bot.command("fact", async (ctx) =>
{
	try
	{
		const fact = await getInterestingFact();
		ctx.reply(fact);
	}
	catch (error)
	{
		console.error(error);
		ctx.reply("Произошла ошибка, попробуйте еще раз позднее");
	}
});

bot.command("gif", async (ctx) =>
{
	try
	{
		const query = ctx.message.text.split(" ").slice(1).join(" ");
		const gifUrl = await getRandomGif(query);
		ctx.replyWithAnimation({ url: gifUrl });
	}
	catch (error)
	{
		console.error(error);
		ctx.reply("Произошла ошибка, попробуйте еще раз позднее");
	}
});

bot.command("quote", async (ctx) =>
{
	try
	{
		const quote = await getMotivationalQuote();
		ctx.reply(quote.quoteText);
		if (quote.quoteAuthor)
		{
			ctx.reply(quote.quoteAuthor);
		}
	}
	catch (error)
	{
		console.error(error);
		ctx.reply("Произошла ошибка, попробуйте еще раз позднее");
	}
});

bot.on("sticker", (ctx) =>
{
	if (ctx.message.sticker.emoji === "👍")
	{
		ctx.reply("👌");
	}
});
// Обработчик сообщений
bot.on("message", (ctx) =>
{
	sendYou(ctx);
	checkMessageDziba(ctx);
	checkMessageStrigoi(ctx);
	// searchVideo(ctx);
	// checkRubai(ctx);
	// answerChatGpt(ctx);
	const query = ctx.message.text;
	const video = searchVideo(query);

	if (video)
	{
		ctx.reply(`Найдено видео: ${video.title}\n${video.url}`);
	} else
	{
		ctx.reply('Видео не найдено.');
	}
});

async function searchVideo(query)
{
	console.log(query);
	try
	{
		const response = await youtube.search.list({
			part: 'snippet',
			type: 'video',
			q: query,
			maxResults: 1,
		});

		if (response.data.items.length > 0)
		{
			const video = response.data.items[0];
			return {
				title: video.snippet.title,
				url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
			};
		} else
		{
			return null;
		}
	} catch (error)
	{
		console.error('Error searching video:', error);
		return null;
	}
}

// const sirena = ["@news_sirena","@sirenanews_bot"];

// function to send the New Year's greeting
async function sendMessage()
{
	await bot.telegram.sendMessage(-1001695052259, "О, с новым годом пацаны!!! 🎉🎊🎈");
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


// async function checkMessageFromUser(ctx)
// {
// 	const message = ctx.update.message;
// 	if(message.forward_from_chat)
// 	{
// 		if(message.forward_from_chat.id === -1001607140386)
// 		{
// 			await ctx.telegram.deleteMessage(message.chat.id, message.message_id);
// 			ctx.reply("This message has been deleted due to spreading fake information. SIRENA BAD!");
// 		}
// 	}
// }

// async function checkMessageFromRubai(ctx)
// {
// 	let message = ctx.update.message;
// 	if(message.text && sirena.some((word) => message.text.includes(word)))
// 	{
// 		await ctx.telegram.deleteMessage(message.chat.id, message.message_id);
// 		ctx.reply("This message has been deleted due to spreading fake information. SIRENA BAD!");
// 	}
// }

bot.launch();
