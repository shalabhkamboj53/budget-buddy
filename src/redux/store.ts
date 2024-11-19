import { applyMiddleware, combineReducers, legacy_createStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import expenseReducer from './slices/expenseSlice';
import incomeReducer from './slices/incomeSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { thunk } from 'redux-thunk';
// @ts-expect-error: TypeScript cannot find module
import storage from 'redux-persist/lib/storage';
// @ts-expect-error: TypeScript cannot find module
import persistReducer from 'redux-persist/es/persistReducer';
// @ts-expect-error: TypeScript cannot find module
import persistStore from 'redux-persist/es/persistStore';


const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    user: userReducer,
    expense: expenseReducer,
    income: incomeReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = legacy_createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();