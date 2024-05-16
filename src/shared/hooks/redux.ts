import { Dispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

export type AppDispatch = Dispatch<RootState>
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
