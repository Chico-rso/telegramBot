const arrXu = ["иди на хуй", "иди нахуй", "пошел на хуй", "пошел нахуй", "нахуй иди", "на хуй иди", "пошёл нахуй", "пошёл на хуй", "нахуй пошёл", "на хуй пошёл", "Нахуй пошел", "хуй", 'xyN', 'xui', 'xyi', 'хyи', 'хуi', 'xуй', 'хyй','xyй','xуi'];
export async function sendYou(ctx)
{
	let message = ctx.message.text;
	if (!message) return;
	let newMessage = message.replace(/[.,-/#!$%^&*;:{}=-_`~()\s]/g, "").toLowerCase();
	if (arrXu.some((word) => newMessage.includes(word)))
	{
		await ctx.reply("хуйнюс", {reply_to_message_id: ctx.message.message_id});
	}
}
