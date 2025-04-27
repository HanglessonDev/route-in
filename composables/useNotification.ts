import type { NotificationType } from './../stores/notification'
export const useNotification = () => {
	const store = useNotificationStore()

	return {
		notify(message: string, type: NotificationType = 'info', options = {}) {
			return store.add(message, type, options)
		},
		success(message: string, options = {}) {
			return store.success(message, options)
		},
		error(message: string, options = {}) {
			return store.error(message, options)
		},
		info(message: string, options = {}) {
			return store.info(message, options)
		},
		warning(message: string, options = {}) {
			return store.warning(message, options)
		},
		remove(id: number) {
			return store.remove(id)
		},
		clearAll() {
			store.clearAll()
		},
	}
}
