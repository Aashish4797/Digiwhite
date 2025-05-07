"use client"
import {SessionProvider} from 'next-auth/react'
import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //ye to bahar se h bhai 

export function Providers({children,session}) {
    return (
        <SessionProvider session={session}>
            <ToastContainer position='top-right' autoClose={3000}/>
            <ThemeProvider attribute='class'>
                {children}
            </ThemeProvider>
        </SessionProvider>
    )
}