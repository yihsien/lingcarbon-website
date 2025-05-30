'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Re-define translations here or import from a shared file
// For simplicity, defining it here. In a larger app, this would be in a separate i18n setup.
export const translations = {
  en: {
    navServices: "Services",
    navServiceGHG: "GHG Inventory",
    navServiceGHGDesc: "Build your carbon strategy on solid ground. Our expert GHG inventory service, aligned with ISO 14064-1 and the GHG Protocol, covers Scopes 1–3 with precision — from boundary setting to emissions calculation. Stay compliant, uncover insights, and take the first step toward a credible, future-ready net-zero journey.",
    navServiceFootprinting: "CFP Calculation", 
    navServiceFootprintingDesc: "Product carbon footprints affect both your environmental impact and your brand. We calculate CFPs under ISO 14067, covering the full product life cycle — from raw materials to end-of-life. Identify emission hotspots, improve efficiency, and meet growing demands from supply chains and consumers with clear, data-backed insights.",
    navServiceStrategy: "Carbon Neutral Strategy",
    navServiceStrategyDesc: "Carbon neutrality is more than offsets — it’s a strategy. We help companies design actionable plans under ISO 14068, covering baseline assessment, reduction roadmap, offset planning, and verification readiness. Achieve compliance, build trust, and lead on climate with a credible, science-aligned path to net zero.",
    navServiceSBTi: "SBTi Target Setting",
    navServiceSBTiDesc: `Science-based targets (SBTs) align your climate goals with global standards. We help companies set targets under the SBTi framework and 1.5°C pathway — from baseline assessment to validation prep. SBTs build trust, boost visibility on platforms like CDP and UNGC, and drive credible, science-backed climate action.`,
    navServiceRatings: "ESG Ratings & Disclosures", 
    navServiceRatingsDesc: `ESG ratings matter. We help companies navigate frameworks like CDP, EcoVadis, DJSI, and UNGC with tailored support — including data gap analysis, indicator mapping, materiality assessment, and report preparation. Strong ESG disclosures boost transparency, stakeholder trust, and performance in global sustainability benchmarks.
`, 
    navAbout: "About",
    navResources: "Resources",
    navContact: "Contact Us",
    dropdownCustomSolutionsTitle: "Custom Solutions", 
    dropdownCustomSolutionsDesc: "Please contact us for custom carbon solutions tailored to your business needs.", 
    heroTitle1: "Your Carbon Advisor.",
    heroTitle2: "From Start to Zero.",
    heroSubtitle: "Data-driven. Science-backed. Net-Zero ready.",
    heroCTA: "Talk to Our Experts", 
    servicesTitle: "Comprehensive Carbon Solutions",
    servicesSubtitle: "From Strategy to Execution — Complete Carbon Services at Every Stage.",
    whyUsTitle: "The LINGCARBON Difference",
    whyUsSubtitle: "We turn complexity into clarity — with strategies that align with business, compliance, and climate goals.",
    advantage1Title: "Tailored Carbon Management Solutions",
    advantage1Desc: "With over a decade of expertise in GHG inventories, carbon footprint calculation, and carbon reduction strategies, our team crafts solutions tailored to the operational realities and growth stage of each organization.",
    advantage2Title: "Industry-Specific Insight Across Sectors",
    advantage2Desc: "From hospitality and manufacturing to finance, logistics, and services — we speak your industry’s language. Our team brings deep domain knowledge and hands-on experience, enabling us to decode complex operations and emissions profiles, and craft carbon strategies that make business sense and drive real-world results.",
    advantage3Title: "Verification-Ready Carbon Strategy",
    advantage3Desc: "With experience on both the execution and assurance side, we help businesses design carbon inventory processes and reports that are operationally effective, audit-ready, and aligned with future verification requirements and stakeholder expectations.",
    advantage4Title: "Technology-Driven Efficiency",
    advantage4Desc: "We integrate software engineering, data science, and deep carbon expertise to turn complex data into actionable insights. From automated workflows to real-time dashboards, we help businesses boost accuracy, simplify reporting, and make faster, smarter climate decisions.",
    advantage5Title: "Capacity Building and Carbon Literacy",
    advantage5Desc: "We help your teams do more than comply — we help them lead. Through hands-on training, collaborative implementation, and tailored knowledge transfer, we build long-term carbon capabilities inside your organization, making sustainability part of your core operations.",
    footerSlogan: "Where carbon action meets business growth.",
    footerProducts: "Services", 
    footerProductsLink1: "GHG Inventory",
    footerProductsLink2: "CFP Calculation",
    footerProductsLink3: "Carbon Neutral Strategy",
    footerProductsLink4: "SBTi Target Setting",
    footerProductsLink5: "ESG Ratings & Disclosures",
    footerResources: "Resources",
    footerResourcesLink1: "Latest News",
    footerResourcesLink2: "Opinions",
    footerResourcesLink3: "FAQs",
    footerCompany: "Company",
    footerCompanyLink1: "Our Team",
    footerCompanyLink2: "Careers",
    footerLegal: "Legal",
    footerLegalLink1: "Privacy Policy",
    footerLegalLink2: "Terms of Service",
    footerLegalLink3: "Cookie Policy",
    footerRights: "LINGCARBON. All rights reserved.",
    contactModalTitle: "Get in touch",
    contactModalSubtitle: "Let’s build your carbon advantage together and drive sustainable business growth.",
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
    navServices: "服務項目",
    navServiceGHG: "溫室氣體盤查",
    navServiceGHGDesc: "為碳管理打下堅實基礎，就從盤查開始。我們依據 ISO 14064-1 與 GHG Protocol 提供全方位的溫室氣體盤查服務，涵蓋邊界設定、排放源鑑別、數據蒐集與範疇一至三的排放計算，協助企業掌握碳風險、因應法規，邁向淨零目標。",
    navServiceFootprinting: "產品碳足跡計算", 
    navServiceFootprintingDesc: "產品的碳足跡，不只影響環境，更攸關品牌競爭力。我們依據 ISO 14067，協助企業釐清產品生命週期中各階段的碳排放，從原料、生產、運輸到最終處置皆涵蓋在內。透過碳足跡量化，企業能找出減碳熱點、優化設計與流程，同時回應供應鏈與消費市場日益高漲的低碳期待。",
    navServiceStrategy: "碳中和策略",
    navServiceStrategyDesc: "碳中和不只是抵換，更需要明確策略。我們依據 ISO 14068，協助企業制定可執行的碳中和計畫，內容涵蓋基準盤查、減量路徑、抵換規劃與查證準備。完善的策略有助符合法規、凝聚利害關係人共識，並強化品牌信任與氣候領導力。",
    navServiceSBTi: "SBTi 目標設定",
    navServiceSBTiDesc: `依循科學制定減碳目標，是企業邁向淨零的關鍵一步。我們協助企業依據 SBTi 架構與 1.5°C 路徑，完成碳盤查、目標建模、驗證準備與落地規劃。導入 SBT 可提升氣候治理、強化利害關係人信任，並獲得 CDP 與 UN Global Compact 等平台的國際曝光。`,
    navServiceRatings: "ESG 評級與揭露", 
    navServiceRatingsDesc: `ESG 表現正成為投資人與合作夥伴關注焦點。我們協助企業掌握 CDP、Ecovadis、DJSI 與 UN Global Compact 等主要評級與揭露架構，提供資料落差分析、指標對應、重大性盤點與報告協作支援，協助企業強化揭露透明度與國際永續競爭力。
`, 
    navAbout: "關於我們",
    navResources: "零碳資源",
    navContact: "與我們聯絡",
    dropdownCustomSolutionsTitle: "客製化碳管理方案",
    dropdownCustomSolutionsDesc: "每個企業的碳管理需求都不同。聯絡我們，讓我們為您打造專屬的解決方案。",
    heroTitle1: "全面的碳管理團隊",
    heroTitle2: "陪你從起步到走向淨零",
    heroSubtitle: "以科學與數據為基礎，提供從盤查到碳中和的客製化解決方案。",
    heroCTA: "取得專屬碳管理建議", 
    servicesTitle: "全方位碳管理服務",
    servicesSubtitle: "從策略擬定到實務執行，提供碳管理每一階段的完整服務。",
    whyUsTitle: "零碳科技讓碳管理更有方向",
    whyUsSubtitle: "從複雜到清晰，我們為你打造兼顧營運、法規與氣候目標的碳管理策略。",
    advantage1Title: "量身定制的碳管理解决方案",
    advantage1Desc: "累積超過十年的實務經驗，我們團隊提供貼近企業營運實況與成長節奏的碳管理策略，從溫室氣體盤查到長期減量規劃，協助企業創造具體成效。",
    advantage2Title: "跨產業的實務經驗",
    advantage2Desc: "從旅宿、製造到金融與物流，我們了解每個產業在營運與碳排上的挑戰與特色。豐富的跨領域經驗讓我們能快速切入重點，提供真正符合產業情境、能落地執行的碳管理方案。",
    advantage3Title: "符合實務與查證需求的碳管理設計",
    advantage3Desc: "我們具備從企業端執行到第三方查證的實務經驗，協助建構清晰可行的盤查流程與報告架構，讓碳管理成果不僅符合營運需求，更能通過查證、回應未來法規與外部關注。",
    advantage4Title: "數據 × 科技 × 減碳效率",
    advantage4Desc: "結合碳管理專業、資料科學與軟體工程能力，我們協助企業導入自動化資料流程與即時儀表板，提升數據準確性、簡化報告製作，並強化決策效率與應變能力。",
    advantage5Title: "培育企業自有碳管理能力",
    advantage5Desc: "協助企業建立內部碳管理能力，不只是因應要求，更能主動領導。透過實務訓練、協作導入與知識轉移，我們協助組織將永續理念融入日常營運，打造可長期運作的碳管理內功。",
    footerSlogan: "在碳管理中創造企業競爭力",
    footerProducts: "服務項目",
    footerProductsLink1: "溫室氣體盤查",
    footerProductsLink2: "產品碳足跡計算",
    footerProductsLink3: "碳中和策略",
    footerProductsLink4: "SBTi 目標設定",
    footerProductsLink5: "ESG 評級與揭露",
    footerResources: "零碳資源",
    footerResourcesLink1: "最新消息",
    footerResourcesLink2: "零碳觀點",
    footerResourcesLink3: "常見問題",
    footerCompany: "關於零碳",
    footerCompanyLink1: "核心團隊",
    footerCompanyLink2: "加入我們",
    footerLegal: "法律條款",
    footerLegalLink1: "隱私政策",
    footerLegalLink2: "服務條款",
    footerLegalLink3: "Cookie 政策",
    footerRights: "LINGCARBON. 版權所有。",
    contactModalTitle: "聯絡我們",
    contactModalSubtitle: "讓我們攜手為您的企業打造碳管理優勢，共創永續競爭力。",
    contactOfficeAddress: "台北市中山區南京東路三段168號",
    contactViewOnMap: "在谷歌地图上查看",
    contactCallUs: "致电我们",
    contactPhoneNumber: "+886 2 7742 6239",
    contactEmailUs: "发送邮件", 
    contactEmailAddress: "contact@lingcarbon.com",
    contactFirstNameLabel: "名字",
    contactLastNameLabel: "姓氏",
    contactEmailLabel: "Email",
    contactPhoneNumberLabel: "電話",
    contactMessageLabel: "留言",
    contactSendMessageButton: "送出訊息",
    contactFormSuccess: "謝謝！我們會儘快和您聯絡。",
    contactFormError: "出錯了，請稍後再試。",
  }
};

type Lang = 'en' | 'zh';
type T    = typeof translations.en;

interface Ctx {
  language: Lang;
  setLanguage: (l: Lang) => void;
  t: T;
}

const LanguageContext = createContext<Ctx | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
  defaultLanguage?: Lang;     // deterministic value for SSR
  storageKey?: string;
}

/* ───────────────────────────────  provider  ──────────────────────────────────── */
export function LanguageProvider({
  children,
  defaultLanguage = 'en',
  storageKey = 'app-lang',
}: ProviderProps) {
  /* 1️⃣  identical value on server and first client render */
  const [language, setLanguage] = useState<Lang>(defaultLanguage);

  /* 2️⃣  after hydration, read saved value once */
  useEffect(() => {
    const saved =
      (typeof window !== 'undefined'
        ? (localStorage.getItem(storageKey) as Lang | null)
        : null) ?? defaultLanguage;

    if (saved !== language) setLanguage(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 3️⃣  whenever `language` changes, sync <html lang> + localStorage */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.lang = language;
    localStorage.setItem(storageKey, language);
  }, [language, storageKey]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};