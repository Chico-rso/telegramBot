import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function getRandomGif(query)
{
	const apiKey = process.env.GIFS_API_KEY;
	const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${query}&rating=R`;
	
	const response = await axios.get(url);
	return response.data.data.images.original.url;
}
