'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Use Next.js Link for navigation
import { ChevronDown, ClipboardList, Calculator, Leaf, Target, Award } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

interface NavItem {
  name: string;
  href: string;
  action?: () => void;
  dropdownItems?: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    description: string;
  }>;
}

interface HeaderProps {
  onContactClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onContactClick }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node) &&
        servicesButtonRef.current &&
        !servicesButtonRef.current.contains(event.target as Node)
      ) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItemsData: NavItem[] = [
    {
      name: t.navServices,
      href: '#features', // In Next.js, you might link to a page like /services
        dropdownItems: [
        { name: t.navServiceGHG,           href: '/services#ghg-inventory',         icon: ClipboardList, description: t.navServiceGHGDesc },
        { name: t.navServiceFootprinting,  href: '/services#footprinting',          icon: Calculator,    description: t.navServiceFootprintingDesc },
        { name: t.navServiceStrategy,      href: '/services#carbon-neutral-strategy', icon: Leaf,       description: t.navServiceStrategyDesc },
        { name: t.navServiceSBTi,          href: '/services#sbti-target-setting',   icon: Target,       description: t.navServiceSBTiDesc },
        { name: t.navServiceRatings,       href: '/services#sustainability-ratings', icon: Award,       description: t.navServiceRatingsDesc },
        ]
    },
    { name: t.navAbout, href: '#about' }, // Example: /about
    { name: t.navResources, href: '#resources' }, // Example: /resources
    { name: t.navContact, href: '#contact', action: onContactClick },
  ];

  const headerBgClass = isScrolled
    ? 'bg-[#d7d8d8]/60 dark:bg-black/70 backdrop-blur-lg shadow-lg'
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
                        <AnimatedLogo
              className="h-8 md:h-9 lingcarbon-logo-main animate-logo"
              variant="main"
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1"> {/* Reduced space-x for tighter packing if needed */}
            {navItemsData.map((item) => (
              <div
                key={item.name}
                className="relative"
                // Move handlers here so both button and dropdown are covered
                onMouseEnter={item.dropdownItems ? () => setIsServicesDropdownOpen(true) : undefined}
                onMouseLeave={item.dropdownItems ? () => setIsServicesDropdownOpen(false) : undefined}
              >
                {item.dropdownItems ? (
                  <>
                    <button
                      type="button"
                      ref={servicesButtonRef}
                      className="text-slate-700 dark:text-slate-300 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] transition-colors duration-200 font-medium text-sm flex items-center py-2 px-3"
                    >
                      {item.name}
                      <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isServicesDropdownOpen && (
                      <div
                        ref={servicesDropdownRef}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-md lg:max-w-2xl xl:max-w-6xl"
                      >
                        <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 bg-slate-200 dark:bg-slate-800 pt-6 mt-4">
                          <div className="relative grid gap-x-6 gap-y-3 px-5 pb-4 sm:px-8 sm:pb-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                            {item.dropdownItems.map((subItem) => {
                              const Icon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={() => setIsServicesDropdownOpen(false)}
                                  className="flex items-start rounded-lg p-4 hover:bg-slate-300/30 dark:hover:bg-slate-700 transition ease-in-out duration-150"
                                >
                                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-companyBlue-light)] text-[var(--color-companyBlue)] sm:h-12 sm:w-12">
                                    <Icon aria-hidden="true" className="size-6" />
                                  </div>
                                  <div className="ml-4">
                                    <p className="text-base font-medium text-slate-900 dark:text-slate-100">{subItem.name}</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subItem.description}</p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                          <div className={`bg-slate-200 dark:bg-slate-800 px-5 py-3 sm:px-8 sm:py-3 border-t border-slate-400/20 dark:border-slate-700 flex flex-col sm:flex-row items-center ${theme === 'light' ? 'justify-between' : 'justify-center sm:justify-between'}`}>
                            <div>
                              <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200">{t.dropdownCustomSolutionsTitle}</h3>
                              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{t.dropdownCustomSolutionsDesc}</p>
                            </div>
                            <button
                              onClick={() => { onContactClick(); setIsServicesDropdownOpen(false); }}
                              className="mt-3 sm:mt-0 sm:ml-4 shrink-0 rounded-md bg-[var(--color-companyBlue)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-companyBlue)]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-companyBlue)]"
                            >
                              {t.navContact}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={item.action ? (e) => { e.preventDefault(); if (item.action) item.action(); } : undefined}
                    className="text-slate-700 dark:text-slate-300 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] transition-colors duration-200 font-medium text-sm flex items-center py-2 px-3" // Consistent padding
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            <LanguageToggle />
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 dark:text-slate-300 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] focus:outline-none p-1"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#d7d8d8]/90 dark:bg-black/90 backdrop-blur-md pb-4 absolute w-full shadow-lg">
          <nav className="flex flex-col items-center space-y-1 pt-2 px-2">
            {navItemsData.map((item) => (
              <div key={item.name} className="w-full text-center">
                {item.dropdownItems ? (
                  <>
                    <button
                      onClick={() => setIsServicesDropdownOpen(prev => !prev)}
                      className="w-full text-slate-700 dark:text-slate-200 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] transition-colors duration-200 font-medium text-lg py-3 px-3 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {item.name}
                      <ChevronDown size={20} className={`ml-2 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isServicesDropdownOpen && (
                      <div className="bg-slate-100/50 dark:bg-slate-800/50 w-full mt-1 rounded-md">
                        {item.dropdownItems.map(subItem => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => { setIsMobileMenuOpen(false); setIsServicesDropdownOpen(false); }}
                            className="block py-2.5 px-4 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] rounded-md"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={item.action ? (e) => { e.preventDefault(); if (item.action) item.action(); setIsMobileMenuOpen(false); } : () => setIsMobileMenuOpen(false)}
                    className="block w-full text-slate-700 dark:text-slate-200 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] transition-colors duration-200 font-medium text-lg py-3 px-3 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;