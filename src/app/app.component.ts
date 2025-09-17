import { Component, ElementRef, inject, OnInit, viewChild } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Theme, ThemeService } from "ng-configcat-publicapi-ui";

@Component({
  selector: "configcat-monday-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [RouterModule],
})
export class AppComponent implements OnInit {

  private readonly themeService = inject(ThemeService);
  readonly resizeReference = viewChild<ElementRef<HTMLElement>>("resizeReference");

  title = "ConfigCat Feature Flags";

  ngOnInit(): void {
    const darkModeOn =
    window.matchMedia
    && window.matchMedia("(prefers-color-scheme: dark)").matches;

    // If dark mode is enabled then directly switch to the dark-theme
    if (darkModeOn) {
      this.themeService.setTheme(Theme.Dark);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const turnOn = e.matches;
        this.themeService.setTheme(turnOn ? Theme.Dark : Theme.Light);
      });
  }

}

