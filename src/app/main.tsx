import { RouterProvider } from "@tanstack/react-router"
import React from "react"
import ReactDOM from "react-dom/client"

import { worker } from "../../mocks"
import { router } from "./router"

worker.start()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
