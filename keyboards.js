import { Markup } from 'telegraf';

export function getMainMenu()
{
	return Markup.keyboard([
		['Буду искать музыку "🎵"', 'Буду искать видео "🎬"']
	]).resize();
}

// кнопка отмены
export function getBackButton()
{
	return Markup.keyboard([
		['Отмена']
	]).resize().oneTime();
}