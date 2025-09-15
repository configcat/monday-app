import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationVersion, IntegrationLinkDetail, IntegrationLinkType } from 'ng-configcat-publicapi';
import { DeleteSettingDialogComponent, PublicApiService } from 'ng-configcat-publicapi-ui';
import { AuthorizationParameters } from '../models/authorization-parameters';
import { MondayService } from '../services/monday-service';

@Component({
    selector: 'app-feature-flags',
    templateUrl: './feature-flags.component.html',
    styleUrls: ['./feature-flags.component.scss'],
    standalone: false
})
export class FeatureFlagsComponent implements OnInit {

  loading = true;
  authorizationParameters!: AuthorizationParameters;
  integrationLinkDetails!: IntegrationLinkDetail[];
  EvaluationVersion = EvaluationVersion;

  constructor(private mondayService: MondayService,
    private router: Router,
    private publicApiService: PublicApiService,
    private dialog: MatDialog) { }

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
      this.loadFeatureFlags();
    });

  }

  loadFeatureFlags() {
    return this.mondayService.getContext().then(context => {
      this.publicApiService
        .createIntegrationLinksService(this.authorizationParameters.basicAuthUsername, this.authorizationParameters.basicAuthPassword)
        .getIntegrationLinkDetails(IntegrationLinkType.Monday, context?.data?.itemId || '1')
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

  redirectToViewerOnly() {
    this.router.navigate(['/vieweronly']);
  }

  onDeleteSettingRequested(data: any) {
    const dialogRef = this.dialog.open(DeleteSettingDialogComponent, {
      data: {
        system: "Monday",
        ticketType: "item",
      }
    });

    dialogRef.afterClosed()
      .subscribe((result: any) => {
        if (!result || result.button !== 'remove') {
          return;
        }
        return this.mondayService.getContext().then(context => {
          this.publicApiService
            .createIntegrationLinksService(this.authorizationParameters.basicAuthUsername, this.authorizationParameters.basicAuthPassword)
            .deleteIntegrationLink(data.environment.environmentId, data.setting.settingId, IntegrationLinkType.Monday, context.data.itemId)
            .toPromise()
            .then(() => {
              return this.loadFeatureFlags();
            });
        });
      });
  }
}
