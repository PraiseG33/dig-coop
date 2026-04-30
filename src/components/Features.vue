<script setup>
    defineProps({
      features: {
        type: Array,
        default: () => []
      }
    })
    </script>
    
    <template>
      <div class="px-4 lg:px-24 mt-15">
        <div class="max-w-7xl mx-auto grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="rounded-2xl px-6 py-8 flex flex-col items-center text-center lg:flex-row lg:items-start 
            lg:text-left gap-6 hover:scale-105 transition"
            style="border: 1px solid #52B640; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); background-color: white;"
          >

            <div class="shrink-0 w-20 h-20 lg:w-15 lg:h-15 bg-linear-to-r from-green-600 to-green-800 rounded-2xl flex items-center justify-center">
              <img 
                :src="feature.icon" 
                :alt="feature.title + ' icon'" 
                class="w-12 h-12 lg:w-14 lg:h-10 object-contain"
              >
            </div>
    
            <div class="flex-1">
              <h1 class="text-xl lg:text-[20px] text-green-700 font-semibold mb-3">{{ feature.title }}</h1>
              <p class="text-base lg:text-[18.5px] text-gray-600 leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>