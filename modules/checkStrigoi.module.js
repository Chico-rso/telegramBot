const strigoi = ["strigoi", "стригой", "стриг", "strig", "стригой", "sстригой", "сtригой", "stригой", "cTrigoi", "cтригой", "стrигой", "стригoй", "стрNгой", "стриrой"];
export async function checkMessageStrigoi(ctx)
{
	if (!ctx.update.message || !ctx.update.message.text) return;
	let message = ctx.update.message.text;
	let newMessage = message.replace(/[.,-/#!$%^&*;:{}=-_`~()\s]/g, "").toLowerCase();
	if (strigoi.some((word) => newMessage.includes(word)))
	{
		await ctx.replyWithPhoto({source: "strigoi.jpg"}, {reply_to_message_id: ctx.message.message_id});
	}
}
