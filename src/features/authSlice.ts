import {createSlice,PayloadAction} from '@reduxjs/toolkit'
type Auth={token:string|null;user:{name:string;email:string}|null}
const initial:Auth={token:localStorage.getItem('token'),user:JSON.parse(localStorage.getItem('user')||'null')}
const slice=createSlice({name:'auth',initialState:initial,reducers:{login:(s,a:PayloadAction<Auth>)=>{s.token=a.payload.token;s.user=a.payload.user;localStorage.setItem('token',a.payload.token);localStorage.setItem('user',JSON.stringify(a.payload.user))},logout:(s)=>{s.token=null;s.user=null;localStorage.removeItem('token');localStorage.removeItem('user')}}})
export const {login,logout}=slice.actions
export default slice.reducer
