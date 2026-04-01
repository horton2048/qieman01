import { Recording } from './types';

export const MOCK_RECORDINGS: Recording[] = [
  {
    id: '1',
    title: '销售周会',
    timestamp: Date.now() - 3_600_000,
    duration: 2_100,
    status: 'completed',
    summary:
      '本次会议围绕 Q2 销售目标展开，重点讨论了客户分层、报价策略调整以及下周交付节奏，整体方向已经对齐。',
    keyPoints: ['确定重点客户名单分层方案', '本周内完成报价模版优化', '下周提交第一版客户同步材料'],
    conclusions: ['优先保证重点客户推进节奏，再跟进常规商机。'],
    todos: [
      { task: '整理报价模版并发给销售团队', owner: '张三' },
      { task: '更新重点客户跟进表', owner: '李四' },
    ],
    transcription: [
      { time: '14:02', text: '我们今天先看一下 Q2 的总体目标，再讨论重点客户的推进节奏。' },
      { time: '14:08', text: '关于重点客户，我建议按照预算和意向度做更细的分层。' },
      { time: '14:20', text: '下周之前需要把报价方案准备好，避免再次来回确认。' },
    ],
  },
  {
    id: '2',
    title: '客户沟通会',
    timestamp: Date.now() - 86_400_000,
    duration: 1_080,
    status: 'completed',
    summary:
      '本次与客户确认了新产品上线计划，客户对当前性能表现基本满意，但希望我们进一步明确上线后的支持节奏。',
    keyPoints: ['确认预计上线窗口', '收集了性能测试反馈', '客户关注后续支持机制'],
    conclusions: ['按计划在 4 月中旬推进上线准备。'],
    todos: [{ task: '更新产品手册中的上线说明', owner: '王五' }],
    transcription: [
      { time: '18:20', text: '关于新产品上线时间，我们希望确认一个稳定的窗口。' },
      { time: '18:35', text: '性能方面目前没有大的问题，客户更关心上线后的响应流程。' },
    ],
  },
  {
    id: '3',
    title: '产品评审会',
    timestamp: Date.now() - 172_800_000,
    duration: 3_720,
    status: 'completed',
    summary:
      '团队评审了 AI Note 原型设计，明确首发版本聚焦录音、转写、摘要与待办生成，暂不扩展过多复杂能力。',
    keyPoints: ['明确首发功能范围', '聚焦核心路径稳定性', '暂缓复杂自动化场景'],
    conclusions: ['第一阶段优先保证录音与总结体验。'],
    todos: [{ task: '补充关键交互说明文档', owner: '赵六' }],
    transcription: [
      { time: '11:00', text: '今天我们集中讨论 AI Note 的首发版本范围和交互路径。' },
      { time: '11:18', text: '建议优先保证录音和摘要体验，其他能力后续再补。' },
    ],
  },
];
