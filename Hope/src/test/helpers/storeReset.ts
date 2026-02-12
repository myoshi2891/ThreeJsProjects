import { useAppStore } from "../../store/appStore"
import { useI18nStore } from "../../store/i18nStore"
import { useSceneStore } from "../../store/sceneStore"

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
	})

	useI18nStore.setState({
		locale: "en",
	})
}
