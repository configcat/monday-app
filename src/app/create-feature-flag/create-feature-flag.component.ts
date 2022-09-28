import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IntegrationLinkType, SettingType } from 'ng-configcat-publicapi';
import { PublicApiService } from 'ng-configcat-publicapi-ui';
import { AuthorizationParameters } from '../models/authorization-parameters';
import { ErrorHandler } from '../services/error-handler';
import { MondayService } from '../services/monday-service';

@Component({
  selector: 'app-create-feature-flag',
  templateUrl: './create-feature-flag.component.html',
  styleUrls: ['./create-feature-flag.component.scss']
})
export class CreateFeatureFlagComponent implements OnInit {

  loading = true;
  formGroup!: UntypedFormGroup;
  authorizationParameters!: AuthorizationParameters | null;
  SettingTypeEnum = SettingType;
  ErrorHandler = ErrorHandler;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private mondayService: MondayService,
    private publicApiService: PublicApiService,
    private router: Router) { }

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
