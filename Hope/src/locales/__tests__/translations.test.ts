import { describe, expect, it } from "vitest"
import en from "../en.json"
import ja from "../ja.json"

/**
 * Helper function to get all keys from a nested object using dot notation
 */
function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
	const keys: string[] = []

	for (const key of Object.keys(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key
		const value = obj[key]

		if (value && typeof value === "object" && !Array.isArray(value)) {
			keys.push(...getAllKeys(value as Record<string, unknown>, fullKey))
		} else {
			keys.push(fullKey)
		}
	}

	return keys
}

describe("Translation files consistency", () => {
	const enKeys = getAllKeys(en as Record<string, unknown>)
	const jaKeys = getAllKeys(ja as Record<string, unknown>)

	it("should have the same number of keys in both languages", () => {
		expect(enKeys.length).toBe(jaKeys.length)
	})

	it("should have all English keys present in Japanese translation", () => {
		const missingInJa = enKeys.filter((key) => !jaKeys.includes(key))
		expect(missingInJa).toEqual([])
	})

	it("should have all Japanese keys present in English translation", () => {
		const missingInEn = jaKeys.filter((key) => !enKeys.includes(key))
		expect(missingInEn).toEqual([])
	})

	describe("nav section", () => {
		it("should have nav.skipLink in both languages", () => {
			expect(en.nav.skipLink).toBeDefined()
			expect(ja.nav.skipLink).toBeDefined()
		})

		it("should have nav.hope in both languages", () => {
			expect(en.nav.hope).toBeDefined()
			expect(ja.nav.hope).toBeDefined()
		})

		it("should have nav.shortFilm in both languages", () => {
			expect(en.nav.shortFilm).toBeDefined()
			expect(ja.nav.shortFilm).toBeDefined()
		})

		it("should have nav.light in both languages", () => {
			expect(en.nav.light).toBeDefined()
			expect(ja.nav.light).toBeDefined()
		})
	})

	describe("hero section", () => {
		it("should have all hero keys in both languages", () => {
			const heroKeys = ["badge", "title", "subtitle1", "subtitle2", "cta", "scroll"]
			for (const key of heroKeys) {
				expect(en.hero[key as keyof typeof en.hero]).toBeDefined()
				expect(ja.hero[key as keyof typeof ja.hero]).toBeDefined()
			}
		})
	})

	describe("story section", () => {
		const storyTypes = ["hope", "life", "possibility", "light"] as const

		for (const type of storyTypes) {
			it(`should have story.${type}.number in both languages`, () => {
				expect(en.story[type].number).toBeDefined()
				expect(ja.story[type].number).toBeDefined()
			})

			it(`should have story.${type}.title in both languages`, () => {
				expect(en.story[type].title).toBeDefined()
				expect(ja.story[type].title).toBeDefined()
			})

			it(`should have story.${type}.author in both languages`, () => {
				expect(en.story[type].author).toBeDefined()
				expect(ja.story[type].author).toBeDefined()
			})
		}
	})

	describe("experience section", () => {
		const experienceKeys = ["number", "title", "quote", "author", "cta", "ctaLabel"] as const

		for (const key of experienceKeys) {
			it(`should have experience.${key} in both languages`, () => {
				expect(en.experience[key]).toBeDefined()
				expect(ja.experience[key]).toBeDefined()
			})
		}
	})

	describe("loading section", () => {
		it("should have loading.text in both languages", () => {
			expect(en.loading.text).toBeDefined()
			expect(ja.loading.text).toBeDefined()
		})
	})

	describe("video section", () => {
		it("should have video.close in both languages", () => {
			expect(en.video.close).toBeDefined()
			expect(ja.video.close).toBeDefined()
		})

		it("should have video.expand in both languages", () => {
			expect(en.video.expand).toBeDefined()
			expect(ja.video.expand).toBeDefined()
		})
	})

	describe("imageModal section", () => {
		it("should have imageModal.close in both languages", () => {
			expect(en.imageModal.close).toBeDefined()
			expect(ja.imageModal.close).toBeDefined()
		})

		it("should have imageModal.viewImage in both languages", () => {
			expect(en.imageModal.viewImage).toBeDefined()
			expect(ja.imageModal.viewImage).toBeDefined()
		})
	})
})
