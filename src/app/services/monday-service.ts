import { Injectable } from '@angular/core';
import { AuthorizationParameters } from '../models/authorization-parameters';
import { PublicApiService } from 'ng-configcat-publicapi-ui';
import { IntegrationLinkType } from 'ng-configcat-publicapi';
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

@Injectable({
    providedIn: 'root'
})
export class MondayService {

    constructor(private publicApiService: PublicApiService) { }

    getAuthorizationParameters(): Promise<AuthorizationParameters> {
        return monday.storage.instance.getItem('authorization').then((res: any) => {
            if (res?.data?.value) {
                return JSON.parse(res.data.value);
            }
            return null;
        });
    }

    setAuthorizationParameters(authorizationParameters: AuthorizationParameters): Promise<any> {
        return monday.storage.instance.setItem('authorization', JSON.stringify(authorizationParameters));
    }

    removeAuthorizationParameters(): Promise<any> {
        return monday.storage.instance.setItem('authorization', '');
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
