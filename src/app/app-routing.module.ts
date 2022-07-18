import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFeatureFlagComponent } from './add-feature-flag/add-feature-flag.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { CreateFeatureFlagComponent } from './create-feature-flag/create-feature-flag.component';
import { FeatureFlagsComponent } from './feature-flags/feature-flags.component';
import { UsageComponent } from './usage/usage.component';
import { ViewerOnlyComponent } from './viewer-only/viewer-only.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: FeatureFlagsComponent },
  { path: 'authorize', component: AuthorizationComponent },
  { path: 'addfeatureflag', component: AddFeatureFlagComponent },
  { path: 'createfeatureflag', component: CreateFeatureFlagComponent },
  { path: 'vieweronly', component: ViewerOnlyComponent },
  { path: 'usage', component: UsageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
