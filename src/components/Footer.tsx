'use client';

import React from 'react';
import Link from 'next/link';
//import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import { useTheme } from './ThemeProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import { useParams } from 'next/navigation';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { lang } = useParams<{ lang: 'en' | 'zh' }>();
  const router = useRouter();
  const pathname = usePathname();
  const langPrefix = `/${lang}`;
  const withLang = (path: string) =>
    path.startsWith('/') ? `${langPrefix}${path}` : path;
  const currentYear = new Date().getFullYear();

  
  //commenting out social links for now
  {/*
  const socialLinks = [
    { icon: <Twitter size={24} />, href: "#", name: "Twitter" },
    { icon: <Linkedin size={24} />, href: "#", name: "LinkedIn" },
    { icon: <Github size={24} />, href: "#", name: "GitHub" },
    { icon: <Mail size={24} />, href: "#", name: "Email" },
  ];
  */}

  const footerSections = [
    { 
      title: t.footerProducts, 
      links: [
        { name: t.footerProductsLink1, href: withLang('/services#ghg-inventory') }, 
        { name: t.footerProductsLink2, href: withLang('/services#cfp-calculation') },
        { name: t.footerProductsLink3, href: withLang('/services#carbon-neutral-strategy') },
        { name: t.footerProductsLink4, href: withLang('/services#sbti-target-setting') },
        { name: t.footerProductsLink5, href: withLang('/services#esg-ratings') },
      ] 
    },
    { 
      title: t.footerCompany, 
      links: [
        { name: t.footerCompanyLink1, href: withLang('/our-team') },
        { name: t.footerCompanyLink2, href: withLang('/join-us') },
      ] 
    },
    /*
    { 
      title: t.footerResources, 
      links: [
        { name: t.footerResourcesLink1, href: "#latest-news" },
        { name: t.footerResourcesLink2, href: "#opinions" },
        { name: t.footerResourcesLink3, href: "#faqs" },
      ] 
    },
    */

//   { 
//      title: t.footerLegal, 
//      links: [
//        { name: t.footerLegalLink1, href: "#privacy-policy" },
//        { name: t.footerLegalLink2, href: "#terms-of-service" },
//        { name: t.footerLegalLink3, href: "#cookie-policy" },
//      ] 
//    }
  ];

  const sectionBgClass = theme === 'dark' ? 'dark:bg-black' : 'bg-transparent';

  return (
    <footer className={`border-t border-slate-400/20 dark:border-gray-700/30 text-slate-700 dark:text-slate-300 py-16 relative z-10 ${sectionBgClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 gap-8 mb-12 justify-items-center sm:justify-items-start">
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 mb-8 lg:mb-0 text-center sm:text-left">
            <Link href={langPrefix} className="flex items-center space-x-2 text-xl font-bold mb-4">
              <AnimatedLogo variant="footer" />
            </Link>
            <p className="text-sm">{t.footerSlogan}</p>
          </div>
          {footerSections.map(section => (
            <div key={section.title} className="text-center sm:text-left">
              <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">{section.title}</h5>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.includes('#')) {
                          e.preventDefault();

                          const [pathOnly, hash] = link.href.split('#');       // "/services", "ghg-inventory"
                          const currentPath = pathname?.split('#')[0] ?? '';   // strip any existing hash

                          const smoothScroll = () => {
                            const target = document.getElementById(hash);
                            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          };

                          if (pathOnly === currentPath || pathOnly === '') {
                            // Already on the target page; just scroll
                            smoothScroll();
                          } else {
                            // Client‑side navigation, then scroll after route change
                            router.push(link.href, { scroll: false });
                            /* allow next tick for the section to mount */
                            setTimeout(smoothScroll, 0);
                          }
                        }
                      }}
                      className="hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-sky-400)] transition-colors text-sm"
                    >
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
          {/*
            TODO: Re‑enable social media icons by uncommenting the block below.
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
          */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;