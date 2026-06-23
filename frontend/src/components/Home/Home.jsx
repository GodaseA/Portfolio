import React, { useEffect, useRef } from 'react'
import "./Home.css"
import { assets } from '../../assets/assets'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Home = () => {

  useEffect(() => {
    const letters = boxRef.current.querySelectorAll(".letter");

    gsap.from(letters, {

      // y: 80,
      // opacity: 0.7,
      // stagger: 0.05,
      // duration: 0.8,
      // ease: "back.out(1.7)",

      x: 150,
      opacity: 1,
      duration: 0.7,
      ease: "power4",
      stagger: 0.04,
      delay: 1

    });
  }, []);

  const line1 = "I'm Godase Abhijit,";
  const line2 = "Frontend developer";

  const boxRef = useRef();

  // useEffect(() => {
  //   gsap.to(boxRef.current, {
  //     // x: 0,
  //     // duration: 20,
  //     // rotation: 360,

  //     // opacity: 0,
  //     scale:1.15,
  //     duration: 3,
  //    });
  // }, []);



  //   useEffect(() => {
  //   gsap.to(boxRef.current, {
  //     x: Math.random,
  //     scrollTrigger: {
  //       trigger: boxRef.current,
  //       start: "top center",
  //     },
  //   });
  // }, []);

  return (
    <div id='home' className='home'>
      {/* <img className='home-left-pic' src={assets.ProfilePic} alt="" /> */}

      <h1 >
        <span ref={boxRef} >{line1.split("").map((ch, i) => (
          <span key={`a-${i}`} className="letter">
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
        </span>
        <br />

        <span>
          {line2.split("").map((ch, i) => (
            <span key={`b-${i}`} className="letter">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </h1>
      <p>I love building interactive web apps that solve real-world problems</p>


      <div className='home-action'>
        <div className="home-connect"><AnchorLink className="anchor-link" offset={50} href="#contact" >connnect with me </AnchorLink> </div>

        <a href="/Abhijit_Godase_Resume.pdf"
          download="Abhijit_Godase_Resume.pdf"
          className="home-resume">
          My resume
        </a>
      </div>
    </div>
  )
}

export default Home