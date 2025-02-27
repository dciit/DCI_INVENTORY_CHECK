// import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from "react-router";
import Login from './pages/login';

function Layout() {
    const redux = useSelector((state: any) => state.reducer);
    let login: boolean =  typeof redux.login != 'undefined' ? redux.login : false;
    return (
        <>
            {
                login ? <Outlet /> : <Login />
            }
        </>
    )
}

export default Layout
