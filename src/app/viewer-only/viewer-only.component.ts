import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "configcat-monday-viewer-only",
  templateUrl: "./viewer-only.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./viewer-only.component.scss"],
})
export class ViewerOnlyComponent {}
