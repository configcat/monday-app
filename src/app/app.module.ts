import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { AddFeatureFlagComponent } from './add-feature-flag/add-feature-flag.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { NgConfigCatPublicApiUIModule } from 'ng-configcat-publicapi-ui';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { environment } from './../environments/environment';
import { CreateFeatureFlagComponent } from './create-feature-flag/create-feature-flag.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FeatureFlagsComponent } from './feature-flags/feature-flags.component';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { LoaderComponent } from './loader/loader.component';
import { DeleteSettingDialogComponent } from './delete-setting-dialog/delete-setting-dialog.component';
import { ViewerOnlyComponent } from './viewer-only/viewer-only.component';
import { ForbiddenInterceptor } from './forbidden.interceptor';
import { UsageComponent } from './usage/usage.component';

@NgModule({
  declarations: [
    AppComponent,
    FeatureFlagsComponent,
    AuthorizationComponent,
    AddFeatureFlagComponent,
    CreateFeatureFlagComponent,
    LoaderComponent,
    DeleteSettingDialogComponent,
    ViewerOnlyComponent,
    UsageComponent
  ],
  imports: [
    BrowserModule,
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
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ForbiddenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
