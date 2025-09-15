import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { AddFeatureFlagComponent } from "./add-feature-flag/add-feature-flag.component";
import { MatTabsModule } from "@angular/material/tabs";
import { NgConfigCatPublicApiUIModule } from "ng-configcat-publicapi-ui";
import { environment } from "./../environments/environment";
import { CreateFeatureFlagComponent } from "./create-feature-flag/create-feature-flag.component";
import { FeatureFlagsComponent } from "./feature-flags/feature-flags.component";
import { ForbiddenInterceptor } from "./forbidden.interceptor";
import { LoaderComponent } from "./loader/loader.component";
import { UsageComponent } from "./usage/usage.component";
import { ViewerOnlyComponent } from "./viewer-only/viewer-only.component";

@NgModule({ declarations: [AppComponent],
  bootstrap: [AppComponent], imports: [BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    NgConfigCatPublicApiUIModule.forRoot(() => ({ basePath: environment.publicApiBaseUrl, dashboardBasePath: environment.dashboardBaseUrl })),
    MatDialogModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    FeatureFlagsComponent,
    AuthorizationComponent,
    AddFeatureFlagComponent,
    CreateFeatureFlagComponent,
    LoaderComponent,
    ViewerOnlyComponent,
    UsageComponent], providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ForbiddenInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ] })
export class AppModule { }
