import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationParameters } from '../models/authorization-parameters';
import { MondayService } from '../services/monday-service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  loading = true;
  authorizationParameters!: AuthorizationParameters | null;

  constructor(
    private mondayService: MondayService,
    private router: Router) { }

  ngOnInit(): void {
    this.authorizationParameters = null;
    this.mondayService.getAuthorizationParameters()
      .then(authorizationParameters => {
        if (authorizationParameters && authorizationParameters.basicAuthUsername && authorizationParameters.basicAuthPassword) {
          this.authorizationParameters = authorizationParameters;
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  login(authorizationParameters: any) {
    this.mondayService
      .setAuthorizationParameters(authorizationParameters)
      .then(() => {
        this.mondayService.showSuccessMessage('Authorized to ConfigCat 🎉');
      })
      .then(() => this.router.navigate(['/']));
  }

  unauthorize() {
    this.mondayService.removeAuthorizationParameters()
      .then(() => this.authorizationParameters = null);
  }

  error(error: any) {
    console.log(error);
  }
}
