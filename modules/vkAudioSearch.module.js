import { VK } from 'vk-io';

const vk = new VK({
	token: process.env.VK_API_KEY, // Замените на ваш access_token
});

export async function searchMusicVK(query)
{
	try
	{
		const response = await vk.api.audio.search({
			q: query,
			count: 1,
		});

		if (response.items.length > 0)
		{
			const track = response.items[0];

			if (track.title || track.artist || track.url)
			{
				return {
					title: track.title,
					artist: track.artist,
					url: track.url,
				};
			} else
			{
				console.log('Track information is missing:', track);
			}
		}
	} catch (error)
	{
		console.error('Error searching music on VK:', error);
	}

	return null;
}