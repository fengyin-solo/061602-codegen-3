<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Bird, TreatmentType } from '@/types/game'
import { TREATMENT_CONFIGS, TREATMENT_EMOJI, TREATMENT_ICONS, STAGE_NAMES } from '@/utils/constants'
import BirdSprite from './BirdSprite.vue'
import AttributeBar from './AttributeBar.vue'

const props = defineProps<{
  bird: Bird | null
  foodStock: number
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'treat', treatmentType: TreatmentType): void
}>()

const treatmentTypes: TreatmentType[] = ['basic', 'standard', 'intensive', 'premium']

const showResult = ref(false)
const resultMessage = ref('')
const resultType = ref<'success' | 'partial'>('success')
const prevFoodStock = ref(props.foodStock)
const foodDelta = ref(0)
const showFoodDelta = ref(false)

watch(() => props.foodStock, (newVal, oldVal) => {
  if (newVal < oldVal) {
    foodDelta.value = oldVal - newVal
    showFoodDelta.value = true
    setTimeout(() => { showFoodDelta.value = false }, 1500)
  }
  prevFoodStock.value = newVal
})

watch(() => props.visible, (v) => {
  if (!v) {
    showResult.value = false
    showFoodDelta.value = false
  }
})

const birdTreatments = computed(() => {
  if (!props.bird) return []
  const isSick = props.bird.isSick
  return treatmentTypes.map(type => ({
    type,
    config: TREATMENT_CONFIGS[type],
    canAfford: props.foodStock >= TREATMENT_CONFIGS[type].foodCost,
    recommended: isSick && (type === 'intensive' || type === 'premium'),
    curesSick: isSick && (type === 'intensive' || type === 'premium'),
  }))
})

const growthBoostPercent = computed(() => {
  if (!props.bird) return 0
  return Math.round(props.bird.growthBoostRemaining * 100)
})

const hasGrowthBoost = computed(() => {
  return props.bird ? props.bird.growthBoostRemaining > 0.01 : false
})

const handleTreat = (type: TreatmentType) => {
  if (!props.bird) return
  const config = TREATMENT_CONFIGS[type]
  const wasSick = props.bird.isSick
  const curesSick = wasSick && (type === 'intensive' || type === 'premium')

  emit('treat', type)

  if (curesSick) {
    resultMessage.value = `${config.name}治疗成功！疾病已治愈，+${config.healthRestore}健康，成长加速${Math.round(config.growthBoost * 100)}%！`
    resultType.value = 'success'
  } else if (wasSick) {
    resultMessage.value = `${config.name}治疗生效！病情缓解中，+${config.healthRestore}健康，还需继续治疗`
    resultType.value = 'partial'
  } else {
    resultMessage.value = `${config.name}治疗完成！+${config.healthRestore}健康，成长加速${Math.round(config.growthBoost * 100)}%！`
    resultType.value = 'success'
  }

  showResult.value = true
  setTimeout(() => { showResult.value = false }, 3000)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-lg glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-pop-in max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-cyan-600/30 px-6 py-5 border-b border-white/10 sticky top-0 z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-4xl">🏥</span>
              <div>
                <h2 class="font-display text-2xl text-white font-bold">鸟巢诊疗站</h2>
                <p class="text-white/60 text-sm">为生病的小鸟提供专业治疗</p>
              </div>
            </div>
            <button
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-all"
              @click="emit('close')"
            >
              ✕
            </button>
          </div>
        </div>

        <div v-if="bird" class="p-6 space-y-5">
          <div
            v-if="showResult"
            :class="[
              'rounded-2xl p-4 border-2 animate-pop-in',
              resultType === 'success'
                ? 'bg-emerald-500/20 border-emerald-400/50'
                : 'bg-amber-500/20 border-amber-400/50',
            ]"
          >
            <div class="flex items-start gap-3">
              <span class="text-3xl shrink-0">{{ resultType === 'success' ? '💚' : '⏳' }}</span>
              <div>
                <div :class="['font-bold text-base', resultType === 'success' ? 'text-emerald-300' : 'text-amber-300']">
                  {{ resultType === 'success' ? '治疗成功！' : '治疗生效！' }}
                </div>
                <div :class="['text-sm mt-1', resultType === 'success' ? 'text-emerald-200/80' : 'text-amber-200/80']">
                  {{ resultMessage }}
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div class="flex items-start gap-5">
              <div class="flex flex-col items-center gap-2 shrink-0">
                <div class="relative">
                  <BirdSprite
                    :stage="bird.stage"
                    :is-dead="bird.isDead"
                    :is-away="bird.isAway"
                    :is-sick="bird.isSick"
                    :is-treated="bird.isTreated"
                    :personality="bird.personality"
                  />
                  <div
                    v-if="bird.isSick"
                    class="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs animate-pulse"
                  >
                    🤒
                  </div>
                </div>
              </div>
              <div class="flex-1 min-w-0 space-y-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-display text-xl text-white font-bold">{{ bird.name }}</span>
                    <span class="text-xs text-white/60">{{ STAGE_NAMES[bird.stage] }}</span>
                  </div>
                  <div class="text-xs text-white/50 mt-0.5">
                    已接受治疗 <span class="text-emerald-400 font-bold">{{ bird.treatmentCount }}</span> 次
                  </div>
                </div>
                <AttributeBar
                  :value="bird.health"
                  label="健康度"
                  icon="❤️"
                  type="health"
                />
                <AttributeBar
                  :value="bird.hunger"
                  label="饱食度"
                  icon="🍒"
                  type="hunger"
                />
                <AttributeBar
                  :value="bird.fear"
                  label="恐惧值"
                  icon="😰"
                  type="fear"
                />

                <div v-if="hasGrowthBoost" class="flex items-center gap-2 bg-emerald-500/10 rounded-lg px-3 py-1.5">
                  <span class="text-sm">📈</span>
                  <span class="text-emerald-300 text-xs font-medium">
                    成长加速中 +{{ growthBoostPercent }}%
                  </span>
                  <div class="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-300"
                      :style="{ width: `${Math.min(100, growthBoostPercent * 2)}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="bird.isSick"
              class="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 flex items-start gap-2"
            >
              <span class="text-xl shrink-0">⚠️</span>
              <div>
                <div class="text-orange-300 font-medium text-sm">小鸟正在生病中</div>
                <div class="text-orange-200/70 text-xs mt-1">
                  <span class="font-bold text-orange-200">加强治疗</span>和<span class="font-bold text-orange-200">特级诊疗</span>可直接治愈！
                  <span v-if="bird.sickUntil">
                    自然康复还需 ~{{ Math.max(0, Math.ceil((bird.sickUntil - Date.now()) / 1000)) }} 秒
                  </span>
                </div>
              </div>
            </div>

            <div
              v-else-if="bird.health < 50"
              class="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-start gap-2"
            >
              <span class="text-xl shrink-0">💡</span>
              <div>
                <div class="text-yellow-300 font-medium text-sm">健康状况不佳</div>
                <div class="text-yellow-200/70 text-xs mt-1">
                  通过治疗恢复健康，还能获得成长加速~
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="text-white/80 font-medium flex items-center gap-2">
                <span>💊</span> 选择治疗方案
              </div>
              <div class="relative text-sm text-white/60">
                库存: <span class="text-amber-300 font-bold">{{ foodStock }}</span> 🍒
                <Transition name="food-delta">
                  <span
                    v-if="showFoodDelta"
                    class="absolute -top-5 right-0 text-red-400 text-xs font-bold animate-float-up"
                  >
                    -{{ foodDelta }}🍒
                  </span>
                </Transition>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="item in birdTreatments"
                :key="item.type"
                :disabled="!item.canAfford || bird.isDead || bird.isAway"
                :class="[
                  'relative rounded-2xl p-4 text-left transition-all border-2 overflow-hidden',
                  item.canAfford && !bird.isDead && !bird.isAway
                    ? `bg-gradient-to-br ${item.config.gradient} border-transparent hover:scale-[1.02] active:scale-[0.98] cursor-pointer`
                    : 'bg-gray-700/50 border-gray-600/50 cursor-not-allowed opacity-60',
                ]"
                @click="item.canAfford && !bird.isDead && !bird.isAway && handleTreat(item.type)"
              >
                <div
                  v-if="item.recommended"
                  class="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg"
                >
                  推荐
                </div>
                <div
                  v-if="item.curesSick"
                  class="absolute top-0 left-0 bg-emerald-400 text-gray-900 text-[9px] font-bold px-2 py-0.5 rounded-br-lg"
                >
                  治愈
                </div>
                <div class="flex items-start gap-2 mb-2">
                  <span class="text-2xl">{{ TREATMENT_ICONS[item.type] }}</span>
                  <div>
                    <div class="font-bold text-white text-base flex items-center gap-1">
                      {{ item.config.name }}
                      <span class="text-lg">{{ TREATMENT_EMOJI[item.type] }}</span>
                    </div>
                    <div class="text-white/80 text-[10px] opacity-80">
                      消耗 {{ item.config.foodCost }} 🍒
                    </div>
                  </div>
                </div>
                <div class="text-white/70 text-[11px] mb-2 leading-relaxed">
                  {{ item.config.description }}
                </div>
                <div class="space-y-0.5">
                  <div class="flex items-center gap-1 text-[10px] text-white/70">
                    <span>❤️</span>
                    <span>+{{ item.config.healthRestore }} 健康</span>
                  </div>
                  <div class="flex items-center gap-1 text-[10px] text-white/70">
                    <span>📈</span>
                    <span>+{{ Math.round(item.config.growthBoost * 100) }}% 成长加速</span>
                  </div>
                  <div class="flex items-center gap-1 text-[10px] text-white/70">
                    <span>😌</span>
                    <span>-{{ item.config.fearReduce }} 恐惧</span>
                  </div>
                  <div v-if="item.curesSick" class="flex items-center gap-1 text-[10px] text-emerald-200 font-bold">
                    <span>💚</span>
                    <span>直接治愈疾病</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10">
            <div class="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <span>✨</span> 治疗效果说明
            </div>
            <ul class="text-white/60 text-xs space-y-1">
              <li>• 治疗可快速恢复健康值，降低恐惧</li>
              <li>• <span class="text-violet-300">加强治疗</span>和<span class="text-amber-300">特级诊疗</span>可直接治愈疾病</li>
              <li>• 成长加速效果持续数分钟，加快发育速度</li>
              <li>• 基础/标准治疗可缩短生病时间，需多次治疗</li>
              <li>• 及时治疗病鸟能提高最终结局评分！</li>
            </ul>
          </div>
        </div>

        <div v-else class="p-8 text-center">
          <div class="text-5xl mb-4">🐦</div>
          <div class="text-white/60">请先选择一只小鸟</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.food-delta-enter-active {
  transition: all 0.3s ease-out;
}
.food-delta-leave-active {
  transition: all 0.5s ease-in;
}
.food-delta-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.food-delta-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
