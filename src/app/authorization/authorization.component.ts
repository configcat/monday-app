import { Component, inject, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { AuthorizationComponent } from "ng-configcat-publicapi-ui";
import { LoaderComponent } from "../loader/loader.component";
import { AuthorizationParameters } from "../models/authorization-parameters";
import { MondayService } from "../services/monday-service";

@Component({
  selector: "configcat-monday-authorization",
  templateUrl: "./authorization.component.html",
  styleUrls: ["./authorization.component.scss"],
  imports: [LoaderComponent, MatButton, RouterLink, AuthorizationComponent],
})
export class AuthComponent implements OnInit {
  private readonly mondayService = inject(MondayService);
  private readonly router = inject(Router);

  loading = true;
  authorizationParameters!: AuthorizationParameters | null;

  ngOnInit(): void {
    this.authorizationParameters = this.mondayService.getAuthorizationParameters();
    this.loading = false;
  }

  login(authorizationParameters: AuthorizationParameters) {
    this.mondayService.setAuthorizationParameters(authorizationParameters);
    this.mondayService.showSuccessMessage("Authorized to ConfigCat 🎉");
    void this.router.navigate(["/"]);
  }

  unauthorize() {
    this.mondayService.removeAuthorizationParameters();
    this.authorizationParameters = null;
  }

  error(error: ErrorEvent) {
    console.log(error);
  }
}
