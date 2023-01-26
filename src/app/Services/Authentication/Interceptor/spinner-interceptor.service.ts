import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, Observable } from 'rxjs';
import { HttpContext, HttpContextToken } from "@angular/common/http";

// Declare http context tokens here...
export const NO_API_KEY = new HttpContextToken<boolean>(() => false);

// Declare functions using context token to set them true
export function skipApiKey() {
    return new HttpContext().set(NO_API_KEY, true);
}

@Injectable({
  providedIn: 'root'
})

export class SpinnerInterceptorService implements HttpInterceptor {

  constructor( private spinner: NgxSpinnerService ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(req.context.get(NO_API_KEY)) {
      return next.handle(req);
    } else {
      this.spinner.show();
      return next.handle(req).pipe(
        finalize( () => this.spinner.hide())
      );
    }

  }
}
