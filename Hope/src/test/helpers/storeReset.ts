import { useAppStore, useI18nStore, useSceneStore } from "../../store"

/**
 * 全Zustandストアを初期状態にリセット
 * テスト間での状態の分離を保証
 */
export const resetAllStores = () => {
	useAppStore.setState({
		isLoading: true,
		loadingProgress: 0,
		isHopeMode: false,
		isVideoOverlayVisible: false,
		isVideoThumbnailVisible: false,
	})

	useSceneStore.setState({
		hopeFactor: 0,
		scrollProgress: 0,
		bloomStrength: 0.2, // 初期値
		envIntensity: 0.1, // 初期値
	})

	useI18nStore.setState({
		locale: "en",
	})
}
