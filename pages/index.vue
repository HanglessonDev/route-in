<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
interface AutocompleteItem {
  title: string;
  // Add other properties you expect from the API
  [key: string]: any;
}

const searchQuery = ref('');
const searchResults = ref<AutocompleteItem[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Debounce function with proper TypeScript typing
function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

async function fetchHereAutocomplete(
  query: string
): Promise<AutocompleteItem[]> {
  if (!query.trim()) return [];

  const endpoint = 'https://autocomplete.search.hereapi.com/v1/autocomplete';
  // const bbox:-67.8970642,-10.0588034,-67.6898859,-9.8744635
  const params = new URLSearchParams({
    q: query,
    limit: '5',
    apiKey: useRuntimeConfig().public.hereApiKey,
    // in: 'countryCode:BRA',
    in: 'bbox:-67.8970642,-10.0588034,-67.6898859,-9.8744635',
    lang: 'pt-BR',
  });

  try {
    isLoading.value = true;
    error.value = null;
    const response = await fetch(`${endpoint}?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (err) {
    console.error('Error fetching autocomplete data:', err);
    error.value = 'Failed to fetch suggestions. Please try again.';
    return [];
  } finally {
    isLoading.value = false;
  }
}

const debouncedSearch = debounce(async (query: string) => {
  searchResults.value = await fetchHereAutocomplete(query);
}, 500);

watch(searchQuery, (newQuery) => {
  if (newQuery) {
    debouncedSearch(newQuery);
  } else {
    searchResults.value = [];
  }
});

function selectItem(item: AutocompleteItem) {
  searchQuery.value = item.title;
  searchResults.value = [];
  // You might want to do something else with the selected item
}
</script>

<template>
  <div
    class="flex w-full h-full flex-col items-center justify-center p-4 border"
  >
    <VRow class="w-full max-w-4xl">
      <VCol cols="12" md="6" lg="4">
        <div class="relative">
          <VForm @submit.prevent="">
            <VTextField
              v-model="searchQuery"
              label="Buscar localização"
              placeholder="Digite um endereço"
              clearable
              :loading="isLoading"
              @update:model-value="debouncedSearch"
            />
          </VForm>

          <!-- Suggestions dropdown -->
          <VList
            v-if="searchResults.length > 0"
            class="absolute z-10 w-full mt-1 border rounded shadow-lg bg-white"
          >
            <VListItem
              v-for="(item, index) in searchResults"
              :key="index"
              class="cursor-pointer hover:bg-gray-100"
              @click="selectItem(item)"
            >
              <VListItemTitle>{{ item.title }}</VListItemTitle>
              <!-- Add more item details if needed -->
            </VListItem>
          </VList>

          <VAlert v-if="error" type="error" class="mt-2">
            {{ error }}
          </VAlert>
        </div>
      </VCol>
      <VCol cols="12" md="6" lg="8">
        <!-- Your map or other content will go here -->
        <div
          class="p-4 border rounded-lg h-64 flex items-center justify-center text-gray-500"
        >
          Resultados serão exibidos aqui
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.z-10 {
  z-index: 10;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}
</style>
