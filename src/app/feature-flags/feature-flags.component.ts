import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IntegrationLinkDetail, IntegrationLinkType } from 'ng-configcat-publicapi';
import { PublicApiService } from 'ng-configcat-publicapi-ui';
import { DeleteSettingDialogComponent } from '../delete-setting-dialog/delete-setting-dialog.component';
import { AuthorizationParameters } from '../models/authorization-parameters';
import { MondayService } from '../services/monday-service';

@Component({
  selector: 'app-feature-flags',
  templateUrl: './feature-flags.component.html',
  styleUrls: ['./feature-flags.component.scss']
})
export class FeatureFlagsComponent implements OnInit {

  loading = true;
  authorizationParameters!: AuthorizationParameters;
  integrationLinkDetails!: IntegrationLinkDetail[];

  constructor(private mondayService: MondayService,
    private router: Router,
    private publicApiService: PublicApiService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.mondayService.getAuthorizationParameters().then(authorizationParameters => {
      if (!authorizationParameters || !authorizationParameters.basicAuthPassword || !authorizationParameters.basicAuthUsername) {
        this.redirectToAuth();
        return;
      }
      this.authorizationParameters = authorizationParameters;
      this.loadFeatureFlags();
    });
  }

  loadFeatureFlags() {
    return this.mondayService.getContext().then(context => {
      this.publicApiService
        .createIntegrationLinksService(this.authorizationParameters.basicAuthUsername, this.authorizationParameters.basicAuthPassword)
        .getIntegrationLinkDetails(IntegrationLinkType.Trello, context.data.itemId)
        .toPromise()
        .then((integrationLinkDetails) => {
          this.integrationLinkDetails = integrationLinkDetails?.details || [];
          this.loading = false;
        });
    });

  }

  redirectToAuth() {
    this.router.navigate(['/authorize']);
  }

  onDeleteSettingRequested(data: any) {
    const dialogRef = this.dialog.open(DeleteSettingDialogComponent);

    dialogRef.afterClosed()
      .subscribe((result: any) => {
        if (!result || result.button !== 'removeFromCard') {
          return;
        }
        return this.mondayService.getContext().then(context => {
          this.publicApiService
            .createIntegrationLinksService(this.authorizationParameters.basicAuthUsername, this.authorizationParameters.basicAuthPassword)
            .deleteIntegrationLink(data.environment.environmentId, data.setting.settingId, IntegrationLinkType.Trello, context.data.itemId)
            .toPromise()
            .then(() => {
              return this.loadFeatureFlags();
            });
        });
      });
  }
}
