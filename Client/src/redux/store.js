// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import userReducer from './slice'; // path to your user slice

// Redux persist configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Combine all the reducers
const rootReducer = combineReducers({
    user: userReducer,
    // Add other reducers here
});

// Apply persistReducer to rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
const store = configureStore({
    reducer: persistedReducer,
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
