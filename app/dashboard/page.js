"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useEdgeStore } from '@/lib/edgestore';
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
  const [following, setFollowing] = useState([])
  const [transactions, setTransactions] = useState([])
  const [project, setProject] = useState(false)
  const [projects, setProjects] = useState([]);
  const [state, setState] = useState(false);
  const [url, setUrl] = useState("");
  const [thumb, setThumb] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState(false);
  const form = useRef();
  const { edgestore } = useEdgeStore();

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
      await getProjects()
    })()
  }, [])
  const getProjects = async () => {
    let req = await fetch("/api/project")
    let res = await req.json();
    if ((Array.from(res.projects.projects)).length > 0) {
      setProjects(Array.from(res.projects.projects))
    } else {
      setProjects([])
    }
  }
  const projectAdd = () => {
    setProject(!project);
    setProgress(0);
  }
  const submitProject = async (e, url, thumb) => {
    e.preventDefault();
    console.log(e);
    const formData = new FormData(e.target);
    if (url !== "") {
      const data = {
        "title": formData.get("title"),
        "description": formData.get("description"),
        "url": url,
        "thumbnail": thumb
      }
      let req = await fetch("/api/project", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(data) })
      let res = await req.json();
      if (!res.success) {
        setErr(true);
      } else {
        form.current.reset();
        await getProjects();
        setProject(!project);
      }
      setUrl("");
      setThumb("");
    }
    setProgress(0);
  }
  const deleteProject = async (pid) => {
    let req = await fetch(`/api/project?pid=${pid}`, { method: "DELETE", headers: { "Content-Type": "application/json", } })
    let res = await req.json();
    if (res.success) {
      await getProjects();
    }
  }
  return (
    <div>
      <div className='h-[90vh] grid grid-cols-3 grid-rows-2 gap-3 p-3 overflow-hidden'>
        {project && <div className='w-screen h-screen fixed top-0 left-0 bg-[#ffffff67] z-15 backdrop-blur-[1px] flex justify-center items-center'>
          <div className='grow flex justify-center items-center'>
            <div className='w-[50vw] h-[80vh] bg-white/50 backdrop-blur-xl border border-white/30 rounded-4xl'>
              <div className='absolute right-7 top-7' onClick={projectAdd}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="cursor-pointer transition-transform duration-100 hover:scale-110">
                  <line x1="6" y1="6" x2="18" y2="18" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="18" x2="18" y2="6" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <form ref={form} onSubmit={(e) => { submitProject(e, url, thumb) }} className='flex flex-col items-center gap-10 justify-center h-[100%]'>
                <div className='flex flex-col gap-3 items-center justify-center '>
                  <div className="content flex gap-2 items-center justify-center">
                    <h1 className='text-xl'>Choose a cover for your project</h1>
                    <input type="file" onChange={(e) => {
                      setFile(e.target.files?.[0]);
                    }} name="projectCover" accept="image/" className='mt-1 border border-[#0000004b] rounded-4xl px-2 cursor-pointer' required={true} />
                  </div>
                  <div className="upload flex gap-2 justify-center items-center">
                    <div onClick={async () => {
                      if (file) {
                        const res = await edgestore.tipjarImages.upload({
                          file,
                          onProgressChange: (progress) => {
                            setProgress(progress);
                          }
                        });
                        setUrl(res.url);
                        setThumb(res.thumbnailUrl);
                      }
                    }} className='mt-1 border border-[#0000004b] rounded-4xl px-2 cursor-pointer'>Upload</div>
                    <div className='h-[10px] w-44 border rounded-xl overflow-hidden'>
                      <div className='h-full bg-blue-500 transition-all duration-150' style={{ width: `${progress}%` }}>
                      </div>
                    </div>
                  </div>
                  {err && <h1 className='text-red-500'>File upload not finished...</h1>}
                </div>
                <input type="title" name='title' className='w-[70%] bg-white py-3 px-5 rounded-4xl focus:outline-0' maxLength={30} placeholder='Project Title' required={true} />
                <textarea type="description" name="description" className='w-[70%] h-[50%] bg-white py-3 px-5 rounded-4xl focus:outline-0' maxLength={1500} placeholder='Write a description within 1500 characters ...' required={true}></textarea>
                <button type='submit' className='cursor-pointer hover:border-b border-[#00000038] py-2 px-4 rounded-full hover:shadow' >Submit</button>
              </form>
            </div>
          </div>
        </div>}
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
        <div className='bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl row-span-2 left p-5 flex flex-col gap-7'>
          <h1 className='text-center text-5xl text-[#ffffffe8] poppins'>Projects</h1>
          <h1 className='text-[#ffffffe8] poppins text-xl text-center cursor-pointer hover:shadow py-3 rounded-4xl hover:border-b border-[#00000038]' onClick={projectAdd}>Add</h1>
          <div className="container flex flex-col overflow-y-scroll hide-scrollbar">
            {projects.map((i, index) => {
              return <div key={index} className="group w-full h-[10vh] border-t-1 border-[#00000023] flex items-center px-10 gap-5 hover:scale-[1.1] transition-all duration-200 cursor-pointer">
                <img src={i.data.thumbnail} className='w-[80px] h-[80px] rounded-2xl' />
                <div className="truncate content flex-grow">
                  <h1 className='group-hover:text-[#ffffff] text-2xl text-[#ffffffb7] poppins'>{i.data.title}</h1>
                  <p className='text-[#ffffff9a] group-hover:text-white poppins'>{i.data.description}</p>
                </div>
                <div onClick={() => { deleteProject(i.pid) }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-[#ffffff9a] group-hover:text-white hover:text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-7 0h8"
                    />
                  </svg>
                </div>
              </div>
            })}
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
