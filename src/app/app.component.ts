import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MondayService } from "./services/monday-service";

@Component({
  selector: "configcat-monday-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [RouterModule],
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly mondayService = inject(MondayService);

  title = "ConfigCat Feature Flags";
  themeChangeListenerUnsubscribe!: () => void;

  ngOnInit(): void {
    this.themeChangeListenerUnsubscribe = this.mondayService.listenThemeChange();
  }

  ngOnDestroy(): void {
    this.themeChangeListenerUnsubscribe();
  }

}

