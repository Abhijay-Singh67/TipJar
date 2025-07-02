"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useEdgeStore } from '@/lib/edgestore';
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
    const [progress, setProgress] = useState(0);
    const { edgestore } = useEdgeStore();
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [url1, setUrl1] = useState("");
    const [thumb1, setThumb1] = useState("");
    const [url2, setUrl2] = useState("");
    const [formt, setFormt] = useState({first:"",last:"",about:""})
    const [err, setErr] = useState(false);
    const form = useRef();
    const router = useRouter();
    const [edit, setEdit] = useState(false);
    const searchParams = useSearchParams();
    useEffect(() => {
        (async () => {
            const edit = searchParams.get('edit')
            if (edit == "true") {
                setEdit(true)
                let req = await fetch("/api/profile");
                let res = await req.json();
                console.log(res);
                setUrl1(res.profile);
                setThumb1(res.thumbnail);
                setUrl2(res.upi);
                setFormt({first:res.first,last:res.last,about:res.about})
            }
        })();
    },[])

    const submitProfile = async (e, url, thumb) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (url1 !== "" && (formData.get("first").trim()).length !== 0 && (formData.get("last").trim()).length !== 0 && (formData.get("about").trim()).length !== 0) {
            let data = {};
            if (url2 === "") {
                data = {
                    "first": formt.first.trim(),
                    "last": formt.last.trim(),
                    "about": formData.get("about").trim(),
                    "profile": url1,
                    "profileThumb": thumb1,
                    "upi": url2
                }
            } else {
                data = {
                    "first": formt.first.trim(),
                    "last": formt.last.trim(),
                    "about": formt.about.trim(),
                    "profile": url1,
                    "profileThumb": thumb1,
                    "upi": url2
                }
            }
            let req = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(data) })
            let res = await req.json();
            if (!res.success) {
                setErr(true);
            } else {
                form.current.reset();
                router.push("/dashboard");
                setProgress(0);
            }
            setUrl1("");
            setThumb1("");
            setUrl2("");
        }
    }
    const handleChange = (e)=>{
        setFormt({...formt,[e.target.name]:e.target.value})
    }
    return (
        <div className='w-[70vw] h-[80vh] bg-[#f3f2f2] flex justify-center items-center my-[5vh] rounded-4xl mx-auto'>
            <div className="font-mono flex flex-col items-center w-[50%] justify-center">
                <div className="content flex flex-col items-center py-10 gap-10 w-[100%] h-[70%]">
                    <h1 className='text-4xl'>Account Information</h1>
                    <form ref={form} onSubmit={(e) => { submitProfile(e) }} className='flex flex-col gap-7 text-lg w-[100%]'>
                        <div className="name flex gap-2">
                            <input required={true} name="first" value={formt.first}  onChange={(e)=>{handleChange(e)}} type="text" placeholder="First Name" className='bg-white rounded-full py-5 px-5 flex-grow' />
                            <input required={true} name="last" value={formt.last}  onChange={(e)=>{handleChange(e)}} type="text" placeholder="Last Name" className='bg-white rounded-full py-5 px-5 flex-grow' />
                        </div>
                        <textarea name="about" placeholder='About You' value={formt.about} onChange={(e)=>{handleChange(e)}}  minLength={1} maxLength={350} required={true} className='bg-white rounded-4xl py-5 px-5 flex-grow h-52'></textarea>
                        <div className='flex flex-col gap-3 items-center justify-center text-sm'>
                            <div className="content flex gap-2 items-center justify-center">
                                <h1 className='text-lg'>Choose a profile picture</h1>
                                <input type="file" onChange={(e) => {
                                    setFile1(e.target.files?.[0]);
                                }} name="projectCover" accept="image/" className='mt-1 border border-[#0000004b] rounded-4xl px-2 cursor-pointer' required={!edit} />
                            </div>
                            <div className="content flex gap-2 items-center justify-center">
                                <h1 className='text-lg'>UPI QR</h1>
                                <input type="file" onChange={(e) => {
                                    setFile2(e.target.files?.[0]);
                                }} name="projectCover" accept="image/" className='mt-1 border border-[#0000004b] rounded-4xl px-2 cursor-pointer' />
                            </div>
                            <h1 className='text-sm italic text-gray-500 text-center'>Note: It is not compulsory to upload a QR but if you don't then you would be opting out of recieving payments.</h1>
                            <div className="upload flex gap-2 justify-center items-center">
                                <div onClick={async () => {
                                    if (file1 && !file2) {
                                        const res = await edgestore.tipjarImages.upload({
                                            file: file1,
                                            onProgressChange: (progress) => {
                                                setProgress(progress);
                                            }
                                        });
                                        setUrl1(res.url);
                                        setThumb1(res.thumbnailUrl);
                                    } else if (!file1 && file2) {
                                        const res = await edgestore.tipjarImages.upload({
                                            file: file1,
                                            onProgressChange: (progress) => {
                                                setProgress(progress);
                                            }
                                        });
                                        setUrl2(res.url);
                                    } else {
                                        const res1 = await edgestore.tipjarImages.upload({
                                            file: file2,
                                            onProgressChange: (progress) => {
                                                setProgress(progress);
                                            }
                                        });
                                        setUrl1(res1.url);
                                        setThumb1(res1.thumbnailUrl);
                                        const res2 = await edgestore.tipjarImages.upload({
                                            file: file1,
                                            onProgressChange: (progress) => {
                                                setProgress(progress);
                                            }
                                        });
                                        setUrl2(res2.url);
                                    }
                                }} className='mt-1 border border-[#0000004b] rounded-4xl px-2 cursor-pointer'>Upload</div>
                                <div className='h-[10px] w-44 border rounded-xl overflow-hidden'>
                                    <div className='h-full bg-blue-500 transition-all duration-150' style={{ width: `${progress}%` }}>
                                    </div>
                                </div>
                            </div>
                            {err && <h1 className='text-red-500'>File upload not finished...</h1>}
                        </div>
                        <button type='submit' className='cursor-pointer rounded-full bg-red-500 w-max self-center px-5 py-3 text-white'>Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Page
