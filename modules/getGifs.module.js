import axios from "axios";

export async function getRandomGif(query) {
  const apiKey = '5IPiyxRgcqVyXjjllP9b0PRUZ2gFwNUd';
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${query}&rating=R`;

  const response = await axios.get(url);
  return response.data.data.images.original.url;
}
