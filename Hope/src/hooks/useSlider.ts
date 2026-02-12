import { useCallback, useEffect, useRef, useState } from "react"

interface UseSliderOptions {
	totalSlides: number
	autoPlay?: boolean
	autoPlayInterval?: number
}

interface UseSliderReturn {
	currentIndex: number
	goToSlide: (index: number) => void
	goNext: () => void
	goPrev: () => void
	containerRef: React.RefObject<HTMLDivElement | null>
	isPaused: boolean
	pause: () => void
	resume: () => void
}

/**
 * スライダーの状態管理とナビゲーションを提供するカスタムフック
 *
 * @param options - スライダーの設定オプション
 * @param options.totalSlides - スライドの総数
 * @param options.autoPlay - 自動再生を有効にするか（デフォルト: false）
 * @param options.autoPlayInterval - 自動再生の間隔（ミリ秒、デフォルト: 5000）
 * @returns スライダーの状態と操作関数
 */
export function useSlider({
	totalSlides,
	autoPlay = false,
	autoPlayInterval = 5000,
}: UseSliderOptions): UseSliderReturn {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isPaused, setIsPaused] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const autoPlayTimerRef = useRef<number | null>(null)

	// 特定のスライドに移動
	const goToSlide = useCallback(
		(index: number) => {
			if (index < 0 || index >= totalSlides) return

			setCurrentIndex(index)

			// スクロール位置を更新
			if (containerRef.current) {
				const slideWidth = containerRef.current.offsetWidth
				containerRef.current.scrollTo({
					left: slideWidth * index,
					behavior: "smooth",
				})
			}
		},
		[totalSlides],
	)

	// 次のスライドへ
	const goNext = useCallback(() => {
		const nextIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0
		goToSlide(nextIndex)
	}, [currentIndex, totalSlides, goToSlide])

	// 前のスライドへ
	const goPrev = useCallback(() => {
		const prevIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1
		goToSlide(prevIndex)
	}, [currentIndex, totalSlides, goToSlide])

	// 自動再生を一時停止
	const pause = useCallback(() => {
		setIsPaused(true)
	}, [])

	// 自動再生を再開
	const resume = useCallback(() => {
		setIsPaused(false)
	}, [])

	// スクロールイベントでインデックスを同期
	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleScroll = () => {
			const slideWidth = container.offsetWidth
			if (slideWidth === 0) return

			const scrollLeft = container.scrollLeft
			const newIndex = Math.round(scrollLeft / slideWidth)

			if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSlides) {
				setCurrentIndex(newIndex)
			}
		}

		container.addEventListener("scroll", handleScroll, { passive: true })
		return () => container.removeEventListener("scroll", handleScroll)
	}, [currentIndex, totalSlides])

	// 自動再生タイマー
	useEffect(() => {
		if (!autoPlay || isPaused || totalSlides <= 1) {
			if (autoPlayTimerRef.current) {
				clearInterval(autoPlayTimerRef.current)
				autoPlayTimerRef.current = null
			}
			return
		}

		autoPlayTimerRef.current = window.setInterval(() => {
			goNext()
		}, autoPlayInterval)

		return () => {
			if (autoPlayTimerRef.current) {
				clearInterval(autoPlayTimerRef.current)
			}
		}
	}, [autoPlay, autoPlayInterval, isPaused, totalSlides, goNext])

	// キーボードナビゲーション
	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleKeyDown = (e: KeyboardEvent) => {
			// コンテナにフォーカスがある場合のみ反応
			if (!container.contains(document.activeElement)) return

			switch (e.key) {
				case "ArrowLeft":
					e.preventDefault()
					goPrev()
					break
				case "ArrowRight":
					e.preventDefault()
					goNext()
					break
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [goNext, goPrev])

	return {
		currentIndex,
		goToSlide,
		goNext,
		goPrev,
		containerRef,
		isPaused,
		pause,
		resume,
	}
}
