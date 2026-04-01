/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DetailTab, MAIN_PAGES, MainPage, PAGE_HEADERS, StatusFilter, NAV_ITEMS } from './constants';
import { HomeView, ProcessingView, RecordingView } from './views/DashboardViews';
import { KnowledgeView, ProfileView } from './views/KnowledgeProfileViews';
import { DetailView, RecordsView } from './views/RecordViews';
import { Message, Page, Recording } from './types';
import { MOCK_RECORDINGS } from './mockData';
import { Button, cn, formatDate } from './ui';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [lastMainPage, setLastMainPage] = useState<MainPage>('home');
  const [recordings, setRecordings] = useState<Recording[]>(MOCK_RECORDINGS);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [activeTab, setActiveTab] = useState<DetailTab>('summary');
  const [qaMessages, setQaMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const timerRef = useRef<number | null>(null);
  const processingTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      processingTimeoutsRef.current.forEach(window.clearTimeout);
    };
  }, []);

  useEffect(() => {
    setQaMessages([]);
    setInputValue('');
  }, [currentRecording?.id]);

  const clearRecordingTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearProcessingQueue = () => {
    processingTimeoutsRef.current.forEach(window.clearTimeout);
    processingTimeoutsRef.current = [];
  };

  const startRecording = () => {
    clearRecordingTimer();
    clearProcessingQueue();
    setRecordingTime(0);
    setIsPaused(false);
    setShowConfirmEnd(false);
    setProcessingStep(0);
    setLastMainPage('home');
    setCurrentPage('recording');
    timerRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const togglePause = () => {
    if (isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearRecordingTimer();
    }
    setIsPaused((prev) => !prev);
  };

  const openRecording = (recording: Recording, origin: MainPage) => {
    setCurrentRecording(recording);
    setLastMainPage(origin);
    setActiveTab('summary');
    setCurrentPage('detail');
  };

  const endRecording = () => {
    clearRecordingTimer();
    clearProcessingQueue();
    setShowConfirmEnd(false);
    setCurrentPage('processing');
    setProcessingStep(0);

    [1, 2, 3, 4].forEach((step, index) => {
      const timeout = window.setTimeout(() => {
        setProcessingStep(step);

        if (step === 4) {
          const newRecording: Recording = {
            id: Math.random().toString(36).slice(2, 11),
            title: `${formatDate(Date.now())} 现场纪要`,
            timestamp: Date.now(),
            duration: recordingTime,
            status: 'completed',
            summary:
              '系统已基于本次录音生成会议摘要，重点聚焦关键信息、责任人以及下一步推进动作，适合直接整理成日报或同步邮件。',
            keyPoints: [
              '跨团队对齐了接下来两周的核心排期。',
              '明确了客户反馈需要在本周内整理成可执行方案。',
              '下一轮评审前需要补充数据依据和交付节奏。',
            ],
            conclusions: ['优先保证纪要沉淀速度，再推进知识库归档。'],
            todos: [
              { task: '整理客户反馈清单并同步负责人', owner: '当前用户' },
              { task: '补充下一轮评审所需的支持材料', owner: 'AI Note 工作台' },
            ],
            transcription: [
              { time: '00:12', text: '我们先统一一下这次会议的目标和预期产出。' },
              { time: '01:34', text: '客户最关心的是上线节奏和交付质量，我们需要给出更清晰的时间点。' },
              { time: '03:08', text: '本周先整理风险和待办，下周一前完成第一版对外同步材料。' },
            ],
          };

          setRecordings((prev) => [newRecording, ...prev]);
          setCurrentRecording(newRecording);
          setActiveTab('summary');
          setCurrentPage('detail');
        }
      }, (index + 1) * 1200);

      processingTimeoutsRef.current.push(timeout);
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentRecording) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setQaMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system: `你是一位专业的会议助手。以下是本次会议的转写内容：\n${currentRecording.transcription
            ?.map((item) => `[${item.time}] ${item.text}`)
            .join('\n')}\n\n请根据这些内容回答用户问题，回答要简洁、结论优先，并尽量指出负责人、时间和动作。`,
          messages: [
            ...qaMessages.map((message) => ({
              role: message.role === 'user' ? 'user' : 'assistant',
              content: message.content,
            })),
            { role: 'user', content: userMessage.content },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      setQaMessages((prev) => [
        ...prev,
        {
          id: `${Date.now() + 1}`,
          role: 'ai',
          content: data.content?.[0]?.text || '抱歉，我暂时没有拿到可用的回答内容。',
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      console.error('QA Error:', error);
      setQaMessages((prev) => [
        ...prev,
        {
          id: `${Date.now() + 1}`,
          role: 'ai',
          content: 'AI 问答暂时不可用，请先检查本地接口和密钥配置。',
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const totalMinutes = Math.round(recordings.reduce((sum, item) => sum + item.duration, 0) / 60);
  const completedCount = recordings.filter((item) => item.status === 'completed').length;
  const activeMainPage = MAIN_PAGES.includes(currentPage as MainPage) ? (currentPage as MainPage) : lastMainPage;
  const filteredRecordings = recordings.filter((recording) => {
    const matchesSearch =
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && recording.status === 'completed') ||
      (statusFilter === 'processing' && recording.status === 'processing');

    return Boolean(matchesSearch) && matchesStatus;
  });

  const lastPageLabel = lastMainPage === 'home' ? 'Meeting Detail' : 'Record Detail';

  return (
    <div className="min-h-screen px-3 py-3 text-[var(--ink)] md:px-4 md:py-4 xl:px-6 xl:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1680px] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="surface flex h-full flex-col p-4">
            <div className="rounded-[28px] bg-[linear-gradient(135deg,#131925_0%,#324663_100%)] px-5 py-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.22)]">
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">AI Note</div>
              <div className="mt-4 display-serif text-3xl leading-none">Web Studio</div>
              <p className="mt-3 text-sm leading-6 text-white/72">重新设计后的原生网页端会议工作台。</p>
              <Button className="mt-5 w-full justify-center" size="lg" onClick={startRecording}>
                <Mic size={18} />
                开始记录
              </Button>
            </div>

            <nav className="mt-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentPage(item.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-left transition',
                    activeMainPage === item.id
                      ? 'bg-[var(--ink)] text-white shadow-[0_18px_38px_rgba(17,24,39,0.16)]'
                      : 'text-[var(--ink-soft)] hover:bg-black/5',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-2xl',
                      activeMainPage === item.id ? 'bg-white/10' : 'bg-[rgba(17,24,39,0.05)]',
                    )}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className={cn('text-xs', activeMainPage === item.id ? 'text-white/60' : 'text-[var(--ink-soft)]')}>
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-auto rounded-[26px] border border-[rgba(17,24,39,0.08)] bg-[rgba(17,24,39,0.03)] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">Workspace Stats</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[20px] bg-white/90 px-4 py-3">
                  <div className="text-sm font-semibold text-[var(--ink)]">{recordings.length} 条记录</div>
                  <div className="mt-1 text-sm text-[var(--ink-muted)]">适合桌面端快速浏览。</div>
                </div>
                <div className="rounded-[20px] bg-white/90 px-4 py-3">
                  <div className="text-sm font-semibold text-[var(--ink)]">{totalMinutes} 分钟内容</div>
                  <div className="mt-1 text-sm text-[var(--ink-muted)]">更适合沉浸式阅读摘要。</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="surface flex min-h-[calc(100vh-24px)] min-w-0 flex-col overflow-hidden">
          <header className="border-b border-black/6 px-5 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-soft)]">Browser Ready Layout</div>
                <div className="mt-2 text-2xl font-semibold text-[var(--ink)]">{PAGE_HEADERS[currentPage].title}</div>
                <div className="mt-1 text-sm text-[var(--ink-muted)]">{PAGE_HEADERS[currentPage].subtitle}</div>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <div className="rounded-full bg-[rgba(17,24,39,0.05)] px-3 py-2 text-sm text-[var(--ink-soft)]">
                  {formatDate(Date.now(), true)}
                </div>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-4 pb-24 md:px-6 md:py-6 md:pb-28 lg:pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="min-w-0"
              >
                {currentPage === 'home' && (
                  <HomeView
                    recordings={recordings}
                    totalMinutes={totalMinutes}
                    completedCount={completedCount}
                    onStartRecording={startRecording}
                    onShowRecords={() => setCurrentPage('records')}
                    onOpenKnowledge={() => setCurrentPage('knowledge')}
                    onOpenRecording={(recording) => openRecording(recording, 'home')}
                  />
                )}

                {currentPage === 'recording' && (
                  <RecordingView
                    isPaused={isPaused}
                    recordingTime={recordingTime}
                    showConfirmEnd={showConfirmEnd}
                    onBack={() => setShowConfirmEnd(true)}
                    onTogglePause={togglePause}
                    onOpenEndConfirm={() => setShowConfirmEnd(true)}
                    onCloseEndConfirm={() => setShowConfirmEnd(false)}
                    onEndRecording={endRecording}
                  />
                )}

                {currentPage === 'processing' && (
                  <ProcessingView
                    processingStep={processingStep}
                    onGoHome={() => setCurrentPage('home')}
                    onGoRecords={() => setCurrentPage('records')}
                  />
                )}

                {currentPage === 'records' && (
                  <RecordsView
                    recordings={recordings}
                    completedCount={completedCount}
                    statusFilter={statusFilter}
                    searchQuery={searchQuery}
                    filteredRecordings={filteredRecordings}
                    onChangeSearch={setSearchQuery}
                    onChangeFilter={setStatusFilter}
                    onOpenRecording={(recording) => openRecording(recording, 'records')}
                  />
                )}

                {currentPage === 'detail' && (
                  <DetailView
                    currentRecording={currentRecording}
                    lastMainPageLabel={lastPageLabel}
                    activeTab={activeTab}
                    qaMessages={qaMessages}
                    inputValue={inputValue}
                    onBack={() => setCurrentPage(lastMainPage)}
                    onChangeTab={setActiveTab}
                    onChangeInput={setInputValue}
                    onSendMessage={handleSendMessage}
                  />
                )}

                {currentPage === 'knowledge' && <KnowledgeView />}
                {currentPage === 'profile' && <ProfileView recordingsCount={recordings.length} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {MAIN_PAGES.includes(currentPage as MainPage) && (
        <nav className="fixed bottom-4 left-3 right-3 z-40 lg:hidden">
          <div className="surface flex items-center justify-around px-2 py-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentPage(item.id)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-[18px] px-3 py-2 text-xs font-semibold transition',
                  currentPage === item.id ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-soft)]',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
