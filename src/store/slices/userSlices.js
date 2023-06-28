import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    search: '',
    status:'',
    page:1,
    searchSafer: false,
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setSearch(state, action) {
            state.search = action.payload.search;
        },
        setStatus(state,action){
            state.status = action.payload.status;
        },
        setPage(state,action){
            state.page = action.payload.page;
        },
        setSearchSafer(state,action){
            state.searchSafer = action.payload.searchSafer;
        }
    },
});

export const {setSearch,setStatus,setPage,setSearchSafer} = userSlice.actions;

export default userSlice.reducer;