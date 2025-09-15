import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { IntegrationLinkType } from "ng-configcat-publicapi";
import { NgConfigCatPublicApiUIModule, PublicApiService } from "ng-configcat-publicapi-ui";
import { LoaderComponent } from "../loader/loader.component";
import { AuthorizationParameters } from "../models/authorization-parameters";
import { MondayService } from "../services/monday-service";

@Component({
  selector: "app-add-feature-flag",
  templateUrl: "./add-feature-flag.component.html",
  styleUrls: ["./add-feature-flag.component.scss"],
  imports: [LoaderComponent, FormsModule, ReactiveFormsModule, NgConfigCatPublicApiUIModule, MatButton, RouterLink],
})
export class AddFeatureFlagComponent implements OnInit {
  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly mondayService = inject(MondayService);
  private readonly publicApiService = inject(PublicApiService);
  private readonly router = inject(Router);

  loading = true;
  formGroup!: UntypedFormGroup;
  authorizationParameters!: AuthorizationParameters | null;

  ngOnInit(): void {
    this.loading = true;
    this.authorizationParameters = null;
    this.formGroup = this.formBuilder.group({
      productId: [null, [Validators.required]],
      configId: [null, [Validators.required]],
      environmentId: [null, [Validators.required]],
      settingId: [null, [Validators.required]],
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
          let url = "";
          if (item?.id && item?.board?.id) {
            url = this.mondayService.getParentOrigin();
            if (url) {
              url += `/boards/${item.board.id}/pulses/${item.id}`;
            }
          }

          return this.publicApiService
            .createIntegrationLinksService(this.authorizationParameters?.basicAuthUsername, this.authorizationParameters?.basicAuthPassword)
            .addOrUpdateIntegrationLink(this.formGroup.value.environmentId, this.formGroup.value.settingId,
              IntegrationLinkType.Monday, item.id,
              { description: item.name, url })
            .toPromise();
        }
      )
      .then(() => {
        this.router.navigate(["/"]);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
