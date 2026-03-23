import { useEffect, useState } from "react";
import "@/styles/landing.css";

import BirdSketch from "@/components/BirdSketch";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FincaSection from "@/components/landing/FincaSection";
import GaleriaSection from "@/components/landing/GaleriaSection";
import ReservasSection from "@/components/landing/ReservasSection";

import { useGallery } from "@/hooks/useGallery";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import background from "@/assets/background.jpeg";
import villaLogo from "@/assets/villa-tata-logo.jpeg";

const Index = () => {
  const [navVisible, setNavVisible] = useState(false);
  const [heroTextVisible, setHeroTextVisible] = useState(false);
  const gallery = useGallery();
  const finca = useScrollReveal(0.3);

  /* Logo intro → show navbar → show hero text */
  useEffect(() => {
    const navTimer = setTimeout(() => setNavVisible(true), 700);
    const textTimer = setTimeout(() => setHeroTextVisible(true), 2200);
    return () => { clearTimeout(navTimer); clearTimeout(textTimer); };
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${background})` }}
      />

      <BirdSketch />

      {/* Floating logo intro */}
      <img
        src={villaLogo}
        alt="Villa Tata"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed z-50 rounded-lg shadow-lg logo-intro ${
          navVisible ? "logo-intro--top" : "logo-intro--center"
        }`}
      />

      <Navbar visible={navVisible} />
      <HeroSection textVisible={heroTextVisible} />
      <FincaSection ref={finca.ref} visible={finca.visible} />
      <GaleriaSection {...gallery} />
      <ReservasSection />
    </div>
  );
};

export default Index;
