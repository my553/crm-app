import { createRoute, createRouter, Outlet } from "@tanstack/react-router"
import { createRootRoute } from "@tanstack/react-router"

import { MainPage } from "@pages/main-page"

const routeTree = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/",
  component: MainPage,
})

const mainPageRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/main",
  component: MainPage,
})

routeTree.addChildren([indexRoute, mainPageRoute])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
