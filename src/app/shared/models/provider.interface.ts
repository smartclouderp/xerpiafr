export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: ProviderAddress;
  taxId: string;
  contactPerson: string;
  website?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProviderRequest {
  name: string;
  email: string;
  phone: string;
  address: ProviderAddress;
  taxId: string;
  contactPerson: string;
  website?: string;
  notes?: string;
}

export interface UpdateProviderRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: ProviderAddress;
  taxId?: string;
  contactPerson?: string;
  website?: string;
  notes?: string;
  isActive?: boolean;
}

export interface ProviderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
