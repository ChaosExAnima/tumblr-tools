export interface BlogPostsResponse {
	blog: Blog;
	posts: Post[];
	total_posts: number;
}

export interface Blog {
	ask: boolean;
	ask_anon: boolean;
	ask_page_title: string;
	asks_allow_media: boolean;
	avatar: Image[];
	can_chat: boolean;
	can_send_fan_mail: boolean;
	can_subscribe: boolean;
	description: string;
	followed: boolean;
	is_blocked_from_primary: boolean;
	is_nsfw: boolean;
	name: string;
	posts: number;
	share_likes: boolean;
	subscribed: boolean;
	theme: ThemeClass;
	title: string;
	total_posts: number;
	updated: number;
	url: string;
	uuid: string;
}

export interface Image {
	height: number;
	url: string;
	width: number;
}

export interface ThemeClass {
	avatar_shape: string;
	background_color: string;
	body_font: string;
	header_bounds: string;
	header_focus_height?: number;
	header_focus_width?: number;
	header_full_height?: number;
	header_full_width?: number;
	header_image: string;
	header_image_focused: string;
	header_image_poster: string;
	header_image_scaled: string;
	header_stretch: boolean;
	link_color: string;
	show_avatar: boolean;
	show_description: boolean;
	show_header_image: boolean;
	show_title: boolean;
	title_color: string;
	title_font: string;
	title_font_weight: string;
}

export interface Post {
	blog: PostBlog;
	blog_name: string;
	body?: string;
	can_blaze: boolean;
	can_ignite: boolean;
	can_like: boolean;
	can_reblog: boolean;
	can_reply: boolean;
	can_send_in_message: boolean;
	caption?: string;
	date: string;
	display_avatar: boolean;
	followed: boolean;
	format: string;
	id: string;
	id_string: string;
	image_permalink?: string;
	interactability_blaze: string;
	interactability_reblog: string;
	is_blaze_pending: boolean;
	is_blazed: boolean;
	is_blocks_post_format: boolean;
	liked: boolean;
	link_url?: string;
	note_count: number;
	parent_post_url: string;
	photos?: Photo[];
	photoset_layout?: string;
	post_url: string;
	reblog: Reblog;
	reblog_key: string;
	recommended_color: null;
	recommended_source: null;
	short_url: string;
	should_open_in_legacy: boolean;
	slug: string;
	source_title?: string;
	source_url?: string;
	state: string;
	summary: string;
	tags: string[];
	timestamp: number;
	title?: null | string;
	trail: Trail[];
	type: Type;
}

export interface PostBlog {
	can_show_badges: boolean;
	description: string;
	name: string;
	title: string;
	tumblrmart_accessories: never;
	updated: number;
	url: string;
	uuid: string;
}

export interface Photo {
	alt_sizes: Image[];
	caption: string;
	original_size: Image;
}

export interface Reblog {
	comment: string;
	tree_html: string;
}

export interface Trail {
	blog: TrailBlog;
	content: string;
	content_raw: string;
	is_root_item: boolean;
	post: TrailPost;
}

export interface TrailBlog {
	active: boolean;
	can_be_followed: boolean;
	name: string;
	share_following: boolean;
	share_likes: boolean;
	theme: ThemeUnion;
}

export type ThemeUnion = ThemeClass;

export interface TrailPost {
	id: string;
}

export type Type = string;
