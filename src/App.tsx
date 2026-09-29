import React from "react";
import { Hero, AboutMe, Skills, Portfolio, Experience, Contact } from "./components";
import SiteShell from "./components/SiteShell";
import TechMarquee from "./components/TechMarquee";

const App: React.FC = () => (
  <SiteShell preloader>
    <Hero />
    <TechMarquee />
    <AboutMe />
    <Skills />
    <Portfolio />
    <Experience />
    <Contact />
  </SiteShell>
);

export default App;
