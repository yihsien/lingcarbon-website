'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Re-define translations here or import from a shared file
// For simplicity, defining it here. In a larger app, this would be in a separate i18n setup.
export const translations = {
  en: {
    navServices: "Services",
    navServiceGHG: "GHG Inventory",
    navServiceGHGDesc: "Comprehensive greenhouse gas accounting and reporting.",
    navServiceFootprinting: "CFP Calculation", 
    navServiceFootprintingDesc: "Detailed Carbon Footprint of Product analysis.", 
    navServiceStrategy: "Carbon Neutral Strategy",
    navServiceStrategyDesc: "Develop your roadmap to net-zero emissions.",
    navServiceSBTi: "SBTi Target Setting",
    navServiceSBTiDesc: "Align your climate goals with science-based targets.",
    navServiceRatings: "ESG Ratings & Disclosures", 
    navServiceRatingsDesc: "Improve ESG performance and reporting (e.g., CDP, Ecovadis).", 
    navAbout: "About",
    navResources: "Resources",
    navContact: "Contact Us",
    dropdownCustomSolutionsTitle: "Custom Solutions", 
    dropdownCustomSolutionsDesc: "Please contact us for custom carbon solutions tailored to your business needs.", 
    heroTitle1: "Pioneering Sustainable",
    heroTitle2: "Carbon Solutions",
    heroSubtitle: "LINGCARBON empowers organizations with cutting-edge services for carbon accounting, footprint calculation, and achieving carbon neutrality.",
    heroCTA: "Contact Us", 
    servicesTitle: "Our Core Services",
    servicesSubtitle: "Driving sustainability through innovative carbon management solutions.",
    whyUsTitle: "The LINGCARBON Advantage",
    whyUsSubtitle: "Partner with us for unparalleled expertise and tailored carbon management strategies.",
    advantage1Title: "Tailored Carbon Management Solutions",
    advantage1Desc: "With over a decade of expertise in GHG inventories, carbon footprint calculation, and carbon reduction strategies, our team crafts solutions tailored to the operational realities and growth stage of each organization.",
    advantage2Title: "Industry-Specific Insight Across Sectors",
    advantage2Desc: "Deep understanding across hospitality, manufacturing, finance, logistics, and services. Our cross-industry experience allows us to quickly grasp the unique operating models and emissions profiles of different sectors, delivering carbon strategies with real business relevance.",
    advantage3Title: "Integrated Planning and Verification Expertise",
    advantage3Desc: "Expertise in both carbon inventory planning and third-party verification. With experience on both sides—implementation and assurance—we ensure carbon strategies are not only practical and operationally sound but also fully aligned with future verification requirements.",
    advantage4Title: "Technology-Driven Efficiency",
    advantage4Desc: "Data automation and digital tools to enhance accuracy and decision-making. Combining software engineering with carbon expertise, we help businesses streamline data workflows, increase accuracy, and enable smarter, real-time climate decision-making through digital tools.",
    advantage5Title: "Capacity Building and Carbon Literacy",
    advantage5Desc: "Empowering internal teams through training and co-creation. We don’t just deliver reports—we empower your teams. By offering hands-on guidance, internal training, and co-working models, we help organizations build lasting in-house carbon management capacity.",
    footerSlogan: "Leading the way in sustainable carbon solutions and environmental stewardship.",
    footerProducts: "Services", 
    footerProductsLink1: "Carbon Accounting",
    footerProductsLink2: "Footprint Calculation",
    footerProductsLink3: "Neutral Implementation",
    footerProductsLink4: "Consulting",
    footerResources: "Resources",
    footerResourcesLink1: "Methodologies",
    footerResourcesLink2: "Case Studies",
    footerResourcesLink3: "Blog",
    footerResourcesLink4: "FAQs",
    footerCompany: "Company",
    footerCompanyLink1: "About Us",
    footerCompanyLink2: "Our Mission",
    footerCompanyLink3: "Careers",
    footerCompanyLink4: "Contact",
    footerLegal: "Legal",
    footerLegalLink1: "Privacy Policy",
    footerLegalLink2: "Terms of Service",
    footerLegalLink3: "Cookie Policy",
    footerRights: "LINGCARBON. All rights reserved. Committed to a greener future.",
    contactModalTitle: "Get in touch",
    contactModalSubtitle: "We're here to help and answer any question you might have. We look forward to hearing from you.",
    contactOfficeAddress: "168, Section 3, Nanjing East Road, Zhongshan District, Taipei City",
    contactViewOnMap: "View on Google Maps",
    contactCallUs: "Call Us",
    contactPhoneNumber: "+886 2 7742 6239",
    contactEmailUs: "Email Us", 
    contactEmailAddress: "contact@lingcarbon.com", 
    contactFirstNameLabel: "First name",
    contactLastNameLabel: "Last name",
    contactEmailLabel: "Email",
    contactPhoneNumberLabel: "Phone number",
    contactMessageLabel: "Message",
    contactSendMessageButton: "Send Message",
    contactFormSuccess: "Message sent successfully! We'll be in touch soon.",
    contactFormError: "Something went wrong. Please try again later.",
  },
  zh: { 
    navServices: "服务项目",
    navServiceGHG: "温室气体清单",
    navServiceGHGDesc: "全面温室气体核算与报告。",
    navServiceFootprinting: "产品碳足迹 (CFP) 计算", 
    navServiceFootprintingDesc: "详细的产品碳足迹分析。", 
    navServiceStrategy: "碳中和战略",
    navServiceStrategyDesc: "制定您的净零排放路线图。",
    navServiceSBTi: "SBTi 目标设定",
    navServiceSBTiDesc: "使您的气候目标与科学碳目标保持一致。",
    navServiceRatings: "ESG 评级与披露", 
    navServiceRatingsDesc: "提升您的 ESG 表现与报告（例如 CDP、Ecovadis）。", 
    navAbout: "关于我们",
    navResources: "资源中心",
    navContact: "联系我们",
    dropdownCustomSolutionsTitle: "定制化解决方案", 
    dropdownCustomSolutionsDesc: "请联系我们，获取为您业务量身定制的碳解决方案。", 
    heroTitle1: "引领可持续",
    heroTitle2: "碳解决方案",
    heroSubtitle: "LINGCARBON 助力企业利用尖端服务进行碳核算、碳足迹计算并实现碳中和。",
    heroCTA: "联系我们", 
    servicesTitle: "我们的核心服务",
    servicesSubtitle: "通过创新的碳管理解决方案推动可持续发展。",
    whyUsTitle: "LINGCARBON 的优势",
    whyUsSubtitle: "与我们合作，获取无与伦比的专业知识和量身定制的碳管理战略。",
    advantage1Title: "量身定制的碳管理解决方案",
    advantage1Desc: "凭借十多年在温室气体清单、碳足迹计算和碳减排战略方面的专业知识，我们的团队为每个组织的运营现实和发展阶段量身打造解决方案。",
    advantage2Title: "跨行业的深刻洞察",
    advantage2Desc: "深刻理解酒店、制造、金融、物流和服务等多个行业。我们跨行业的经验使我们能够快速掌握不同行业的独特运营模式和排放特征，提供具有实际商业意义的碳战略。",
    advantage3Title: "整合规划与核查专业知识",
    advantage3Desc: "在碳清单规划和第三方核查两方面均拥有专业知识。凭借在实施和保障两方面的经验，我们确保碳战略不仅实用且运营稳健，而且完全符合未来的核查要求。",
    advantage4Title: "技术驱动的效率",
    advantage4Desc: "通过数据自动化和数字工具提高准确性并辅助决策。我们将软件工程与碳专业知识相结合，帮助企业简化数据工作流程，提高准确性，并通过数字工具实现更智能、实时的气候决策。",
    advantage5Title: "能力建设与碳素养提升",
    advantage5Desc: "通过培训和共同创造赋能内部团队。我们不仅仅交付报告——我们赋能您的团队。通过提供实践指导、内部培训和共同工作模式，我们帮助组织建立持久的内部碳管理能力。",
    footerSlogan: "引领可持续碳解决方案和环境管理。",
    footerProducts: "服务项目",
    footerProductsLink1: "碳核算",
    footerProductsLink2: "碳足迹计算",
    footerProductsLink3: "碳中和实施",
    footerProductsLink4: "咨询服务",
    footerResources: "资源中心",
    footerResourcesLink1: "方法论",
    footerResourcesLink2: "案例研究",
    footerResourcesLink3: "博客",
    footerResourcesLink4: "常见问题",
    footerCompany: "关于公司",
    footerCompanyLink1: "关于我们",
    footerCompanyLink2: "我们的使命",
    footerCompanyLink3: "加入我们",
    footerCompanyLink4: "联系方式",
    footerLegal: "法律条款",
    footerLegalLink1: "隐私政策",
    footerLegalLink2: "服务条款",
    footerLegalLink3: "Cookie 政策",
    footerRights: "LINGCARBON. 版权所有。致力于绿色未来。",
    contactModalTitle: "联系我们",
    contactModalSubtitle: "我们随时准备提供帮助并回答您的任何问题。期待您的来信。",
    contactOfficeAddress: "台北市中山區南京東路三段168號",
    contactViewOnMap: "在谷歌地图上查看",
    contactCallUs: "致电我们",
    contactPhoneNumber: "+886 2 7742 6239",
    contactEmailUs: "发送邮件", 
    contactEmailAddress: "contact@lingcarbon.com",
    contactFirstNameLabel: "名字",
    contactLastNameLabel: "姓氏",
    contactEmailLabel: "邮箱",
    contactPhoneNumberLabel: "电话号码",
    contactMessageLabel: "留言",
    contactSendMessageButton: "发送消息",
    contactFormSuccess: "消息发送成功！我们会尽快与您联系。",
    contactFormError: "出错了，请稍后再试。",
  }
};

type Language = 'en' | 'zh';
type Translations = typeof translations.en; // Use 'en' as the shape for all translations

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, defaultLanguage = 'en', storageKey = 'app-lang' }: {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}) {
  const [language, setLanguageState] = useState<Language>(() => {
     if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Language) || defaultLanguage;
    }
    return defaultLanguage;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, language);
        document.documentElement.lang = language;
    }
  }, [language, storageKey]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };
  
  const t = translations[language];

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};