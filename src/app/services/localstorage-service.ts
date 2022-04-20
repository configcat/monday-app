import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

    inMemoryStorage: { [key: string]: string } = {};

    getItem(key: string): string | null {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            if (this.inMemoryStorage.hasOwnProperty(key)) {
                return this.inMemoryStorage[key];
            }
        }
        return null;
    }

    setItem(key: string, value: string): void {
        try {
            return localStorage.setItem(key, value);
        } catch (e) {
            this.inMemoryStorage[key] = value;
        }
    }

    removeItem(key: string): void {
        try {
            return localStorage.removeItem(key);
        } catch (e) {
            delete this.inMemoryStorage[key];
        }
    }
}
