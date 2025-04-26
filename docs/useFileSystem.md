# Documentação do Composable `useFileSystem`

## Introdução

Este composable, `useFileSystem`, é responsável por fornecer funcionalidades básicas para importação e exportação de arquivos JSON em um aplicativo Vue.js. Ele trata operações de arquivo como a validação da presença de um arquivo, o processamento do JSON e a configuração da status bar.

## Exemplo de Uso

Para utilizar este composable no seu componente, você deve seguir os passos abaixo:

1. **Importe o Composable**:

```typescript
import { useFileSystem } from '@/composables/useFileSystem';
```

2. **Use o Composable em um Componente**:

```typescript
<template>
  <div>
    <input type="file" @change="onFileChange" ref="fileInput" />
    <button @click="importJSON()">Importar JSON</button>

    <!-- Status Bar -->
    {{ operationStatus.message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useFileSystem } from '@/composables/useFileSystem';

export default defineComponent({
  setup() {
    const { file, importJSON, operationStatus } = useFileSystem();

    // Função para lidar com a mudança do input de arquivo
    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;

      file.value = target.files[0];
    };

    return {
      file,
      importJSON,
      operationStatus,
      onFileChange,
    };
  },
});
</script>

<style scoped>
/* Estilização opcional para o componente */
</style>
```

## Métodos

### `importJSON()`

- **Descrição**: Este método trata a importação de um arquivo JSON. Ele valida a presença do arquivo, processa o conteúdo do arquivo, e atualiza a status bar com os resultados da operação.

- **Parâmetros**: Nenhum parâmetro necessário.

- **Retorno**: Retorna um objeto `FileOperationResult` que indica se a operação foi bem-sucedida (`success: boolean`) ou contém erro (`error?: string | Error`).

### `exportJSON(data, filename)`

- **Descrição**: Este método trata a exportação de um arquivo JSON. Ele recebe os dados a serem exportados e o nome do arquivo (padrão é 'default'). Cria um Blob com o conteúdo JSON e fornece ao usuário uma opção para baixar o arquivo.

- **Parâmetros**:
  - `data`: Os dados que devem ser exportados. Deve ser um objeto ou array.
  - `filename`: O nome do arquivo a ser exportado (opcional, padrão é 'default').

- **Retorno**: Retorna um objeto `FileOperationResult` que indica se a operação foi bem-sucedida (`success: boolean`) ou contém erro (`error?: string | Error`).

## Funções Internas

### `validadeFilePresence()`

- **Descrição**: Este método verifica se há um arquivo selecionado pelo usuário. Se não houver, ele atualiza a status bar com uma mensagem de erro e retorna `false`.

- **Parâmetros**: Nenhum parâmetro necessário.

- **Retorno**: Retorna `true` se o arquivo estiver presente e `false` caso contrário.

### `processJsonFile(file)`

- **Descrição**: Este método lê o conteúdo do arquivo, limpa a formatação JSON (removendo vírgulas seguidas de parênteses ou chaves), e tenta parsear o conteúdo como um array. Retorna um objeto `FileOperationResult` com os resultados da operação.

- **Parâmetros**:
  - `file`: O arquivo que deve ser processado.

- **Retorno**: Retorna um objeto `FileOperationResult` que indica se a operação foi bem-sucedida (`success: boolean`) ou contém erro (`error?: string | Error`).

### `readFileAsText(file)`

- **Descrição**: Este método lê o conteúdo de um arquivo como texto. Retorna uma Promise com o resultado da leitura do arquivo.

- **Parâmetros**:
  - `file`: O arquivo que deve ser lido.

- **Retorno**: Uma Promise que resolve com o conteúdo do arquivo ou rejeita com um erro se houver.

### `sanitizeJson(content)`

- **Descrição**: Este método remove espaços desnecessários após vírgulas em JSON, garantindo uma formatação consistente. Retorna a string sanitizada.

- **Parâmetros**:
  - `content`: O conteúdo do arquivo JSON.

- **Retorno**: A string sanitizada com os espaços removidos.

### `parseJson(content)`

- **Descrição**: Este método tenta parsear uma string como JSON e retorna o objeto resultante. Se a string não for um JSON válido, ele lança uma exceção.

- **Parâmetros**:
  - `content`: A string que deve ser parseada.

- **Retorno**: O objeto resultante do parsing ou uma exceção se falhar.

### `setOperationStatus(message, type)`

- **Descrição**: Este método atualiza a status bar com uma mensagem e um tipo de operação (sucesso, erro, informação, aviso).

- **Parâmetros**:
  - `message`: A mensagem que deve ser exibida na status bar.
  - `type`: O tipo de mensagem (`success`, `error`, `info`, `warning`).

### `resetFileInput()`

- **Descrição**: Este método reseta o input de arquivo para permitir a seleção de outro arquivo.

- **Parâmetros**: Nenhum parâmetro necessário.

## Erros e Exceções

Este composable também trata erros durante as operações de importação, exportação e processamento do JSON. Em caso de erro, ele atualiza a status bar com uma mensagem de erro e retorna um objeto `FileOperationResult` indicando o sucesso como `false`.

- **Erro na Leitura do Arquivo**: Se ocorrer um erro ao ler o arquivo, o método `handleFileError` é chamado para lidar com o erro e exibir uma mensagem adequada.

## Licença

Este composable está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).

---

Este documento fornece uma visão geral profissional da funcionalidade e uso do composable `useFileSystem`, fornecendo um guia detalhado para quem deseja implementá-lo em seu projeto Vue.js.