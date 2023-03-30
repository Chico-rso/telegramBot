import axios from "axios";

const WETHER_API_KEY = "a1a5763c6ce3ed3ae0df7930f0d187b2";
export async function getWeather(location, ctx)
{
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WETHER_API_KEY}`;
	try
	{
		const response = await axios.get(url);
		const data = response.data;
		// get the temperature and forecast
		let temperature = data.main.temp;
		temperature = Math.round(temperature - 273.15);
		const forecast = data.weather[0].description;
		// send the forecast to the user
		ctx.reply(`🌤️ *The weather in ${location}*:
						*Forecast:* ${forecast}
						*Temperature:* ${temperature}°C
						*Humidity:* ${data.main.humidity}%
						*Wind speed:* ${data.wind.speed} m/s
						*Cloudiness:* ${data.clouds.all}%
						*Pressure:* ${data.main.pressure} hPa
						*Coordinates:* ${data.coord.lat}, ${data.coord.lon}
						*Sunrise:* ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
						*Sunset:* ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}
						*Timezone:* ${data.timezone / 3600} hours
						*Country:* ${data.sys.country}
						*City:* ${data.name}
						`, {parse_mode: "Markdown"});
	}
	catch (error)
	{
		console.error(error);
	}
}
