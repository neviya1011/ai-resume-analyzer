import React from 'react'
import HeroSection from './components/HomePage/HeroSection'
import Cards from './components/HomePage/Cards'
import resume1 from './assets/images/resume1.webp'
import resume2 from './assets/images/resume2.webp'
import resume3 from './assets/images/resume3.webp'

const App = () => {

  const resumes = [
    {
      company: "Google",
      role: "Frontend Developer",
      img: resume1,
      score: 90
    },
    {
      company: "Microsoft",
      role: "Cloud Engineer",
      img: resume2,
      score: 85
    },
    {
      company: "Apple",
      role: "iOS Developer",
      img: resume3,
      score: 75
    },
  ];

  return (
    <div>
      < HeroSection />

      <div className='grid grid-cols-3 gap-20 justify-items-center mt-10'>
        {resumes.map(function(elem,index) {
          return <Cards key={index} company={elem.company} role={elem.role} img={elem.img} score={elem.score}/>
        })}
      </div>
    </div>
  )
}

export default App
