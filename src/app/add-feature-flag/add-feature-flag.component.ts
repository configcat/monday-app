import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IntegrationLinkType } from "ng-configcat-publicapi";
import {
  DEFAULT_CUSTOMIZE_LINK_FEATURE_FLAG,
  ICustomizeLinkFeatureFlag,
  LinkFeatureFlagComponent,
  LinkFeatureFlagParameters,
  LoaderComponent,
  PublicApiService,
} from "ng-configcat-publicapi-ui";
import { AuthorizationParameters } from "../models/authorization-parameters";
import { ErrorHandler } from "../services/error-handler";
import { MondayService } from "../services/monday-service";

@Component({
  selector: "configcat-monday-add-feature-flag",
  templateUrl: "./add-feature-flag.component.html",
  styleUrls: ["./add-feature-flag.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LinkFeatureFlagComponent, LoaderComponent],
})
export class AddFeatureFlagComponent implements OnInit {
  private readonly mondayService = inject(MondayService);
  private readonly publicApiService = inject(PublicApiService);
  private readonly router = inject(Router);

  loading = true;

  authorizationParameters!: AuthorizationParameters | null;
  ErrorHandler = ErrorHandler;

  ngOnInit(): void {
    this.authorizationParameters = null;

    this.authorizationParameters = this.mondayService.getAuthorizationParameters();
    this.loading = false;
  }

  add(linkFeatureFlagParameters: LinkFeatureFlagParameters) {
    this.mondayService
      .getContext()
      .then(context => this.mondayService.getItem(context.itemId))
      .then(item => {
        let url = "";
        if (item?.id && item?.board?.id) {
          url = this.mondayService.getParentOrigin();
          if (url) {
            url += `/boards/${item.board.id}/pulses/${item.id}`;
          }
        }

        this.publicApiService
          .createIntegrationLinksService(
            this.authorizationParameters?.basicAuthUsername,
            this.authorizationParameters?.basicAuthPassword
          )
          .addOrUpdateIntegrationLink(
            linkFeatureFlagParameters.environmentId,
            linkFeatureFlagParameters.settingId,
            IntegrationLinkType.Monday,
            item?.id,
            { description: item?.name, url }
          )
          .subscribe({
            next: () => {
              linkFeatureFlagParameters.callback();
              void this.router.navigate(["/"]);
            },
            error: (error: Error) => {
              let errorMessage: string;
              if (error instanceof HttpErrorResponse && error?.status === 409) {
                errorMessage = "Integration link already exists.";
              } else {
                errorMessage = ErrorHandler.getErrorMessage(error);
              }
              linkFeatureFlagParameters.callback();
              this.mondayService.showErrorMessage(errorMessage);
              console.log(error);
            },
          });
      })
      .catch((error: unknown) => {
        this.mondayService.showErrorMessage(ErrorHandler.getErrorMessage(error as Error));
        console.log(error);
      });
  }

  cancel() {
    void this.router.navigate(["/"]);
  }

  componentFailed(error: Error) {
    const errorMessage = ErrorHandler.getErrorMessage(error);
    this.mondayService.showErrorMessage(errorMessage);
  }

  redirectToAuth() {
    void this.router.navigate(["/authorize"]);
  }

   getCustomize(): ICustomizeLinkFeatureFlag {
    return { ...DEFAULT_CUSTOMIZE_LINK_FEATURE_FLAG, hideCancelButton: false, addButtonLabel: "Link", cancelButtonLabel: "Go back" };
  }
}
