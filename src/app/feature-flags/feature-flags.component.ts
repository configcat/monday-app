import { Component, inject, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { Router, RouterLink } from "@angular/router";
import { EvaluationVersion, IntegrationLinkDetail, IntegrationLinkType } from "ng-configcat-publicapi";
import { DeleteSettingDialogComponent, DeleteSettingDialogData, DeleteSettingDialogResult, DeleteSettingModel, FeatureFlagItemComponent, PublicApiService, SettingItemComponent } from "ng-configcat-publicapi-ui";
import { firstValueFrom } from "rxjs";
import { LoaderComponent } from "../loader/loader.component";
import { AuthorizationParameters } from "../models/authorization-parameters";
import { MondayService } from "../services/monday-service";

@Component({
  selector: "configcat-monday-feature-flags",
  templateUrl: "./feature-flags.component.html",
  styleUrls: ["./feature-flags.component.scss"],
  imports: [LoaderComponent, RouterLink, MatButton, FeatureFlagItemComponent, SettingItemComponent],
})
export class FeatureFlagsComponent implements OnInit {
  private readonly mondayService = inject(MondayService);
  private readonly router = inject(Router);
  private readonly publicApiService = inject(PublicApiService);
  private readonly dialog = inject(MatDialog);

  loading = true;
  authorizationParameters!: AuthorizationParameters;
  integrationLinkDetails!: IntegrationLinkDetail[];
  EvaluationVersion = EvaluationVersion;

  ngOnInit(): void {
    this.mondayService.isViewOnly().then(isViewOnly => {
      if (isViewOnly) {
        this.redirectToViewerOnly();
        return;
      }

      const params = this.mondayService.getAuthorizationParameters();
      if (!params) {
        this.redirectToAuth();
        return;
      }
      this.authorizationParameters = params;
      void this.loadFeatureFlags();
    }).catch((error: unknown) => { console.log(error); });

  }

  loadFeatureFlags() {
    return this.mondayService.getContext().then(context => {
      this.publicApiService
        .createIntegrationLinksService(this.authorizationParameters.basicAuthUsername, this.authorizationParameters.basicAuthPassword)
        .getIntegrationLinkDetails(IntegrationLinkType.Monday, context?.data?.itemId || "1")
        .subscribe((integrationLinkDetails) => {
          this.integrationLinkDetails = integrationLinkDetails?.details || [];
          this.loading = false;
        });
    });

  }

  redirectToAuth() {
    void this.router.navigate(["/authorize"]);
  }

  redirectToViewerOnly() {
    void this.router.navigate(["/vieweronly"]);
  }

  onDeleteSettingRequested(data: DeleteSettingModel) {
    const dialogRef = this.dialog.open<
      DeleteSettingDialogComponent,
      DeleteSettingDialogData,
      DeleteSettingDialogResult
    >(DeleteSettingDialogComponent, {
      data: {
        system: "Monday",
        ticketType: "item",
      },
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!result || result.button !== "remove") {
          return;
        }
        this.mondayService.getContext()
          .then(context => {
            return firstValueFrom(this.publicApiService
              .createIntegrationLinksService(this.authorizationParameters.basicAuthUsername, this.authorizationParameters.basicAuthPassword)
              .deleteIntegrationLink(data.environment.environmentId, data.setting.settingId, IntegrationLinkType.Monday, context.data.itemId));
          })
          .then(() => {
            return this.loadFeatureFlags();
          })
          .catch((error: unknown) => {
            console.log(error);
          });
      });
  }
}
