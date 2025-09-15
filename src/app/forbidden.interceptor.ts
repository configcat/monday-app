import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MondayService } from './services/monday-service';
import { Router } from '@angular/router';

@Injectable()
export class ForbiddenInterceptor implements HttpInterceptor {
  private mondayService = inject(MondayService);
  private router = inject(Router);


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>error).status) {
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
    this.router.navigate(['/authorize']);
  }
}
