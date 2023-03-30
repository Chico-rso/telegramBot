const dziba = ["дзыб", "дзеб", "цепан", "ципан", "дзиб", "ципа", "Дзэб"];
export async function checkMessageDziba(ctx)
{
	try
	{
		let message = ctx.update.message.text;
		if (!message)
		{
			return;
		}
		let newMessage = message.replace(/[.,-/#!$%^&*;:{}=-_`~()\s]/g, "").toLowerCase();
		if (dziba.some((word) => newMessage.includes(word)))
		{
			await ctx.replyWithPhoto({source: "dziba.jpg"}, {reply_to_message_id: ctx.message.message_id});
			await ctx.reply("Военкор Дзэбоев на месте.", {reply_to_message_id: ctx.message.message_id});
		}
	}
	catch (error)
	{
		console.error(error);
	}
}
