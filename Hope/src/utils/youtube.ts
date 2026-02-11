/**
 * Validates a YouTube Video ID.
 *
 * A valid YouTube Video ID must be exactly 11 characters long and consist of
 * alphanumeric characters, hyphens, or underscores.
 *
 * @param id - The video ID to validate.
 * @returns The video ID if valid, otherwise an empty string.
 */
export function validateYouTubeVideoId(id: string): string {
	const pattern = /^[a-zA-Z0-9_-]{11}$/
	return pattern.test(id) ? id : ""
}

/**
 * The validated YouTube Video ID from the environment variable.
 * Only exported if the environment variable is set and valid.
 * Defaults to an empty string if invalid or missing.
 */
export const YOUTUBE_VIDEO_ID = validateYouTubeVideoId(import.meta.env.VITE_YOUTUBE_VIDEO_ID || "")
