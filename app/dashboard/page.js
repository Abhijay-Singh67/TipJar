"use client"
import React, {useEffect, useState} from 'react'
import LineChart from '@/components/LineChart'

const page = () => {
  const [amount, setAmount] = useState(0)
  useEffect(() => {
          (async () => {
              let req = await fetch("/api/transactions")
              let res = await req.json();
              setAmount((Array.from(res.transaction)).reduce((a,b)=>a+b))
          })()
      }, [])
  return (
    <div className='min-h-[90vh] grid grid-cols-3 grid-rows-2 gap-3 p-3'>
      <div className='bg-[#ffffff4b] rounded-3xl backdrop-blur-[2px] col-span-2 flex gap-3 p-5'>
        <div className='bg-white rounded-4xl w-[70%] flex justify-between items-center p-3 gap-2'>
          <div className="content flex flex-col justify-center h-full gap-5">
            <div className="head">
              <h1 className='text-5xl roboto font-bold text-center'>Total Income</h1>
              <p className='text-lg quicksand'></p>
            </div>
            <h1 className='text-5xl text-center saira'>Rs.{amount}</h1>
          </div>
          <LineChart />
        </div>
        <div className='bg-white rounded-4xl w-[30%]'>

        </div>
      </div>
      <div className='bg-[#ffffff4b] rounded-3xl backdrop-blur-[2px] row-span-2'></div>
      <div className='bg-[#ffffff4b] rounded-3xl backdrop-blur-[2px]'></div>
      <div className='bg-[#ffffff4b] rounded-3xl backdrop-blur-[2px]'></div>
    </div>
  )
}

export default page
