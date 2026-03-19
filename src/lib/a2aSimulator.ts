// A2A 对话模拟器
// 模拟两个 AI 分身之间的对话

export interface ChatMessage {
  id: string;
  role: "user_agent" | "match_agent" | "system";
  content: string;
  timestamp: number;
}

const GREETINGS = [
  "你好呀！看到我们有共同的兴趣，很开心认识你！",
  "Hi！发现我们志趣相投，太巧了吧！",
  "嗨～看来我们在很多方面都很合拍呢！",
];

const INTEREST_RESPONSES: Record<string, string[]> = {
  读书: [
    "最近在看什么书呀？我刚读完一本很棒的科幻小说。",
    "我也超爱阅读的！你一般喜欢什么类型的书？",
    "太好了！找到一个同样爱看书的人不容易呀，有什么好书推荐吗？",
  ],
  健身: [
    "你一般去哪个健身房呀？我最近在练力量。",
    "健身真的会上瘾！你主要练什么项目？",
    "太棒了！有没有兴趣一起约个训练？",
  ],
  钓鱼: [
    "你一般去哪里钓鱼呀？我最近在研究路亚。",
    "同道中人啊！你比较喜欢海钓还是溪钓？",
    "钓鱼真的是最放松的事了，有没有好的钓点分享？",
  ],
  编程: [
    "你平时用什么技术栈开发？我最近在学 Rust。",
    "程序员搭子！你做前端还是后端呀？",
    "酷！最近有在做什么有趣的项目吗？",
  ],
  旅行: [
    "你下一个旅行目的地是哪里？我在计划去日本。",
    "旅行最棒了！你喜欢自由行还是跟团？",
    "有没有印象最深的一次旅行经历？",
  ],
  音乐: [
    "你平时听什么类型的音乐？我最近迷上了爵士乐。",
    "会乐器吗？我在自学吉他～",
    "要不要一起去看个音乐节？",
  ],
  摄影: [
    "你用什么相机拍照？我最近入了一台富士。",
    "最喜欢拍什么题材？我偏爱街拍和风光。",
    "要不要一起出去扫街拍照？",
  ],
  咖啡: [
    "你喜欢什么咖啡？我最近在研究手冲。",
    "有没有推荐的咖啡店？我在找新的去处。",
    "咖啡搭子！要不要一起试试新开的那家精品咖啡店？",
  ],
};

const DEFAULT_RESPONSES = [
  "这个兴趣我也很感兴趣，能多跟我说说吗？",
  "真没想到我们有这么多共同点，有空约出来聊聊？",
  "感觉我们会成为很好的搭子呢！",
  "太有缘了！你平时周末一般做什么？",
];

const CLOSING_MESSAGES = [
  "聊得很开心！要不要加个微信，找时间一起玩？",
  "感觉我们真的很合拍！下次约一起出来吧？",
  "太开心认识你了！希望我们能成为好搭子～",
];

/**
 * 生成 A2A 对话消息序列
 */
export function generateA2AConversation(
  commonInterests: string[],
  userName: string = "你",
  matchName: string = "搭子"
): ChatMessage[] {
  const messages: ChatMessage[] = [];
  let id = 0;
  let time = Date.now();

  // 系统消息
  messages.push({
    id: String(id++),
    role: "system",
    content: `🤝 AI 分身匹配成功！发现 ${commonInterests.length} 个共同兴趣：${commonInterests.join("、")}`,
    timestamp: time,
  });
  time += 1000;

  // 我方 Agent 打招呼
  messages.push({
    id: String(id++),
    role: "user_agent",
    content: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
    timestamp: time,
  });
  time += 2000;

  // 对方 Agent 回应
  messages.push({
    id: String(id++),
    role: "match_agent",
    content: `${GREETINGS[Math.floor(Math.random() * GREETINGS.length)]} 看到我们都喜欢${commonInterests[0]}，真的太巧了！`,
    timestamp: time,
  });
  time += 2500;

  // 围绕共同兴趣展开对话
  for (let i = 0; i < Math.min(commonInterests.length, 3); i++) {
    const interest = commonInterests[i];
    const responses = INTEREST_RESPONSES[interest] || DEFAULT_RESPONSES;
    
    // 我方 Agent 聊兴趣
    if (i === 0) {
      messages.push({
        id: String(id++),
        role: "user_agent",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: time,
      });
    } else {
      messages.push({
        id: String(id++),
        role: "user_agent",
        content: `对了，我看你也喜欢${interest}！${responses[Math.floor(Math.random() * responses.length)]}`,
        timestamp: time,
      });
    }
    time += 3000;

    // 对方 Agent 回应
    const matchResponse = responses[(Math.floor(Math.random() * responses.length) + 1) % responses.length];
    messages.push({
      id: String(id++),
      role: "match_agent",
      content: matchResponse,
      timestamp: time,
    });
    time += 2500;
  }

  // 结束语
  messages.push({
    id: String(id++),
    role: "user_agent",
    content: CLOSING_MESSAGES[Math.floor(Math.random() * CLOSING_MESSAGES.length)],
    timestamp: time,
  });
  time += 2000;

  messages.push({
    id: String(id++),
    role: "match_agent",
    content: "当然好呀！很期待下次见面，先加个好友吧！😊",
    timestamp: time,
  });

  return messages;
}

/**
 * 模拟流式输出（用于实时打字效果）
 */
export async function* streamMessage(
  content: string,
  charDelay: number = 50
): AsyncGenerator<string> {
  for (const char of content) {
    yield char;
    await new Promise((r) => setTimeout(r, charDelay));
  }
}
