import React, { useState } from 'react';
import { PROJECT_SOURCE_FILES } from '../../data/projectSourceTree';
import { ProjectSourceFile } from '../../types';
import {
  Code,
  FileCode,
  FolderTree,
  Copy,
  Check,
  Search,
  Terminal,
  Download,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const CodeStudioModule: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectSourceFile>(PROJECT_SOURCE_FILES[3]); // MainActivity.kt by default
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  const modules = ['All', 'Jetpack Compose UI', 'Android App', 'AI & Voice', 'Database & Room', 'Backend API', 'Configuration & Gradle'];

  const filteredFiles = PROJECT_SOURCE_FILES.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(search.toLowerCase()) ||
      file.path.toLowerCase().includes(search.toLowerCase()) ||
      file.description.toLowerCase().includes(search.toLowerCase());
    const matchesModule = selectedModule === 'All' || file.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const copyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Studio Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-pink-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Android Studio Hedgehog / Ladybug · Kotlin 2.0+ · Gradle 8.9+</span>
          </div>
          <h2 className="text-xl font-display font-extrabold text-white">
            Pinky AI Android & Backend Source Hub
          </h2>
          <p className="text-xs text-purple-200/60 mt-1">
            Browse and export all production-grade Kotlin, Compose, Room, and Node.js backend files.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadFile}
            className="px-3.5 py-2 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-pink-400" />
            <span>Download {selectedFile.name}</span>
          </button>
          <button
            onClick={copyCode}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-pink-500/20 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Code Copied!' : 'Copy Full File'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Code Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Explorer */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-white flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-pink-400" />
              <span>Project Files ({filteredFiles.length})</span>
            </span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Kotlin source..."
              className="w-full bg-black/40 border border-purple-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-500/50"
            />
          </div>

          {/* Module Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {modules.map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                  selectedModule === mod
                    ? 'bg-pink-500 text-white'
                    : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/40'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>

          {/* File list items */}
          <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-0.5 ${
                  selectedFile.path === file.path
                    ? 'bg-pink-500/20 border border-pink-500/40 text-white'
                    : 'bg-purple-950/20 hover:bg-purple-900/30 border border-transparent text-purple-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-medium text-pink-300 truncate">{file.name}</span>
                  <span className="text-[10px] text-purple-400/60 uppercase">{file.language}</span>
                </div>
                <span className="text-[11px] text-purple-300/50 truncate font-sans">
                  {file.path}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 glass-panel rounded-2xl overflow-hidden flex flex-col h-[640px]">
          {/* File Metadata Header */}
          <div className="px-5 py-3.5 border-b border-pink-500/15 bg-black/60 flex items-center justify-between">
            <div>
              <div className="font-mono text-xs text-white font-semibold flex items-center gap-2">
                <FileCode className="w-4 h-4 text-pink-400" />
                <span>{selectedFile.path}</span>
              </div>
              <p className="text-[11px] text-purple-200/60 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <button
              onClick={copyCode}
              className="px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-xs font-mono text-pink-300 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Syntax Code Body */}
          <div className="flex-1 overflow-auto p-5 bg-[#08040d] font-mono text-xs text-purple-100 leading-relaxed">
            <pre className="whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>

          {/* Bottom Build Quick Guide */}
          <div className="p-3 bg-black/80 border-t border-purple-500/20 text-[11px] font-mono text-purple-300/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-pink-400" />
              <span>Android Build: ./gradlew assembleRelease --stacktrace</span>
            </div>
            <span className="text-pink-400 font-semibold">Ready for Android Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
};
