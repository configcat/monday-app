import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LocalStorageService {

  inMemoryStorage: Record<string, string> = {};

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error: unknown) {
      console.log(error);
      if (Object.prototype.hasOwnProperty.call(this.inMemoryStorage, key)) {
        return this.inMemoryStorage[key];
      }
    }
    return null;
  }

  setItem(key: string, value: string): void {
    try {
      return localStorage.setItem(key, value);
    } catch (error: unknown) {
      console.log(error);
      this.inMemoryStorage[key] = value;
    }
  }

  removeItem(key: string): void {
    try {
      return localStorage.removeItem(key);
    } catch (error: unknown) {
      console.log(error);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.inMemoryStorage[key];
    }
  }
}
