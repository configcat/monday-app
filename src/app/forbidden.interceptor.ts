import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { MondayService } from "./services/monday-service";

@Injectable()
export class ForbiddenInterceptor implements HttpInterceptor {
  private readonly mondayService = inject(MondayService);
  private readonly router = inject(Router);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            switch ((error).status) {
              case 401:
                this.redirectToAuth();
                return throwError(error);
              default:
                return throwError(error);
            }
          } else {
            return throwError(error);
          }
        })
      );
  }

  redirectToAuth() {
    this.mondayService.removeAuthorizationParameters();
    this.router.navigate(["/authorize"]);
  }
}
