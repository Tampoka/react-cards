import {ThunkType} from "./store"
import {authApi} from "../api/cards-api";
import {setIsLoggedIn} from "./auth-reducer";

const initialState = {
    isLoading: false,
    error: null as null | string,
    //true if app already/successfully initialized (user authentication, settings etc.)
    isInitialized: false,
    appInfo: '',
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-IS-LOADING':
            return {...state, isLoading: action.payload.isLoading}
        case 'APP/SET-ERROR':
            return {...state, error: action.payload.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.payload.value}
        case 'APP/SET-APP-INFO':
            return {...state, appInfo: action.payload.message}
        default:
            return {...state}
    }
}

//Action Creators
export const setAppError = (error: string | null) => ({type: 'APP/SET-ERROR', payload: {error}} as const)
export const setAppIsLoading = (isLoading: boolean) => ({type: 'APP/SET-IS-LOADING', payload: {isLoading}} as const)
export const setAppInitialized = (value: boolean) => ({type: 'APP/SET-IS-INITIALIZED', payload: {value}} as const)
export const setAppInfo = (message: string) => ({type: 'APP/SET-APP-INFO', payload: {message}} as const)

//Thunk Creators
export const initializeApp = (): ThunkType => async dispatch => {
    try {
        dispatch(setAppIsLoading(true))
        await authApi.authMe();
        dispatch(setIsLoggedIn(true));
    } catch (e) {
        console.log((e as Error).message);
        dispatch(setAppIsLoading(true))
    } finally {
        dispatch(setAppInitialized(true));
        dispatch(setAppIsLoading(false))
    }
};


//Types
export type InitialStateType = typeof initialState

export type SetAppErrorActionType = ReturnType<typeof setAppError>
export type SetAppIsLoadingActionType = ReturnType<typeof setAppIsLoading>
export type SetAppInitializedActionType = ReturnType<typeof setAppInitialized>
export type SetAppInfoActionType = ReturnType<typeof setAppInfo>

export type AppActionsType =
    | SetAppInitializedActionType
    | SetAppIsLoadingActionType
    | SetAppErrorActionType
    | SetAppInfoActionType

