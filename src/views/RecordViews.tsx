import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Download,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  TrendingUp,
} from 'lucide-react';
import { Button, EmptyState, SectionEyebrow, StatusPill, Surface, cn, formatDate, formatTime } from '../ui';
import { QA_SUGGESTIONS, StatusFilter, DetailTab } from '../constants';
import { Message, Recording } from '../types';

export function RecordsView({
  recordings,
  completedCount,
  statusFilter,
  searchQuery,
  filteredRecordings,
  onChangeSearch,
  onChangeFilter,
  onOpenRecording,
}: {
  recordings: Recording[];
  completedCount: number;
  statusFilter: StatusFilter;
  searchQuery: string;
  filteredRecordings: Recording[];
  onChangeSearch: (value: string) => void;
  onChangeFilter: (value: StatusFilter) => void;
  onOpenRecording: (recording: Recording) => void;
}) {
  return (
    <div className="space-y-6">
      <Surface className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow>Archive</SectionEyebrow>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--ink)]">会议记录总览</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">
              更适合网页端的列表密度和信息布局，方便快速筛选和打开详情。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-[rgba(17,24,39,0.08)] bg-[rgba(17,24,39,0.03)] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-soft)]">共计记录</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">{recordings.length}</p>
            </div>
            <div className="rounded-[22px] border border-[rgba(17,24,39,0.08)] bg-[rgba(17,24,39,0.03)] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-soft)]">已完成摘要</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onChangeSearch(event.target.value)}
              placeholder="搜索标题或摘要关键词"
              className="w-full rounded-full border border-[rgba(17,24,39,0.08)] bg-white px-12 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)]"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: '全部' },
              { id: 'completed', label: '已完成' },
              { id: 'processing', label: '处理中' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeFilter(item.id as StatusFilter)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  statusFilter === item.id
                    ? 'bg-[var(--ink)] text-white'
                    : 'bg-[rgba(17,24,39,0.05)] text-[var(--ink-soft)] hover:bg-[rgba(17,24,39,0.08)]',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </Surface>

      {filteredRecordings.length === 0 ? (
        <EmptyState title="没有匹配的记录" description="试试修改搜索词或切换状态筛选，看看其他会议纪要。" />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredRecordings.map((recording) => (
            <button
              key={recording.id}
              type="button"
              onClick={() => onOpenRecording(recording)}
              className="surface text-left transition duration-200 hover:-translate-y-1"
            >
              <div className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-4">
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

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-[rgba(17,24,39,0.04)] p-3">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-soft)]">重点</div>
                    <div className="mt-2 text-base font-semibold text-[var(--ink)]">
                      {recording.keyPoints?.length || 0}
                    </div>
                  </div>
                  <div className="rounded-[20px] bg-[rgba(17,24,39,0.04)] p-3">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-soft)]">待办</div>
                    <div className="mt-2 text-base font-semibold text-[var(--ink)]">
                      {recording.todos?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DetailView({
  currentRecording,
  lastMainPageLabel,
  activeTab,
  qaMessages,
  inputValue,
  onBack,
  onChangeTab,
  onChangeInput,
  onSendMessage,
}: {
  currentRecording: Recording | null;
  lastMainPageLabel: string;
  activeTab: DetailTab;
  qaMessages: Message[];
  inputValue: string;
  onBack: () => void;
  onChangeTab: (tab: DetailTab) => void;
  onChangeInput: (value: string) => void;
  onSendMessage: () => void;
}) {
  if (!currentRecording) {
    return (
      <EmptyState
        title="当前没有打开的记录"
        description="从记录列表选择一条会议纪要，或者先开始一次新的录音。"
      />
    );
  }

  return (
    <div className="space-y-6">
      <Surface className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-[var(--ink-soft)] transition hover:bg-black/8"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <SectionEyebrow>{lastMainPageLabel}</SectionEyebrow>
              <h1 className="mt-2 text-3xl font-semibold text-[var(--ink)]">{currentRecording.title}</h1>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">
                {formatDate(currentRecording.timestamp, true)} · 总时长 {formatTime(currentRecording.duration)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusPill status={currentRecording.status} />
            <Button variant="outline">
              <RefreshCw size={16} />
              重新生成
            </Button>
            <Button variant="solid">
              <Download size={16} />
              导出纪要
            </Button>
          </div>
        </div>
      </Surface>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Surface className="p-2">
            <div className="grid gap-2 sm:grid-cols-4">
              {([
                ['summary', '摘要'],
                ['full', '全文'],
                ['qa', '问答'],
                ['more', '更多'],
              ] as const).map(([tabId, label]) => (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => onChangeTab(tabId)}
                  className={cn(
                    'rounded-[22px] px-4 py-3 text-sm font-semibold transition',
                    activeTab === tabId
                      ? 'bg-[var(--ink)] text-white shadow-[0_16px_36px_rgba(17,24,39,0.18)]'
                      : 'text-[var(--ink-soft)] hover:bg-black/5',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </Surface>

          {activeTab === 'summary' && (
            <div className="space-y-4">
              <Surface className="p-6">
                <SectionEyebrow>AI Summary</SectionEyebrow>
                <p className="mt-4 text-sm leading-8 text-[var(--ink-muted)] md:text-base">
                  {currentRecording.summary || '暂无摘要。'}
                </p>
              </Surface>

              <div className="grid gap-4 xl:grid-cols-2">
                <Surface className="p-6">
                  <div className="flex items-center gap-2 text-[var(--ink)]">
                    <MessageSquare size={18} />
                    <h2 className="text-lg font-semibold">核心讨论点</h2>
                  </div>
                  <div className="mt-4 space-y-3">
                    {currentRecording.keyPoints?.map((point, index) => (
                      <div key={point} className="rounded-[22px] border border-[rgba(17,24,39,0.08)] bg-[rgba(17,24,39,0.03)] p-4">
                        <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                          Point {String(index + 1).padStart(2, '0')}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">{point}</p>
                      </div>
                    ))}
                  </div>
                </Surface>

                <Surface className="p-6">
                  <div className="flex items-center gap-2 text-[var(--ink)]">
                    <CheckCircle2 size={18} />
                    <h2 className="text-lg font-semibold">结论与待办</h2>
                  </div>
                  <div className="mt-4 rounded-[22px] bg-[rgba(17,24,39,0.04)] p-4">
                    <p className="text-sm font-semibold text-[var(--ink)]">会议结论</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">
                      {currentRecording.conclusions?.join('；') || '暂无结论。'}
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {currentRecording.todos?.map((todo) => (
                      <div
                        key={`${todo.task}-${todo.owner}`}
                        className="flex items-center justify-between rounded-[22px] border border-[rgba(17,24,39,0.08)] px-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--ink)]">{todo.task}</p>
                          <p className="mt-1 text-sm text-[var(--ink-soft)]">{todo.owner}</p>
                        </div>
                        <ArrowRight size={16} className="text-[var(--ink-soft)]" />
                      </div>
                    ))}
                  </div>
                </Surface>
              </div>
            </div>
          )}

          {activeTab === 'full' && (
            <Surface className="p-6">
              <SectionEyebrow>Transcript</SectionEyebrow>
              <div className="mt-6 space-y-5">
                {currentRecording.transcription?.map((item) => (
                  <div key={`${item.time}-${item.text}`} className="grid gap-3 md:grid-cols-[92px_minmax(0,1fr)]">
                    <div className="font-mono text-sm text-[var(--ink-soft)]">{item.time}</div>
                    <p className="text-sm leading-8 text-[var(--ink-muted)] md:text-base">{item.text}</p>
                  </div>
                ))}
              </div>
            </Surface>
          )}

          {activeTab === 'qa' && (
            <Surface className="p-6">
              <SectionEyebrow>Ask This Meeting</SectionEyebrow>
              {qaMessages.length === 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-[var(--ink-muted)]">可以先试试这些问题：</p>
                  <div className="grid gap-3">
                    {QA_SUGGESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => onChangeInput(question)}
                        className="rounded-[22px] border border-[rgba(17,24,39,0.08)] p-4 text-left text-sm text-[var(--ink-muted)] transition hover:bg-black/3"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4">
                {qaMessages.map((message) => (
                  <div key={message.id} className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-7',
                        message.role === 'user'
                          ? 'bg-[var(--ink)] text-white'
                          : 'bg-[rgba(17,24,39,0.05)] text-[var(--ink-muted)]',
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => onChangeInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      onSendMessage();
                    }
                  }}
                  placeholder="输入你想追问的问题"
                  className="min-w-0 flex-1 rounded-full border border-[rgba(17,24,39,0.08)] bg-white px-5 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)]"
                />
                <Button className="shrink-0" onClick={onSendMessage}>
                  <Send size={16} />
                  发送
                </Button>
              </div>
            </Surface>
          )}

          {activeTab === 'more' && (
            <Surface className="p-6">
              <SectionEyebrow>More Actions</SectionEyebrow>
              <div className="mt-4 space-y-3">
                {[
                  '重命名记录',
                  '加入知识库专题',
                  '查看原始音频',
                  '重新转写',
                  '再次生成摘要',
                  '删除本条记录',
                ].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between rounded-[22px] border px-4 py-4 text-left text-sm font-semibold transition',
                      index === 5
                        ? 'border-red-100 bg-red-50/70 text-red-600 hover:bg-red-50'
                        : 'border-[rgba(17,24,39,0.08)] text-[var(--ink)] hover:bg-black/3',
                    )}
                  >
                    {item}
                    <MoreHorizontal size={16} />
                  </button>
                ))}
              </div>
            </Surface>
          )}
        </div>

        <div className="space-y-4">
          <Surface className="p-6">
            <SectionEyebrow>Snapshot</SectionEyebrow>
            <div className="mt-4 space-y-4">
              <div className="rounded-[24px] bg-[rgba(17,24,39,0.04)] p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">Summary Health</div>
                <div className="mt-3 text-2xl font-semibold text-[var(--ink)]">
                  {currentRecording.keyPoints?.length || 0} 个重点
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
                  摘要、重点、结论和待办都已放在右侧可快速扫描的区域。
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(17,24,39,0.08)] p-4">
                <div className="flex items-center justify-between text-sm text-[var(--ink-soft)]">
                  <span>记录时间</span>
                  <Clock size={16} />
                </div>
                <p className="mt-3 text-base font-semibold text-[var(--ink)]">{formatDate(currentRecording.timestamp, true)}</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(17,24,39,0.08)] p-4">
                <div className="flex items-center justify-between text-sm text-[var(--ink-soft)]">
                  <span>录音时长</span>
                  <TrendingUp size={16} />
                </div>
                <p className="mt-3 text-base font-semibold text-[var(--ink)]">{formatTime(currentRecording.duration)}</p>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
