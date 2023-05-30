import {Configuration, OpenAIApi} from "openai";


const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export async function answerChatGpt(ctx)
{
	// Получить текст сообщения
	const user_input = ctx.message.text;
	
	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: user_input,
		temperature: 0.5,
		max_tokens: 300,
		top_p: 1.0,
		frequency_penalty: 0.5,
		presence_penalty: 0.0,
		stop: ["You:"],
	});
	
	// Отправить ответ обратно в Telegram
	ctx.reply(response.data.choices[0].text);
}
