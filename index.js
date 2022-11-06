// когда пользователь пишет слово "рубай" в чате, бот отвечает "привет"
const {Telegraf} = require('telegraf');
const bot = new Telegraf('5349322670:AAGgL_PuGYb8T6CHxy_ZqY4BlMOnn8WaC64');

bot.start((ctx) => ctx.reply('Привет!'));

bot.on('sticker', (ctx) =>
{
	if (ctx.message.sticker.emoji == '👍')
	{
		ctx.reply('👌');
	}
});

bot.on('voice', (ctx) =>
{
	if (ctx.message.voice.duration > 15)
	{
		ctx.reply("за такие длинные голосовые будешь гореть в аду");
	}
});
bot.on('message', (ctx) =>
{
	hendler(ctx);
})

async function hendler(ctx)
{
	if (includesStrigoi(ctx.message.text))
	{
		await ctx.reply('))))');
	}
	else if (includesRub(ctx.message.text || ""))
	{
		await ctx.reply(`https://picsum.photos/id/${randomInteger(1, 300)}/400/500`);
	}
}

function randomInteger(min, max)
{
	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

// искать в сообщении слово "руб" убирать пробелы и приводить к нижнему регистру
function includesRub(text)
{
	return text.toLowerCase().replace(/\s/g, "").includes("руб");
}

// искать в сообщения слово которое может совпадать с любым словом из массива strigoi убирать пробелы повтрряющиеся буквы и приводить к нижнему регистру
function includesStrigoi(text)
{
	let strigoi = ['strigoi', 'стригой', 'стриг', 'strig', 'стригой']
	
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






