"use client"
import React, { useEffect, useState } from 'react'

const page = ({ params }) => {
  const [profile, setProfile] = useState("error.jpg")
  const [info, setInfo] = useState({ first: "", last: "", about: "" })
  const [projects, setProjects] = useState([]);
  const [follows, setFollows] = useState(false)
  useEffect(() => {
    (async () => {
      let req = await fetch("/api/user");
      let res = await req.json()
      setProfile(res.profile)
      setInfo({ ...info, first: res.first, last: res.last, about: res.about })
      const currentUrl = window.location.href;
      try {
        req = await fetch("/api/follow")
        res = await req.json()
        if (res.following.filter((i) => i.id == (currentUrl.split("/")).reverse()[0]).length > 0) {
          setFollows(true);
        }
      } catch {
        console.log("User not logged in")
      }
      getProjects();
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
  const follow = async () => {
    let req = await fetch("/api/auth")
    let res = await req.json()
    if (res.logged) {
      const currentUrl = window.location.href;
      let data = { id: (currentUrl.split("/")).reverse()[0] }
      let req = await fetch("/api/follow", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(data) })
      let res = await req.json();
      if (res) {
        setFollows(true);
      }
    }
  }
  const unfollow = async () => {
    const currentUrl = window.location.href;
    let data = { id: (currentUrl.split("/")).reverse()[0] }
    let req = await fetch("api/follow", { method: "DELETE", headers: { "Content-Type": "application/json", } })
    let res = await req.json();
    if (res) {
      setFollows(false);
    }
  }
  return (
    <div className='overflow-x-hidden'>
      <div className='flex justify-between items-center gap-5 pt-10 px-12'>
        <div className='w-[30vh]'>
          <img src={profile} className='z-1 rounded-full h-[30vh] w-[30vh] object-cover object-top' />
        </div>
        <div className="info w-[80%]">
          <div className="content flex justify-between">
            <h1 className='text-5xl'>{info.first} {info.last}</h1>
            {follows ? <button className='bg-white px-5 rounded-full text-black border flex gap-1 items-center cursor-pointer' onClick={unfollow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>Following</span>
            </button> : <button className='bg-blue-500 px-5 rounded-full text-white cursor-pointer' onClick={follow}>Follow</button>}
          </div>
          <p className='mt-5 text-2xl'>{info.about}</p>
        </div>
      </div>
      <img src="waves.svg" />
      <div className='bg-[#C62368] pb-10'>
        <div className="w-[100vw] flex flex-col gap-5 ">
          {projects.map((i, index) => {
            return <div key={index} className='w-[90%] mx-auto text-[#e4e3e3]'>
              <div className="rounded-3xl card flex justify-between py-10 px-25 bg-[#D53867] items-center gap-5">
                <img src={i.data.url} className="w-[30vw] h-[40vh] object-cover rounded-4xl mt-10" />
                <div className="content text-right flex flex-col items-end justify-center">
                  <h1 className="text-5xl font-semibold stroke">{i.data.title}</h1>
                  <br />
                  <p className="font-serif text-xl w-[50vw]">{i.data.description}</p>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default page
