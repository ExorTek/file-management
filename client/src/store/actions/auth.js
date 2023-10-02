import {createSlice} from '@reduxjs/toolkit';

export const auth = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
    },
    reducers: {
        setUser: (state, action) => {
            const {user} = action.payload;
            state.user = user;
        },
        logout: state => {
            state.token = null;
            localStorage.removeItem('token');
            state.user = null;
        }
    }
});

export const {setUser, logout} = auth.actions;
export default auth.reducer;
