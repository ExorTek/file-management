import rootReducer from './rootReducer'
import { configureStore } from '@reduxjs/toolkit'

export default configureStore( {
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware( {
            serializableCheck: false
        } )
    },
    devTools: process.env.NODE_ENV !== 'production'
} );
