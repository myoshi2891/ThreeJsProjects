import { describe, expect, it } from "vitest"
import { validateYouTubeVideoId } from "../youtube"

describe("validateYouTubeVideoId", () => {
	it("有効なID（11文字英数字+ハイフン+アンダースコア）が通過する", () => {
		// 標準的なYouTube ID
		expect(validateYouTubeVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
		// ハイフン含む
		expect(validateYouTubeVideoId("x7BEDUGk6NI")).toBe("x7BEDUGk6NI")
		// アンダースコア含む
		expect(validateYouTubeVideoId("abc_def-123")).toBe("abc_def-123")
		// 全てハイフン/アンダースコア
		expect(validateYouTubeVideoId("___--------")).toBe("___--------")
	})

	it("不正なID（特殊文字、長さ違い、空文字列）が空文字列を返す", () => {
		// 空文字列
		expect(validateYouTubeVideoId("")).toBe("")
		// 短すぎる
		expect(validateYouTubeVideoId("abc")).toBe("")
		// 長すぎる
		expect(validateYouTubeVideoId("dQw4w9WgXcQ1")).toBe("")
		// 特殊文字含む
		expect(validateYouTubeVideoId("abc!def@ghi")).toBe("")
		// スペース含む
		expect(validateYouTubeVideoId("abc def ghi")).toBe("")
		// スラッシュ含む
		expect(validateYouTubeVideoId("abc/def/ghi")).toBe("")
		// ドット含む
		expect(validateYouTubeVideoId("abc.def.ghi")).toBe("")
	})

	it("XSS攻撃文字列が拒否される", () => {
		// scriptタグ注入
		expect(validateYouTubeVideoId('"><script>alert(1)</script>')).toBe("")
		// イベントハンドラ注入
		expect(validateYouTubeVideoId('" onload="alert(1)')).toBe("")
		// URLエンコード攻撃
		expect(validateYouTubeVideoId("%3Cscript%3E")).toBe("")
		// HTMLエンティティ
		expect(validateYouTubeVideoId("&lt;script&gt")).toBe("")
		// JavaScript URI
		expect(validateYouTubeVideoId("javascript:")).toBe("")
	})
})
