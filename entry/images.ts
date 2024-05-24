import { access, mkdir, writeFile } from 'fs/promises';
import minimist from 'minimist';
import { join } from 'path';

import { debug } from '../lib/logging';
import { loadPosts, postPath } from '../lib/posts';
import { Image, Post } from '../lib/types';

function imageKey(image: Image) {
	const url = new URL(image.url);
	const extension = url.pathname.split('.').pop();
	let key = url.pathname.split('/').at(1);
	if (key.startsWith('tumblr_')) {
		key = key.replace('tumblr_', '');
	}
	if (key.includes('_')) {
		key = key.replace(/_.+$/, '');
	}
	if (!key.includes('.') && extension) {
		key = key + '.' + extension;
	}
	if (!key.includes('.') || !extension) {
		throw new Error('Could not determine extension for image: ' + key);
	}
	return key;
}

async function findImagesToDownload(post: Post) {
	const images = post.photos?.map((photo) => photo.original_size) ?? [];
	if (images.length === 0) {
		return;
	}
	const downloadImages = new Map<string, Image>();
	const path = postPath(post, false);
	for (const image of images) {
		const key = imageKey(image);
		const oldImage = downloadImages.get(key);
		if (!oldImage || oldImage.width < image.width) {
			downloadImages.set(key, image);
		}
	}
	debug('Downloading', downloadImages.size, 'images for post:', post.id);

	await mkdir(path, { recursive: true });
	await Promise.all(
		Array.from(downloadImages.entries()).map(([key, image]) =>
			downloadImage(join(path, key), image),
		),
	);
}

async function downloadImage(path: string, image: Image) {
	const args = minimist(process.argv.slice(2));
	const wet = !!args.wet;
	debug('Downloading image:', image.url);
	try {
		await access(path);
		debug('Image already downloaded:', path);
		return;
	} catch (err) {
		if (wet) {
			const response = await fetch(image.url);
			const buffer = await response.arrayBuffer();
			await writeFile(path, Buffer.from(buffer));
		}
		debug('Downloaded image:', path);
	}
}

async function main() {
	const posts = await loadPosts();
	Promise.all(posts.map(findImagesToDownload));
}

main();
