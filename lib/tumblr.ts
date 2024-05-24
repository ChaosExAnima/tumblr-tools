import { createClient } from 'tumblr.js';
import { pRateLimit } from 'p-ratelimit';
import 'dotenv/config';

import type { Client } from '../node_modules/tumblr.js/types/tumblr.d.ts';

export { Client };

export const BLOG_POSTS_LIMIT = 20;

export function throttle() {
	return pRateLimit({
		interval: 1000,
		rate: 250, // 300, but keeping it conservative.
		maxDelay: 2000,
	});
}

export function tumblrClient(): Client {
	return createClient({
		consumer_key: process.env.TUMBLR_KEY,
		consumer_secret: process.env.TUMBLR_SECRET,
		token: process.env.TUMBLR_TOKEN,
		token_secret: process.env.TUMBLR_TOKEN_SECRET,
	});
}
