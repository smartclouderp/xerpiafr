import { Provider, CreateProviderRequest, UpdateProviderRequest } from '../../../shared/models/provider.interface';

// Domain interfaces for Provider module
export interface ProviderRepository {
  findAll(params?: any): Promise<Provider[]>;
  findById(id: string): Promise<Provider | null>;
  create(provider: CreateProviderRequest): Promise<Provider>;
  update(id: string, provider: UpdateProviderRequest): Promise<Provider>;
  delete(id: string): Promise<void>;
  findByTaxId(taxId: string): Promise<Provider | null>;
  findByEmail(email: string): Promise<Provider | null>;
}

export interface ProviderUseCases {
  getAllProviders(params?: any): Promise<Provider[]>;
  getProviderById(id: string): Promise<Provider>;
  createProvider(providerData: CreateProviderRequest): Promise<Provider>;
  updateProvider(id: string, providerData: UpdateProviderRequest): Promise<Provider>;
  deleteProvider(id: string): Promise<void>;
  getProviderByTaxId(taxId: string): Promise<Provider>;
  getProviderByEmail(email: string): Promise<Provider>;
  searchProviders(query: string): Promise<Provider[]>;
}
