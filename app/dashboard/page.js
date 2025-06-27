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
  useEffect(() => {
    (async () => {
      await getTrans()
      await getFollow()
    })()
  }, [])
  return (
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
          <h1 className='text-center text-5xl doto text-[#ffffffe8]'>Followers</h1>
          <p className='text-xl text-center poppins text-[#ffffffec]'>These are the people who follow you and send you tips.</p>
          <h1 className='text-8xl text-center bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent'>{followers}</h1>
        </div>
      </div>
      <div className='bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl row-span-2 left'>
        <h1>Projects</h1>
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
  )
}

export default page
