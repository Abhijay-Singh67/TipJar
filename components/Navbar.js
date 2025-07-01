"use client"
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const [logged, setLogged] = useState(false);
    const [drop, setDrop] = useState(false);
    const dropdownRef = useRef();
    const [pfp, setPfp] = useState("empty.jpg")
    const router = useRouter();
    useEffect(() => {
        (async () => {
            let req = await fetch("/api/auth")
            let res = await req.json()
            if (res.logged === true) {
                let req = await fetch("/api/profile")
                let res = await req.json();
                setPfp(res.thumbnail)
                setLogged(true)
            } else {
                setLogged(false)
            }
        })();
    },)
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const droop = () => {
        setDrop(!drop)
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDrop(false);
        }
    };

    const signOut = async () => {
        let req = await fetch("/api/auth", { method: "DELETE", headers: { "Content-Type": "application/json", } })
        let res = await req.json()
        if (res.success) {
            setLogged(false);
            window.location.href = "/";
        }
    }

    const editProfile = () => {
        console.log("Hello")
        router.push("/info?edit=true")
    }

    const profile = async () => {
        let req = await fetch("/api/profile")
        let res = await req.json();
        router.push(`/${res.id}`)
    }

    return (
        <nav className='flex justify-between items-center bg-white px-6 py-2 rounded-full w-[80vw] mx-auto mt-[10px] sticky top-[10px] z-10 text-black'>
            <Link href={"/"}>
                <div className='flex gap-1 items-center'>
                    <img src="coffee.png" className='w-8 cursor-pointer wiggle' />
                    <span className='text-2xl'>TipJar</span>
                </div>
            </Link>
            <div className='flex gap-20'>
                <Link href={"/"}>
                    <h1 className='cursor-pointer hover:bg-[#e7e6e6] hover:font-semibold rounded-full p-2'>Home</h1>
                </Link>
                <Link href={"/dashboard"}>
                    <h1 className='cursor-pointer hover:bg-[#e7e6e6] hover:font-semibold rounded-full p-2'>Dashboard</h1>
                </Link>
                <h1 className='cursor-pointer hover:bg-[#e7e6e6] hover:font-semibold rounded-full p-2'>About</h1>
            </div>
            {logged ? <div className='relative rounded-full border-2'>
                <div>
                    <img src={pfp} className='w-10 h-10 object-cover object-top rounded-full cursor-pointer' onClick={droop} />
                </div>
                {drop && <div ref={dropdownRef} className='w-[10vw] h-[20vh] rounded-xl bg-white absolute top-[50%] right-[50%] flex flex-col items-center justify-around py-3 border border-gray-500'>
                    <h1 className='font-semibold flex-grow w-full flex justify-center items-center cursor-pointer' onClick={profile}>Profile Page</h1>
                    <div className='w-[80%] h-[1px] bg-black'></div>
                    <h1 className='font-semibold flex-grow w-full flex justify-center items-center cursor-pointer' onClick={editProfile}>Edit Profile</h1>
                    <div className='w-[80%] h-[1px] bg-black'></div>
                    <h1 className='font-semibold flex-grow w-full flex justify-center items-center cursor-pointer' onClick={signOut}>Logout</h1>
                </div>}
            </div> : <div className='flex gap-5'>
                <Link href={"/auth?login=false"}>
                    <h1 className='cursor-pointer hover:bg-[#e7e6e6] hover:font-semibold rounded-full p-2'>Sign Up</h1>
                </Link>
                <Link href={"/auth?login=true"}>
                    <h1 className='cursor-pointer hover:bg-[#e7e6e6] hover:font-semibold rounded-full p-2'>Login</h1>
                </Link>
            </div>}
        </nav>
    )
}

export default Navbar
