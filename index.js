import {
    // 315793010 - id моего аккаунта
    // checkMessageDziba,
    // answerChatGpt,
    // checkRubai
    getWeather,
    checkMessageStrigoi,
    sendYou,
    getMotivationalQuote,
    getInterestingFact,
    getRandomGif,
    searchVideo,
    searchMusicVK,
} from './modules/index.js';
import { Context, Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { getMainMenu, getBackButton } from './keyboards.js';
import Redis from 'ioredis';

dotenv.config();

const testApiKey = process.env.MAIN_BOT_API;
const bot = new Telegraf(testApiKey);
const redis = new Redis();
const targetUserId = '315793010';// '2067105006' -rubs

const imageUrl = 'dziba.jpg';

// Логирование действий пользователя
bot.use(async (ctx, next) => {
    console.log(`Команда от пользователя ${ ctx.from.id }: ${ ctx.message.text }`);
    await next();
});

// Стартовое сообщение
bot.start((ctx) => ctx.reply('Привет! Используй /help для списка доступных команд.'));

// Команда для рандомного изображения
bot.hears('/random', (ctx) => {
    let randomId = Math.floor(Math.random() * 300);
    ctx.reply(`https://picsum.photos/id/${ randomId }/400/600/`);
});

// Получение погоды
bot.command('weather', (ctx) => {
    const location = 'Vladikavkaz';
    getWeather(location, ctx);
});

// Получение интересного факта
bot.command('fact', async (ctx) => {
    try {
        const fact = await getInterestingFact();
        ctx.reply(fact);
    } catch (error) {
        console.error(error);
        ctx.reply('Произошла ошибка, попробуйте еще раз позднее');
    }
});

// Поиск gif по запросу
bot.command('gif', async (ctx) => {
    try {
        const query = ctx.message.text.split(' ').slice(1).join(' ');
        const gifUrl = await getRandomGif(query);
        ctx.replyWithAnimation({url: gifUrl});
    } catch (error) {
        console.error(error);
        ctx.reply('Произошла ошибка, попробуйте еще раз позднее');
    }
});

// Получение мотивационной цитаты
bot.command('quote', async (ctx) => {
    try {
        const quote = await getMotivationalQuote();
        ctx.reply(quote.quoteText);
        if (quote.quoteAuthor) {
            ctx.reply(quote.quoteAuthor);
        }
    } catch (error) {
        console.error(error);
        ctx.reply('Произошла ошибка, попробуйте еще раз позднее');
    }
});

// Команда для поиска с меню
bot.command('/search', async (ctx) => {
    await ctx.reply('Что искать?', getMainMenu());
});

// Ответ на стикер
bot.on('sticker', (ctx) => {
    if (ctx.message.sticker.emoji === '👍') {
        ctx.reply('👌');
    }
});

// Основная логика обработки текстовых сообщений с состояниями пользователей
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const messageText = ctx.message.text;
    
    // Получаем текущее состояние пользователя
    const currentState = await redis.get(`user_state:${ userId }`);
    
    if (messageText === 'Буду искать музыку "🎵"') {
        await redis.set(`user_state:${ userId }`, 'search_music');
        await ctx.reply('Введите поисковой запрос для музыки:', getBackButton());
    } else if (messageText === 'Буду искать видео "🎬"') {
        await redis.set(`user_state:${ userId }`, 'search_video');
        await ctx.reply('Введите поисковой запрос для видео:', getBackButton());
    } else if (messageText === 'Закончить поиск') {
        await redis.del(`user_state:${ userId }`);
        await ctx.reply('Ушел');
    } else {
        if (currentState === 'search_music') {
            const musicResults = await searchMusicVK(messageText);
            
            if (Array.isArray(musicResults) && musicResults.length > 0) {
                await ctx.reply('Щас постой...');
                await Promise.all(musicResults.map((result, index) => {
                    return ctx.replyWithAudio({
                        url: result.url,
                        title: `${ result.artist } - ${ result.title }`,
                        performer: result.artist,
                    }, {caption: `${ index + 1 }. ${ result.artist } - ${ result.title }`});
                }));
            } else {
                ctx.reply('ой что-то нихуя не нашел');
            }
        } else if (currentState === 'search_video') {
            const videoResults = await searchVideo(messageText);
            
            if (videoResults) {
                ctx.reply(`Найдено видео: ${ videoResults.title }\n${ videoResults.url }`);
            } else {
                ctx.reply('ой что-то нихуя не нашел');
            }
        }
    }
    
    // Выполнение пользовательских функций
    sendYou(ctx);
    checkMessageStrigoi(ctx);
});

// Ответ на действия пользователя в чате
bot.on('chat_action', (ctx) => {
    if (ctx.update.message?.from?.id === targetUserId && ctx.update.message?.action === 'typing') {
        ctx.replyWithPhoto(imageUrl);
    }
});

// Команда для поздравления с Новым годом
async function sendMessage() {
    await bot.telegram.sendMessage(-1001695052259, 'О, с новым годом пацаны!!! 🎉🎊🎈');
}

// Расписание отправки сообщения каждый день в полночь
const now = new Date();
const timeUntilMidnight = (24 - now.getHours()) * 60 * 60 * 1000 + (60 - now.getMinutes()) * 60 * 1000 + (60 - now.getSeconds()) * 1000;
setTimeout(() => {
    setInterval(sendMessage, 24 * 60 * 60 * 1000);
}, timeUntilMidnight);

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error(`Ошибка для пользователя ${ ctx.from.id }:`, err);
    ctx.reply('Произошла ошибка, попробуйте еще раз.');
});

// Команда помощи
bot.command('help', (ctx) => {
    ctx.reply(`
    Доступные команды:
    /weather - узнать погоду
    /fact - интересный факт
    /quote - мотивирующая цитата
    /gif [запрос] - случайный gif
    /search - поиск музыки или видео
  `);
    
    // sendYou(ctx);
	// // checkMessageDziba(ctx);
	// checkMessageStrigoi(ctx);
	// // checkRubai(ctx);
	// // answerChatGpt(ctx);
});

bot.launch();
