import React from "react";
import { Hero, AboutMe, Skills, Portfolio, Experience, Contact } from "./components";
import SiteShell from "./components/SiteShell";

const App: React.FC = () => (
  <SiteShell>
    <Hero />
    <AboutMe />
    <Skills />
    <Portfolio />
    <Experience />
    <Contact />
  </SiteShell>
);

export default App;
