import React from 'react'

const Card = (props) => {
    return (
        <div className='w-[90vw] mx-auto my-[30px]'>
            <div className={props.reverse?"flex-row-reverse card flex justify-between py-10 px-25 bg-[#e7e6e6]":"rounded-3xl card flex justify-between py-10 px-25 bg-[#e4e2e2]"}>
                <img src={props.image} className="w-[18vw] rounded-2xl" />
                <div className={props.reverse?"content text-left flex flex-col items-start justify-center":"content text-right flex flex-col items-end justify-center"}>
                    <h1 className="text-5xl font-semibold">{props.title}</h1>
                    <br />
                    <p className="font-serif text-2xl w-[50vw]">{props.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Card
