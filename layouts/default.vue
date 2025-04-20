<script setup lang="ts">
const drawer = ref(false);
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" density="compact" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title>RouteOptimizer</v-app-bar-title>

      <v-spacer />

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>

      <v-btn icon class="ml-2">
        <v-avatar size="32">
          <v-img
            src="https://randomuser.me/api/portraits/men/85.jpg"
            alt="Avatar"
          />
        </v-avatar>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        title="José Silva"
        subtitle="Administrador"
      />

      <v-divider />

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          to="/"
        />
        <v-list-item
          prepend-icon="mdi-map-marker-path"
          title="Rotas"
          to="/routes"
        />
        <v-list-item
          prepend-icon="mdi-truck-delivery"
          title="Entregas"
          to="/deliveries"
        />
        <!-- Menu com submenu para Clientes -->
        <v-list-group>
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-group"
              title="Clientes"
            />
          </template>

          <v-list-item
            title="Cadastrar Cliente"
            prepend-icon="mdi-account-plus"
            to="/customers/register"
          />

          <v-list-item
            title="Listar Clientes"
            prepend-icon="mdi-format-list-bulleted"
            to="/customers/list"
          />

          <v-list-item
            title="Segmentação"
            prepend-icon="mdi-chart-bubble"
            to="/customers/segments"
            class="pl-2"
          />
        </v-list-group>
        <v-list-item
          prepend-icon="mdi-account-hard-hat"
          title="Entregadores"
          to="/drivers"
        />
        <v-list-item
          prepend-icon="mdi-chart-bar"
          title="Relatórios"
          to="/reports"
        />
        <v-list-group>
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-cog"
              title="Configurações"
            />
          </template>

          <v-list-item
            title="Banco de Dados"
            prepend-icon="mdi-database"
            to="/settings/database"
          />
        </v-list-group>
      </v-list>

      <template #append>
        <div class="pa-2">
          <v-btn block color="error" prepend-icon="mdi-logout"> Sair </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="h-[calc(100svh-85px)]">
        <!-- Este é o slot onde será renderizado o conteúdo das suas páginas -->
        <slot />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer
      app
      class="d-flex flex-column flex-sm-row justify-space-between align-center pa-2"
    >
      <div class="text-caption">
        RouteOptimizer &copy; {{ new Date().getFullYear() }}
      </div>
      <div class="text-caption">v1.0.0</div>
    </v-footer>
  </v-app>
</template>

<style scoped>
/* Ajuste visual para os sub-itens */
:deep(.v-list-group__items .v-list-item) {
  padding-left: 0px;
}
</style>
