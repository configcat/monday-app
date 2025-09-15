import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatError, MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatSelect } from "@angular/material/select";
import { Router, RouterLink } from "@angular/router";
import { IntegrationLinkType, SettingType } from "ng-configcat-publicapi";
import { NgConfigCatPublicApiUIModule, PublicApiService } from "ng-configcat-publicapi-ui";
import { AuthorizationParameters } from "../models/authorization-parameters";
import { ErrorHandler } from "../services/error-handler";
import { MondayService } from "../services/monday-service";

@Component({
  selector: "app-create-feature-flag",
  templateUrl: "./create-feature-flag.component.html",
  styleUrls: ["./create-feature-flag.component.scss"],
  imports: [FormsModule, ReactiveFormsModule, NgConfigCatPublicApiUIModule, MatFormField, MatLabel, MatSelect, MatOption, MatInput, MatHint, MatError, MatButton, RouterLink],
})
export class CreateFeatureFlagComponent implements OnInit {
  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly mondayService = inject(MondayService);
  private readonly publicApiService = inject(PublicApiService);
  private readonly router = inject(Router);

  loading = true;
  formGroup!: UntypedFormGroup;
  authorizationParameters!: AuthorizationParameters | null;
  SettingTypeEnum = SettingType;
  ErrorHandler = ErrorHandler;

  ngOnInit(): void {
    this.loading = true;
    this.authorizationParameters = null;
    this.formGroup = this.formBuilder.group({
      productId: [null, [Validators.required]],
      configId: [null, [Validators.required]],
      environmentId: [null, [Validators.required]],
      name: ["", [Validators.required, Validators.maxLength(255)]],
      key: ["", [Validators.required, Validators.maxLength(255)]],
      hint: ["", [Validators.maxLength(1000)]],
      settingType: [SettingType.Boolean, [Validators.required]],
    });

    this.authorizationParameters = this.mondayService.getAuthorizationParameters();
    this.loading = false;
  }

  add() {
    if (!this.formGroup.valid) {
      return;
    }

    this.mondayService.getContext()
      .then(context => this.mondayService.getItem(context.data.itemId))
      .then(
        item => {
          return this.publicApiService
            .createSettingsService(this.authorizationParameters?.basicAuthUsername, this.authorizationParameters?.basicAuthPassword)
            .createSetting(this.formGroup.value.configId, {
              key: this.formGroup.value.key,
              settingType: this.formGroup.value.settingType,
              name: this.formGroup.value.name,
              hint: this.formGroup.value.hint,
            })
            .toPromise()
            .then((setting: any) => {
              let url = "";
              if (item?.id && item?.board?.id) {
                url = this.mondayService.getParentOrigin();
                if (url) {
                  url += `/boards/${item.board.id}/pulses/${item.id}`;
                }
              }

              return this.publicApiService
                .createIntegrationLinksService(this.authorizationParameters?.basicAuthUsername, this.authorizationParameters?.basicAuthPassword)
                .addOrUpdateIntegrationLink(this.formGroup.value.environmentId, setting.settingId,
                  IntegrationLinkType.Monday, item.id,
                  { description: item.name, url })
                .toPromise();
            });
        }
      )
      .then(() => {
        this.router.navigate(["/"]);
      })
      .catch(error => {
        ErrorHandler.handleErrors(this.formGroup, error);
        console.log(error);
      });
  }
}
