import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
    token: '',
    userId: '',
    userType: '',
    isLoggedIn: false
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        registerUser: (state, action) => {
            state.username = action.payload.username;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.userType = action.payload.userType;
            state.isLoggedIn = true;
        },
        loginUser: (state, action) => {
            state.username = action.payload.username;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.isLoggedIn = true;
            state.userType = action.payload.usertype;
        },
        logoutUser: (state) => {
            state.username = '';
            state.token = '';
            state.userId = '';
            state.userType = '';
            state.isLoggedIn = false;
        }
    }
});

// Action creators
export const { registerUser, loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
