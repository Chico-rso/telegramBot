import { google } from 'googleapis';
const youtube = google.youtube({
	version: 'v3',
	auth: process.env.YOUTUBE_API_KEY, // Замените на ваш API-ключ
});
export async function searchVideo(query)
{
	try
	{
		const response = await youtube.search.list({
			part: 'snippet',
			type: 'video',
			q: query,
			maxResults: 1,
		});

		if (response.data.items.length > 0)
		{
			const video = response.data.items[0];
			return {
				title: video.snippet.title,
				url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
			};
		} else
		{
			return null;
		}
	} catch (error)
	{
		console.error('Error searching video:', error);
		return null;
	}
}