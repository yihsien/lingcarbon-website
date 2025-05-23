'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Twitter size={24} />, href: "#", name: "Twitter" },
    { icon: <Linkedin size={24} />, href: "#", name: "LinkedIn" },
    { icon: <Github size={24} />, href: "#", name: "GitHub" },
    { icon: <Mail size={24} />, href: "#", name: "Email" },
  ];

  const footerSections = [
    { 
      title: t.footerProducts, 
      links: [
        { name: t.footerProductsLink1, href: "#carbon-accounting" }, // Assuming these link to sections or specific pages
        { name: t.footerProductsLink2, href: "#footprint-calculation" },
        { name: t.footerProductsLink3, href: "#neutral-implementation" },
        { name: t.footerProductsLink4, href: "#consulting" },
      ] 
    },
    { 
      title: t.footerResources, 
      links: [
        { name: t.footerResourcesLink1, href: "#methodologies" },
        { name: t.footerResourcesLink2, href: "#case-studies" },
        { name: t.footerResourcesLink3, href: "#blog" },
        { name: t.footerResourcesLink4, href: "#faqs" },
      ] 
    },
    { 
      title: t.footerCompany, 
      links: [
        { name: t.footerCompanyLink1, href: "#about-us" },
        { name: t.footerCompanyLink2, href: "#our-mission" },
        { name: t.footerCompanyLink3, href: "#careers" },
        { name: t.footerCompanyLink4, href: "#contact" },
      ] 
    },
    { 
      title: t.footerLegal, 
      links: [
        { name: t.footerLegalLink1, href: "#privacy-policy" },
        { name: t.footerLegalLink2, href: "#terms-of-service" },
        { name: t.footerLegalLink3, href: "#cookie-policy" },
      ] 
    }
  ];

  const sectionBgClass = theme === 'dark' ? 'dark:bg-black' : 'bg-transparent';

  return (
    <footer className={`border-t border-slate-400/20 dark:border-gray-700/30 text-slate-700 dark:text-slate-300 py-16 relative z-10 ${sectionBgClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold mb-4">
              <AnimatedLogo variant="footer" />
            </Link>
            <p className="text-sm">{t.footerSlogan}</p>
          </div>
          {footerSections.map(section => (
            <div key={section.title}>
              <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">{section.title}</h5>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-sky-400)] transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-400/20 dark:border-gray-700/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">© {currentYear} {t.footerRights}</p>
          <div className="flex space-x-5">
            {socialLinks.map(social => (
              <a 
                key={social.name} 
                href={social.href} 
                aria-label={social.name} 
                className="hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-sky-400)] transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;