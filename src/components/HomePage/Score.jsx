import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Score = ({ score = 75 }) => {
  return (
    <div className="w-16 h-16">
      <CircularProgressbar
      className='font-bold'
        value={score}
        text={`${score}`}
        strokeWidth={12}
        styles={buildStyles({
          pathColor: '#7C3AED',
          textColor: '#000',
          textSize: '24px',
          trailColor: '#e5e7eb',
        })}
      />
    </div>
  )
}

export default Score