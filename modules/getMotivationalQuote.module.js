import axios from "axios";

export async function getMotivationalQuote()
{
	const response = await axios.get("https://api.forismatic.com/api/1.0/?method=getQuote&lang=ru&format=json");
	return response.data;
}
