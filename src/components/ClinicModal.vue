<script setup lang="ts">
import { computed } from 'vue'
import type { Bird } from '@/types/game'
import type { TreatmentType } from '@/types/game'
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

const birdTreatments = computed(() => {
  if (!props.bird) return []
  return treatmentTypes.map(type => ({
    type,
    config: TREATMENT_CONFIGS[type],
    canAfford: props.foodStock >= TREATMENT_CONFIGS[type].foodCost,
  }))
})

const handleTreat = (type: TreatmentType) => {
  if (!props.bird) return
  emit('treat', type)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-lg glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-pop-in">
        <div class="bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-cyan-600/30 px-6 py-5 border-b border-white/10">
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

        <div v-if="bird" class="p-6 space-y-6">
          <div class="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div class="flex items-start gap-5">
              <div class="flex flex-col items-center gap-2 shrink-0">
                <div class="relative">
                  <BirdSprite
                    :stage="bird.stage"
                    :is-dead="bird.isDead"
                    :is-away="bird.isAway"
                    :is-sick="bird.isSick"
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
                  生病会持续降低健康度，请及时治疗！
                  <span v-if="bird.sickUntil">
                    预计还需 ~{{ Math.max(0, Math.ceil((bird.sickUntil - Date.now()) / 1000)) }} 秒自然康复
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
                  即使没有生病，也可以通过治疗恢复健康并促进成长~
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="text-white/80 font-medium flex items-center gap-2">
                <span>💊</span> 选择治疗方案
              </div>
              <div class="text-sm text-white/60">
                当前库存: <span class="text-amber-300 font-bold">{{ foodStock }}</span> 🍒
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="item in birdTreatments"
                :key="item.type"
                :disabled="!item.canAfford || bird.isDead || bird.isAway"
                :class="[
                  'relative rounded-2xl p-4 text-left transition-all border-2',
                  item.canAfford && !bird.isDead && !bird.isAway
                    ? `bg-gradient-to-br ${item.config.gradient} border-transparent hover:scale-[1.02] active:scale-[0.98] cursor-pointer`
                    : 'bg-gray-700/50 border-gray-600/50 cursor-not-allowed opacity-60',
                ]"
                @click="item.canAfford && !bird.isDead && !bird.isAway && handleTreat(item.type)"
              >
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
              <li>• 成长加速效果会持续一段时间，加快发育</li>
              <li>• 生病时治疗可缩短生病持续时间</li>
              <li>• 及时治疗能提高最终结局评分！</li>
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
