import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IntegrationLinkType } from 'ng-configcat-publicapi';
import { PublicApiService } from 'ng-configcat-publicapi-ui';
import { Subscription } from 'rxjs';
import { AuthorizationParameters } from '../models/authorization-parameters';
import { MondayService } from '../services/monday-service';

@Component({
  selector: 'app-add-feature-flag',
  templateUrl: './add-feature-flag.component.html',
  styleUrls: ['./add-feature-flag.component.scss']
})
export class AddFeatureFlagComponent implements OnInit {

  loading = true;
  formGroup!: FormGroup;
  authorizationParameters!: AuthorizationParameters | null;

  constructor(
    private formBuilder: FormBuilder,
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
      settingId: [null, [Validators.required]]
    });

    this.authorizationParameters = this.mondayService.getAuthorizationParameters();
    this.loading = false;
  }


  add() {
    if (!this.formGroup.valid) {
      return;
    }

    this.mondayService.getContext().then(
      context => {
        return this.publicApiService
          .createIntegrationLinksService(this.authorizationParameters?.basicAuthUsername, this.authorizationParameters?.basicAuthPassword)
          .addOrUpdateIntegrationLink(this.formGroup.value.environmentId, this.formGroup.value.settingId,
            IntegrationLinkType.Monday, context.data.itemId,
            { description: "Monday.com item" })
          .toPromise();
      }
    )
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
