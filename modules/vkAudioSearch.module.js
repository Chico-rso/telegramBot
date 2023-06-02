import { VK } from 'vk-io';
const vk = new VK({
	token: process.env.VK_API_KEY,
	apiMode: 'parallel_selected',
});

export async function searchMusicVK(query)
{
	const searchResults = await vk.api.audio.search({
		q: query,
		count: 10,
	});

	const musicResults = [];

	for (const result of searchResults.items)
	{
		const audioInfo = await vk.api.audio.getById({
			audios: `${result.owner_id}_${result.id}`,
		});

		const musicResult = {
			title: audioInfo[0].title,
			artist: audioInfo[0].artist,
			url: audioInfo[0].url,
		};

		musicResults.push(musicResult);
	}
	return musicResults;
}

