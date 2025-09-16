import { inject, Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import mondaySdk from "monday-sdk-js";
import { BaseContext } from "monday-sdk-js/types/client-context.type";
import { AuthorizationParameters } from "../models/authorization-parameters";
import { QueryItem, QueryItems } from "../models/query-item";
import { LocalStorageService } from "./localstorage-service";

const monday = mondaySdk();

@Injectable({
  providedIn: "root",
})
export class MondayService {
  private readonly localStorageService = inject(LocalStorageService);

  authorizationkey = "configcat-auth";

  getAuthorizationParameters(): AuthorizationParameters | null {
    try {
      const stored = this.localStorageService.getItem(this.authorizationkey);
      if (!stored) {
        return null;
      }
      const authorizationParameters: AuthorizationParameters = JSON.parse(atob(stored) || "{}") as AuthorizationParameters;
      if (authorizationParameters?.basicAuthPassword && authorizationParameters.basicAuthUsername
                && authorizationParameters.email && authorizationParameters.fullName) {
        return authorizationParameters;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  setAuthorizationParameters(authorizationParameters: AuthorizationParameters) {
    this.localStorageService.setItem(this.authorizationkey, btoa(JSON.stringify(authorizationParameters)));
  }

  removeAuthorizationParameters() {
    this.localStorageService.removeItem(this.authorizationkey);
  }

  getContext(): Promise<BaseContext & {
    workspaceId: number;
    boardId: number;
    boardIds: [number];
    itemId: number;
    instanceId: number;
    instanceType: string;
  }> {
    return monday.get("context", { appFeatureType: "AppFeatureItemView" }).then(result => {
      return Promise.resolve(result.data);
    });
  }

  isViewOnly(): Promise<boolean> {
    return monday.get("sessionToken")
      .then((sessionToken) => {
        if (!sessionToken?.data) {
          return false;
        }

        try {
          const decoded = jwtDecode<
            {
              "exp": string;
              "dat": {
                "account_id": number;
                "user_id": number;
                "is_view_only": boolean;
              };
            }>(sessionToken.data);

          return decoded.dat.is_view_only ?? false;
        } catch (error: unknown) {
          console.log(error);
          return false;
        }
      });
  }

  getSlug(itemId: number): Promise<QueryItem | null> {
    return monday.api(`query { items (ids: [${itemId}]) { id, board {id}, name }}`, { apiVersion: "2024-01" })
      .then((res: { data: QueryItems; account_id: number }) => res.data.items.length ? res.data.items[0] : null);
  }

  getItem(itemId: number): Promise<QueryItem> {
    return monday.api<QueryItems>(`query { items (ids: [${itemId}]) { id, board {id}, name }}`, { apiVersion: "2024-01" })
      .then((res: { data: QueryItems; account_id: number }) => res.data.items[0]);
  }

  showSuccessMessage(message: string) {
    void monday.execute("notice", {
      message: message,
      type: "success",
      timeout: 2000,
    });
  }

  getParentOrigin() {
    const locationAreDisctint = (window.location !== window.parent.location);
    const parentOrigin = ((locationAreDisctint ? document.referrer : document.location.href) || "");

    if (parentOrigin) {
      return new URL(parentOrigin).origin;
    }

    const currentLocation = document.location;

    if (currentLocation.ancestorOrigins?.length) {
      return currentLocation.ancestorOrigins[0];
    }

    return "";
  }
}
