'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Cloud, Zap } from 'lucide-react';
import Header from '@/components/Header';

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'uploading' | 'done'>('idle');

  // Filename demo state
  const [part1, setPart1] = useState('');
  const [part2, setPart2] = useState('');
  const [part3, setPart3] = useState('');
  const [part4, setPart4] = useState('');
  const [copied, setCopied] = useState(false);

  const displayFileName = `${part1 || 'xxxxx'}_${part2 || 'xx'}_${part3 || 'xxxx'}_${part4 || 'xx'}`;
  const isFileNameComplete = Boolean(part1 && part2 && part3 && part4);

  useEffect(() => {
    setCopied(false);
  }, [part1, part2, part3, part4]);

  /**
   * Returns an error string if the filename is invalid; otherwise `null`.
   */
  function validateName(f: File): string | null {
    const invalidChars = /[\\/?%*:|"<>]/;
    if (invalidChars.test(f.name)) return '檔名含有不允許的特殊字元。';
    if (f.name.length > 255) return '檔名過長 (必須 ≤ 255 字元)。';

    // 必須符合：GP001_01_2025_01.ext
    const pattern = /^GP0(?:0[1-9]|1[0-9]|2[0-2])_(?:0[1-9]|1[01])_(?:2025|2026)_(?:0[0-9]|1[0-2])(?:\.[A-Za-z0-9_-]+)?$/i;

    if (!pattern.test(f.name)) {
      return '檔名格式不符，需為 GP001_01_2025_01.ext 且各段落需落在有效範圍內。';
    }

    return null;
  }

  /** Pushes new files into state after validation */
  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const newFiles: File[] = [];
    const newErrors: string[] = [];

    Array.from(fileList).forEach((f) => {
      const err = validateName(f);
      if (err) {
        newErrors.push(`${f.name}: ${err}`);
      } else {
        newFiles.push(f);
      }
    });

    setErrors((prev) => [...prev, ...newErrors]);
    setFiles((prev) => {
      const updated = [...prev, ...newFiles];
      setStatus((prevStatus) => (updated.length ? 'ready' : prevStatus));
      return updated;
    });
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
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      setStatus('idle');
    }
  }

  function clearErrors() {
    setErrors([]);
  }

  async function handleUpload() {
    if (files.length === 0 || status === 'uploading') return;

    setStatus('uploading');

    for (const f of files) {
      const fd = new FormData();
      fd.append('file', f, f.name);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: '上傳失敗' }));
        setErrors(prev => [...prev, `${f.name}: ${error}`]);
      }
    }

    setFiles([]);
    setStatus('done');
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
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
              <Upload size={32} />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 dark:from-slate-100 dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">
            上傳您的活動數據資料
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            檔名格式：GP001_01_2025_01.副檔名<br />
            第一段 GP001–GP022，第二段 01–11，年份 2025/2026，月份 00–12
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        {/* Reference Tables */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-8">
            參考編碼對照表
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-xl font-mono font-semibold">
              <span className="text-blue-600 dark:text-blue-400">{part1 || 'xxxxx'}</span>_
              <span className="text-emerald-600 dark:text-emerald-400">{part2 || 'xx'}</span>_
              <span className="text-purple-600 dark:text-purple-400">{part3 || 'xxxx'}</span>_
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
              className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:from-slate-700 hover:to-slate-900 transition-colors"
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
                        className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                          idx % 2 === 0 ? 'bg-white dark:bg-slate-800/30' : 'bg-slate-50/50 dark:bg-slate-700/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">{code}</td>
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
                      ['01', '甲類大客車加油紀錄'],
                      ['02', '公務車加油紀錄'],
                      ['03', '尿素水添加紀錄'],
                      ['04', '緊急發電機柴油加油紀錄'],
                      ['05', '乙炔鋼瓶'],
                      ['06', '天然氣'],
                      ['07', '補裝瓦斯'],
                      ['08', '冰箱、冷氣、飲水機設備銘牌'],
                      ['09', '車用冷媒添加紀錄'],
                      ['10', '人員活動‑出勤紀錄'],
                      ['11', '電費單'],
                    ].map(([code, desc], idx) => (
                      <tr
                        key={code}
                        onClick={() => setPart2(code)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                          idx % 2 === 0 ? 'bg-white dark:bg-slate-800/30' : 'bg-slate-50/50 dark:bg-slate-700/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400">{code}</td>
                        <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200">{desc}</td>
                      </tr>
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
                    {['2025', '2026'].map((year, idx) => (
                      <tr
                        key={year}
                        onClick={() => setPart3(year)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                          idx % 2 === 0
                            ? 'bg-white dark:bg-slate-800/30'
                            : 'bg-slate-50/50 dark:bg-slate-700/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-mono font-semibold text-purple-600 dark:text-purple-400">
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
                        className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                          idx % 2 === 0
                            ? 'bg-white dark:bg-slate-800/30'
                            : 'bg-slate-50/50 dark:bg-slate-700/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-mono font-semibold text-amber-600 dark:text-amber-400">
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

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl cursor-pointer transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 group bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 group-hover:from-blue-200 group-hover:to-cyan-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-cyan-800/50 transition-all duration-300 mx-auto w-fit">
                <Upload size={48} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                將檔案拖曳至此
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                或點擊下方按鈕選取檔案
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
      </main>
      </div>
    </>
  );
}