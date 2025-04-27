<script setup lang="ts">
import type { Notification } from '~/stores/notification';
const notificationStore = useNotificationStore();

const notifications = computed(() => notificationStore.notifications);

// Create a reactive model for each snackbar to handle visibility
const snackbarModels = ref<Record<number, boolean>>({});

// Watch for new notifications and set their model value to true
watch(
  () => [...notifications.value],
  (newNotifications) => {
    for (const notification of newNotifications) {
      if (!(notification.id in snackbarModels.value)) {
        snackbarModels.value[notification.id] = true;
      }
    }

    // Clean up models that no longer have corresponding notifications
    for (const id in snackbarModels.value) {
      if (!newNotifications.some((n) => n.id === Number(id))) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete snackbarModels.value[id];
      }
    }
  },
  { deep: true, immediate: true }
);

// When a snackbar is closed, remove it from the store
watch(
  snackbarModels,
  (newModels) => {
    for (const id in newModels) {
      if (!newModels[id]) {
        notificationStore.remove(Number(id));
      }
    }
  },
  { deep: true }
);

function closeNotification(id: number) {
  if (id in snackbarModels.value) {
    snackbarModels.value[id] = false;
  }
}

function getColorByType(type: Notification['type']) {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    default:
      return 'primary';
  }
}

function getIconByType(type: Notification['type']) {
  switch (type) {
    case 'success':
      return 'mdi-check-circle';
    case 'error':
      return 'mdi-alert-circle';
    case 'info':
      return 'mdi-information';
    case 'warning':
      return 'mdi-alert';
    default:
      return 'mdi-bell';
  }
}
</script>

<template>
  <div class="notification-system">
    <VSnackbar
      v-for="notification in notifications"
      :key="notification.id"
      v-model="snackbarModels[notification.id]"
      :color="getColorByType(notification.type)"
      :timeout="notification.timeout || 3000"
      location="top"
      class="mr-2"
      multi-line
    >
      <div class="flex items-center">
        <VIcon :icon="getIconByType(notification.type)" class="mr-2" />
        {{ notification.message }}
      </div>
      <template #actions>
        <VBtn icon @click="closeNotification(notification.id)">
          <VIcon icon="mdi-close" />
        </VBtn>
      </template>
    </VSnackbar>
  </div>
</template>

<style scoped>
/* .notification-system {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  width: 100%;
}

.notification-system :deep(.v-snackbar__wrapper) {
  pointer-events: auto;
} */
</style>
