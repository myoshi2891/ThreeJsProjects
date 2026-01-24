import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { useAppStore } from "../../store/appStore"
import { Loading } from "../Loading"

describe("Loading", () => {
	beforeEach(() => {
		useAppStore.setState({
			isLoading: true,
			loadingProgress: 0,
		})
	})

	it("should render loading spinner", () => {
		render(<Loading />)
		expect(screen.getByTestId("loading-spinner")).toBeInTheDocument()
	})

	it("should render loading text", () => {
		render(<Loading />)
		expect(screen.getByText("Loading Experience")).toBeInTheDocument()
	})

	it("should render progress bar", () => {
		render(<Loading />)
		expect(screen.getByTestId("progress-bar")).toBeInTheDocument()
	})

	it("should update progress bar width based on loadingProgress", () => {
		useAppStore.setState({ loadingProgress: 50 })
		render(<Loading />)
		const progressBar = screen.getByTestId("progress-bar")
		expect(progressBar).toHaveStyle({ "--progress-width": "50%" })
	})

	it("should show 100% progress when fully loaded", () => {
		useAppStore.setState({ loadingProgress: 100 })
		render(<Loading />)
		const progressBar = screen.getByTestId("progress-bar")
		expect(progressBar).toHaveStyle({ "--progress-width": "100%" })
	})
})
