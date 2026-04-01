import React from 'react';
import { ArrowRight, Bot, Plus, Send, User } from 'lucide-react';
import { KNOWLEDGE_COLLECTIONS, PROFILE_ITEMS } from '../constants';
import { Button, SectionEyebrow, Surface } from '../ui';

export function KnowledgeView() {
  return (
    <div className="space-y-6">
      <Surface className="p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px]">
          <div>
            <SectionEyebrow>Knowledge Hub</SectionEyebrow>
            <h1 className="mt-2 display-serif text-4xl leading-[1.04] text-[var(--ink)] md:text-5xl">
              让会议记录真正变成可复用的知识资产。
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)] md:text-base">
              新网页端把知识库设计成更像工作台而不是单页表单，既能浏览专题，又能直接发起跨记录问答。
            </p>
          </div>
          <Surface className="border-none bg-[rgba(17,24,39,0.04)] p-5 shadow-none">
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <Bot size={18} />
              <p className="text-sm font-semibold">知识问答建议</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">
              先把会议归到专题，再围绕客户诉求、项目风险或版本决策做跨记录追问，效果会更稳定。
            </p>
          </Surface>
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {KNOWLEDGE_COLLECTIONS.map((collection) => (
              <Surface key={collection.name} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-[var(--ink)]">{collection.name}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">{collection.description}</p>
                  </div>
                  <div className="rounded-full bg-[rgba(17,24,39,0.05)] px-3 py-1 text-sm font-semibold text-[var(--ink)]">
                    {collection.count}
                  </div>
                </div>
              </Surface>
            ))}
          </div>

          <Surface className="p-6">
            <SectionEyebrow>Knowledge Query</SectionEyebrow>
            <div className="mt-4 space-y-4">
              <textarea
                placeholder="例如：过去三次客户沟通里，最常被提到的问题是什么？"
                className="min-h-[180px] w-full resize-none rounded-[28px] border border-[rgba(17,24,39,0.08)] bg-white px-5 py-4 text-sm leading-7 text-[var(--ink)] outline-none transition focus:border-[var(--brand)]"
              />
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Send size={16} />
                  发起问答
                </Button>
                <Button variant="outline">
                  <Plus size={16} />
                  导入新纪要
                </Button>
              </div>
            </div>
          </Surface>
        </div>

        <Surface className="p-6">
          <SectionEyebrow>专题建议</SectionEyebrow>
          <div className="mt-4 space-y-3">
            {[
              '把每次销售沟通归到同一专题，便于追踪需求变化。',
              '对产品评审类会议启用统一的摘要格式，后续更容易横向比较。',
              '对外部客户会议建议单独维护行动项清单，减少遗漏。',
            ].map((tip) => (
              <div key={tip} className="rounded-[22px] border border-[rgba(17,24,39,0.08)] p-4 text-sm leading-7 text-[var(--ink-muted)]">
                {tip}
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

export function ProfileView({ recordingsCount }: { recordingsCount: number }) {
  return (
    <div className="space-y-6">
      <Surface className="p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#1a2233_0%,#324868_100%)] text-white shadow-[0_18px_48px_rgba(17,24,39,0.22)]">
              <User size={34} />
            </div>
            <div>
              <SectionEyebrow>User Profile</SectionEyebrow>
              <h1 className="mt-2 text-3xl font-semibold text-[var(--ink)]">网页工作台偏好设置</h1>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">
                这里保留账号、生成规则和导出偏好，结构也改成更适合桌面浏览的分组方式。
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[24px] bg-[rgba(17,24,39,0.04)] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">剩余时长</div>
              <div className="mt-3 text-2xl font-semibold text-[var(--ink)]">120 分钟</div>
            </div>
            <div className="rounded-[24px] bg-[rgba(17,24,39,0.04)] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">本月纪要</div>
              <div className="mt-3 text-2xl font-semibold text-[var(--ink)]">{recordingsCount} 条</div>
            </div>
          </div>
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Surface className="p-6">
          <SectionEyebrow>Preferences</SectionEyebrow>
          <div className="mt-4 space-y-3">
            {PROFILE_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center justify-between rounded-[24px] border border-[rgba(17,24,39,0.08)] p-4 text-left transition hover:bg-black/3"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-[rgba(17,24,39,0.05)] p-3 text-[var(--ink)]">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
                    <p className="mt-1 text-sm text-[var(--ink-muted)]">{item.hint}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-[var(--ink-soft)]" />
              </button>
            ))}
          </div>
        </Surface>

        <Surface className="p-6">
          <SectionEyebrow>Workspace Note</SectionEyebrow>
          <div className="mt-4 rounded-[24px] bg-[linear-gradient(135deg,#1b2434_0%,#2f4f56_100%)] p-5 text-white">
            <p className="text-sm font-semibold">这次改版的方向</p>
            <p className="mt-3 text-sm leading-7 text-white/72">
              用桌面工作台替代原来的手机单列布局，保留业务流程，同时让浏览器展示更自然、更高效。
            </p>
          </div>
        </Surface>
      </div>
    </div>
  );
}
