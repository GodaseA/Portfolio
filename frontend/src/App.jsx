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

const App = () => {
  return (
    <div>
      <GlobeBackground />
      <Navbar />
      {/* <Home /> */}
      <Hero />
      <About />
      <Project />
            <ExperienceSection/>

      <Contact />
      <Footer />


    </div>
  )
}

export default App