export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MEILISEARCH_KEY: string;
			TUMBLR_KEY: string;
			TUMBLR_SECRET: string;
			TUMBLR_TOKEN: string;
			TUMBLR_TOKEN_SECRET: string;
		}
	}
}
