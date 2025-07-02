"use client"
import React, { useRef, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const Auth = () => {
    let ref = useRef();
    const [log, setLog] = useState(false)
    const [sign, setSign] = useState(false)
    const [side, setSide] = useState(true)
    const searchParams = useSearchParams();
    useEffect(() => {
        const login = searchParams.get('login');
        if (login == "true") {
            setSide(false)
        } else {
            setSide(true)
        }
    },)
    const login = async (e) => {
        let data = {
            email: e.get("email").trim(),
            password: e.get("password").trim()
        }
        let req = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(data) })
        let res = await req.json()
        if (res.success) {
            window.location.href = "/dashboard";
        } else {
            setLog(true)
        }
    }
    const signup = async (e) => {
        let data = {
            username: e.get("username").trim(),
            email: e.get("email").trim(),
            password: e.get("password").trim()
        }
        let req = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(data) })
        let res = await req.json()
        if (res.success) {
            window.location.href = "/info";
        } else {
            setSign(true)
        }
    }
    return (
        <div className='w-[70vw] h-[80vh] bg-[#f8f8f8] mx-auto my-[5vh] rounded-4xl'>
            <div className='flex relative'>
                <div className='transition-all duration-700'>
                    <img src="loginPage.avif" className={`transition-transform duration-1000 h-[80vh] w-[50%] rounded-4xl absolute z-10 ${side ? 'translate-x-[100%]' : 'translate-x-[0%]'}`} />
                </div>
                <div className="font-mono flex flex-col items-center w-[50%] justify-center">
                    <div className="content flex flex-col items-center  py-10 gap-10 w-[60%] h-[70%]">
                        <h1 className='text-4xl'>Create an Account</h1>
                        <form ref={ref} action={(e) => { signup(e); ref.current.reset() }} className='flex flex-col gap-7 text-lg'>
                            <input required name="username" type="username" placeholder="Username" className='bg-white rounded-full py-5 px-5 w-[400px]' />
                            <input required name="email" type="email" placeholder="Email" className='bg-white rounded-full py-5 px-5 w-[400px]' />
                            <input required name="password" type="password" placeholder="Password" className='bg-white rounded-full py-5 px-5' />
                            <button type='submit' className='cursor-pointer rounded-full bg-red-500 w-max self-center px-5 py-3 text-white'>Sign Up</button>
                        </form>
                        {sign && <h2 className='text-red-600 font-semibold'>Account Already Exists &excl;&excl;</h2>}
                        <Link href={"/auth?login=true"}>
                            <h2 className='mt-[-30px] cursor-pointer hover:bg-[#e7e6e6] hover:font-semibold rounded-full p-2'>Login</h2>
                        </Link>
                    </div>
                </div>
                <div className="font-mono flex flex-col items-center w-[50%] justify-center">
                    <div className="content flex flex-col items-center  py-10 gap-10 w-[60%] h-[70%]">
                        <h1 className='text-4xl'>Login</h1>
                        <form ref={ref} action={(e) => { login(e); ref.current.reset() }} className='flex flex-col gap-7 text-lg'>
                            <input required name="email" type="email" placeholder="Email" className='bg-white rounded-full py-5 px-5 w-[400px]' />
                            <input required name="password" type="password" placeholder="Password" className='bg-white rounded-full py-5 px-5' />
                            <button type='submit' className='cursor-pointer rounded-full bg-red-500 w-max self-center px-5 py-3 text-white'>Login</button>
                        </form>
                        {log && <h2 className='text-red-600 font-semibold'>Invalid Username or Password !!</h2>}
                        <Link href={"/auth?login=false"}>
                            <h2 className='mt-[-30px] cursor-pointer hover:bg-[#e7e6e6] hover:font-semibold rounded-full p-2'>Sign Up</h2>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Auth
