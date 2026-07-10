import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollSequence.css"
import frames from "../../assets/frames";

gsap.registerPlugin(ScrollTrigger);



export default function ScrollSequence() {
  const sectionRef = useRef(null);
  const content1 = useRef();
  const content2 = useRef();
  const [currentImage, setCurrentImage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=1000", // longer scroll distance to give text room to breathe
      pin: true,
      scrub: true,
      pinSpacing: true,
      // markers: true, // turn back on while debugging

      onUpdate: (self) => {
        const index = Math.min(170, Math.floor(self.progress * 171));
        setCurrentImage(index);
        setProgress(self.progress);
       
        //  gsap.set(".content", {
        //   opacity: 0,
        //   y: 100,
        //   scrollTrigger: {
        //     trigger: sectionRef.current,
        //     start: "top top",
        //     end: "+=4000",
        //     scrub: true,
        //   }
        // });

      // if(progress > 0.2){
          gsap.to(".content", {
          opacity: 1,
          x: 100,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2000",
            scrub: true,
          }
        });



           gsap.to(".cotaintRight", {
          opacity: 1,
          x: -200,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2000",
            scrub: true,
          }
        });
      // }
      
      
      },
    });

    return () => trigger.kill();
  }, []);



  return (
    <section ref={sectionRef} className="sequence">
      <img className="imgs" src={frames[currentImage]} alt="" />

      <div className="content">
        <h1 className="hi-text"  >HI, I AM
          <br />
          <span>ABHIJIT</span>
        </h1>

        <p className="pos-text">SOFTWARE DEVELOPER</p>
      </div>

      <div className="cotaintRight" >
        <p>Building fast, clean web apps with Various Technologies, from pixel-perfect UI to production-ready APIs.</p>
        <a href=""> projects</a>
        <a href=""> contact</a>
      </div>

    </section>
  );
}