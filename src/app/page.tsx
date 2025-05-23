'use client'; 

import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import WhyUsSection from '@/components/WhyUsSection';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import { useTheme } from '@/components/ThemeProvider'; // Ensure correct path
import { useLanguage } from '@/components/LanguageProvider'; // Ensure correct path

export default function HomePage() {
  // It's better to use the custom hooks if they are exported from your providers
  const themeContext = useTheme(); 
  const languageContext = useLanguage();
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Fallback or error handling if context is not available (should not happen if setup correctly)
  if (!themeContext || !languageContext) {
    // You could render a loading state or an error message
    // For now, returning null or a simple loading message
    // This check is more of a safeguard during development.
    // In a production app, ThemeProvider and LanguageProvider must wrap this component.
    console.error("Theme or Language context is not available. Make sure providers are set up in layout.tsx.");
    return <div>Loading context...</div>; 
  }

  // const { theme, setTheme } = themeContext;

  const toggleContactModal = () => {
    setIsContactModalOpen(prev => !prev);
  };
  
  return (
    <div className="font-satoshi transition-colors duration-300"> {/* font-satoshi is applied via body in globals.css */}
        {/* Animated blob container is now in layout.tsx to be truly global */}
        {/* The relative z-10 wrapper is also in layout.tsx */}
        <Header 
          onContactClick={toggleContactModal} 
        />
        <main>
          <HeroSection onContactClick={toggleContactModal} /> 
          <FeaturesSection />
          <WhyUsSection />
        </main>
        <Footer /> 
        <ContactModal 
          isOpen={isContactModalOpen} 
          onClose={toggleContactModal} 
        />
    </div>
  );
}