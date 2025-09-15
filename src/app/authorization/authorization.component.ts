import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationParameters } from '../models/authorization-parameters';
import { MondayService } from '../services/monday-service';

import { LoaderComponent } from '../loader/loader.component';
import { NgConfigCatPublicApiUIModule } from 'ng-configcat-publicapi-ui';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-authorization',
    templateUrl: './authorization.component.html',
    styleUrls: ['./authorization.component.scss'],
    imports: [LoaderComponent, NgConfigCatPublicApiUIModule, MatButton, RouterLink]
})
export class AuthorizationComponent implements OnInit {
  private mondayService = inject(MondayService);
  private router = inject(Router);


  loading = true;
  authorizationParameters!: AuthorizationParameters | null;

  ngOnInit(): void {
    this.authorizationParameters = this.mondayService.getAuthorizationParameters();
    this.loading = false;
  }

  login(authorizationParameters: any) {
    this.mondayService.setAuthorizationParameters(authorizationParameters);
    this.mondayService.showSuccessMessage('Authorized to ConfigCat 🎉');
    this.router.navigate(['/']);
  }

  unauthorize() {
    this.mondayService.removeAuthorizationParameters();
    this.authorizationParameters = null;
  }

  error(error: any) {
    console.log(error);
  }
}
