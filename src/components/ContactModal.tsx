'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';


import { useLanguage } from './LanguageProvider';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Line Icon Component
const LineIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.628-.629.628M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
);

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {

  const { t } = useLanguage();

  /* ───────────── form state ───────────── */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setFormStatus('sending');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Mail failed');
      setFormStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', message: '' });
    } catch {
      setFormStatus('error');
    } finally {
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  // Prevent page scroll when modal is open
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  // Cleanup on unmount or when modal closes
  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);


  if (!isOpen) return null;

  return (
    <div
      aria-modal
      className="fixed inset-0 z-[60] flex items-center justify-center p-4
           bg-black/70 backdrop-blur-md no-scrollbar
           animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[95dvh] flex flex-col
            overflow-y-auto rounded-3xl shadow-2xl overscroll-y-contain
            touch-pan-y bg-slate-100/95 dark:bg-slate-800/95 backdrop-blur-xl
            border border-slate-300/30 dark:border-slate-600/40
            animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200/40 via-transparent to-slate-300/20 
                        dark:from-slate-700/30 dark:via-transparent dark:to-slate-600/20 pointer-events-none" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2.5 rounded-full
                     text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100
                     hover:bg-slate-200/80 dark:hover:bg-slate-700/80 backdrop-blur-sm
                     transition-all duration-300 hover:scale-110 hover:rotate-90
                     border border-transparent hover:border-slate-300/50 dark:hover:border-slate-600/50"
          aria-label="Close contact modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow">
          {/* ───────────── Left column (info) ───────────── */}
          <div className="relative px-10 py-20 bg-gradient-to-br from-slate-200/80 to-slate-300/60 
                          dark:from-slate-700/80 dark:to-slate-800/60 backdrop-blur-sm">
            {/* Subtle animated background pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500 rounded-full blur-2xl animate-pulse" 
                   style={{ animationDelay: '2s' }} />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight
                               animate-in slide-in-from-left-6 duration-700">
                  {t.contactModalTitle}
                </h2>
                
                <div className="w-16 h-px bg-gradient-to-r from-[var(--color-companyBlue)] to-purple-400 
                                animate-in slide-in-from-left-8 duration-700 delay-200" />
                
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg
                               animate-in slide-in-from-left-8 duration-700 delay-300">
                  {t.contactModalSubtitle}
                </p>
              </div>

              {/* Contact info */}
              <div className="space-y-8 animate-in slide-in-from-left-8 duration-700 delay-500">
                <ContactInfoItem
                  icon={<Building2 size={22} />}
                  value={t.contactOfficeAddress}
                />
                <ContactInfoItem
                  icon={<Phone size={22} />}
                  value={
                    <a
                      href={`tel:${t.contactPhoneNumber.replace(/\s/g, '')}`}
                      className="hover:text-[var(--color-companyBlue)] transition-colors duration-300
                                 hover:underline underline-offset-4"
                    >
                      {t.contactPhoneNumber}
                    </a>
                  }
                />
                <ContactInfoItem
                  icon={<Mail size={22} />}
                  value={
                    <a
                      href={`mailto:${t.contactEmailAddress}`}
                      className="hover:text-[var(--color-companyBlue)] transition-colors duration-300
                                 hover:underline underline-offset-4"
                    >
                      {t.contactEmailAddress}
                    </a>
                  }
                />
                <ContactInfoItem
                  icon={<LineIcon size={22} />}
                  value={
                    <a
                      href="https://lin.ee/JGkRkVy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--color-companyBlue)] transition-colors duration-300 hover:underline underline-offset-4"
                    >
                      {t.contactLine}
                    </a>
                  }
                />
              </div>
            </div>
          </div>

          {/* ───────────── Right column (form) ───────────── */}
          <form onSubmit={handleSubmit} className="px-10 py-20 overflow-y-auto max-h-full pb-36">
            <div className="space-y-6 animate-in slide-in-from-right-6 duration-700 delay-200">
              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MinimalInput
                  label={t.contactFirstNameLabel}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <MinimalInput
                  label={t.contactLastNameLabel}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <MinimalInput
                label={t.contactEmailLabel}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Phone */}
              <MinimalInput
                label={t.contactPhoneNumberLabel}
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
              />

              {/* Message */}
              <MinimalTextArea
                label={t.contactMessageLabel}
                name="message"
                rows={3}               /* slightly shorter textarea */
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {/* Submit section */}
            <div className="mt-10 space-y-6 animate-in slide-in-from-right-6 duration-700 delay-400">
              <button
                type="submit"
                disabled={formStatus === 'sending' || !formData.firstName || !formData.email || !formData.message}
                className={`group relative w-full overflow-hidden font-medium py-4 px-8 rounded-2xl
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                           flex items-center justify-center gap-3 shadow-lg hover:shadow-xl
                           ${formStatus === 'sending' 
                             ? 'bg-slate-600 dark:bg-slate-500 border-2 border-transparent' 
                             : 'bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 border border-transparent hover:border-slate-500/30 dark:hover:border-slate-400/30'
                           } text-white`}
              >
                {/* Animated border for sending state */}
                {formStatus === 'sending' && (
                  <div className="absolute inset-0 rounded-2xl">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 
                                    bg-[length:300%_300%] animate-[gradient_2s_ease-in-out_infinite] opacity-60" />
                    <div className="absolute inset-[2px] rounded-2xl bg-slate-600 dark:bg-slate-500" />
                  </div>
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-3">
                  {formStatus === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : formStatus === 'success' ? (
                    <>
                      <CheckCircle size={18} className="text-green-400 animate-in zoom-in duration-300" />
                      <span>Message Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                      <span>{t.contactSendMessageButton}</span>
                    </>
                  )}
                </div>
              </button>

              {/* Status messages */}
              {formStatus === 'success' && (
                <div className="flex items-center gap-4 p-4 bg-green-50/80 dark:bg-green-900/30 
                                border border-green-200/50 dark:border-green-800/50 rounded-2xl backdrop-blur-sm
                                animate-in slide-in-from-bottom-4 duration-500">
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 animate-in zoom-in duration-300" />
                  <p className="text-green-700 dark:text-green-300">
                    {t.contactFormSuccess}
                  </p>
                </div>
              )}

              {formStatus === 'error' && (
                <div className="flex items-center gap-4 p-4 bg-red-50/80 dark:bg-red-900/30 
                                border border-red-200/50 dark:border-red-800/50 rounded-2xl backdrop-blur-sm
                                animate-in slide-in-from-bottom-4 duration-500">
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 animate-bounce" />
                  <p className="text-red-700 dark:text-red-300">
                    {t.contactFormError}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ───────────────── Helper Components ───────────────── */

const ContactInfoItem = ({ icon, value }: {
  icon: React.ReactNode;
  value: React.ReactNode;
}) => (
  <div className="group flex items-start gap-4 p-2 rounded-xl transition-all duration-300 
                  hover:bg-slate-300/50 dark:hover:bg-slate-700/50 hover:scale-105 cursor-default">
    <div className="flex-shrink-0 p-3 text-[var(--color-companyBlue)] bg-white/60 dark:bg-slate-700/80 
                    rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 backdrop-blur-sm">
      {icon}
    </div>
    <div className="text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
      {value}
    </div>
  </div>
);

const MinimalInput = ({
  label, name, value, onChange, type = 'text'
}: {
  label: string; name: string; value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div className="group">
    <label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 
                                    transition-colors duration-300 group-focus-within:text-[var(--color-companyBlue)]">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-4 border border-slate-300/60 dark:border-slate-500/60 rounded-2xl
                 bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm
                 text-slate-800 dark:text-slate-100
                 placeholder:text-slate-500 dark:placeholder:text-slate-400
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-companyBlue)]/30 
                 focus:border-[var(--color-companyBlue)] focus:bg-slate-50 dark:focus:bg-slate-700
                 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-400
                 hover:shadow-sm focus:shadow-md hover:bg-slate-100/90 dark:hover:bg-slate-700/90"
    />
  </div>
);

const MinimalTextArea = ({
  label, name, value, onChange, rows = 4
}: {
  label: string; name: string; value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}) => (
  <div className="group">
    <label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-3
                                    transition-colors duration-300 group-focus-within:text-[var(--color-companyBlue)]">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-4 border border-slate-300/60 dark:border-slate-500/60 rounded-2xl
                 bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm
                 text-slate-800 dark:text-slate-100
                 placeholder:text-slate-500 dark:placeholder:text-slate-400
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-companyBlue)]/30 
                 focus:border-[var(--color-companyBlue)] focus:bg-slate-50 dark:focus:bg-slate-700
                 transition-all duration-300 resize-none hover:border-slate-400 dark:hover:border-slate-400
                 hover:shadow-sm focus:shadow-md hover:bg-slate-100/90 dark:hover:bg-slate-700/90"
    />
  </div>
);

export default ContactModal;