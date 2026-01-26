import { createRoot } from "react-dom/client"
import { App } from "./components/App"
import "./styles.css"

const rootElement = document.getElementById("root")
if (rootElement) {
	const root = createRoot(rootElement)
	root.render(<App />)
} else {
	console.error(
		"Failed to find root element. Make sure there is a <div id='root'></div> in your HTML.",
	)
}
