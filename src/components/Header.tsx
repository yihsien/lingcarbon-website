'use client';

import React, { useState, useEffect} from 'react';
import Link from 'next/link'; // Use Next.js Link for navigation
import { ChevronDown, ClipboardList, Calculator, Leaf, Target, Award, Users, Briefcase} from 'lucide-react';
//import { Newspaper, BookOpen, HelpCircle } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
//import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { useRouter } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  action?: () => void;
  /** Items shown in dropdown (if any) */
  dropdownItems?: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    description: string;
  }>;
  /** Render dropdown items in a single vertical column */
  vertical?: boolean;
  /** Show the CTA footer (defaults to true) */
  showCTA?: boolean;
}

interface HeaderProps {
  onContactClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onContactClick }) => {
  //const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [disableDropdownUntilLeave, setDisableDropdownUntilLeave] = useState(false);

  // Reset dropdown states when navigating
  const resetDropdownStates = () => {
    setOpenDropdown(null);
    setDisableDropdownUntilLeave(false);
    setIsMobileMenuOpen(false);
  };

  // Smooth‑scroll so the target section is roughly centred
  const scrollToSection = (href: string) => {
    const hash = href.includes('#') ? href.split('#')[1] : '';
    if (!hash) return;

    const el = document.getElementById(hash);
    if (el) {
      // Same‑page: smooth‑scroll & centre
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Different page: navigate and reset dropdown states
      resetDropdownStates();
      router.push(href, { scroll: false });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Re‑centre section after navigating to a different page with #hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Run once on mount in case page loaded with #hash
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Reset dropdown when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      resetDropdownStates();
    };

    // Listen for route changes (Next.js specific)
    window.addEventListener('beforeunload', handleRouteChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, []);

  const navItemsData: NavItem[] = [
    {
      name: t.navServices,
      href: '/services',
        dropdownItems: [
        { name: t.navServiceGHG,           href: '/services#ghg-inventory',         icon: ClipboardList, description: t.navServiceGHGDesc },
        { name: t.navServiceFootprinting,  href: '/services#cfp-calculation',       icon: Calculator,    description: t.navServiceFootprintingDesc },
        { name: t.navServiceStrategy,      href: '/services#carbon-neutral-strategy', icon: Leaf,       description: t.navServiceStrategyDesc },
        { name: t.navServiceSBTi,          href: '/services#sbti-target-setting',   icon: Target,       description: t.navServiceSBTiDesc },
        { name: t.navServiceRatings,       href: '/services#esg-ratings',           icon: Award,       description: t.navServiceRatingsDesc },
        ]
    },
    {
      name: t.navCompany,
      href: '#company',
      dropdownItems: [
        {
          name: t.navOurTeam,
          href: '/our-team',
          icon: Users,
          description: t.navOurTeamDesc,
        },
        {
          name: t.navJoinUs,
          href: '/join-us',
          icon: Briefcase,
          description: t.navJoinUsDesc,
        },
      ],
    },
    /*
    {
      name: t.navResources,
      href: '#resources',
      vertical: true,
      showCTA: false,
      dropdownItems: [
        {
          name: t.navLatestNews,
          href: '/latest-news',
          icon: Newspaper,
          description: t.navLatestNewsDesc,
        },
        {
          name: t.navBlog,
          href: '/blog',
          icon: BookOpen,
          description: t.navBlogDesc,
        },
        {
          name: t.navFAQs,
          href: '/faqs',
          icon: HelpCircle,
          description: t.navFAQsDesc,
        },
      ],
    },
    */
    { name: t.navContact, href: '#contact', action: onContactClick },
  ];

  // Keep a transparent bottom‑border at all times so no new
  // layer is painted when scrolling → prevents white flash.
  const headerBgClass = isScrolled
    ? 'bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl shadow-sm border-b border-gray-200/20 dark:border-gray-700/30'
    : 'bg-transparent border-b border-transparent';

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
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItemsData.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={item.dropdownItems ? () => {
                  if (!disableDropdownUntilLeave) setOpenDropdown(item.name);
                } : undefined}
                onMouseLeave={item.dropdownItems ? () => {
                  setOpenDropdown(null);
                  setDisableDropdownUntilLeave(false);
                } : undefined}
              >
                {item.dropdownItems ? (
                  <>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        
                        if (item.href.includes('#')) {
                          scrollToSection(item.href);
                        } else {
                          resetDropdownStates();
                          router.push(item.href);
                        }
                      }}
                      className="text-gray-700 dark:text-gray-300 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] transition-all duration-200 font-medium text-sm flex items-center py-3 px-4 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    >
                      {item.name}
                      <ChevronDown
                        size={14}
                        className={`ml-1.5 transition-all duration-300 ${
                          openDropdown === item.name ? 'rotate-180 text-[var(--color-companyBlue)]' : ''
                        }`}
                      />
                    </Link>
                    {openDropdown === item.name && !disableDropdownUntilLeave && (
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 ${
                          item.vertical
                            ? 'w-80'
                            : item.dropdownItems.length <= 2
                              ? 'w-80'
                              : 'w-screen max-w-4xl'
                        } animate-in fade-in-0 zoom-in-95 duration-200`}
                        style={{
                          animation: 'dropdownAppear 0.2s ease-out forwards'
                        }}
                      >
                        <div className="overflow-hidden rounded-xl bg-gray-200/100 dark:bg-gray-900/100 backdrop-blur-xl shadow-2xl ring-1 ring-gray-900/5 dark:ring-gray-100/10 border border-gray-200/20 dark:border-gray-700/30">
                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-companyBlue-light)]/20 to-transparent dark:from-[var(--color-companyBlue)]/10 pointer-events-none"></div>
                          
                          <div
                            className={`relative p-6 ${
                              item.vertical
                                ? 'flex flex-col space-y-1'
                                : item.dropdownItems.length <= 2
                                  ? 'flex flex-col space-y-1'
                                  : 'grid gap-1 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                            }`}
                          >
                            {item.dropdownItems.map((subItem, index) => {
                              const Icon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    resetDropdownStates();
                                    
                                    if (subItem.href.includes('#')) {
                                      scrollToSection(subItem.href);
                                    } else {
                                      router.push(subItem.href);
                                    }
                                  }}
                                  className="group relative flex items-start rounded-lg p-4 transition-all duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:scale-[1.02] border border-transparent hover:border-gray-200/40 dark:hover:border-gray-700/40"
                                  style={{
                                    animationDelay: `${index * 50}ms`,
                                    animation: 'slideInUp 0.3s ease-out forwards'
                                  }}
                                >
                                  {/* Icon container with tech-style glow */}
                                  <div className="relative">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-companyBlue)] to-[var(--color-companyBlue)]/80 dark:from-[var(--color-companyBlue)] dark:to-[var(--color-companyBlue)]/70 shadow-lg group-hover:shadow-xl group-hover:shadow-[var(--color-companyBlue)]/25 transition-all duration-200">
                                      <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    {/* Subtle glow effect */}
                                    <div className="absolute inset-0 rounded-lg bg-[var(--color-companyBlue)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm"></div>
                                  </div>
                                  
                                  <div className="ml-4 flex-1">
                                    <div className="flex items-center">
                                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[var(--color-companyBlue)] transition-colors duration-200">
                                        {subItem.name}
                                      </p>
                                      {/* Subtle arrow indicator */}
                                      <svg 
                                        className="ml-2 h-3 w-3 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                      {subItem.description}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                          
                          {/* Enhanced CTA section */}
                          {item.showCTA !== false && item.dropdownItems.length > 2 && (
                            <div className="relative border-t border-gray-200/40 dark:border-gray-700/40 bg-gradient-to-r from-gray-50/50 to-gray-100/30 dark:from-gray-800/50 dark:to-gray-900/30 px-6 py-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                                    {t.dropdownCustomSolutionsTitle}
                                    <div className="ml-2 h-1.5 w-1.5 rounded-full bg-[var(--color-companyBlue)] animate-pulse"></div>
                                  </h3>
                                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {t.dropdownCustomSolutionsDesc}
                                  </p>
                                </div>
                                <button
                                  onClick={() => { 
                                    onContactClick(); 
                                    resetDropdownStates(); 
                                  }}
                                  className="mt-3 sm:mt-0 sm:ml-6 shrink-0 relative overflow-hidden rounded-lg bg-gradient-to-r from-[var(--color-companyBlue)] to-[var(--color-companyBlue)]/80 px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[var(--color-companyBlue)]/25 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-companyBlue)]/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                >
                                  <span className="relative z-10">{t.navContact}</span>
                                  {/* Hover shimmer effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      } else if (item.href.includes('#')) {
                        e.preventDefault();
                        scrollToSection(item.href);
                      }
                      resetDropdownStates();
                    }}
                    className="text-gray-700 dark:text-gray-300 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] transition-all duration-200 font-medium text-sm flex items-center py-3 px-4 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
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
                className="text-gray-600 dark:text-gray-300 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] focus:outline-none p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/20 dark:border-gray-700/30 shadow-xl">
          <nav className="flex flex-col space-y-1 p-4">
            {navItemsData.map((item, index) => (
              <div key={item.name} className="w-full" style={{ animationDelay: `${index * 100}ms` }}>
                {item.dropdownItems ? (
                  <>
                    <button
                      onClick={() => {
                        setOpenDropdown(prev => (prev === item.name ? null : item.name));
                      }}
                      className="w-full text-gray-700 dark:text-gray-200 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] transition-all duration-200 font-medium text-base py-3 px-4 flex items-center justify-between rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    >
                      {item.name}
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-300 ${
                          openDropdown === item.name ? 'rotate-180 text-[var(--color-companyBlue)]' : ''
                        }`} 
                      />
                    </button>
                    {openDropdown === item.name && (
                      <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg mt-1 ml-4 overflow-hidden">
                        {item.dropdownItems.map((subItem, subIndex) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={(e) => {
                              e.preventDefault();
                              resetDropdownStates();
                              
                              if (subItem.href.includes('#')) {
                                scrollToSection(subItem.href);
                              } else {
                                router.push(subItem.href);
                              }
                            }}
                            className="flex items-center py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/50 hover:text-[var(--color-companyBlue)] transition-all duration-200 text-sm"
                            style={{ animationDelay: `${subIndex * 50}ms` }}
                          >
                            <subItem.icon className="h-4 w-4 mr-3 text-[var(--color-companyBlue)]" />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      } else if (item.href.includes('#')) {
                        e.preventDefault();
                        scrollToSection(item.href);
                      }
                      resetDropdownStates();
                    }}
                    className="block w-full text-gray-700 dark:text-gray-200 hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-companyBlue)] transition-all duration-200 font-medium text-base py-3 px-4 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes dropdownAppear {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;