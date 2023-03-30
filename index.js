// 5349322670:AAGgL_PuGYb8T6CHxy_ZqY4BlMOnn8WaC64
//5609369539:AAFVT7jURIg_gpFTAQA5kZ8rZ6qlSz8aGbk - тестовый бот
//5970563248:AAEM-Exx2s7Et1ifpZEqGQf6DyiJAnzA7sM - strigoiMusicBot
// 315793010 - id моего аккаунта

import {getWeather, checkMessageDziba, checkMessageStrigoi, answerChatGpt, sendYou, getMotivationalQuote} from "./modules/index.js";
import {Telegraf} from "telegraf";

const bot = new Telegraf("5609369539:AAFVT7jURIg_gpFTAQA5kZ8rZ6qlSz8aGbk");
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

bot.command("quote", async (ctx) =>
{
	try
	{
		const quote = await getMotivationalQuote();
		console.log(quote);
		
		ctx.reply(quote.quoteText);
		if(quote.quoteAuthor)
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
	// answerChatGpt(ctx);
});


const rubai = ["рубай", "рубай.", "рубай,", "рубс", "рубенс", "rubai", "rubs", "rubens", "Рубай", "Рубай.", "Рубай,", "Рубс", "Рубенс", "Rubai", "Rubs", "Rubens", "рубчик"];
const sirena = ["@news_sirena", "@sirenanews_bot"];


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

// async function checkRubai(ctx)
// {
// 	const message = ctx.update.message;
// 	if (message.text && rubai.some((word) => message.text.includes(word)))
// 	{
// 		await ctx.telegram.sendAudio(ctx.message.chat.id, {source: "strigoi.mp3"}, {reply_to_message_id: ctx.message.message_id});
// 	}
// }

bot.launch();
