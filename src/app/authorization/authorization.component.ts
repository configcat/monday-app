import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationParameters } from '../models/authorization-parameters';
import { MondayService } from '../services/monday-service';

@Component({
    selector: 'app-authorization',
    templateUrl: './authorization.component.html',
    styleUrls: ['./authorization.component.scss'],
    standalone: false
})
export class AuthorizationComponent implements OnInit {

  loading = true;
  authorizationParameters!: AuthorizationParameters | null;

  constructor(
    private mondayService: MondayService,
    private router: Router) { }

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
