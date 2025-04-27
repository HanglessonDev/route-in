// stores/notification.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
	id: number
	message: string
	type: NotificationType
	timeout?: number
	closeButton?: boolean
}

export const useNotificationStore = defineStore('notification', () => {
	const notifications = ref<Notification[]>([])
	const nextId = ref(1)

	function add(
		message: string,
		type: NotificationType = 'info',
		options: { timeout?: number; closeButton?: boolean } = {},
	) {
		const notification: Notification = {
			id: nextId.value++,
			message,
			type,
			timeout: options.timeout ?? 5000, // Default timeout: 5 seconds
			closeButton: options.closeButton ?? true, // Default: show close button
		}

		notifications.value.push(notification)

		// Auto-remove notification after timeout (if timeout > 0)
		if (notification.timeout && notification.timeout > 0) {
			setTimeout(() => {
				remove(notification.id)
			}, notification.timeout)
		}

		return notification.id
	}

	function remove(id: number) {
		const index = notifications.value.findIndex((n) => n.id === id)
		if (index !== -1) {
			notifications.value.splice(index, 1)
		}
	}

	// Helper methods for common notification types
	function success(message: string, options = {}) {
		return add(message, 'success', options)
	}

	function error(message: string, options = {}) {
		return add(message, 'error', options)
	}

	function info(message: string, options = {}) {
		return add(message, 'info', options)
	}

	function warning(message: string, options = {}) {
		return add(message, 'warning', options)
	}

	function clearAll() {
		notifications.value = []
	}

	return {
		notifications,
		add,
		remove,
		success,
		error,
		info,
		warning,
		clearAll,
	}
})
