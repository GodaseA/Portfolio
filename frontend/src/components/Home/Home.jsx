import React from 'react'
import "./Home.css"
import bgimg from "../../assets/heroBG.webp"
const Home = () => {
  return (
    <section className='hr-sec'>
      <img src={bgimg} alt=""  className='hr-bg'/>
      <h1 className='hr-title'>HI, I'M ABHIJIT</h1>
    </section>
  )
}

export default Home