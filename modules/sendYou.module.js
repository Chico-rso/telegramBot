const arrXu = ["иди на хуй", "иди нахуй", "пошел на хуй", "пошел нахуй", "нахуй иди", "на хуй иди", "пошёл нахуй", "пошёл на хуй", "нахуй пошёл", "на хуй пошёл", "хуй"];
export async function sendYou(ctx)
{
	let message = ctx.message.text;
	if (!message) return;
	let newMessage = message.replace(/[.,-/#!$%^&*;:{}=-_`~()\s]/g, "").toLowerCase();
	if (arrXu.includes(newMessage))
	{
		await ctx.reply("хуйнюс", {reply_to_message_id: ctx.message.message_id});
	}
}
