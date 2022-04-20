import { Injectable } from '@angular/core';
import { AuthorizationParameters } from '../models/authorization-parameters';
import mondaySdk from "monday-sdk-js";
import { LocalStorageService } from './localstorage-service';
const monday = mondaySdk();

@Injectable({
    providedIn: 'root'
})
export class MondayService {

    authorizationkey = 'configcat-auth';

    constructor(
        private localStorageService: LocalStorageService) { }

    getAuthorizationParameters(): AuthorizationParameters | null {
        const stored = this.localStorageService.getItem(this.authorizationkey);
        if (!stored) {
            return null;
        }
        const authorizationParameters: AuthorizationParameters = JSON.parse(atob(stored) || '{}');
        if (authorizationParameters
            && authorizationParameters.basicAuthPassword && authorizationParameters.basicAuthUsername
            && authorizationParameters.email && authorizationParameters.fullName) {
            return authorizationParameters;
        }
        else {
            return null;
        }
    }

    setAuthorizationParameters(authorizationParameters: AuthorizationParameters) {
        this.localStorageService.setItem(this.authorizationkey, btoa(JSON.stringify(authorizationParameters)));
    }

    removeAuthorizationParameters() {
        this.localStorageService.removeItem(this.authorizationkey);
    }

    getContext(): Promise<any> {
        return monday.get("context");
    }

    showSuccessMessage(message: string) {
        monday.execute("notice", {
            message: message,
            type: 'success',
            timeout: 2000,
        });
    }
}
