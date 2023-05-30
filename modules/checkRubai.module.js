const rubai = ["рубай", "рубай.", "рубай,", "рубс", "рубенс", "rubai", "rubs", "rubens", "Рубай", "Рубай.",
	"Рубай,", "Рубс", "Рубенс", "Rubai", "Rubs", "Rubens", "рубчик"];

export async function checkRubai(ctx)
{
	const message = ctx.update.message;
	if (message.text && rubai.some((word) => message.text.includes(word)))
	{
		await ctx.telegram.sendAudio(ctx.message.chat.id, { source: "strigoi.mp3" }, {
			reply_to_message_id:
				ctx.message.message_id
		});
	}
}