<script setup lang="ts">
import { useFileSystem } from '~/composables/useFileSystem';

const { file, importJSON } = useFileSystem();
const { importAddresses, loadAddresses } = useAutocompleteService();
const notification = useNotification();

const fileData = ref();

async function handleImport() {
  fileData.value = await importJSON();
  if (!fileData.value.success) {
    notification.error(fileData.value.error);
    return;
  }

  const jsonStr = JSON.stringify(fileData.value.data);
  await importAddresses(jsonStr);
  loadAddresses();

  notification.success(fileData.value.message);
}
</script>

<template>
  <VCard title="Importação">
    <VCardText class="flex-wrap lg:flex lg:space-x-2">
      <VFileInput
        v-model="file"
        label="Selecione o arquivo"
        :multiple="false"
        density="compact"
        accept=".json"
        prepend-icon="mdi-paperclip"
        variant="underlined"
        :show-size="1000"
        class="mt-2"
      >
        <template #selection="{ fileNames }">
          <VChip variant="flat" color="primary" size="small" label>
            {{ fileNames[0] }}
          </VChip>
        </template>
      </VFileInput>
      <VBtn
        class="w-full lg:w-fit"
        text="importar"
        variant="flat"
        color="primary"
        :disabled="!file"
        @click="handleImport"
      />
    </VCardText>
  </VCard>
</template>

<style scoped></style>
