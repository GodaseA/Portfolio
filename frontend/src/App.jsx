import "./App.css"
import Navbar from './components/Navbar/Navbar'
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Project from "./components/Projects/Project";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import BackgroundWords from "./components/Background/BackgroundWords";
import GlobeBackground from "./components/Background/Background";
import ExperienceSection from "./components/Experience/ExperienceSection";
import ScrollSequence from "./components/Hero/ScrollSequence";
 import HangingIdCard from "./components/HangingIdCard";

const App = () => {
  return (
    <div>
      {/* <GlobeBackground /> */}
      <Navbar />
      <ScrollSequence />
      <About />
      <Project />
      {/* <Home/> */}
      {/* <HangingIdCard/> */}
      <ExperienceSection />
{/* <Contact/> */}
<Footer/>

    </div>
  )
}

export default App