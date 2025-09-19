import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", pathMatch: "full", loadComponent: () => import("./feature-flags/feature-flags.component").then(m => m.FeatureFlagsComponent) },
  { path: "authorize", loadComponent: () => import("./authorization/authorization.component").then(m => m.AuthComponent) },
  { path: "addfeatureflag", loadComponent: () => import("./add-feature-flag/add-feature-flag.component").then(m => m.AddFeatureFlagComponent) },
  { path: "createfeatureflag", loadComponent: () => import("./create-feature-flag/create-feature-flag.component").then(m => m.CreateFeatureFlagComponent) },
  { path: "vieweronly", loadComponent: () => import("./viewer-only/viewer-only.component").then(m => m.ViewerOnlyComponent) },
  { path: "usage", loadComponent: () => import("./usage/usage.component").then(m => m.UsageComponent) },
];

