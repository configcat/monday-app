import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { IntegrationLinkType } from "ng-configcat-publicapi";
import { ConfigSelectComponent, EnvironmentSelectComponent, ProductSelectComponent, PublicApiService, SettingSelectComponent } from "ng-configcat-publicapi-ui";
import { LoaderComponent } from "../loader/loader.component";
import { AuthorizationParameters } from "../models/authorization-parameters";
import { ErrorHandler } from "../services/error-handler";
import { MondayService } from "../services/monday-service";

@Component({
  selector: "configcat-monday-add-feature-flag",
  templateUrl: "./add-feature-flag.component.html",
  styleUrls: ["./add-feature-flag.component.scss"],
  imports: [
    LoaderComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    RouterLink,
    ProductSelectComponent,
    SettingSelectComponent,
    EnvironmentSelectComponent,
    ConfigSelectComponent,
  ],
})
export class AddFeatureFlagComponent implements OnInit {
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
    settingId: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  authorizationParameters!: AuthorizationParameters | null;
  ErrorHandler = ErrorHandler;

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
          let url = "";
          if (item?.id && item?.board?.id) {
            url = this.mondayService.getParentOrigin();
            if (url) {
              url += `/boards/${item.board.id}/pulses/${item.id}`;
            }
          }

          return this.publicApiService
            .createIntegrationLinksService(this.authorizationParameters?.basicAuthUsername, this.authorizationParameters?.basicAuthPassword)
            .addOrUpdateIntegrationLink(this.formGroup.controls.environmentId.value, this.formGroup.controls.settingId.value,
              IntegrationLinkType.Monday, item.id,
              { description: item.name, url })
            .toPromise();
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
