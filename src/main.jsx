import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"

import "./styles/tokens.css"
import "./styles/base.css"
import "./styles/layout.css"
import "./styles/hero.css"
import "./styles/text-disperse.css"
import "./styles/services.css"
import "./styles/cases.css"
import "./styles/price.css"
import "./styles/forms.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
