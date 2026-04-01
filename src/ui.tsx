import React from 'react';
import { FileText } from 'lucide-react';
import { RecordingStatus } from './types';

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${h > 0 ? `${String(h).padStart(2, '0')}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const formatDate = (timestamp: number, withTime = false) =>
  new Intl.DateTimeFormat(
    'zh-CN',
    withTime
      ? {
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      : {
          month: 'numeric',
          day: 'numeric',
        },
  ).format(timestamp);

const getStatusMeta = (status: RecordingStatus) => {
  switch (status) {
    case 'completed':
      return {
        label: '已完成',
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200/80',
      };
    case 'processing':
      return {
        label: '处理中',
        className: 'bg-amber-100 text-amber-700 border-amber-200/80',
      };
    case 'recording':
      return {
        label: '录音中',
        className: 'bg-rose-100 text-rose-700 border-rose-200/80',
      };
    case 'paused':
      return {
        label: '已暂停',
        className: 'bg-neutral-200 text-neutral-700 border-neutral-300/80',
      };
    case 'failed':
      return {
        label: '失败',
        className: 'bg-red-100 text-red-700 border-red-200/80',
      };
    default:
      return {
        label: '未知',
        className: 'bg-neutral-200 text-neutral-700 border-neutral-300/80',
      };
  }
};

export const Button = ({
  children,
  className,
  variant = 'solid',
  size = 'md',
  type,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'soft' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const variants = {
    solid:
      'bg-[var(--brand)] text-white shadow-[0_18px_40px_rgba(211,92,49,0.28)] hover:-translate-y-0.5 hover:bg-[var(--brand-strong)]',
    soft:
      'bg-[rgba(17,24,39,0.06)] text-[var(--ink)] hover:bg-[rgba(17,24,39,0.1)]',
    ghost:
      'bg-transparent text-[var(--ink-muted)] hover:bg-black/5 hover:text-[var(--ink)]',
    outline:
      'border border-[rgba(17,24,39,0.12)] bg-white/70 text-[var(--ink)] hover:bg-white',
    danger:
      'bg-red-500 text-white hover:bg-red-600 shadow-[0_18px_40px_rgba(220,38,38,0.28)]',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-4.5 py-3 text-sm',
    lg: 'px-5 py-3.5 text-base',
  };

  return (
    <button
      type={type ?? 'button'}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Surface: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('surface', className)} {...props}>
    {children}
  </div>
);

export const StatusPill = ({ status }: { status: RecordingStatus }) => {
  const meta = getStatusMeta(status);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
        meta.className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
};

export const MetricCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) => (
  <div className="rounded-[24px] border border-white/15 bg-white/8 p-4 backdrop-blur-sm">
    <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">{label}</p>
    <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    <p className="mt-2 text-sm leading-6 text-white/65">{hint}</p>
  </div>
);

export const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--ink-soft)]">
    {children}
  </div>
);

export const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Surface className="p-8 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(17,24,39,0.06)] text-[var(--ink-soft)]">
      <FileText size={24} />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{description}</p>
  </Surface>
);
