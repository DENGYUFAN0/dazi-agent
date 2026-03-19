// 匹配引擎：基于兴趣标签计算用户之间的匹配度

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  interests: string[];
  bio: string;
  shades?: string[];
}

// 模拟用户数据（实际项目中应从数据库获取）
export const MOCK_USERS: UserProfile[] = [
  {
    id: "user_001",
    name: "小明",
    avatar: "🧑‍💻",
    interests: ["编程", "AI", "读书", "跑步", "咖啡"],
    bio: "全栈开发者，喜欢在咖啡店写代码，周末跑步放松",
  },
  {
    id: "user_002",
    name: "阿花",
    avatar: "🎨",
    interests: ["绘画", "摄影", "旅行", "咖啡", "音乐"],
    bio: "自由插画师，热爱用镜头记录生活，旅行是灵感来源",
  },
  {
    id: "user_003",
    name: "大力",
    avatar: "💪",
    interests: ["健身", "篮球", "游泳", "跑步", "烹饪"],
    bio: "健身教练，篮球爱好者，喜欢研究健康餐食",
  },
  {
    id: "user_004",
    name: "书虫",
    avatar: "📖",
    interests: ["读书", "写作", "哲学", "历史", "品酒"],
    bio: "文学编辑，每月至少读4本书，红酒入门爱好者",
  },
  {
    id: "user_005",
    name: "钓神",
    avatar: "🎣",
    interests: ["钓鱼", "露营", "徒步", "摄影", "烹饪"],
    bio: "野钓10年老手，最爱在山间溪流寻觅大物",
  },
  {
    id: "user_006",
    name: "Luna",
    avatar: "🎮",
    interests: ["电竞", "桌游", "剧本杀", "动漫", "编程"],
    bio: "游戏主播，桌游收藏家，剧本杀资深玩家",
  },
  {
    id: "user_007",
    name: "风铃",
    avatar: "🎵",
    interests: ["音乐", "瑜伽", "冥想", "旅行", "摄影"],
    bio: "独立音乐人，瑜伽练习者，用音乐和旅行治愈生活",
  },
  {
    id: "user_008",
    name: "探索者",
    avatar: "🏔",
    interests: ["登山", "攀岩", "潜水", "滑雪", "露营"],
    bio: "极限运动爱好者，已征服多座高峰，梦想是七大洲最高峰",
  },
];

export interface MatchResult {
  user: UserProfile;
  score: number;
  commonInterests: string[];
}

/**
 * 计算两组兴趣之间的匹配度
 * 使用 Jaccard 相似度 + 共同兴趣数量加权
 */
export function calculateMatchScore(
  interests1: string[],
  interests2: string[]
): { score: number; common: string[] } {
  const set1 = new Set(interests1);
  const set2 = new Set(interests2);
  
  const common = interests1.filter((i) => set2.has(i));
  const union = new Set([...interests1, ...interests2]);
  
  // Jaccard 相似度 (0~1)
  const jaccard = union.size > 0 ? common.length / union.size : 0;
  
  // 共同兴趣数量奖励
  const commonBonus = Math.min(common.length * 0.1, 0.3);
  
  // 最终分数 (0~100)
  const score = Math.round((jaccard + commonBonus) * 100);
  
  return { score: Math.min(score, 99), common };
}

/**
 * 为用户查找最佳匹配
 */
export function findMatches(
  userInterests: string[],
  shades: string[] = [],
  topN: number = 5
): MatchResult[] {
  // 合并手动选择的兴趣和 SecondMe shades
  const allInterests = [...new Set([...userInterests, ...shades])];
  
  const results: MatchResult[] = MOCK_USERS.map((user) => {
    const { score, common } = calculateMatchScore(allInterests, user.interests);
    return { user, score, commonInterests: common };
  });

  // 按匹配度排序，取 topN
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
