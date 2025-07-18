import { 
  AccountingEntry, 
  AccountingEntryDetail, 
  Account, 
  CreateAccountingEntryRequest, 
  CreateAccountRequest, 
  UpdateAccountRequest 
} from '../../../shared/models/accounting.interface';

// Domain interfaces for Accounting module
export interface AccountRepository {
  findAll(params?: any): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  create(account: CreateAccountRequest): Promise<Account>;
  update(id: string, account: UpdateAccountRequest): Promise<Account>;
  delete(id: string): Promise<void>;
  findByCode(code: string): Promise<Account | null>;
  findByType(type: string): Promise<Account[]>;
  getAccountBalance(id: string): Promise<number>;
}

export interface AccountingEntryRepository {
  findAll(params?: any): Promise<AccountingEntry[]>;
  findById(id: string): Promise<AccountingEntry | null>;
  create(entry: CreateAccountingEntryRequest): Promise<AccountingEntry>;
  update(id: string, entry: Partial<AccountingEntry>): Promise<AccountingEntry>;
  delete(id: string): Promise<void>;
  findByDateRange(startDate: Date, endDate: Date): Promise<AccountingEntry[]>;
  findByAccount(accountId: string): Promise<AccountingEntry[]>;
  postEntry(id: string): Promise<AccountingEntry>;
}

export interface AccountingUseCases {
  // Account use cases
  getAllAccounts(params?: any): Promise<Account[]>;
  getAccountById(id: string): Promise<Account>;
  createAccount(accountData: CreateAccountRequest): Promise<Account>;
  updateAccount(id: string, accountData: UpdateAccountRequest): Promise<Account>;
  deleteAccount(id: string): Promise<void>;
  getAccountByCode(code: string): Promise<Account>;
  getAccountsByType(type: string): Promise<Account[]>;
  getAccountBalance(id: string): Promise<number>;

  // Accounting Entry use cases
  getAllEntries(params?: any): Promise<AccountingEntry[]>;
  getEntryById(id: string): Promise<AccountingEntry>;
  createEntry(entryData: CreateAccountingEntryRequest): Promise<AccountingEntry>;
  updateEntry(id: string, entryData: Partial<AccountingEntry>): Promise<AccountingEntry>;
  deleteEntry(id: string): Promise<void>;
  getEntriesByDateRange(startDate: Date, endDate: Date): Promise<AccountingEntry[]>;
  getEntriesByAccount(accountId: string): Promise<AccountingEntry[]>;
  postEntry(id: string): Promise<AccountingEntry>;
}
