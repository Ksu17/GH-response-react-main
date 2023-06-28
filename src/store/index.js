import {configureStore, combineReducers} from "@reduxjs/toolkit";
import userReducer from './slices/userSlices';
import { persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    user: userReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    //blacklist: [''] whitelist same. можно сделать не сохранение данных при рефреше (не сохранять \ только это сохранять)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store);
export default store;