import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:'Authenticate',
    initialState:{
        token: null,
        isAuthenticate:false,
        refreshToken:null,
        expireTime:null,
        usertoken:null
    },
    reducers:{
        isAuthenticate:(state,action)=>{
            state.token=action.payload
            state.isAuthenticate=true
        },
        logout:(state,action)=>{
            state.token=null
            state.isAuthenticate=false
        },
        setRefreshToken:(state,action)=>{
            state.refreshToken=action.payload

        },
        setExpireTime:(state,action)=>{
            state.expireTime=action.payload

        },
        setUserId:(state,action)=>{
            state.usertoken=action.payload
        }
    }

}
)

export const { isAuthenticate, logout,setRefreshToken,setExpireTime,setUserId } = authSlice.actions;


export default authSlice.reducer;