'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Cloud, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'uploading' | 'done'>('idle');
  const [progress, setProgress] = useState<number>(0);

  // Filename demo state
  const [part1, setPart1] = useState('');
  // ---- 4‑digit activity code (main + sub) ----
  const [part2Main, setPart2Main] = useState('');   // first two digits (01‑21)
  const [part2Sub,  setPart2Sub]  = useState(''); // last two digits (00‑99)
  const SPECIAL_ACTIVITY_CODES    = ['12', '14', '16', '20']; // need 01‑99
  const part2Full                 = `${part2Main || 'xx'}${part2Sub || 'xx'}`;
  const [part3, setPart3] = useState('');
  const [part4, setPart4] = useState('');
  const [copied, setCopied] = useState(false);

  // Queue of files awaiting filename construction
  const [renameQueue, setRenameQueue] = useState<File[]>([]);

  // File that is currently in the rename modal
  const [renameModal, setRenameModal] = useState<File | null>(null);
  // Preview URL for image files shown in rename modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (renameModal && renameModal.type.startsWith('image/')) {
      const url = URL.createObjectURL(renameModal);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [renameModal]);
  // When the current modal closes, automatically open the next file in queue
  useEffect(() => {
    if (!renameModal && renameQueue.length) {
      setRenameModal(renameQueue[0]);
      setRenameQueue(prev => prev.slice(1));
    }
  }, [renameModal, renameQueue]);

  // Dropdown option lists [value, label]
  const LOCATION_OPTIONS: [string, string][] = [
    ['GP000', 'GP000 全公司資料 (全公司資料)'],
    ['GP001', 'GP001 台北車廠 (停車暨保修廠)'],
    ['GP002', 'GP002 台中車廠 (停車暨保修廠)'],
    ['GP003', 'GP003 台南車廠 (停車暨保修廠)'],
    ['GP004', 'GP004 高雄車廠 (停車暨保修廠)'],
    ['GP005', 'GP005 臺北轉運站 (場站)'],
    ['GP006', 'GP006 板橋客運站 (場站)'],
    ['GP007', 'GP007 三重站 (場站)'],
    ['GP008', 'GP008 桃園站 (場站)'],
    ['GP009', 'GP009 中壢祐民醫院站 (場站)'],
    ['GP010', 'GP010 新竹站 (場站)'],
    ['GP011', 'GP011 朝馬轉運站 (場站)'],
    ['GP012', 'GP012 嘉義轉運站 (場站)'],
    ['GP013', 'GP013 新營轉運站 (場站)'],
    ['GP014', 'GP014 麻豆轉運站 (場站)'],
    ['GP015', 'GP015 永康轉運站 (場站)'],
    ['GP016', 'GP016 臺南轉運站 (場站)'],
    ['GP017', 'GP017 楠梓站 (場站)'],
    ['GP018', 'GP018 九如站 (場站)'],
    ['GP019', 'GP019 中正站 (場站)'],
    ['GP020', 'GP020 建國客運站 (場站)'],
    ['GP021', 'GP021 佳里辦公室 (辦公室)'],
    ['GP022', 'GP022 車控中心 (辦公室)'],
  ];
  const ACTIVITY_OPTIONS: [string, string][] = [
    ['01', '01 甲類大客車加油紀錄-柴油 (彙總表)'],
    ['02', '02 甲類大客車加油紀錄-柴油 (自設加油站)'],
    ['03', '03 甲類大客車加油紀錄-柴油 (中油加油卡)'],
    ['04', '04 甲類大客車加油紀錄-柴油 (加油機校正紀錄)'],
    ['05', '05 公務車加油紀錄-汽油'],
    ['06', '06 公務車加油紀錄-柴油'],
    ['07', '07 尿素水添加紀錄'],
    ['08', '08 緊急發電機加油紀錄-柴油'],
    ['09', '09 乙炔鋼瓶'],
    ['10', '10 滅火器彙總表'],
    ['11', '11 冰箱設備彙總表'],
    ['12', '12 冰箱設備銘牌照片'],
    ['13', '13 冷氣設備彙總表'],
    ['14', '14 冷氣設備銘牌照片'],
    ['15', '15 飲水機彙總表'],
    ['16', '16 飲水機銘牌照片'],
    ['17', '17 車用及場站冷媒添加紀錄'],
    ['18', '18 人員出勤紀錄-司機人員'],
    ['19', '19 人員出勤紀錄-從業人員'],
    ['20', '20 電費單'],
    ['21', '21 其它 (無法分類待確認)'],
  ];
  const YEAR_OPTIONS: [string, string][] = [
    ['2024', '2024 年'],
    ['2025', '2025 年'],
    ['2026', '2026 年'],
  ];
  const MONTH_OPTIONS: [string, string][] = [
    ['00', '00 全年度'],
    ['01', '01 一月'],
    ['02', '02 二月'],
    ['03', '03 三月'],
    ['04', '04 四月'],
    ['05', '05 五月'],
    ['06', '06 六月'],
    ['07', '07 七月'],
    ['08', '08 八月'],
    ['09', '09 九月'],
    ['10', '10 十月'],
    ['11', '11 十一月'],
    ['12', '12 十二月'],
  ];

  const displayFileName = `${part1 || 'xxxxx'}_${part2Full}_${part3 || 'xxxx'}_${part4 || 'xx'}`;
  const isFileNameComplete = Boolean(part1 && part2Main && part2Sub && part3 && part4);

  useEffect(() => {
    setCopied(false);
  }, [part1, part2Main, part2Sub, part3, part4]);

  /**
   * Returns true if the filename WITHOUT EXTENSION matches the required pattern.
   * Pattern: GP001‑GP022 _ 4-digit activity _ 2024/2025/2026 _ 00‑12
   */
  function isValidFileName(nameWithoutExt: string): boolean {
    const parts = nameWithoutExt.split('_');
    if (parts.length !== 4) return false;

    const [location, activity, year, month] = parts;

    if (!/^GP0(?:00|0[1-9]|1[0-9]|2[0-2])$/.test(location)) return false;
    if (!/^[0-9]{4}$/.test(activity)) return false;
    const main = activity.slice(0, 2);
    const sub  = activity.slice(2);

    if (['12','14','16','20'].includes(main)) {
      if (!/^(0[1-9]|[1-9][0-9])$/.test(sub)) return false;
    } else if (sub !== '00') {
      return false;
    }

    if (!/^(2024|2025|2026)$/.test(year)) return false;
    if (!/^(0[0-9]|1[0-2])$/.test(month)) return false;

    return true;
  }

  /** Adds new files; only invalid names go through rename flow */
  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);

    const toRename: File[] = [];
    const validFiles: File[] = [];

    incoming.forEach((file) => {
      const base = file.name.replace(/\.[^/.]+$/, ''); // strip extension
      if (isValidFileName(base)) {
        validFiles.push(file);          // already passes pattern
      } else {
        toRename.push(file);            // needs filename construction
      }
    });

    // Append valid files immediately
    if (validFiles.length) {
      setFiles((prev) => {
        const updated = [...prev, ...validFiles];
        setStatus('ready');
        return updated;
      });
    }

    // Queue the invalid files for modal
    if (toRename.length) {
      setRenameQueue((prev) => [...prev, ...toRename]);
      if (!renameModal) {
        setRenameModal(toRename[0]);
        setRenameQueue((prev) => prev.slice(1));
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  function removeFile(index: number) {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (!updated.length) setStatus('idle');
      return updated;
    });
  }

  function clearErrors() {
    setErrors([]);
  }

  async function handleUpload() {
    if (files.length === 0 || status === 'uploading') return;

    setStatus('uploading');
    setProgress(0);
    setErrors([]);

    const total = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1️⃣ Upload directly to Vercel Blob (the SDK fetches the token for us)
        await upload(file.name, file, {
          handleUploadUrl: '/api/upload',   // our Route Handler
          access: 'public',
          onUploadProgress: ({ percentage }) => {
            // Aggregate progress across all files
            const overall = Math.round(((i + percentage / 100) / total) * 100);
            setProgress(overall);
          },
        });
      }

      // Success
      setFiles([]);
      setStatus('done');
      setProgress(100);
    } catch (err) {
      setErrors((prev) => [
        ...prev,
        (err as Error)?.message || '上傳失敗，請稍後再試',
      ]);
      setStatus('idle');
      setProgress(0);
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'uploading':
        return <Zap className="text-blue-500 animate-pulse" size={20} />;
      case 'done':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Cloud className="text-slate-400" size={20} />;
    }
  };

  function handleRenameConfirm() {
    if (!renameModal || !isFileNameComplete) return;

    const ext = renameModal.name.includes('.')
      ? renameModal.name.substring(renameModal.name.lastIndexOf('.'))
      : '';
    const newName = `${part1}_${part2Full}_${part3}_${part4}${ext}`;
    const renamed = new File([renameModal], newName, { type: renameModal.type });

    setFiles(prev => [...prev, renamed]);
    setStatus('ready');

    // Reset selectors
    setPart1('');
    setPart2Main('');
    setPart2Sub('');
    setPart3('');
    setPart4('');
    setRenameModal(null);   // queue effect will open next file
  }

  return (
    <>
      <Header onContactClick={() => { /* stub: not used on this page */ }} />
      <style jsx global>{`
        .scrollbar-visible {
          scrollbar-width: auto;
        }
        .scrollbar-visible::-webkit-scrollbar {
          width: 8px;
          background: #e5e7eb;
        }
        .scrollbar-visible::-webkit-scrollbar-thumb {
          background: #a3a3a3;
          border-radius: 4px;
        }
      `}</style>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 text-center">
        {/* Client Logo */}
        <div className="flex justify-center mb-2">
          <Image
            src="/ho-hsin-logo.png"   // put your logo file in /public/client-logo.png
            alt="Client Company Logo"
            width={180}
            height={90}
            priority
          />
        </div>
        <div className="mt-2 mx-auto max-w-4xl px-6 lg:px-8">
          {/*  
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
              <Upload size={32} />
            </div>
          </div>
          */}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 dark:from-slate-100 dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">
            上傳您的活動數據資料
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            檔名格式：GP001_01_2025_01.副檔名<br />
            第一段 GP001–GP022，第二段 01–21，年份 2025/2026，月份 00–12
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        {/* Reference Tables */}
        <div className="hidden sm:block mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-8">
            參考編碼對照表
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-xl font-mono font-semibold">
              <span className="text-blue-600 dark:text-blue-400">{part1 || 'xxxxx'}</span>
              <span className="text-slate-600 dark:text-slate-400">_</span>
              <span className="text-emerald-600 dark:text-emerald-400">{part2Full || 'xxxx'}</span>
              <span className="text-slate-600 dark:text-slate-400">_</span>
              <span className="text-purple-600 dark:text-purple-400">{part3 || 'xxxx'}</span>
              <span className="text-slate-600 dark:text-slate-400">_</span>
              <span className="text-amber-600 dark:text-amber-400">{part4 || 'xx'}</span>
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(displayFileName).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              disabled={!isFileNameComplete}
              className="hidden sm:inline-flex px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:from-slate-700 hover:to-slate-900 transition-colors"
              title={isFileNameComplete ? '複製檔名' : '請先選取所有段落'}
            >
              {copied ? '檔名已複製成功!' : '複製檔名'}
            </button>
          </div>
          <div className="flex flex-col xl:flex-row gap-8 justify-center">
            {/* Location Table */}
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">場站 / 車廠 / 辦公室</h3>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-80 scrollbar-visible">
                <table className="w-full">
                  <thead>
                    <tr className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-700/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">編號</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">類型</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">名稱</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['GP000', '全公司資料', '全公司資料'],
                      ['GP001', '停車暨保修廠', '台北車廠'],
                      ['GP002', '停車暨保修廠', '台中車廠'],
                      ['GP003', '停車暨保修廠', '台南車廠'],
                      ['GP004', '停車暨保修廠', '高雄車廠'],
                      ['GP005', '場站', '臺北轉運站'],
                      ['GP006', '場站', '板橋客運站'],
                      ['GP007', '場站', '三重站'],
                      ['GP008', '場站', '桃園站'],
                      ['GP009', '場站', '中壢祐民醫院站'],
                      ['GP010', '場站', '新竹站'],
                      ['GP011', '場站', '朝馬轉運站'],
                      ['GP012', '場站', '嘉義轉運站'],
                      ['GP013', '場站', '新營轉運站'],
                      ['GP014', '場站', '麻豆轉運站'],
                      ['GP015', '場站', '永康轉運站'],
                      ['GP016', '場站', '臺南轉運站'],
                      ['GP017', '場站', '楠梓站'],
                      ['GP018', '場站', '九如站'],
                      ['GP019', '場站', '中正站'],
                      ['GP020', '場站', '建國客運站'],
                      ['GP021', '辦公室', '佳里辦公室'],
                      ['GP022', '辦公室', '車控中心'],
                    ].map(([code, type, name], idx) => (
                      <tr
                        key={code}
                        onClick={() => setPart1(code)}
                        className={`cursor-pointer transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                          part1 === code 
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 shadow-md ring-2 ring-blue-200 dark:ring-blue-800' 
                            : idx % 2 === 0 
                            ? 'bg-white dark:bg-slate-800/30' 
                            : 'bg-slate-50/50 dark:bg-slate-700/20'
                        }`}
                      >
                        <td className={`px-4 py-3 text-sm font-mono font-semibold ${
                          part1 === code ? 'text-blue-700 dark:text-blue-300' : 'text-blue-600 dark:text-blue-400'
                        }`}>{code}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{type}</td>
                        <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200">{name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Data Table */}
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">活動數據類型</h3>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-80 scrollbar-visible">
                <table className="w-full">
                  <thead>
                    <tr className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-700/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">編號</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">活動數據</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['01', '甲類大客車加油紀錄-柴油 (彙總表)'],
                      ['02', '甲類大客車加油紀錄-柴油 (自設加油站)'],
                      ['03', '甲類大客車加油紀錄-柴油 (中油加油卡)'],
                      ['04', '甲類大客車加油紀錄-柴油 (加油機校正紀錄)'],
                      ['05', '公務車加油紀錄-汽油'],
                      ['06', '公務車加油紀錄-柴油'],
                      ['07', '尿素水添加紀錄'],
                      ['08', '緊急發電機加油紀錄-柴油'],
                      ['09', '乙炔鋼瓶'],
                      ['10', '滅火器彙總表'],
                      ['11', '冰箱設備彙總表'],
                      ['12', '冰箱設備銘牌照片'],
                      ['13', '冷氣設備彙總表'],
                      ['14', '冷氣設備銘牌照片'],
                      ['15', '飲水機彙總表'],
                      ['16', '飲水機銘牌照片'],
                      ['17', '車用及場站冷媒添加紀錄'],
                      ['18', '人員出勤紀錄-司機人員'],
                      ['19', '人員出勤紀錄-從業人員'],
                      ['20', '電費單'],
                      ['21', '其它 (無法分類待確認)'],
                    ].map(([code, desc], idx) => (
                      <React.Fragment key={code}>
                        <tr
                          onClick={() => {
                            setPart2Main(code);
                            setPart2Sub(SPECIAL_ACTIVITY_CODES.includes(code) ? '' : '00');
                          }}
                          className={`cursor-pointer transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                            part2Main === code 
                              ? 'bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-500 shadow-md ring-2 ring-emerald-200 dark:ring-emerald-800' 
                              : idx % 2 === 0 
                              ? 'bg-white dark:bg-slate-800/30' 
                              : 'bg-slate-50/50 dark:bg-slate-700/20'
                          }`}
                        >
                          <td className={`px-4 py-3 text-sm font-mono font-semibold ${
                            part2Main === code ? 'text-emerald-700 dark:text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>{code}</td>
                          <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                            <span>{desc}</span>
                            {SPECIAL_ACTIVITY_CODES.includes(code) && part2Main === code && (
                              <select
                                autoFocus
                                value={part2Sub}
                                onChange={(e) => setPart2Sub(e.target.value)}
                                className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              >
                                <option value="">
                                  {code === '20'
                                    ? '流水號 （一個電號一個流水號）'
                                    : '流水號 （一張照片一個流水號）'}
                                </option>
                                {Array.from({ length: 99 }, (_, i) => {
                                  const v = String(i + 1).padStart(2, '0');
                                  return (
                                    <option key={v} value={v}>
                                      {v}
                                    </option>
                                  );
                                })}
                              </select>
                            )}
                          </td>
                        </tr>
                        {/* Removed the subrow button grid */}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Year Table */}
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">活動數據年度</h3>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-80 scrollbar-visible">
                <table className="w-full">
                  <thead>
                    <tr className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-700/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                        年份
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {['2024', '2025', '2026'].map((year, idx) => (
                      <tr
                        key={year}
                        onClick={() => setPart3(year)}
                        className={`cursor-pointer transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                          part3 === year 
                            ? 'bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500 shadow-md ring-2 ring-purple-200 dark:ring-purple-800' 
                            : idx % 2 === 0
                            ? 'bg-white dark:bg-slate-800/30'
                            : 'bg-slate-50/50 dark:bg-slate-700/20'
                        }`}
                      >
                        <td className={`px-4 py-3 text-sm font-mono font-semibold ${
                          part3 === year ? 'text-purple-700 dark:text-purple-300' : 'text-purple-600 dark:text-purple-400'
                        }`}>
                          {year}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Month Table */}
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">活動數據月份</h3>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-80 scrollbar-visible">
                <table className="w-full">
                  <thead>
                    <tr className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-700/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                        月份
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      '00 (全年度活動數據)',
                      '01',
                      '02',
                      '03',
                      '04',
                      '05',
                      '06',
                      '07',
                      '08',
                      '09',
                      '10',
                      '11',
                      '12',
                    ].map((month, idx) => (
                      <tr
                        key={month}
                        onClick={() => setPart4(month.slice(0, 2))}
                        className={`cursor-pointer transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                          part4 === month.slice(0, 2) 
                            ? 'bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 shadow-md ring-2 ring-amber-200 dark:ring-amber-800' 
                            : idx % 2 === 0
                            ? 'bg-white dark:bg-slate-800/30'
                            : 'bg-slate-50/50 dark:bg-slate-700/20'
                        }`}
                      >
                        <td className={`px-4 py-3 text-sm font-mono font-semibold ${
                          part4 === month.slice(0, 2) ? 'text-amber-700 dark:text-amber-300' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {month}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto">
          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {getStatusIcon()}
            <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
              {status === 'idle' && '準備上傳檔案'}
              {status === 'ready' && `已選擇 ${files.length} 個檔案`}
              {status === 'uploading' && '上傳中...'}
              {status === 'done' && '上傳完成！'}
            </span>
          </div>

          {status === 'uploading' && (
            <div className="w-full max-w-xl mx-auto mb-6">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-400">
                {progress}%
              </p>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="hidden sm:flex relative w-full h-64 flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl cursor-pointer transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 group bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 group-hover:from-blue-200 group-hover:to-cyan-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-cyan-800/50 transition-all duration-300 mx-auto w-fit">
                <Upload size={48} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                將檔案拖曳至此
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                或點擊下方按鈕選取檔案<br />檔案大小上限為50MB<br />
              </p>
            </div>
          </div>

          {/* File Input */}
          <input
            type="file"
            multiple
            className="hidden"
            id="fileInput"
            onChange={handleFileChange}
          />
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <label
              htmlFor="fileInput"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <FileText size={20} />
              選擇檔案
            </label>
            
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || status === 'uploading'}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 transform hover:scale-105 disabled:hover:scale-100"
            >
              {status === 'uploading' ? (
                <>
                  <Zap size={20} className="animate-pulse" />
                  上傳中...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  確認上傳
                </>
              )}
            </button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-12 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-500" />
                  已選擇的檔案 ({files.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText size={20} className="text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                        title="移除檔案"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mt-8 bg-red-50/70 dark:bg-red-900/20 backdrop-blur-xl rounded-2xl shadow-xl border border-red-200/50 dark:border-red-800/50 overflow-hidden">
              <div className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 px-6 py-4 border-b border-red-200 dark:border-red-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
                    <AlertCircle size={20} />
                    錯誤訊息 ({errors.length})
                  </h3>
                  <button
                    onClick={clearErrors}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 bg-red-100/50 dark:bg-red-900/30 rounded-lg"
                    >
                      <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
{/* Rename Modal */}
{renameModal && (
  <>
    {/* Dimmed backdrop */}
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm pointer-events-none" />

    {/* Modal box */}
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full pointer-events-auto">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 text-center">
          請完成活動數據檔案命名
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 text-center">
          由下拉選單選取檔名片段，完成後按「確認」上傳。<br />
          若不需此檔案，請按「取消」跳過。
        </p>

        {/* File preview */}
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="預覽"
              width={112}
              height={112}
              className="w-28 h-28 object-cover rounded-lg mb-2 mx-auto border border-slate-200 dark:border-slate-600"
              unoptimized
            />
            <div className="mb-4 text-center text-sm text-slate-600 dark:text-slate-400">
              {renameModal?.name}
            </div>
          </>
        ) : (
          <div className="mb-4 text-center text-sm text-slate-600 dark:text-slate-400">
            {renameModal?.name}
          </div>
        )}

        {/* Live preview - improved colors with better contrast */}
        <div className="flex justify-center mb-6 text-lg font-mono bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="text-blue-700 dark:text-blue-300 font-semibold">{part1 || 'xxxxx'}</span>
          <span className="text-slate-700 dark:text-slate-400 font-semibold">_</span>
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{part2Full || 'xxxx'}</span>
          <span className="text-slate-700 dark:text-slate-400 font-semibold">_</span>
          <span className="text-violet-700 dark:text-violet-300 font-semibold">{part3 || 'xxxx'}</span>
          <span className="text-slate-700 dark:text-slate-400 font-semibold">_</span>
          <span className="text-amber-700 dark:text-amber-300 font-semibold">{part4 || 'xx'}</span>
        </div>

        {/* Dropdown selectors */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Location */}
          <select
            value={part1}
            onChange={(e) => setPart1(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-base font-mono h-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">場站編碼</option>
            {LOCATION_OPTIONS.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          {/* Activity main */}
          <select
            value={part2Main}
            onChange={(e) => {
              const c = e.target.value;
              setPart2Main(c);
              setPart2Sub(SPECIAL_ACTIVITY_CODES.includes(c) ? '' : '00');
            }}
            className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-base font-mono h-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">活動代碼</option>
            {ACTIVITY_OPTIONS.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          {/* Activity sub serial (only for special codes) */}
          {SPECIAL_ACTIVITY_CODES.includes(part2Main) && (
            <select
              value={part2Sub}
              onChange={(e) => setPart2Sub(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-base font-mono h-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">
                {part2Main === '20'
                  ? '流水號 （一個電號一個流水號）'
                  : '流水號 （一張照片一個流水號）'}
              </option>
              {Array.from({ length: 99 }, (_, i) => {
                const v = String(i + 1).padStart(2, '0');
                return <option key={v} value={v}>{v}</option>;
              })}
            </select>
          )}

          {/* Year & Month row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Year */}
            <select
              value={part3}
              onChange={(e) => setPart3(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-base font-mono h-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">年度</option>
              {YEAR_OPTIONS.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>

            {/* Month */}
            <select
              value={part4}
              onChange={(e) => setPart4(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-base font-mono h-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">月份</option>
              {MONTH_OPTIONS.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setPart1('');
              setPart2Main('');
              setPart2Sub('');
              setPart3('');
              setPart4('');
              setRenameModal(null);   // discard current file, move to next
            }}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors font-medium"
          >
            取消
          </button>
          <button
            onClick={handleRenameConfirm}
            disabled={!isFileNameComplete}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors font-medium disabled:cursor-not-allowed"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </>
)}
      </main>
      </div>
    </>
  );
}