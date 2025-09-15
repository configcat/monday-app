import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IntegrationLinkType, SettingType } from 'ng-configcat-publicapi';
import { PublicApiService, NgConfigCatPublicApiUIModule } from 'ng-configcat-publicapi-ui';
import { AuthorizationParameters } from '../models/authorization-parameters';
import { ErrorHandler } from '../services/error-handler';
import { MondayService } from '../services/monday-service';

import { MatFormField, MatLabel, MatHint, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-create-feature-flag',
    templateUrl: './create-feature-flag.component.html',
    styleUrls: ['./create-feature-flag.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, NgConfigCatPublicApiUIModule, MatFormField, MatLabel, MatSelect, MatOption, MatInput, MatHint, MatError, MatButton, RouterLink]
})
export class CreateFeatureFlagComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private mondayService = inject(MondayService);
  private publicApiService = inject(PublicApiService);
  private router = inject(Router);


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
      name: ['', [Validators.required, Validators.maxLength(255)]],
      key: ['', [Validators.required, Validators.maxLength(255)]],
      hint: ['', [Validators.maxLength(1000)]],
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
              hint: this.formGroup.value.hint
            })
            .toPromise()
            .then((setting: any) => {
              let url = '';
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
        this.router.navigate(['/']);
      })
      .catch(error => {
        ErrorHandler.handleErrors(this.formGroup, error);
        console.log(error);
      });
  }
}
