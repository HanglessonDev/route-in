type FileOperationStatus = {
	message: string
	type: 'success' | 'error' | 'info' | 'warning' | undefined
}

type FileOperationResult<T = any> = {
	success: boolean
	data?: T
	error?: string | Error
}

export const useFileSystem = () => {
	const file = ref<File | null>(null)
	const operationStatus = ref<FileOperationStatus>({
		message: '',
		type: undefined,
	})

	async function importJSON(): Promise<FileOperationResult> {
		if (!validadeFilePresence()) {
			return { success: false, error: operationStatus.value.message }
		}

		try {
			const importResult = await processJsonFile(file.value as File)

			if (!importResult.success) {
				setOperationStatus(
					importResult.error || 'Erro desconhecido na importação',
					'error',
				)
				return importResult
			}

			setOperationStatus('JSON importado com sucesso.', 'success')
			resetFileInput()

			return importResult
		} catch (error) {
			return handleFileError(error)
		}
	}

	async function exportJSON<T = any>(data: T, filename = 'default') {
		try {
			const jsonStr = JSON.stringify(data, null, 2)
			const blob = new Blob([jsonStr], { type: 'application/json' })
			const url = URL.createObjectURL(blob)

			const link = document.createElement('a')
			link.href = url
			link.download = `${filename}.json`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			URL.revokeObjectURL(url)

			setOperationStatus('JSON exportado com sucesso.', 'success')
		} catch (error) {
			handleFileError(error)
		}
	}

	function validadeFilePresence(): boolean {
		if (!file.value) {
			setOperationStatus('Selecione um arquivo JSON para importar.', 'error')
			return false
		}
		return true
	}
	async function processJsonFile(file: File) {
		try {
			const fileContent = await readFileAsText(file)
			const cleanContent = sanitizeJson(fileContent)
			const jsonData = parseJson(cleanContent)

			if (!Array.isArray(jsonData)) {
				return {
					success: false,
					error: 'Arquivo JSON não é um array',
				}
			}
			return { success: true, data: jsonData }
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Erro ao processar arquivo JSON',
			}
		}
	}

	async function readFileAsText(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = (e) =>
				e.target?.result
					? resolve(e.target.result as string)
					: reject(new Error('Erro ao ler o arquivo'))
			reader.onerror = () => reject(new Error('Erro ao ler o arquivo'))
			reader.readAsText(file)
		})
	}

	function sanitizeJson(content: string): string {
		return content.replace(/,(\s*[\]}])/g, '$1').trim()
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function parseJson<T = any>(content: string): T {
		try {
			return JSON.parse(content) as T
		} catch {
			throw new Error('Arquivo JSON inválido')
		}
	}

	function setOperationStatus(
		message: string,
		type: FileOperationStatus['type'],
	): void {
		operationStatus.value = { message, type }
	}
	function resetFileInput(): void {
		file.value = null
	}
	function handleFileError(error: unknown): FileOperationResult {
		console.error('Erro na operação de arquivo:', error)
		const errorMessage =
			error instanceof Error ? error.message : 'Error desconhecido'
		setOperationStatus(`Erro: ${errorMessage}`, 'error')
		return { success: false, error: errorMessage }
	}

	return {
		file,
		operationStatus,
		importJSON,
		exportJSON,
	}
}
