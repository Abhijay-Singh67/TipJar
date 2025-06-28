"use client"
import React, { useEffect, useState } from 'react'
import LineChart from '@/components/LineChart'
import { Doto, Roboto } from "next/font/google";

const doto = Doto({
  subsets: ['latin'],
})

const poppins = Roboto({
  weight: "400",
  subsets: ['latin'],
})


function formatTimestamp(timestampString) {
  const timestamp = Number(timestampString);
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = date.getDate();
  const year = date.getFullYear();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = months[date.getMonth()];
  return `${hours}:${minutes}, ${day} ${month} ${year}`;
}
const page = () => {
  const [amount, setAmount] = useState(0)
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState([])
  const [project, setProject] = useState(!false)
  const [transactions, setTransactions] = useState([])
  const getTrans = async () => {
    let req = await fetch("/api/transactions")
    let res = await req.json();
    const trans = Array.from(res.transaction)
    let amount = 0;
    trans.forEach((value) => {
      amount += value.amount;
    })
    setAmount(amount);
    setTransactions(trans.slice(-10).reverse());
  }
  const getFollow = async () => {
    let req = await fetch("/api/follow")
    let res = await req.json();
    setFollowers(res.followers);
    setFollowing(Array.from(res.following))
  }
  const projectAdd = () => {
    setProject(!project);
  }
  useEffect(() => {
    (async () => {
      await getTrans()
      await getFollow()
    })()
  }, [])
  return (
    <div>
      {project && <div className='w-[100vw] h-[100vh] absolute top-0 left-0 bg-[#ffffff67] z-15 backdrop-blur-[1px] flex justify-center items-center'>
        <div className='w-[50vw] h-[80vh] bg-white/50 backdrop-blur-xl border border-white/30 rounded-4xl'>
          <div className='absolute right-7 top-7' onClick={projectAdd}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="cursor-pointer transition-transform duration-100 hover:scale-110">
              <line x1="6" y1="6" x2="18" y2="18" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="18" x2="18" y2="6" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <form action="" className='flex flex-col items-center gap-10 justify-center h-[100%]'>
            <div className='flex gap-2 items-center'>
              <h1 className='text-xl'>Choose a cover for your project</h1>
              <input type="file" name="projectCover" accept="image/" className='mt-1 border border-[#0000004b] rounded-4xl px-2 cursor-pointer' required={true}/>
            </div>
            <input type="title" className='w-[70%] bg-white py-3 px-5 rounded-4xl focus:outline-0' maxLength={100} placeholder='Project Title' required={true}/>
            <textarea name="description" className='w-[70%] h-[50%] bg-white py-3 px-5 rounded-4xl focus:outline-0' maxLength={1500} placeholder='Write a description within 1500 characters ...' required={true}></textarea>
            <button type='submit' className='cursor-pointer hover:border-b border-[#00000038] py-2 px-4 rounded-full hover:shadow' >Submit</button>
          </form>
        </div>
      </div>}
      <div className='h-[90vh] grid grid-cols-3 grid-rows-2 gap-3 p-3 overflow-hidden'>
        <div className='bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl col-span-2 flex gap-3 p-5 right'>
          <div className="content flex flex-col justify-center h-full gap-5">
            <div className="head">
              <h1 className={`text-5xl text-center text-[#ffffffe8]`}>Income</h1>
            </div>
            <h1 className={`text-7xl text-center font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent`}>Rs.{amount}</h1>
          </div>
          <LineChart />
          <div className=' w-[30%] flex flex-col justify-center gap-2'>
            <h1 className='text-center text-5xl text-[#ffffffe8]'>Followers</h1>
            <p className='text-xl text-center poppins text-[#ffffffec]'>These are the people who follow you and send you tips.</p>
            <h1 className='text-8xl text-center bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent'>{followers}</h1>
          </div>
        </div>
        <div className='bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl row-span-2 left p-5 relative flex flex-col gap-7'>
          <h1 className='text-center text-5xl text-[#ffffffe8] poppins'>Projects</h1>
          <h1 className='text-[#ffffffe8] poppins text-xl text-center cursor-pointer hover:shadow py-3 rounded-4xl hover:border-b border-[#00000038]' onClick={projectAdd}>Add</h1>
          <div className="container flex flex-col">
            <div className="card w-full h-[10vh] border-t-1 border-[#00000023] flex items-center px-4 gap-5 hover:scale-[1.1] transition-all duration-200 cursor-pointer">
              <img src="programmer.png" className='w-[80px] rounded-2xl' />
              <div className="content">
                <h1 className='text-3xl text-[#ffffffe8] poppins'>Programming in C++</h1>
                <p className='overflow-ellipsis text-[#ffffffec] poppins'>This is my journey with learning C++ from scratch without anyone's help...</p>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl box-border flex flex-col justify-around items-center p-5 relative up'>
          <h1 className='text-center doto text-5xl text-[#ffffffe8] sticky top-0'>Tips Recieved</h1>
          <div className="container flex flex-col gap-4 items-center w-full mt-5 overflow-y-scroll hide-scrollbar">
            {transactions.map((i, index) => {
              return <div key={index} className="group border-t-1 border-[#00000023] w-[80%] h-[20%] flex justify-between py-3 items-center text-2xl px-5 hover:scale-125 transition-all duration-200 cursor-pointer">
                <h1 className='text-[#ffffff9a] group-hover:text-[#ffffff]'>{formatTimestamp(i.timestamp)}</h1>
                <h1 className='text-[#4ADE809a] group-hover:text-[#4ADE80]'>+{i.amount}</h1>
              </div>
            })}
          </div>
        </div>
        <div className='bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-5 box-border flex flex-col gap-5 justify-around items-center down'>
          <h1 className='text-center text-5xl text-[#ffffffe8]'>Send Tips</h1>
          <div className="container flex flex-col items-center w-full flex-grow">
            {following.map((i, index) => {
              return <div key={index} className="group border-t-1 border-[#00000023] w-[80%] h-[20%] flex justify-between py-2 items-center text-2xl px-5 hover:scale-125 transition-all duration-200 cursor-pointer">
                <h1 className='text-[#ffffff9a] group-hover:text-[#ffffff]'>{i.username}</h1>
                <img src="payment.gif" className='w-7' />
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
