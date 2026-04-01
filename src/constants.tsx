import React from 'react';
import {
  AlertCircle,
  BookOpen,
  Download,
  History,
  Mic,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import { Page } from './types';

export type MainPage = 'home' | 'records' | 'knowledge' | 'profile';
export type DetailTab = 'summary' | 'full' | 'qa' | 'more';
export type StatusFilter = 'all' | 'completed' | 'processing';

export const MAIN_PAGES: MainPage[] = ['home', 'records', 'knowledge', 'profile'];

export const NAV_ITEMS: Array<{
  id: MainPage;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  { id: 'home', label: '总览', description: '首页与实时入口', icon: <Sparkles size={18} /> },
  { id: 'records', label: '记录', description: '会议与访谈档案', icon: <History size={18} /> },
  { id: 'knowledge', label: '知识库', description: '跨记录归档与问答', icon: <BookOpen size={18} /> },
  { id: 'profile', label: '设置', description: '账号、偏好与帮助', icon: <User size={18} /> },
];

export const PROCESSING_STEPS = [
  '本地音频已保存',
  '会议素材上传中',
  '语音转写进行中',
  'AI 摘要与待办生成',
];

export const QA_SUGGESTIONS = [
  '这次会议的最终结论是什么？',
  '有哪些待办需要本周内推进？',
  '谁负责下一轮客户沟通？',
];

export const KNOWLEDGE_COLLECTIONS = [
  { name: '销售沟通', count: 12, description: '客户拜访、报价讨论、跟单记录' },
  { name: '产品评审', count: 9, description: '原型讨论、版本取舍、需求对齐' },
  { name: '项目例会', count: 16, description: '进度同步、风险复盘、跨团队协作' },
];

export const PROFILE_ITEMS = [
  { label: '录音偏好', hint: '采样、降噪与默认场景', icon: <Mic size={18} /> },
  { label: 'AI 生成规则', hint: '摘要格式、待办拆分与语言风格', icon: <Sparkles size={18} /> },
  { label: '导出模版', hint: '纪要、邮件、周报与知识卡片', icon: <Download size={18} /> },
  { label: '帮助中心', hint: '使用说明、常见问题与支持入口', icon: <AlertCircle size={18} /> },
  { label: '产品设置', hint: '通知、隐私与集成能力', icon: <Settings size={18} /> },
];

export const PAGE_HEADERS: Record<Page, { title: string; subtitle: string }> = {
  home: { title: '总览', subtitle: '浏览器工作台首页' },
  records: { title: '记录中心', subtitle: '查看与管理全部纪要' },
  knowledge: { title: '知识库', subtitle: '归档与跨记录问答' },
  profile: { title: '偏好设置', subtitle: '账号与导出配置' },
  recording: { title: '录音中', subtitle: '实时采集现场声音' },
  processing: { title: '处理中', subtitle: '摘要与待办正在生成' },
  detail: { title: '记录详情', subtitle: '摘要、全文与问答' },
};
