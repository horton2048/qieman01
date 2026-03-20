import { Recording } from './types';

export const MOCK_RECORDINGS: Recording[] = [
  {
    id: '1',
    title: '销售周会',
    timestamp: Date.now() - 3600000,
    duration: 2100,
    status: 'completed',
    summary: '本次会议主要围绕 Q2 目标展开，重点讨论了客户分层和报价策略。',
    keyPoints: ['重点客户分层', '报价策略调整', '下周交付节点'],
    conclusions: ['下周提交重点客户报价方案'],
    todos: [
      { task: '整理报价模板', owner: '张三' },
      { task: '跟进客户名单', owner: '李四' }
    ],
    transcription: [
      { time: '14:02', text: '大家今天主要讨论一下 Q2 目标...' },
      { time: '14:08', text: '关于重点客户，我们认为需要进行更细致的分层管理。' },
      { time: '14:20', text: '下周前需要提交一版报价方案，大家没问题吧？' }
    ]
  },
  {
    id: '2',
    title: '客户沟通会',
    timestamp: Date.now() - 86400000,
    duration: 1080,
    status: 'completed',
    summary: '与客户沟通了新产品的上线计划，客户对性能表示满意。',
    keyPoints: ['产品上线时间', '性能测试反馈'],
    conclusions: ['按原计划 4 月中旬上线'],
    todos: [{ task: '更新产品手册', owner: '王五' }],
    transcription: [
      { time: '18:20', text: '你好，关于新产品的进度...' },
      { time: '18:35', text: '性能方面我们已经通过了初步测试。' }
    ]
  },
  {
    id: '3',
    title: '产品评审会',
    timestamp: Date.now() - 172800000,
    duration: 3720,
    status: 'completed',
    summary: '评审了 AI Note 的原型设计，确定了首发版本的功能范围。',
    keyPoints: ['主路径优化', 'AI 能力边界', '异常状态处理'],
    conclusions: ['优先保证录音和总结的稳定性'],
    todos: [{ task: '细化交互说明', owner: '赵六' }],
    transcription: [
      { time: '11:00', text: '今天我们来看一下 AI Note 的原型。' }
    ]
  }
];
