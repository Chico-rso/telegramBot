// 315793010 - id моего аккаунта
import
{
	getWeather,
	// checkMessageDziba,
	checkMessageStrigoi,
	// answerChatGpt,
	sendYou,
	getMotivationalQuote,
	getInterestingFact,
	getRandomGif,
	searchVideo,
	searchMusicVK,
	// checkRubai
} from "./modules/index.js";
import { Context, Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import { getMainMenu, getBackButton } from "./keyboards.js";



dotenv.config();

const testApiKey = process.env.MAIN_BOT_API;
const bot = new Telegraf(testApiKey);

const targetUserId = "315793010"; // Замените на ID пользователя, которого вы хотите отслеживать
// '2067105006' -rubs
const imageUrl = 'dziba.jpg';

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

bot.command('/search', async (ctx) =>
{
	await ctx.reply('Что искать?', getMainMenu());
});

bot.on("sticker", (ctx) =>
{
	if (ctx.message.sticker.emoji === "👍")
	{
		ctx.reply("👌");
	}
});


const userStates = {};

bot.on('text', async (ctx) =>
{
	const userId = ctx.from.id;
	const messageText = ctx.message.text;

	if (messageText === 'Буду искать музыку "🎵"')
	{
		userStates[userId] = 'search_music';
		await ctx.reply('Введите поисковой запрос для музыки:', getBackButton());
	} else if (messageText === 'Буду искать видео "🎬"')
	{
		userStates[userId] = 'search_video';
		await ctx.reply('Введите поисковой запрос для видео:', getBackButton());
	} else if (messageText === 'Закончить поиск')
	{
		delete userStates[userId];
		await ctx.reply('Ушел');
	} else
	{
		const currentState = userStates[userId];

		if (currentState === 'search_music')
		{
			const musicResults = await searchMusicVK(messageText);
			// Обработка результатов поиска музыки и отправка пользователю
			// Если найдена музыка, отправляем пользователю список найденных треков
			if (Array.isArray(musicResults) && musicResults.length > 0)
			{
				ctx.reply(`Щас постой...`);
				for (const result of musicResults)
				{
					const index = musicResults.indexOf(result);
					await ctx.replyWithAudio({
						url: result.url,
						title: `${result.artist} - ${result.title}`,
						performer: result.artist,
					}, { caption: `${index + 1}. ${result.artist} - ${result.title}` });
				}
			}
			else
			{
				ctx.reply('ой что то нихуя не нашел')
			}
		}
		else if (currentState === 'search_video')
		{
			const videoResults = await searchVideo(messageText);
			// Обработка результатов поиска видео и отправка пользователю
			if (videoResults)
			{
				ctx.reply(`Найдено видео: ${videoResults.title}\n${videoResults.url}`);
			}
			else
			{
				ctx.reply('ой что то нихуя не нашел')
			}
		}
		else
		{
		}
	}
	sendYou(ctx);
	// checkMessageDziba(ctx);
	checkMessageStrigoi(ctx);
	// checkRubai(ctx);
	// answerChatGpt(ctx);
});

bot.on('chat_action', (ctx) =>
{
	console.log(ctx);
	if (ctx.update.message.from.id === targetUserId && ctx.update.message.action === 'typing')
	{
		console.log(ctx);
		ctx.replyWithPhoto(imageUrl);
	}
});
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
