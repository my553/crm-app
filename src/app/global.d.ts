import store from "@app/store.ts"

declare global {
  interface RootState extends ReturnType<typeof store.getState> {}
}
