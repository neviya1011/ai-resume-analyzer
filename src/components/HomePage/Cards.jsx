import React from 'react'
import Score from './Score'

const Cards = (props) => {
  return (
    <div className='w-[350px] h-[400px] bg-white rounded-2xl'>
        <div className='p-3'>
            <div className='flex justify-between'>
                <div className='mt-2'>
                    <h1 className='font-bold text-2xl mb-2'>{props.company}</h1>
                    <h2 className='text-xs text-[rgb(170,170,170)]'>{props.role}</h2>
                </div>
                <Score score={props.score} />
            </div>
            <img src={props.img} className="w-full h-[250px] rounded-2xl mt-4 object-cover object-top" />
        </div>
    </div>
  )
}

export default Cards
