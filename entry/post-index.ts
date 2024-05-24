import MeiliSearch from 'meilisearch';

import { chunk } from '../lib/helpers';
import { loadPosts, postImagePaths } from '../lib/posts';

async function main() {
	const client = new MeiliSearch({
		apiKey: 'iD6XOfiDGF__C-kzdjsQp9xKS2n6lYCeqO9O0q1a2NU',
		host: 'http://localhost:7700',
	});
	const posts = await loadPosts();
	const chunks = chunk(posts, 100);
	const tasks = await Promise.all(
		chunks.map(async (posts) => {
			const postsWithImages = await Promise.all(
				posts.map(async (post) => {
					const images = await postImagePaths(post);
					return { ...post, images };
				}),
			);
			return client
				.index('tumblr')
				.addDocuments(postsWithImages, { primaryKey: 'id' });
		}),
	);
	console.log('Indexed', tasks.length, 'posts');
}

main();
