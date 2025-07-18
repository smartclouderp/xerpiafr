import { Injectable } from '@angular/core';
import { AccountingInfrastructureService } from '../infrastructure/accounting-infrastructure.service';
import { 
  AccountingEntry, 
  Account, 
  CreateAccountingEntryRequest, 
  CreateAccountRequest, 
  UpdateAccountRequest,
  AccountType 
} from '../../../shared/models/accounting.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountingApplicationService {
  constructor(private accountingInfrastructure: AccountingInfrastructureService) {}

  // Account use cases
  getAllAccounts(params?: any): Observable<Account[]> {
    return this.accountingInfrastructure.findAllAccounts(params).pipe(
      catchError(error => {
        console.error('Error fetching accounts:', error);
        return throwError(() => new Error('Failed to fetch accounts'));
      })
    );
  }

  getAccountById(id: string): Observable<Account | null> {
    if (!id) {
      return throwError(() => new Error('Account ID is required'));
    }

    return this.accountingInfrastructure.findAccountById(id).pipe(
      catchError(error => {
        console.error('Error fetching account:', error);
        return throwError(() => new Error('Failed to fetch account'));
      })
    );
  }

  createAccount(accountData: CreateAccountRequest): Observable<Account> {
    if (!this.validateAccountData(accountData)) {
      return throwError(() => new Error('Invalid account data'));
    }

    return this.accountingInfrastructure.createAccount(accountData).pipe(
      catchError(error => {
        console.error('Error creating account:', error);
        return throwError(() => new Error('Failed to create account'));
      })
    );
  }

  updateAccount(id: string, accountData: UpdateAccountRequest): Observable<Account> {
    if (!id) {
      return throwError(() => new Error('Account ID is required'));
    }

    return this.accountingInfrastructure.updateAccount(id, accountData).pipe(
      catchError(error => {
        console.error('Error updating account:', error);
        return throwError(() => new Error('Failed to update account'));
      })
    );
  }

  deleteAccount(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('Account ID is required'));
    }

    return this.accountingInfrastructure.deleteAccount(id).pipe(
      catchError(error => {
        console.error('Error deleting account:', error);
        return throwError(() => new Error('Failed to delete account'));
      })
    );
  }

  getAccountByCode(code: string): Observable<Account | null> {
    if (!code) {
      return throwError(() => new Error('Account code is required'));
    }

    return this.accountingInfrastructure.findAccountByCode(code).pipe(
      catchError(error => {
        console.error('Error fetching account by code:', error);
        return throwError(() => new Error('Failed to fetch account by code'));
      })
    );
  }

  getAccountsByType(type: string, params?: any): Observable<Account[]> {
    if (!type || !Object.values(AccountType).includes(type as AccountType)) {
      return throwError(() => new Error('Valid account type is required'));
    }

    return this.accountingInfrastructure.findAccountsByType(type, params).pipe(
      catchError(error => {
        console.error('Error fetching accounts by type:', error);
        return throwError(() => new Error('Failed to fetch accounts by type'));
      })
    );
  }

  getAccountBalance(id: string): Observable<number> {
    if (!id) {
      return throwError(() => new Error('Account ID is required'));
    }

    return this.accountingInfrastructure.getAccountBalance(id).pipe(
      catchError(error => {
        console.error('Error fetching account balance:', error);
        return throwError(() => new Error('Failed to fetch account balance'));
      })
    );
  }

  searchAccounts(query: string, params?: any): Observable<Account[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Search query must be at least 2 characters'));
    }

    return this.accountingInfrastructure.searchAccounts(query.trim(), params).pipe(
      catchError(error => {
        console.error('Error searching accounts:', error);
        return throwError(() => new Error('Failed to search accounts'));
      })
    );
  }

  // Accounting Entry use cases
  getAllEntries(params?: any): Observable<AccountingEntry[]> {
    return this.accountingInfrastructure.findAllEntries(params).pipe(
      catchError(error => {
        console.error('Error fetching accounting entries:', error);
        return throwError(() => new Error('Failed to fetch accounting entries'));
      })
    );
  }

  getEntryById(id: string): Observable<AccountingEntry | null> {
    if (!id) {
      return throwError(() => new Error('Entry ID is required'));
    }

    return this.accountingInfrastructure.findEntryById(id).pipe(
      catchError(error => {
        console.error('Error fetching accounting entry:', error);
        return throwError(() => new Error('Failed to fetch accounting entry'));
      })
    );
  }

  createEntry(entryData: CreateAccountingEntryRequest): Observable<AccountingEntry> {
    if (!this.validateEntryData(entryData)) {
      return throwError(() => new Error('Invalid entry data'));
    }

    if (!this.validateDoubleEntry(entryData.entries)) {
      return throwError(() => new Error('Entry does not balance - total debits must equal total credits'));
    }

    return this.accountingInfrastructure.createEntry(entryData).pipe(
      catchError(error => {
        console.error('Error creating accounting entry:', error);
        return throwError(() => new Error('Failed to create accounting entry'));
      })
    );
  }

  updateEntry(id: string, entryData: Partial<AccountingEntry>): Observable<AccountingEntry> {
    if (!id) {
      return throwError(() => new Error('Entry ID is required'));
    }

    return this.accountingInfrastructure.updateEntry(id, entryData).pipe(
      catchError(error => {
        console.error('Error updating accounting entry:', error);
        return throwError(() => new Error('Failed to update accounting entry'));
      })
    );
  }

  deleteEntry(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('Entry ID is required'));
    }

    return this.accountingInfrastructure.deleteEntry(id).pipe(
      catchError(error => {
        console.error('Error deleting accounting entry:', error);
        return throwError(() => new Error('Failed to delete accounting entry'));
      })
    );
  }

  getEntriesByDateRange(startDate: Date, endDate: Date, params?: any): Observable<AccountingEntry[]> {
    if (!startDate || !endDate) {
      return throwError(() => new Error('Start date and end date are required'));
    }

    if (startDate > endDate) {
      return throwError(() => new Error('Start date cannot be after end date'));
    }

    return this.accountingInfrastructure.findEntriesByDateRange(startDate, endDate, params).pipe(
      catchError(error => {
        console.error('Error fetching entries by date range:', error);
        return throwError(() => new Error('Failed to fetch entries by date range'));
      })
    );
  }

  getEntriesByAccount(accountId: string, params?: any): Observable<AccountingEntry[]> {
    if (!accountId) {
      return throwError(() => new Error('Account ID is required'));
    }

    return this.accountingInfrastructure.findEntriesByAccount(accountId, params).pipe(
      catchError(error => {
        console.error('Error fetching entries by account:', error);
        return throwError(() => new Error('Failed to fetch entries by account'));
      })
    );
  }

  postEntry(id: string): Observable<AccountingEntry> {
    if (!id) {
      return throwError(() => new Error('Entry ID is required'));
    }

    return this.accountingInfrastructure.postEntry(id).pipe(
      catchError(error => {
        console.error('Error posting entry:', error);
        return throwError(() => new Error('Failed to post entry'));
      })
    );
  }

  searchEntries(query: string, params?: any): Observable<AccountingEntry[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Search query must be at least 2 characters'));
    }

    return this.accountingInfrastructure.searchEntries(query.trim(), params).pipe(
      catchError(error => {
        console.error('Error searching entries:', error);
        return throwError(() => new Error('Failed to search entries'));
      })
    );
  }

  // Reporting use cases
  getTrialBalance(startDate?: Date, endDate?: Date): Observable<Account[]> {
    return this.accountingInfrastructure.getTrialBalance(startDate, endDate).pipe(
      catchError(error => {
        console.error('Error fetching trial balance:', error);
        return throwError(() => new Error('Failed to fetch trial balance'));
      })
    );
  }

  getBalanceSheet(date?: Date): Observable<any> {
    return this.accountingInfrastructure.getBalanceSheet(date).pipe(
      catchError(error => {
        console.error('Error fetching balance sheet:', error);
        return throwError(() => new Error('Failed to fetch balance sheet'));
      })
    );
  }

  getIncomeStatement(startDate: Date, endDate: Date): Observable<any> {
    if (!startDate || !endDate) {
      return throwError(() => new Error('Start date and end date are required'));
    }

    if (startDate > endDate) {
      return throwError(() => new Error('Start date cannot be after end date'));
    }

    return this.accountingInfrastructure.getIncomeStatement(startDate, endDate).pipe(
      catchError(error => {
        console.error('Error fetching income statement:', error);
        return throwError(() => new Error('Failed to fetch income statement'));
      })
    );
  }

  private validateAccountData(accountData: CreateAccountRequest): boolean {
    return !!(
      accountData.code?.trim() &&
      accountData.name?.trim() &&
      accountData.type &&
      Object.values(AccountType).includes(accountData.type)
    );
  }

  private validateEntryData(entryData: CreateAccountingEntryRequest): boolean {
    return !!(
      entryData.date &&
      entryData.description?.trim() &&
      entryData.reference?.trim() &&
      entryData.entries &&
      entryData.entries.length >= 2
    );
  }

  private validateDoubleEntry(entries: any[]): boolean {
    const totalDebits = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredits = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    
    // Allow for small floating point differences
    return Math.abs(totalDebits - totalCredits) < 0.01;
  }
}
