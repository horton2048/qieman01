import React from 'react';
import {
  ArrowRight,
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronLeft,
  History,
  Mic,
  Pause,
  Play,
  Sparkles,
  Square,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button, EmptyState, MetricCard, SectionEyebrow, StatusPill, Surface, cn, formatDate, formatTime } from '../ui';
import { PROCESSING_STEPS } from '../constants';
import { Recording } from '../types';

function HomeBrandLockup() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="home-brand-mark"
        >
          <div className="home-brand-ring home-brand-ring--outer" />
          <div className="home-brand-ring home-brand-ring--inner" />
          <div className="home-brand-core">
            <span className="home-brand-bar h-4" />
            <span className="home-brand-bar h-8" />
            <span className="home-brand-bar h-12" />
            <span className="home-brand-bar h-8" />
            <span className="home-brand-bar h-4" />
          </div>
          <div className="home-brand-dot" />
        </motion.div>

        <div className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/58">
            AI NOTE
          </div>
          <div className="display-serif text-5xl leading-none text-white md:text-6xl xl:text-7xl">
            AI Note
          </div>
          <p className="text-base font-medium tracking-[0.12em] text-white/74 md:text-lg">
            你的全能会议助手
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeView({
  recordings,
  totalMinutes,
  completedCount,
  onStartRecording,
  onShowRecords,
  onOpenKnowledge,
  onOpenRecording,
}: {
  recordings: Recording[];
  totalMinutes: number;
  completedCount: number;
  onStartRecording: () => void;
  onShowRecords: () => void;
  onOpenKnowledge: () => void;
  onOpenRecording: (recording: Recording) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_340px]">
        <Surface className="hero-shell overflow-hidden p-6 md:p-8 xl:p-10">
          <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[rgba(92,201,184,0.18)] blur-3xl" />
          <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.85fr)]">
            <div className="space-y-6">
              <HomeBrandLockup />
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={onStartRecording}>
                  <Mic size={18} />
                  立即开始记录
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                  onClick={onShowRecords}
                >
                  <History size={18} />
                  浏览历史纪要
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard label="累计纪要" value={`${recordings.length}`} hint="从录音到可分享摘要，一步完成整理。" />
                <MetricCard label="总时长" value={`${totalMinutes}m`} hint="适配访谈、例会、复盘与沟通记录。" />
                <MetricCard label="完成率" value={`${completedCount}/${recordings.length}`} hint="处理状态一眼可见，方便追踪。" />
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/12 bg-black/10 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">网页端工作流</p>
                  <p className="mt-1 text-sm text-white/62">从采集到沉淀的完整路径</p>
                </div>
                <AudioWaveform size={22} className="text-white/70" />
              </div>
              <div className="space-y-3">
                {[
                  ['01', '实时录音', '网页直接进入采集状态，保留录音时长与波形反馈。'],
                  ['02', '转写与总结', '后台异步处理，生成摘要、重点、结论和待办。'],
                  ['03', '知识归档', '把会议内容沉淀成可检索的专题集合。'],
                ].map(([step, title, description]) => (
                  <div key={step} className="rounded-[24px] border border-white/10 bg-white/7 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">{step}</span>
                      <ArrowRight size={16} className="text-white/40" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/66">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Surface>

        <Surface className="p-6">
          <SectionEyebrow>今日节奏</SectionEyebrow>
          <div className="mt-4 space-y-4">
            <div className="rounded-[24px] bg-[rgba(17,24,39,0.04)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">推荐操作</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
                先记录今天的新会议，再把最近三场客户沟通同步进知识库，方便后续统一问答。
              </p>
            </div>
            <div className="space-y-3">
              {[
                ['实时录音', '当前环境正常，可直接开始采集。'],
                ['摘要导出', '默认输出精简纪要，适配邮件与日报。'],
                ['知识问答', '支持跨记录问答，但需要先完成归档。'],
              ].map(([title, description]) => (
                <div key={title} className="flex items-start gap-3 rounded-[22px] border border-[rgba(17,24,39,0.08)] p-4">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Surface>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionEyebrow>Recent Signals</SectionEyebrow>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">最近记录</h2>
            </div>
            <Button variant="ghost" onClick={onShowRecords}>
              查看全部
              <ArrowRight size={16} />
            </Button>
          </div>

          {recordings.length === 0 ? (
            <EmptyState title="还没有会议记录" description="点击左侧或首页的开始记录按钮，就能创建第一条会议纪要。" />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {recordings.slice(0, 4).map((recording) => (
                <button
                  key={recording.id}
                  type="button"
                  onClick={() => onOpenRecording(recording)}
                  className="surface text-left transition duration-200 hover:-translate-y-1"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-[var(--ink)]">{recording.title}</p>
                        <p className="mt-1 text-sm text-[var(--ink-muted)]">
                          {formatDate(recording.timestamp, true)} · {formatTime(recording.duration)}
                        </p>
                      </div>
                      <StatusPill status={recording.status} />
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm leading-7 text-[var(--ink-muted)]">
                      {recording.summary || '暂无摘要内容。'}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-black/6 pt-4 text-sm text-[var(--ink-soft)]">
                      <span>{recording.keyPoints?.length || 0} 个重点</span>
                      <span>{recording.todos?.length || 0} 个待办</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Surface className="p-6">
          <SectionEyebrow>Quick Access</SectionEyebrow>
          <div className="mt-4 space-y-3">
            {[
              {
                title: '生成会议摘要',
                description: '录音完成后自动拆出摘要、结论、待办。',
                icon: <Sparkles size={18} />,
                action: onShowRecords,
              },
              {
                title: '打开知识库',
                description: '把不同会议沉淀到统一的专题结构里。',
                icon: <BookOpen size={18} />,
                action: onOpenKnowledge,
              },
              {
                title: '进入 AI 问答',
                description: '围绕单条或多条记录追问关键细节。',
                icon: <Bot size={18} />,
                action: onOpenKnowledge,
              },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.action}
                className="w-full rounded-[22px] border border-[rgba(17,24,39,0.08)] bg-[rgba(255,255,255,0.72)] p-4 text-left transition duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[rgba(17,24,39,0.06)] p-3 text-[var(--ink)]">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                      <ArrowRight size={16} className="text-[var(--ink-soft)]" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{item.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Surface>
      </section>
    </div>
  );
}

export function RecordingView({
  isPaused,
  recordingTime,
  showConfirmEnd,
  onBack,
  onTogglePause,
  onOpenEndConfirm,
  onCloseEndConfirm,
  onEndRecording,
}: {
  isPaused: boolean;
  recordingTime: number;
  showConfirmEnd: boolean;
  onBack: () => void;
  onTogglePause: () => void;
  onOpenEndConfirm: () => void;
  onCloseEndConfirm: () => void;
  onEndRecording: () => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Surface className="overflow-hidden p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:bg-black/10"
          >
            <ChevronLeft size={16} />
            返回
          </button>
          <StatusPill status={isPaused ? 'paused' : 'recording'} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div className="space-y-6">
            <SectionEyebrow>Live Capture</SectionEyebrow>
            <div>
              <h1 className="display-serif text-4xl leading-[1.05] text-[var(--ink)] md:text-5xl">
                正在采集会议现场声音。
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)] md:text-base">
                这套新界面把录音状态放到浏览器中心区域，方便在网页端长时间盯着看，也更适合同步查看纪要生成提示。
              </p>
            </div>
            <div className="rounded-[30px] bg-[linear-gradient(135deg,#181d28_0%,#293548_100%)] p-6 text-white shadow-[0_28px_90px_rgba(17,24,39,0.24)]">
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">Elapsed Time</div>
              <div className="mt-4 font-mono text-5xl font-semibold tracking-[-0.08em] md:text-7xl">
                {formatTime(recordingTime)}
              </div>
              <div className="mt-8 flex h-28 items-end gap-1 md:h-36">
                {Array.from({ length: 36 }).map((_, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      height: isPaused ? 10 : [10, 22 + ((index * 13) % 90), 18 + ((index * 7) % 56), 12],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.03,
                    }}
                    className="flex-1 rounded-full bg-[linear-gradient(180deg,#fff1d8_0%,#ff8d57_100%)]"
                  />
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-white/72">
                <span className={cn('h-2.5 w-2.5 rounded-full', isPaused ? 'bg-amber-300' : 'bg-rose-400 animate-pulse')} />
                {isPaused ? '录音已暂停，点击继续恢复采集。' : '采集中，系统正在准备后续的转写和摘要。'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Surface className="border-none bg-[rgba(17,24,39,0.04)] p-5 shadow-none">
              <SectionEyebrow>当前动作</SectionEyebrow>
              <div className="mt-4 space-y-3">
                {[
                  '浏览器端持续采集声音，不影响后续网页阅读。',
                  '结束录音后自动进入处理态，无需跳转新页面。',
                  '处理完成后直接打开详情页，适合继续校对和导出。',
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-7 text-[var(--ink-muted)]">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Surface>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Button variant="soft" size="lg" className="w-full justify-center" onClick={onTogglePause}>
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
                {isPaused ? '继续录音' : '暂停录音'}
              </Button>
              <Button variant="solid" size="lg" className="w-full justify-center" onClick={onOpenEndConfirm}>
                <Square size={18} />
                结束并生成纪要
              </Button>
            </div>
          </div>
        </div>
      </Surface>

      <Surface className="p-6">
        <SectionEyebrow>网页端提示</SectionEyebrow>
        <div className="mt-4 space-y-4">
          <div className="rounded-[24px] bg-[rgba(17,24,39,0.04)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">视觉重心</p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
              大时间码、宽波形和右侧操作区，都是为浏览器大屏重新组织的。
            </p>
          </div>
          <div className="rounded-[24px] border border-[rgba(17,24,39,0.08)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">推荐使用方式</p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
              录音时把页面停留在当前界面，方便同时观察状态、会后动作和处理预期。
            </p>
          </div>
        </div>
      </Surface>

      <AnimatePresence>
        {showConfirmEnd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(17,24,39,0.36)] p-4 backdrop-blur-sm sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="surface w-full max-w-md p-6"
            >
              <SectionEyebrow>结束录音</SectionEyebrow>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">确认生成本次纪要？</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">
                结束后会自动完成转写、摘要生成和待办拆分，然后跳转到详情页。
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="solid" className="flex-1" onClick={onEndRecording}>
                  结束并处理
                </Button>
                <Button variant="soft" className="flex-1" onClick={onCloseEndConfirm}>
                  继续录音
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProcessingView({
  processingStep,
  onGoHome,
  onGoRecords,
}: {
  processingStep: number;
  onGoHome: () => void;
  onGoRecords: () => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Surface className="p-6 md:p-8">
        <SectionEyebrow>Processing</SectionEyebrow>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,1.05fr)] lg:items-center">
          <div className="rounded-[32px] bg-[linear-gradient(135deg,#faf5ee_0%,#f0e4d3_100%)] p-6">
            <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(17,24,39,0.08)" strokeWidth="10" />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="url(#processingGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="427"
                  animate={{ strokeDashoffset: 427 - 427 * (processingStep / 4) }}
                />
                <defs>
                  <linearGradient id="processingGradient" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#e8743d" />
                    <stop offset="100%" stopColor="#4aa89a" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono text-5xl font-semibold tracking-[-0.08em] text-[var(--ink)]">
                  {Math.round((processingStep / 4) * 100)}%
                </div>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">处理中</p>
              </div>
            </div>
          </div>

          <div>
            <h1 className="display-serif text-4xl leading-[1.05] text-[var(--ink)] md:text-5xl">
              正在把录音转换成可交付的会议内容。
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)] md:text-base">
              这一步会保留浏览器端的进度反馈，让用户明确看到每个阶段正在发生什么，减少等待焦虑。
            </p>
            <div className="mt-8 space-y-3">
              {PROCESSING_STEPS.map((stepLabel, index) => {
                const stepNumber = index + 1;
                const completed = processingStep > stepNumber;
                const active = processingStep === stepNumber;

                return (
                  <div
                    key={stepLabel}
                    className="flex items-center justify-between rounded-[22px] border border-[rgba(17,24,39,0.08)] bg-white/70 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{stepLabel}</p>
                      <p className="mt-1 text-sm text-[var(--ink-soft)]">阶段 {stepNumber}</p>
                    </div>
                    {completed ? (
                      <div className="text-emerald-500">完成</div>
                    ) : active ? (
                      <div className="text-[var(--brand)]">进行中</div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-[rgba(17,24,39,0.12)]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Surface>

      <Surface className="p-6">
        <SectionEyebrow>处理说明</SectionEyebrow>
        <div className="mt-4 space-y-4">
          <div className="rounded-[24px] bg-[rgba(17,24,39,0.04)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">平均耗时</p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">通常在 1 到 3 分钟之间，取决于录音长度和接口状态。</p>
          </div>
          <div className="flex gap-3">
            <Button variant="soft" className="flex-1" onClick={onGoHome}>
              返回首页
            </Button>
            <Button variant="outline" className="flex-1" onClick={onGoRecords}>
              查看列表
            </Button>
          </div>
        </div>
      </Surface>
    </div>
  );
}
