'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { X, Building2, Phone, MailCheck } from 'lucide-react';
import { useTheme } from './ThemeProvider'; // Adjust path if needed
import { useLanguage } from './LanguageProvider'; // Adjust path

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactClick?: () => void; // Optional, if needed for other actions
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend API
    console.log("Form data submitted:", formData);
    console.log("Would send to: contact@lingcarbon.com"); // Placeholder
    
    // Simulate API call
    setFormStatus('sending'); // Optional: for loading state
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

    // Simulate success
    setFormStatus('success');
    setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', message: '' });
    setTimeout(() => {
      setFormStatus('');
      // onClose(); // Optionally close modal on success after a delay
    }, 3000);
  };

  if (!isOpen) return null;

  const modalBgClass = theme === 'light' ? 'bg-white' : 'dark:bg-slate-900';
  const leftPanelBgClass = theme === 'light' ? 'bg-slate-50' : 'dark:bg-black/20';
  const leftPanelRingClass = theme === 'light' ? 'ring-gray-900/10' : 'dark:ring-white/10';
  const svgStrokeClass = theme === 'light' ? 'stroke-gray-200' : 'dark:stroke-slate-700';
  const svgFillClass = theme === 'light' ? 'fill-gray-50' : 'dark:fill-slate-800/30';
  
  const labelTextColor = theme === 'light' ? 'text-gray-900' : 'dark:text-slate-100';
  const infoTextColor = theme === 'light' ? 'text-gray-600' : 'dark:text-slate-300';
  const iconColorClass = theme === 'light' ? 'text-gray-400' : 'dark:text-slate-400';
  const inputBgClass = theme === 'light' ? 'bg-white' : 'dark:bg-slate-800';
  const inputRingClass = theme === 'light' ? 'ring-gray-300' : 'dark:ring-slate-600';
  const inputFocusRingClass = 'focus:ring-[var(--color-companyBlue)]';
  const companyColorText = 'text-[var(--color-companyBlue)]';
  const companyColorDarkText = 'dark:text-[var(--color-sky-400)]';

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-opacity duration-300 ease-in-out">
      <div className={`relative ${modalBgClass} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col`}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors z-20"
          aria-label="Close contact modal"
        >
          <X size={24} />
        </button>
        
        <div className="mx-auto grid w-full grid-cols-1 lg:grid-cols-2 flex-grow">
          <div className={`relative px-6 pb-20 pt-16 sm:pt-20 lg:static lg:px-8 lg:py-24 ${leftPanelBgClass}`}>
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <div className={`absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'dark:bg-black/5'} ring-1 ${leftPanelRingClass} lg:w-1/2`}>
                <svg
                  aria-hidden="true"
                  className={`absolute inset-0 size-full ${svgStrokeClass} [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]`}
                >
                  <defs>
                    <pattern x="100%" y={-1} id="contact-modal-pattern" width={200} height={200} patternUnits="userSpaceOnUse">
                      <path d="M130 200V.5M.5 .5H200" fill="none" />
                    </pattern>
                  </defs>
                  <rect fill={theme === 'light' ? "white" : "transparent"} width="100%" height="100%" strokeWidth={0} />
                  <svg x="100%" y={-1} className={`overflow-visible ${svgFillClass}`}>
                    <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                  </svg>
                  <rect fill="url(#contact-modal-pattern)" width="100%" height="100%" strokeWidth={0} />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold tracking-tight ${labelTextColor}`}>{t.contactModalTitle}</h2>
              <p className={`mt-6 text-lg leading-8 ${infoTextColor}`}>{t.contactModalSubtitle}</p>
              <dl className={`mt-10 space-y-4 text-base leading-7 ${infoTextColor}`}>
                <div className="flex gap-x-4">
                  <dt className="flex-none"><span className="sr-only">Address</span><Building2 aria-hidden="true" className={`h-7 w-6 ${iconColorClass}`} /></dt>
                  <dd>{t.contactOfficeAddress}</dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none"><span className="sr-only">Telephone</span><Phone aria-hidden="true" className={`h-7 w-6 ${iconColorClass}`} /></dt>
                  <dd><a href={`tel:${t.contactPhoneNumber.replace(/\s/g, '')}`} className={`hover:text-[var(--color-companyBlue)] ${companyColorDarkText}`}>{t.contactPhoneNumber}</a></dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none"><span className="sr-only">Email</span><MailCheck aria-hidden="true" className={`h-7 w-6 ${iconColorClass}`} /></dt>
                  <dd><a href={`mailto:${t.contactEmailAddress}`} className={`hover:text-[var(--color-companyBlue)] ${companyColorDarkText}`}>{t.contactEmailAddress}</a></dd>
                </div>
              </dl>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="px-6 pb-16 pt-10 sm:pb-20 lg:px-8 lg:py-24 overflow-y-auto">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className={`block text-sm font-semibold leading-6 ${labelTextColor}`}>{t.contactFirstNameLabel}</label>
                  <div className="mt-2.5">
                    <input type="text" name="firstName" id="first-name" autoComplete="given-name" required value={formData.firstName} onChange={handleChange}
                      className={`block w-full rounded-md border-0 px-3.5 py-2 ${inputBgClass} ${labelTextColor} shadow-sm ring-1 ring-inset ${inputRingClass} placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset ${inputFocusRingClass} sm:text-sm sm:leading-6`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className={`block text-sm font-semibold leading-6 ${labelTextColor}`}>{t.contactLastNameLabel}</label>
                  <div className="mt-2.5">
                    <input type="text" name="lastName" id="last-name" autoComplete="family-name" required value={formData.lastName} onChange={handleChange}
                      className={`block w-full rounded-md border-0 px-3.5 py-2 ${inputBgClass} ${labelTextColor} shadow-sm ring-1 ring-inset ${inputRingClass} placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset ${inputFocusRingClass} sm:text-sm sm:leading-6`} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={`block text-sm font-semibold leading-6 ${labelTextColor}`}>{t.contactEmailLabel}</label>
                  <div className="mt-2.5">
                    <input type="email" name="email" id="email" autoComplete="email" required value={formData.email} onChange={handleChange}
                      className={`block w-full rounded-md border-0 px-3.5 py-2 ${inputBgClass} ${labelTextColor} shadow-sm ring-1 ring-inset ${inputRingClass} placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset ${inputFocusRingClass} sm:text-sm sm:leading-6`} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone-number" className={`block text-sm font-semibold leading-6 ${labelTextColor}`}>{t.contactPhoneNumberLabel}</label>
                  <div className="mt-2.5">
                    <input type="tel" name="phoneNumber" id="phone-number" autoComplete="tel" value={formData.phoneNumber} onChange={handleChange}
                      className={`block w-full rounded-md border-0 px-3.5 py-2 ${inputBgClass} ${labelTextColor} shadow-sm ring-1 ring-inset ${inputRingClass} placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset ${inputFocusRingClass} sm:text-sm sm:leading-6`} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className={`block text-sm font-semibold leading-6 ${labelTextColor}`}>{t.contactMessageLabel}</label>
                  <div className="mt-2.5">
                    <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange}
                      className={`block w-full rounded-md border-0 px-3.5 py-2 ${inputBgClass} ${labelTextColor} shadow-sm ring-1 ring-inset ${inputRingClass} placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset ${inputFocusRingClass} sm:text-sm sm:leading-6`}></textarea>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button type="submit"
                  disabled={formStatus === 'sending'}
                  className="rounded-md bg-[var(--color-companyBlue)] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-companyBlue)]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-companyBlue)] disabled:opacity-70"
                >
                  {formStatus === 'sending' ? 'Sending...' : t.contactSendMessageButton}
                </button>
              </div>
               {formStatus === 'success' && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{t.contactFormSuccess}</p>}
               {formStatus === 'error' && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{t.contactFormError}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;