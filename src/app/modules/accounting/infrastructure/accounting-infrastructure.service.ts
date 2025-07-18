import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpService, PaginationParams } from '../../../shared/services/base-http.service';
import { 
  AccountingEntry, 
  Account, 
  CreateAccountingEntryRequest, 
  CreateAccountRequest, 
  UpdateAccountRequest 
} from '../../../shared/models/accounting.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountingInfrastructureService extends BaseHttpService {
  private readonly accountsEndpoint = '/accounts';
  private readonly entriesEndpoint = '/accounting-entries';

  // Account methods
  findAllAccounts(paginationParams?: PaginationParams): Observable<Account[]> {
    return this.getPaginated<Account>(this.accountsEndpoint, paginationParams)
      .pipe(map(response => response.data || []));
  }

  findAccountById(id: string): Observable<Account | null> {
    return this.get<Account>(`${this.accountsEndpoint}/${id}`)
      .pipe(map(response => response.data || null));
  }

  createAccount(accountData: CreateAccountRequest): Observable<Account> {
    return this.post<CreateAccountRequest, Account>(this.accountsEndpoint, accountData)
      .pipe(map(response => response.data!));
  }

  updateAccount(id: string, accountData: UpdateAccountRequest): Observable<Account> {
    return this.put<UpdateAccountRequest, Account>(`${this.accountsEndpoint}/${id}`, accountData)
      .pipe(map(response => response.data!));
  }

  deleteAccount(id: string): Observable<void> {
    return super.delete(`${this.accountsEndpoint}/${id}`)
      .pipe(map(() => void 0));
  }

  findAccountByCode(code: string): Observable<Account | null> {
    return this.get<Account>(`${this.accountsEndpoint}/code/${code}`)
      .pipe(map(response => response.data || null));
  }

  findAccountsByType(type: string, paginationParams?: PaginationParams): Observable<Account[]> {
    return this.getPaginated<Account>(`${this.accountsEndpoint}/type/${type}`, paginationParams)
      .pipe(map(response => response.data || []));
  }

  getAccountBalance(id: string): Observable<number> {
    return this.get<{ balance: number }>(`${this.accountsEndpoint}/${id}/balance`)
      .pipe(map(response => response.data?.balance || 0));
  }

  searchAccounts(query: string, paginationParams?: PaginationParams): Observable<Account[]> {
    const params = { query, ...paginationParams };
    return this.getPaginated<Account>(`${this.accountsEndpoint}/search`, undefined, params)
      .pipe(map(response => response.data || []));
  }

  // Accounting Entry methods
  findAllEntries(paginationParams?: PaginationParams): Observable<AccountingEntry[]> {
    return this.getPaginated<AccountingEntry>(this.entriesEndpoint, paginationParams)
      .pipe(map(response => response.data || []));
  }

  findEntryById(id: string): Observable<AccountingEntry | null> {
    return this.get<AccountingEntry>(`${this.entriesEndpoint}/${id}`)
      .pipe(map(response => response.data || null));
  }

  createEntry(entryData: CreateAccountingEntryRequest): Observable<AccountingEntry> {
    return this.post<CreateAccountingEntryRequest, AccountingEntry>(this.entriesEndpoint, entryData)
      .pipe(map(response => response.data!));
  }

  updateEntry(id: string, entryData: Partial<AccountingEntry>): Observable<AccountingEntry> {
    return this.put<Partial<AccountingEntry>, AccountingEntry>(`${this.entriesEndpoint}/${id}`, entryData)
      .pipe(map(response => response.data!));
  }

  deleteEntry(id: string): Observable<void> {
    return super.delete(`${this.entriesEndpoint}/${id}`)
      .pipe(map(() => void 0));
  }

  findEntriesByDateRange(startDate: Date, endDate: Date, paginationParams?: PaginationParams): Observable<AccountingEntry[]> {
    const params = { 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString(),
      ...paginationParams 
    };
    return this.getPaginated<AccountingEntry>(`${this.entriesEndpoint}/date-range`, undefined, params)
      .pipe(map(response => response.data || []));
  }

  findEntriesByAccount(accountId: string, paginationParams?: PaginationParams): Observable<AccountingEntry[]> {
    return this.getPaginated<AccountingEntry>(`${this.entriesEndpoint}/account/${accountId}`, paginationParams)
      .pipe(map(response => response.data || []));
  }

  postEntry(id: string): Observable<AccountingEntry> {
    return this.patch<{}, AccountingEntry>(`${this.entriesEndpoint}/${id}/post`, {})
      .pipe(map(response => response.data!));
  }

  searchEntries(query: string, paginationParams?: PaginationParams): Observable<AccountingEntry[]> {
    const params = { query, ...paginationParams };
    return this.getPaginated<AccountingEntry>(`${this.entriesEndpoint}/search`, undefined, params)
      .pipe(map(response => response.data || []));
  }

  getTrialBalance(startDate?: Date, endDate?: Date): Observable<Account[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return this.get<Account[]>('/reports/trial-balance', params)
      .pipe(map(response => response.data || []));
  }

  getBalanceSheet(date?: Date): Observable<any> {
    const params: any = {};
    if (date) params.date = date.toISOString();

    return this.get<any>('/reports/balance-sheet', params)
      .pipe(map(response => response.data));
  }

  getIncomeStatement(startDate: Date, endDate: Date): Observable<any> {
    const params = { 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString() 
    };

    return this.get<any>('/reports/income-statement', params)
      .pipe(map(response => response.data));
  }
}
