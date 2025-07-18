export interface AccountingEntry {
  id: string;
  date: Date;
  description: string;
  reference: string;
  totalAmount: number;
  entries: AccountingEntryDetail[];
  isPosted: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountingEntryDetail {
  id: string;
  accountId: string;
  account: Account;
  debit: number;
  credit: number;
  description?: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  parent?: Account;
  children?: Account[];
  balance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountingEntryRequest {
  date: Date;
  description: string;
  reference: string;
  entries: CreateAccountingEntryDetailRequest[];
}

export interface CreateAccountingEntryDetailRequest {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface CreateAccountRequest {
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
}

export interface UpdateAccountRequest {
  code?: string;
  name?: string;
  type?: AccountType;
  parentId?: string;
  isActive?: boolean;
}

export enum AccountType {
  ASSET = 'asset',
  LIABILITY = 'liability',
  EQUITY = 'equity',
  REVENUE = 'revenue',
  EXPENSE = 'expense'
}
