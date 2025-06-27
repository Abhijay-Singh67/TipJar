"use client"
import React, { useEffect, useState } from 'react'
import LineChart from '@/components/LineChart'
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
  const [transactions, setTransactions] = useState([])
  const getTrans = async () => {
    let req = await fetch("/api/transactions")
    let res = await req.json();
    const trans = Array.from(res.transaction)
    let amount = 0;
    trans.forEach((value)=>{
      amount+=value.amount;
    })
    setAmount(amount);
    setTransactions(trans.slice(-4).reverse());
  }
  const getFollow = async () => {
    let req = await fetch("/api/follow")
    let res = await req.json();
    setFollowers(res.followers);
  }
  useEffect(() => {
    (async () => {
      await getTrans()
      await getFollow()
    })()
  }, [])
  return (
    <div className='min-h-[90vh] grid grid-cols-3 grid-rows-2 gap-3 p-3'>
      <div className='bg-[#ffffff4b] rounded-3xl backdrop-blur-[2px] col-span-2 flex gap-3 p-5'>
        <div className='bg-gradient-to-b from-[#b9dffa] rounded-4xl w-[70%] flex justify-between items-center p-3 gap-2 shadow-2xl shadow-rgba(0, 0, 0, 0.05)'>
          <div className="content flex flex-col justify-center h-full gap-5">
            <div className="head">
              <h1 className='text-5xl text-center doto text-[#222222]'>Total Income</h1>
              <p className='text-lg quicksand'></p>
            </div>
            <h1 className='text-5xl text-center saira text-[#222222]'>Rs.{amount}</h1>
          </div>
          <LineChart />
        </div>
        <div className='bg-gradient-to-b from-[#b9dffa] rounded-4xl w-[30%] flex flex-col justify-center gap-2 shadow-2xl shadow-rgba(0, 0, 0, 0.05)'>
          <h1 className='text-center text-5xl doto text-[#222222]'>Followers</h1>
          <p className='text-xl text-center poppins text-[#222222]'>These are the people who follow you and send you tips.</p>
          <h1 className='text-8xl text-center saira'>{followers}</h1>
        </div>
      </div>
      <div className='bg-[#ffffff4b] rounded-3xl backdrop-blur-[2px] row-span-2'></div>
      <div className='bg-[#ffffff4b] rounded-3xl backdrop-blur-[2px] p-2 box-border flex justify-center items-center'>
        <div className='bg-gradient-to-b from-[#c4fdc9] w-[95%] h-[95%] rounded-4xl p-3 overflow-hidden shadow-2xl shadow-rgba(0, 0, 0, 0.05)'>
          <h1 className='text-center doto text-5xl text-[#222222]'>Tips Recieved</h1>
          <div className="container flex flex-col gap-4 items-center w-full mt-5">
            {transactions.map((i, index)=>{
              return <div key={index} className="card bg-white w-[80%] h-[20%] rounded-2xl flex justify-between py-3 items-center text-2xl px-5 hover:scale-125 transition-all duration-200 cursor-pointer">
              <h1>{formatTimestamp(i.timestamp)}</h1>
              <h1 className='text-[#4CAF50]'>+{i.amount}</h1>
            </div>
            })}
          </div>
        </div>
      </div>
      <div className='bg-[#ffffff4b] rounded-3xl backdrop-blur-[2px]'></div>
    </div>
  )
}

export default page
