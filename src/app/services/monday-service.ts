import { Injectable } from '@angular/core';
import { AuthorizationParameters } from '../models/authorization-parameters';
import mondaySdk from "monday-sdk-js";
import { LocalStorageService } from './localstorage-service';
import jwt_decode from 'jwt-decode';
const monday = mondaySdk();

@Injectable({
    providedIn: 'root'
})
export class MondayService {

    authorizationkey = 'configcat-auth';

    constructor(
        private localStorageService: LocalStorageService) { }

    getAuthorizationParameters(): AuthorizationParameters | null {
        try {
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
        catch {
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

    isViewOnly(): Promise<boolean> {
        return monday.get("sessionToken")
            .then((sessionToken: any) => {
                if (!sessionToken?.data) {
                    return false;
                }

                try {
                    const decoded: any = jwt_decode(sessionToken.data);

                    return decoded?.dat?.is_view_only ?? false;
                } catch (error) {
                    return false;
                }
            });
    }

    getSlug(itemId: any): Promise<any> {
        return monday.api(`query { items (ids: [${itemId}]) { id, board {id}, name }}`)
            .then((res: any) => res?.data?.items?.length ? res.data.items[0] : null);
    }

    getItem(itemId: any): Promise<any> {
        return monday.api(`query { items (ids: [${itemId}]) { id, board {id}, name }}`)
            .then((res: any) => res?.data?.items?.length ? res.data.items[0] : null);
    }

    showSuccessMessage(message: string) {
        monday.execute("notice", {
            message: message,
            type: 'success',
            timeout: 2000,
        });
    }

    getParentOrigin() {
        const locationAreDisctint = (window.location !== window.parent.location);
        const parentOrigin = '' + ((locationAreDisctint ? document.referrer : document.location) || '');

        if (parentOrigin) {
            return new URL(parentOrigin).origin;
        }

        const currentLocation = document.location;

        if (currentLocation.ancestorOrigins && currentLocation.ancestorOrigins.length) {
            return currentLocation.ancestorOrigins[0];
        }

        return '';
    }
}
