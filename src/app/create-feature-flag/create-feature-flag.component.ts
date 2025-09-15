import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatError, MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatSelect } from "@angular/material/select";
import { Router, RouterLink } from "@angular/router";
import { IntegrationLinkType, SettingType } from "ng-configcat-publicapi";
import { ConfigSelectComponent, EnvironmentSelectComponent, featureFlagKeyRegex, FormHelper, ProductSelectComponent, PublicApiService } from "ng-configcat-publicapi-ui";
import { AuthorizationParameters } from "../models/authorization-parameters";
import { ErrorHandler } from "../services/error-handler";
import { MondayService } from "../services/monday-service";

@Component({
  selector: "configcat-monday-create-feature-flag",
  templateUrl: "./create-feature-flag.component.html",
  styleUrls: ["./create-feature-flag.component.scss"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatHint,
    MatError,
    MatButton,
    RouterLink,
    ConfigSelectComponent,
    ProductSelectComponent,
    EnvironmentSelectComponent],
})
export class CreateFeatureFlagComponent implements OnInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly mondayService = inject(MondayService);
  private readonly publicApiService = inject(PublicApiService);
  private readonly router = inject(Router);

  loading = true;
  formGroup = this.formBuilder.group({
    productId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    environmentId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    configId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    key: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255), Validators.pattern(featureFlagKeyRegex)],
    }),
    hint: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    settingType: new FormControl<SettingType>(SettingType.Boolean, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  authorizationParameters!: AuthorizationParameters | null;
  SettingTypeEnum = SettingType;
  ErrorHandler = ErrorHandler;
  FormHelper = FormHelper;

  ngOnInit(): void {
    this.loading = true;
    this.authorizationParameters = null;
    this.formGroup.reset();

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
            .createSetting(this.formGroup.controls.configId.value, {
              key: this.formGroup.controls.key.value,
              settingType: this.formGroup.controls.settingType.value,
              name: this.formGroup.controls.name.value,
              hint: this.formGroup.controls.hint.value,
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
        void this.router.navigate(["/"]);
      })
      .catch((error: unknown) => {
        ErrorHandler.handleErrors(this.formGroup, error as Error);
        console.log(error);
      });
  }
}
