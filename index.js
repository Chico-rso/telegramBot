// 315793010 - id моего аккаунта
import {
	getWeather,
	checkMessageDziba,
	checkMessageStrigoi,
	answerChatGpt,
	sendYou,
	getMotivationalQuote,
	getInterestingFact,
	getRandomGif,
} from "./modules/index.js";

import {Telegraf} from "telegraf";
import dotenv from "dotenv";

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
		
		ctx.replyWithAnimation({url: gifUrl});
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
		console.log(quote);
		
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
	// sendYou(ctx);
	// checkMessageDziba(ctx);
	// checkMessageStrigoi(ctx);
	answerChatGpt(ctx);
});

// Структура данных для хранения статей
let articles = [];

// Функция для создания новой статьи
function createArticle(title, content)
{
	const newArticle = {title, content};
	articles.push(newArticle);
	return newArticle;
}

// Функция для редактирования существующей статьи
function editArticle(index, newTitle, newContent)
{
	if (index >= 0 && index < articles.length)
	{
		articles[index].title = newTitle;
		articles[index].content = newContent;
		return true;
	}
	return false;
}

// Функция для проверки, является ли пользователь администратором
async function isAdmin(ctx)
{
	const chatMember = await ctx.getChatMember(ctx.from.id);
	return chatMember.status === "creator" || chatMember.status === "administrator";
}

// Обработка команды /start
bot.start((ctx) =>
{
	ctx.reply("Добро пожаловать! Введите /create для создания статьи или /edit для редактирования статьи.");
});

// Обработка команды /create
bot.command("create", async (ctx) =>
{
	if (await isAdmin(ctx))
	{
		ctx.reply("Введите название статьи:");
		bot.on("text", (ctx) =>
		{
			const title = ctx.message.text;
			ctx.reply("Введите содержание статьи:");
			bot.on("text", (ctx) =>
			{
				const content = ctx.message.text;
				createArticle(title, content);
				ctx.reply("Статья успешно создана!");
			});
		});
	}
	else
	{
		ctx.reply("Извините, только администратор может создавать статьи.");
	}
});

// Обработка команды /edit
bot.command("edit", async (ctx) =>
{
	if (await isAdmin(ctx))
	{
		ctx.reply("Введите индекс статьи для редактирования:");
		bot.on("text", (ctx) =>
		{
			const index = parseInt(ctx.message.text);
			ctx.reply("Введите новое название статьи:");
			bot.on("text", (ctx) =>
			{
				const newTitle = ctx.message.text;
				ctx.reply("Введите новое содержание статьи:");
				bot.on("text", (ctx) =>
				{
					const newContent = ctx.message.text;
					if (editArticle(index, newTitle, newContent))
					{
						ctx.reply("Статья успешно отредактирована!");
					}
					else
					{
						ctx.reply("Ошибка: неверный индекс статьи.");
					}
				});
			});
		});
	}
	else
	{
		ctx.reply("Извините, только администратор может редактировать статьи.");
	}
});


// const rubai = ["рубай", "рубай.", "рубай,", "рубс", "рубенс", "rubai", "rubs", "rubens", "Рубай", "Рубай.",
// "Рубай,", "Рубс", "Рубенс", "Rubai", "Rubs", "Rubens", "рубчик"]; const sirena = ["@news_sirena",
// "@sirenanews_bot"];


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
// 		await ctx.telegram.sendAudio(ctx.message.chat.id, {source: "strigoi.mp3"}, {reply_to_message_id:
// ctx.message.message_id}); } }

bot.launch();
