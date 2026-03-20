/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  History, 
  BookOpen, 
  User, 
  Play, 
  Pause, 
  Square, 
  ChevronLeft, 
  MoreVertical, 
  Search, 
  Send, 
  RefreshCw, 
  Download, 
  Plus, 
  Settings,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, Recording, Message, RecordingStatus } from './types';
import { MOCK_RECORDINGS } from './mockData';
import { GoogleGenAI } from "@google/genai";

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; 
  className?: string;
  disabled?: boolean;
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100";
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  key?: string | number;
}

const Card = ({ children, onClick, className = "" }: CardProps) => (
  <div 
    onClick={onClick}
    className={`bg-white border border-neutral-100 rounded-2xl p-4 hover:border-neutral-200 transition-all cursor-pointer ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'processing' | 'success' }) => {
  const styles = {
    default: "bg-neutral-100 text-neutral-600",
    processing: "bg-blue-50 text-blue-600",
    success: "bg-green-50 text-green-600"
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [recordings, setRecordings] = useState<Recording[]>(MOCK_RECORDINGS);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'summary' | 'full' | 'qa' | 'more'>('summary');
  const [qaMessages, setQaMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Handlers ---

  const startRecording = () => {
    setRecordingTime(0);
    setIsPaused(false);
    setCurrentPage('recording');
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const togglePause = () => {
    if (isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    setIsPaused(!isPaused);
  };

  const endRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowConfirmEnd(false);
    setCurrentPage('processing');
    setProcessingStep(0);
    
    // Simulate processing steps
    const steps = [1, 2, 3, 4];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setProcessingStep(step);
        if (step === 4) {
          const newRec: Recording = {
            id: Math.random().toString(36).substr(2, 9),
            title: `新会议记录 ${new Date().toLocaleDateString()}`,
            timestamp: Date.now(),
            duration: recordingTime,
            status: 'completed',
            summary: '这是一份自动生成的会议摘要。讨论了项目进度和下一步计划。',
            keyPoints: ['项目里程碑达成', '资源分配优化', '下周会议安排'],
            conclusions: ['项目按期推进'],
            todos: [{ task: '更新进度表', owner: '当前用户' }],
            transcription: [
              { time: '00:01', text: '会议开始，今天我们讨论...' },
              { time: '00:05', text: '关于资源方面，我们需要更多支持。' }
            ]
          };
          setRecordings([newRec, ...recordings]);
          setCurrentRecording(newRec);
          setCurrentPage('detail');
          setActiveTab('summary');
        }
      }, (index + 1) * 1500);
    });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentRecording) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };
    
    setQaMessages(prev => [...prev, userMsg]);
    setInputValue('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system: `你是一个专业的会议助手。以下是本次会议的转写内容：\n${currentRecording.transcription?.map(t => `[${t.time}] ${t.text}`).join('\n')}\n\n请根据以上内容回答用户的问题。回答要简洁、专业、结论先行。`,
          messages: [
            ...qaMessages.map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content
            })),
            { role: 'user', content: userMsg.content }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const aiContent = data.content?.[0]?.text || "抱歉，我无法处理您的请求。";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiContent,
        timestamp: Date.now()
      };
      setQaMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("QA Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "抱歉，连接 AI 服务时出现错误，请检查 API 配置。",
        timestamp: Date.now()
      };
      setQaMessages(prev => [...prev, errorMsg]);
    }
  };

  // --- Renderers ---

  const renderHome = () => (
    <div className="flex flex-col h-full bg-neutral-50">
      <header className="p-6 flex justify-between items-center bg-white border-b border-neutral-100">
        <h1 className="text-xl font-bold tracking-tight">纳米 AI Note</h1>
        <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          已连接设备
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <section className="flex flex-col items-center justify-center py-12 space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center shadow-2xl shadow-black/20"
          >
            <Mic size={48} />
          </motion.button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">开始录音</h2>
            <p className="text-sm text-neutral-500">适用于会议、访谈、沟通记录</p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">最近录音</h3>
            <button onClick={() => setCurrentPage('records')} className="text-sm text-neutral-500 hover:text-black">查看更多</button>
          </div>
          <div className="space-y-3">
            {recordings.slice(0, 3).map(rec => (
              <Card key={rec.id} onClick={() => { setCurrentRecording(rec); setCurrentPage('detail'); setActiveTab('summary'); }}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <Badge variant={rec.status === 'completed' ? 'success' : 'processing'}>
                    {rec.status === 'completed' ? '已完成' : '处理中'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(rec.timestamp).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><History size={12} /> {formatTime(rec.duration)}</span>
                </div>
              </Card>
            ))}
            {recordings.length === 0 && (
              <div className="text-center py-8 text-neutral-400 text-sm">
                还没有录音记录，点击上方开始第一次录音
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold">快捷能力</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <FileText size={20} />, label: 'AI 总结' },
              { icon: <BookOpen size={20} />, label: '知识页' },
              { icon: <MessageSquare size={20} />, label: '问答' }
            ].map((item, i) => (
              <button key={i} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-all">
                <div className="text-neutral-600">{item.icon}</div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );

  const renderRecording = () => (
    <div className="flex flex-col h-full bg-white">
      <header className="p-6 flex items-center gap-4">
        <button onClick={() => setCurrentPage('home')} className="p-2 -ml-2 hover:bg-neutral-100 rounded-full">
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold">正在录音</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-6xl font-mono font-light tracking-tighter">
          {formatTime(recordingTime)}
        </div>

        <div className="w-full h-32 flex items-center justify-center gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: isPaused ? 4 : [4, Math.random() * 80 + 20, 4] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.5, 
                delay: i * 0.05 
              }}
              className="w-1.5 bg-black rounded-full"
            />
          ))}
        </div>

        <div className="text-sm font-medium text-neutral-500 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} />
          当前状态：{isPaused ? '已暂停' : '录音中'}
        </div>

        <div className="flex gap-6 w-full max-w-xs">
          <Button 
            variant="secondary" 
            className="flex-1 py-4" 
            onClick={togglePause}
          >
            {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
            {isPaused ? '继续' : '暂停'}
          </Button>
          <Button 
            variant="primary" 
            className="flex-1 py-4" 
            onClick={() => setShowConfirmEnd(true)}
          >
            <Square size={20} fill="currentColor" />
            结束
          </Button>
        </div>
      </main>

      <footer className="p-8 text-center text-xs text-neutral-400">
        结束录音后将自动上传、转写并生成 AI 总结
      </footer>

      <AnimatePresence>
        {showConfirmEnd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-6 shadow-2xl"
            >
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">确认结束录音？</h3>
                <p className="text-neutral-500 text-sm">结束后将自动上传、转写并生成 AI 总结。</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="primary" onClick={endRecording}>结束并生成纪要</Button>
                <Button variant="secondary" onClick={() => setShowConfirmEnd(false)}>继续录音</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col h-full bg-white p-6 justify-center items-center space-y-12">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-neutral-100"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="377"
            animate={{ strokeDashoffset: 377 - (377 * (processingStep / 4)) }}
            className="text-black"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
          {Math.round((processingStep / 4) * 100)}%
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">会议记录处理中</h2>
        <p className="text-neutral-500 text-sm">预计耗时 1 ~ 3 分钟</p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        {[
          { label: '录音保存', step: 1 },
          { label: '音频上传', step: 2 },
          { label: '语音转写', step: 3 },
          { label: 'AI 总结生成', step: 4 }
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className={`text-sm ${processingStep >= item.step ? 'text-black font-medium' : 'text-neutral-300'}`}>
              {item.label}
            </span>
            {processingStep > item.step ? (
              <CheckCircle2 size={16} className="text-green-500" />
            ) : processingStep === item.step ? (
              <RefreshCw size={16} className="text-black animate-spin" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-neutral-100" />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 w-full max-w-xs pt-8">
        <Button variant="secondary" className="flex-1" onClick={() => setCurrentPage('home')}>返回首页</Button>
        <Button variant="secondary" className="flex-1" onClick={() => setCurrentPage('records')}>查看列表</Button>
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="flex flex-col h-full bg-neutral-50">
      <header className="p-6 bg-white border-b border-neutral-100 space-y-4">
        <h1 className="text-xl font-bold">记录</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索录音标题" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/5"
          />
        </div>
        <div className="flex gap-2">
          {['全部', '处理中', '已完成'].map(tab => (
            <button key={tab} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${tab === '全部' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500'}`}>
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {recordings
          .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(rec => (
          <Card key={rec.id} onClick={() => { setCurrentRecording(rec); setCurrentPage('detail'); setActiveTab('summary'); }}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold">{rec.title}</h4>
              <Badge variant={rec.status === 'completed' ? 'success' : 'processing'}>
                {rec.status === 'completed' ? '已完成' : '处理中'}
              </Badge>
            </div>
            <div className="text-xs text-neutral-400 mb-3 flex gap-3">
              <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
              <span>{formatTime(rec.duration)}</span>
            </div>
            {rec.summary && (
              <p className="text-sm text-neutral-600 line-clamp-2 bg-neutral-50 p-2 rounded-lg">
                {rec.summary}
              </p>
            )}
          </Card>
        ))}
      </main>
    </div>
  );

  const renderDetail = () => {
    if (!currentRecording) return null;
    
    return (
      <div className="flex flex-col h-full bg-white">
        <header className="p-6 border-b border-neutral-100">
          <div className="flex justify-between items-start mb-4">
            <button onClick={() => setCurrentPage('records')} className="p-2 -ml-2 hover:bg-neutral-100 rounded-full">
              <ChevronLeft />
            </button>
            <button className="p-2 -mr-2 hover:bg-neutral-100 rounded-full">
              <MoreHorizontal />
            </button>
          </div>
          <h1 className="text-xl font-bold mb-1">{currentRecording.title}</h1>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span>{new Date(currentRecording.timestamp).toLocaleString()}</span>
            <span>时长 {formatTime(currentRecording.duration)}</span>
          </div>
        </header>

        <nav className="flex border-b border-neutral-100">
          {(['summary', 'full', 'qa', 'more'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-black' : 'text-neutral-400'}`}
            >
              {tab === 'summary' && '摘要'}
              {tab === 'full' && '全文'}
              {tab === 'qa' && '问答'}
              {tab === 'more' && '更多'}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'summary' && (
            <div className="space-y-8">
              <section className="space-y-3">
                <h3 className="font-bold flex items-center gap-2"><FileText size={18} /> 会议摘要</h3>
                <p className="text-neutral-600 leading-relaxed">{currentRecording.summary}</p>
              </section>

              <section className="space-y-3">
                <h3 className="font-bold flex items-center gap-2"><CheckCircle2 size={18} /> 核心讨论点</h3>
                <ul className="space-y-2">
                  {currentRecording.keyPoints?.map((p, i) => (
                    <li key={i} className="flex gap-2 text-neutral-600">
                      <span className="text-neutral-300 font-mono">{i + 1}.</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="font-bold flex items-center gap-2"><AlertCircle size={18} /> 会议结论</h3>
                <div className="bg-neutral-50 p-4 rounded-2xl text-neutral-700 font-medium">
                  {currentRecording.conclusions?.join('；')}
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="font-bold flex items-center gap-2"><Clock size={18} /> 待办事项</h3>
                <div className="space-y-2">
                  {currentRecording.todos?.map((todo, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl">
                      <span className="text-sm font-medium">{todo.task}</span>
                      <span className="text-xs text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md">{todo.owner}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1"><RefreshCw size={16} /> 重新生成</Button>
                <Button variant="primary" className="flex-1"><Download size={16} /> 导出纪要</Button>
              </div>
            </div>
          )}

          {activeTab === 'full' && (
            <div className="space-y-6">
              {currentRecording.transcription?.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{item.time}</div>
                  <p className="text-neutral-700 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-4 mb-4">
                {qaMessages.length === 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-400">推荐问题</p>
                    <div className="space-y-2">
                      {['谁负责下周报价？', '本次会议的最终结论是什么？', '客户最关注的问题有哪些？'].map((q, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setInputValue(q); }}
                          className="w-full text-left p-3 text-sm border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {qaMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 sticky bottom-0 bg-white pt-2 pb-4">
                <input 
                  type="text" 
                  placeholder="请输入问题..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-neutral-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black/5"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-3 bg-black text-white rounded-xl active:scale-95 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'more' && (
            <div className="space-y-2">
              {[
                { label: '重命名录音', icon: <FileText size={18} /> },
                { label: '加入知识库', icon: <Plus size={18} /> },
                { label: '查看原始音频', icon: <History size={18} /> },
                { label: '重新转写', icon: <RefreshCw size={18} /> },
                { label: '重新生成总结', icon: <RefreshCw size={18} /> },
                { label: '删除记录', icon: <Square size={18} />, danger: true }
              ].map((item, i) => (
                <button 
                  key={i} 
                  className={`w-full flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 transition-all ${item.danger ? 'text-red-500' : 'text-neutral-700'}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  };

  const renderKnowledge = () => (
    <div className="flex flex-col h-full bg-neutral-50">
      <header className="p-6 bg-white border-b border-neutral-100">
        <h1 className="text-xl font-bold">知识页</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1 text-sm"><Plus size={16} /> 导入录音纪要</Button>
          <Button variant="secondary" className="flex-1 text-sm"><FileText size={16} /> 上传文件</Button>
        </div>

        <section className="space-y-4">
          <h3 className="font-bold">已收录内容</h3>
          <div className="space-y-3">
            {[
              { label: '销售会议纪要', count: 12 },
              { label: '客户沟通记录', count: 6 },
              { label: '产品评审记录', count: 9 }
            ].map((item, i) => (
              <Card key={i} className="flex items-center justify-between">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-neutral-400">{item.count} 条</span>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold">知识问答</h3>
          <div className="relative">
            <textarea 
              placeholder="输入问题，跨记录分析信息" 
              className="w-full bg-white border border-neutral-100 rounded-2xl p-4 text-sm min-h-[100px] focus:ring-2 focus:ring-black/5 resize-none"
            />
            <button className="absolute bottom-4 right-4 p-2 bg-black text-white rounded-xl">
              <Send size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );

  const renderProfile = () => (
    <div className="flex flex-col h-full bg-neutral-50">
      <header className="p-6 bg-white border-b border-neutral-100">
        <h1 className="text-xl font-bold">我的</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center gap-4 bg-white p-6 rounded-3xl">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-400">
            <User size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold">用户昵称</h2>
            <p className="text-xs text-neutral-400">剩余总结时长：120 分钟</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden">
          {[
            { label: '录音设置', icon: <Mic size={18} /> },
            { label: '自动 AI 分析', icon: <RefreshCw size={18} /> },
            { label: '导出设置', icon: <Download size={18} /> },
            { label: '帮助中心', icon: <AlertCircle size={18} /> },
            { label: '意见反馈', icon: <MessageSquare size={18} /> },
            { label: '关于我们', icon: <Settings size={18} /> }
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-all border-b border-neutral-50 last:border-none">
              <div className="flex items-center gap-4">
                <div className="text-neutral-400">{item.icon}</div>
                <span className="font-medium text-neutral-700">{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-white shadow-2xl flex flex-col overflow-hidden font-sans text-neutral-900">
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="h-full w-full"
          >
            {currentPage === 'home' && renderHome()}
            {currentPage === 'records' && renderRecords()}
            {currentPage === 'knowledge' && renderKnowledge()}
            {currentPage === 'profile' && renderProfile()}
            {currentPage === 'recording' && renderRecording()}
            {currentPage === 'processing' && renderProcessing()}
            {currentPage === 'detail' && renderDetail()}
          </motion.div>
        </AnimatePresence>
      </div>

      {['home', 'records', 'knowledge', 'profile'].includes(currentPage) && (
        <nav className="h-20 bg-white border-t border-neutral-100 flex items-center justify-around px-4 pb-2">
          {[
            { id: 'home', icon: <Mic size={24} />, label: '首页' },
            { id: 'records', icon: <History size={24} />, label: '记录' },
            { id: 'knowledge', icon: <BookOpen size={24} />, label: '知识' },
            { id: 'profile', icon: <User size={24} />, label: '我的' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Page)}
              className={`flex flex-col items-center gap-1 transition-all ${currentPage === item.id ? 'text-black' : 'text-neutral-300'}`}
            >
              {item.icon}
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
