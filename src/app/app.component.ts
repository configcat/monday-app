import { Component, DestroyRef, ElementRef, inject, OnInit, viewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
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
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  readonly resizeReference = viewChild<ElementRef<HTMLElement>>("resizeReference");

  title = "ConfigCat Feature Flags";

  ngOnInit(): void {
    this.dialog.afterOpened.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      this.resize(result.id);
    });
    this.dialog.afterAllClosed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.resize();
    });

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

  resize(dialogId?: string): void {
    console.log("fix resize " + dialogId);
    setTimeout(() => {
      // const contentHeight = this.resizeReference()?.nativeElement?.offsetHeight;

      // let height = contentHeight && contentHeight < 500 ? contentHeight : 500;
      // if (dialogId) {
      //   const dialogHeight = document.getElementById(dialogId)?.offsetHeight ?? 0;
      //   // the extra 130 px is hard coded. because of the dialog content dinamically changes the height.
      //   height = height < dialogHeight ? dialogHeight + 130 : height;
      // }
      // this.jiraService.resize(height);
    }, 500);
  }
}

