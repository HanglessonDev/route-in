<script setup lang="ts">
import type { AutocompleteAddress } from '~/modules/offlineDB/domain/autocompleteAddressEntitie';

const importFile = ref();
const importStatus = ref<{
  message: string;
  type: 'success' | 'info' | 'warning' | 'error' | undefined;
}>({
  message: '',
  type: 'success',
});

const {
  loadAddresses,
  addAddress,
  importAddresses,
  currentPage,
  isLoading,
  error,
  totalPages,
  loadAddressesPaginated,
  addressesPaginated,
} = useAutocompleteService();

const vuetifyPage = computed({
  get: () => currentPage.value,
  set: (value) => loadAddressesPaginated(value),
});

const newAddress = ref<Partial<AutocompleteAddress>>({
  zipCode: '',
  type: '',
  street: '',
  neighborhood: '',
  city: '',
  state: '',
});

onMounted(async () => {
  loadAddresses();
  loadAddressesPaginated(1);
});

async function add() {
  await addAddress(newAddress.value);
  await loadAddresses();
  newAddress.value = {
    zipCode: '',
    type: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
  };
}

async function handleImport() {
  if (!importFile.value || importFile.value.length === 0) {
    importStatus.value = {
      message: 'Selecione um arquivo para importar',
      type: 'error',
    };
    return;
  }

  const file = importFile.value;

  try {
    // Ler o conteúdo do arquivo
    const fileContent = await readFileAsText(file); // Ajuste aqui: Vuetify pode encapsular o File original

    // Aqui está o fix para JSON mal formatado (remover vírgulas antes de })
    const cleanContent = fileContent.replace(/,(\s*[\]}])/g, '$1');

    // Tentar fazer parse do JSON
    let jsonData;
    try {
      jsonData = JSON.parse(cleanContent);
    } catch (jsonError) {
      console.error('Erro no parse do JSON:', jsonError);
      importStatus.value = {
        message: 'O arquivo não contém JSON válido',
        type: 'error',
      };
      return;
    }

    // Verificar se é um array
    if (!Array.isArray(jsonData)) {
      importStatus.value = {
        message: 'O JSON deve conter um array de endereços',
        type: 'error',
      };
      return;
    }

    // Importar os dados
    await importAddresses(cleanContent);

    // Recarregar endereços
    await loadAddresses();

    importStatus.value = {
      message: `Importação concluída!`,
      type: 'success',
    };

    // Limpar a seleção do arquivo
    importFile.value = null;
  } catch (error) {
    console.error('Erro na importação:', error);
    importStatus.value = {
      message: `Erro na importação: ${
        error instanceof Error ? error.message : 'Erro desconhecido'
      }`,
      type: 'error',
    };
  }
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Erro ao ler o arquivo'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
    reader.readAsText(file);
  });
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="columns-1">
      <VCard title="Importação/Exportação" class="mb-4">
        <VCardText class="flex-wrap lg:flex space-x-2 items-center">
          <VFileInput
            v-model="importFile"
            label="Selecione o arquivo"
            :multiple="false"
            density="compact"
            accept=".json"
            prepend-icon="mdi-paperclip"
            variant="underlined"
            :show-size="1000"
          >
            <template #selection="{ fileNames }">
              <VChip
                class="mb-1"
                variant="flat"
                color="primary"
                size="small"
                label
              >
                {{ fileNames[0] }}
              </VChip>
            </template>
          </VFileInput>
          <VBtn
            class="lg:-mt-4 w-full lg:w-fit"
            text="Importar"
            variant="flat"
            color="primary"
            size="small"
            :disabled="!importFile || importFile.length === 0"
            @click="handleImport"
          />
        </VCardText>
      </VCard>
      <!-- <VCard title="Importação" class="mb-4">
        <VCardText>
          <VFileUpload
            v-model="importFile"
            :multiple="false"
            density="compact"
            title="Selecione o arquivo"
            accept=".json"
          />
          <VAlert
            v-if="importStatus.message"
            :type="importStatus.type"
            class="mt-2"
            density="compact"
          >
            {{ importStatus.message }}
          </VAlert>
        </VCardText>
        <VCardActions>
          <VBtn
            block
            color="primary"
            prepend-icon="mdi-upload"
            :disabled="!importFile || importFile.length === 0"
            @click="handleImport"
          >
            Importar
          </VBtn>
        </VCardActions>
      </VCard> -->
      <VCard title="Cadastro" class="h-fit">
        <VCardText>
          <VTextField
            v-model="newAddress.street"
            label="Rua"
            placeholder="Digite a rua"
          />
          <VTextField
            v-model="newAddress.zipCode"
            label="CEP"
            placeholder="Digite o CEP"
          />
          <VTextField
            v-model="newAddress.neighborhood"
            label="Bairro"
            placeholder="Digite o bairro"
          />
          <VTextField
            v-model="newAddress.city"
            label="Cidade"
            placeholder="Digite a cidade"
          />
          <VTextField
            v-model="newAddress.state"
            label="Estado"
            placeholder="Digite o estado"
          />
          <VBtn color="primary" block class="mt-4" @click="add">
            Cadastrar
          </VBtn>
        </VCardText>
      </VCard>
    </div>
    <VCard title="Endereços Cadastrados" class="col-span-2">
      <div v-if="isLoading">
        <VProgressLinear color="primary" indeterminate />
      </div>
      <div v-else-if="error">
        <VAlert type="error">{{ error }}</VAlert>
      </div>

      <VTable v-else density="compact">
        <thead>
          <tr>
            <th class="text-left">Rua</th>
            <th class="text-left">CEP</th>
            <th class="text-left">Bairro</th>
            <th class="text-left">Cidade</th>
            <th class="text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="address in addressesPaginated" :key="address.id">
            <td>{{ address.street }}</td>
            <td>{{ address.formattedZipCode }}</td>
            <td>{{ address.neighborhood }}</td>
            <td>{{ address.city }}</td>
            <td>{{ address.state }}</td>
          </tr>
        </tbody>
        <tfoot v-if="addressesPaginated.length === 0">
          <tr>
            <td class="text-center" colspan="5">Nenhum endereço cadastrado</td>
          </tr>
        </tfoot>
      </VTable>
      <div class="mt-2">
        <VPagination
          v-model="vuetifyPage"
          :length="totalPages"
          :disabled="isLoading"
          rounded
        />
      </div>
    </VCard>
  </div>
</template>

<style scoped></style>
