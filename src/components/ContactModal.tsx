'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  X,
  Building2,
  Phone,
  MailCheck
} from 'lucide-react';

import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { theme }        = useTheme();
  const { t }            = useLanguage();

  /* ───────────── form state ───────────── */
  const [formData, setFormData] = useState({
    firstName   : '',
    lastName    : '',
    email       : '',
    phoneNumber : '',
    message     : ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setFormStatus('sending');
      await new Promise(r => setTimeout(r, 1200)); // fake API latency
      setFormStatus('success');
      setFormData({ firstName:'', lastName:'', email:'', phoneNumber:'', message:'' });
      setTimeout(() => setFormStatus('idle'), 4000);
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  /* ───────────── style helpers ───────────── */
  const light  = theme === 'light';
  const txt    = light ? 'text-slate-900'             : 'text-slate-100';
  const subTxt = light ? 'text-slate-600'             : 'text-slate-300';
  const icon   = light ? 'text-slate-400'             : 'text-slate-400';
  const bgInput= light ? 'bg-white'                   : 'bg-slate-800';
  const ring   = light ? 'ring-slate-300'             : 'ring-slate-600';
  const leftBg = light ? 'bg-slate-50/70'             : 'bg-black/30 backdrop-blur-md';

  if (!isOpen) return null;

  return (
    <div
      aria-modal
      className="fixed inset-0 z-[60] flex items-center justify-center p-4
                 bg-black/60 dark:bg-black/80 backdrop-blur-sm
                 animate-fade-in"
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col
                   overflow-hidden rounded-2xl shadow-2xl
                   bg-white dark:bg-slate-900
                   animate-scale-in"
      >
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400
                     hover:text-slate-700 dark:hover:text-slate-200 transition"
          aria-label="Close contact modal"
        >
          <X size={24}/>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow">
          {/* ───────────── left column (info) ───────────── */}
          <div className={`${leftBg} relative px-8 py-20`}>
            {/* subtle pattern */}
            <div
              className="pointer-events-none absolute inset-0 -z-10
                         bg-[linear-gradient(transparent_29px,rgba(0,0,0,0.04)_30px),
                              linear-gradient(90deg,transparent_29px,rgba(0,0,0,0.04)_30px)]
                         bg-[length:30px_30px]"
            />
            <h2 className={`text-3xl font-extrabold ${txt}`}>{t.contactModalTitle}</h2>
            <p className={`mt-4 text-lg leading-7 ${subTxt}`}>{t.contactModalSubtitle}</p>

            <dl className={`mt-10 space-y-4 text-base leading-7 ${subTxt}`}>
              <InfoLine icon={<Building2 size={28} className={icon}/>} text={t.contactOfficeAddress}/>
              <InfoLine icon={<Phone size={28}    className={icon}/>}
                        text={<a href={`tel:${t.contactPhoneNumber.replace(/\s/g,'')}`}
                                 className="hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-sky-400)]">
                                {t.contactPhoneNumber}
                              </a>} />
              <InfoLine icon={<MailCheck size={28} className={icon}/>}
                        text={<a href={`mailto:${t.contactEmailAddress}`}
                                 className="hover:text-[var(--color-companyBlue)] dark:hover:text-[var(--color-sky-400)]">
                                {t.contactEmailAddress}
                              </a>} />
            </dl>
          </div>

          {/* ───────────── right column (form) ───────────── */}
          <form
            onSubmit={handleSubmit}
            className="px-8 py-12 overflow-y-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label={t.contactFirstNameLabel}  name="firstName"  value={formData.firstName}  onChange={handleChange}
                     txt={txt} bg={bgInput} ring={ring}/>
              <Input label={t.contactLastNameLabel}   name="lastName"   value={formData.lastName}   onChange={handleChange}
                     txt={txt} bg={bgInput} ring={ring}/>
              <Input label={t.contactEmailLabel}      name="email" type="email" value={formData.email} onChange={handleChange}
                     className="sm:col-span-2" txt={txt} bg={bgInput} ring={ring}/>
              <Input label={t.contactPhoneNumberLabel} name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange}
                     className="sm:col-span-2" txt={txt} bg={bgInput} ring={ring}/>
              <TextArea label={t.contactMessageLabel} name="message" rows={4} value={formData.message} onChange={handleChange}
                        className="sm:col-span-2" txt={txt} bg={bgInput} ring={ring}/>
            </div>

            {/* submit + feedback */}
            <div className="mt-8 flex items-center gap-4">
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="rounded-md bg-[var(--color-companyBlue)] px-4 py-2.5
                           text-sm font-medium text-white shadow
                           hover:bg-[var(--color-companyBlue)]/90 transition
                           disabled:opacity-70"
              >
                {formStatus === 'sending' ? 'Sending…' : t.contactSendMessageButton}
              </button>

              {formStatus === 'success' && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {t.contactFormSuccess}
                </p>
              )}
              {formStatus === 'error' && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {t.contactFormError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ───────────────── helper components ───────────────── */

const InfoLine = ({ icon, text }:{
  icon: React.ReactNode;
  text: React.ReactNode;
}) => (
  <div className="flex gap-x-4">
    <dt className="flex-none">{icon}</dt>
    <dd>{text}</dd>
  </div>
);

const Input = ({
  label, name, value, onChange, type='text', className='', txt, bg, ring
}:{
  label:string; name:string; value:string;
  onChange: (e:ChangeEvent<HTMLInputElement>)=>void;
  type?:string; className?:string;
  txt:string; bg:string; ring:string;
}) => (
  <div className={className}>
    <label htmlFor={name} className={`block text-sm font-semibold ${txt}`}>{label}</label>
    <input
      id={name} name={name} type={type} autoComplete="off"
      value={value} onChange={onChange} required
      className={`mt-2 block w-full rounded-md border-0 px-3 py-2
                  ${bg} ${txt} shadow-sm ring-1 ring-inset ${ring}
                  placeholder:text-slate-400 dark:placeholder:text-slate-500
                  focus:ring-2 focus:ring-[var(--color-companyBlue)]
                  sm:text-sm`}
    />
  </div>
);

const TextArea = ({
  label, name, value, onChange, rows=4, className='', txt, bg, ring
}:{
  label:string; name:string; value:string;
  onChange:(e:ChangeEvent<HTMLTextAreaElement>)=>void;
  rows?:number; className?:string;
  txt:string; bg:string; ring:string;
}) => (
  <div className={className}>
    <label htmlFor={name} className={`block text-sm font-semibold ${txt}`}>{label}</label>
    <textarea
      id={name} name={name} rows={rows}
      value={value} onChange={onChange} required
      className={`mt-2 block w-full rounded-md border-0 px-3 py-2
                  ${bg} ${txt} shadow-sm ring-1 ring-inset ${ring}
                  placeholder:text-slate-400 dark:placeholder:text-slate-500
                  focus:ring-2 focus:ring-[var(--color-companyBlue)]
                  sm:text-sm`}
    />
  </div>
);

export default ContactModal;

