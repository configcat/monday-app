import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddFeatureFlagComponent } from './add-feature-flag/add-feature-flag.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgConfigCatPublicApiUIModule } from 'ng-configcat-publicapi-ui';
import { MatDialogModule } from '@angular/material/dialog';
import { environment } from './../environments/environment';
import { CreateFeatureFlagComponent } from './create-feature-flag/create-feature-flag.component';
import { HttpClientModule } from '@angular/common/http';
import { FeatureFlagsComponent } from './feature-flags/feature-flags.component';
import { MatOptionModule } from '@angular/material/core';
import { LoaderComponent } from './loader/loader.component';
import { DeleteSettingDialogComponent } from './delete-setting-dialog/delete-setting-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    FeatureFlagsComponent,
    AuthorizationComponent,
    AddFeatureFlagComponent,
    CreateFeatureFlagComponent,
    LoaderComponent,
    DeleteSettingDialogComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
