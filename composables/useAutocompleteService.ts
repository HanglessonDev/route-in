import type { AutocompleteAddress } from '~/modules/offlineDB/domain/autocompleteAddressEntitie';
import { AutocompleteService } from '~/modules/offlineDB/domain/autocompleteService';
import { AutocompleteRepository } from '~/modules/offlineDB/infra/autocompleteRepository';

export const useAutocompleteService = () => {
  const repository = new AutocompleteRepository();
  const service = new AutocompleteService(repository);

  const addresses = ref<AutocompleteAddress[]>([]);
  const addressesPaginated = ref<AutocompleteAddress[]>([]);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const totalCount = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(15);
  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageSize.value)
  );

  async function loadAddresses(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      addresses.value = await service.getAllAddresses();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  async function loadAddressesPaginated(
    page = currentPage.value
  ): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      currentPage.value = page;
      addressesPaginated.value = await service.getPaginatedAddresses(
        page,
        pageSize.value
      );
      totalCount.value = await service.getAddressCount();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  async function goToNextPage(): Promise<void> {
    if (currentPage.value < totalPages.value) {
      await loadAddressesPaginated(currentPage.value + 1);
    }
  }

  async function goToPreviousPage(): Promise<void> {
    if (currentPage.value > 1) {
      await loadAddressesPaginated(currentPage.value - 1);
    }
  }

  async function addAddress(address: Partial<AutocompleteAddress>) {
    isLoading.value = true;
    error.value = null;
    try {
      await service.createAddress(address);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAddress(address: AutocompleteAddress) {
    isLoading.value = true;
    error.value = null;
    try {
      await service.updateAddress(address);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAddress(id: number) {
    isLoading.value = true;
    error.value = null;
    try {
      await service.deleteAddress(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function importAddresses(jsonString: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await service.importAddresses(jsonString);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function exportAddresses() {
    isLoading.value = true;
    error.value = null;
    try {
      return await service.exportAddresses();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function bulkCreateAddresses(addresses: AutocompleteAddress[]) {
    isLoading.value = true;
    error.value = null;
    try {
      await service.bulkCreateAddresses(addresses);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function getAddressById(id: number) {
    isLoading.value = true;
    error.value = null;
    try {
      return await service.getAddressById(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function getAddressesByStreet(street: string) {
    isLoading.value = true;
    error.value = null;
    try {
      return await service.getAddressesByStreet(street);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function getAddressesByZipCode(zipCode: string) {
    isLoading.value = true;
    error.value = null;
    try {
      return await service.getAddressesByZipCode(zipCode);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    addresses,
    isLoading,
    error,
    addressesPaginated,
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    loadAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    importAddresses,
    exportAddresses,
    bulkCreateAddresses,
    getAddressById,
    getAddressesByStreet,
    getAddressesByZipCode,
    goToNextPage,
    goToPreviousPage,
    loadAddressesPaginated,
  };
};
