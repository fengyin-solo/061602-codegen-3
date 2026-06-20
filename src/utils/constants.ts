import type { Weather, WeatherEffect, BerryType, GrowthStage, Personality, TreatmentType } from '@/types/game'

export const ATTR_MIN = 0
export const ATTR_MAX = 100
export const DEATH_THRESHOLD = 10

export const STAGE_DURATION: Record<Exclude<GrowthStage, 'adult'>, number> = {
  egg: 1,
  chick: 2,
  juvenile: 2,
  subadult: 1,
}

export const STAGE_NAMES: Record<GrowthStage, string> = {
  egg: '🥚 蛋',
  chick: '🐣 雏鸟',
  juvenile: '🐥 幼鸟',
  subadult: '🦜 亚成鸟',
  adult: '🐦 成鸟',
}

export const STAGE_EMOJI: Record<GrowthStage, string> = {
  egg: '🥚',
  chick: '🐣',
  juvenile: '🐥',
  subadult: '🦜',
  adult: '🐦',
}

export const FOOD_NEED_MULTIPLIER: Record<Exclude<GrowthStage, 'egg'>, number> = {
  chick: 1.5,
  juvenile: 1.2,
  subadult: 1.0,
  adult: 0.8,
}

export const HUNGER_DECAY_RATE = 1.5
export const FEAR_DECAY_RATE = 0.8
export const HEALTH_RECOVERY_RATE = 0.5

export const BERRY_SPAWN_INTERVAL = 4000
export const BERRY_MAX_COUNT = 8
export const BERRY_LIFETIME = 20000

export const BERRY_VALUES: Record<BerryType, number> = {
  red: 10,
  blue: 15,
  golden: 25,
}

export const BERRY_COLORS: Record<BerryType, string> = {
  red: '#C41E3A',
  blue: '#4169E1',
  golden: '#FFD700',
}

export const BERRY_EMOJI: Record<BerryType, string> = {
  red: '🍒',
  blue: '🫐',
  golden: '✨',
}

export const WEATHER_CHANGE_INTERVAL = 25000

export const WEATHER_EFFECTS: Record<Weather, WeatherEffect> = {
  sunny: { hungerMod: 1.0, fearMod: 0.8, healthMod: 1.0 },
  rainy: { hungerMod: 1.3, fearMod: 1.5, healthMod: 0.9, awayChance: 0.08 },
  snowy: { hungerMod: 1.5, fearMod: 1.2, healthMod: 0.7, sickChance: 0.12 },
  stormy: { hungerMod: 1.2, fearMod: 2.0, healthMod: 0.6, awayChance: 0.2, sickChance: 0.18 },
}

export const WEATHER_NAMES: Record<Weather, string> = {
  sunny: '☀️ 晴天',
  rainy: '🌧️ 雨天',
  snowy: '❄️ 雪天',
  stormy: '🌪️ 暴风',
}

export const WEATHER_COLORS: Record<Weather, string> = {
  sunny: 'from-amber-300/30 to-yellow-200/20',
  rainy: 'from-blue-400/40 to-gray-500/30',
  snowy: 'from-blue-100/40 to-white/30',
  stormy: 'from-gray-600/50 to-purple-800/40',
}

export const PERSONALITY_NAMES: Record<Personality, string> = {
  bold: '勇敢大胆',
  shy: '胆小害羞',
  gentle: '温柔恬静',
  curious: '好奇活泼',
  stubborn: '倔强独立',
}

export const PERSONALITY_EMOJI: Record<Personality, string> = {
  bold: '💪',
  shy: '🥺',
  gentle: '🌸',
  curious: '🌟',
  stubborn: '😤',
}

export const DAY_DURATION = 60000
export const INITIAL_FOOD = 30
export const MIN_EGGS = 2
export const MAX_EGGS = 4
export const MAX_BREEDING_ROUNDS = 2

export const BIRD_NAMES = [
  '毛毛', '豆豆', '啾啾', '喳喳', '花花', '点点', '果果', '泡泡',
  '糖糖', '圆圆', '小米', '小麦', '云朵', '星星', '月亮', '太阳',
  '小橘', '小蓝', '小绿', '小红', '阿黄', '阿白', '阿黑', '阿灰',
]

export interface TreatmentConfig {
  name: string
  description: string
  foodCost: number
  healthRestore: number
  growthBoost: number
  fearReduce: number
  sickDurationReduce: number
  color: string
  gradient: string
}

export const TREATMENT_CONFIGS: Record<TreatmentType, TreatmentConfig> = {
  basic: {
    name: '基础护理',
    description: '基础的食物和温水，适合轻微不适',
    foodCost: 15,
    healthRestore: 15,
    growthBoost: 0.05,
    fearReduce: 5,
    sickDurationReduce: 5000,
    color: '#10B981',
    gradient: 'from-emerald-500 to-green-500',
  },
  standard: {
    name: '标准治疗',
    description: '专业的护理和营养补充',
    foodCost: 30,
    healthRestore: 30,
    growthBoost: 0.1,
    fearReduce: 10,
    sickDurationReduce: 10000,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
  },
  intensive: {
    name: '加强治疗',
    description: '高强度治疗，快速恢复健康',
    foodCost: 50,
    healthRestore: 50,
    growthBoost: 0.15,
    fearReduce: 15,
    sickDurationReduce: 15000,
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-500',
  },
  premium: {
    name: '特级诊疗',
    description: '顶级护理套餐，全面调理身心',
    foodCost: 80,
    healthRestore: 75,
    growthBoost: 0.25,
    fearReduce: 25,
    sickDurationReduce: 20000,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
  },
}

export const TREATMENT_EMOJI: Record<TreatmentType, string> = {
  basic: '💚',
  standard: '💙',
  intensive: '💜',
  premium: '💛',
}

export const TREATMENT_ICONS: Record<TreatmentType, string> = {
  basic: '🌿',
  standard: '💊',
  intensive: '💉',
  premium: '✨',
}
