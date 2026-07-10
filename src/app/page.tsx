import { Hero } from "@/components/sections/Hero";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Metrics } from "@/components/sections/Metrics";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

/**
 * MAHARSHI.OS — single-page interactive portfolio.
 * Boot → identity → training data → runtime logs → applications
 * → neural graph → metrics → uplink.
 */
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Education />
      <Experience />
      <Projects />
      <Skills />
      <Metrics />
      <Contact />
      <Footer />
    </main>
  );
}
