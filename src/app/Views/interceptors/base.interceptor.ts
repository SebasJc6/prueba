import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()



export class BaseInterceptor implements HttpInterceptor {




  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = 'Bearer ahjfdewqfwwrottpryreyrpoypry'
    const cambiorequest = request.clone({headers:  request.headers.set('Authorization',token)})

    


    return next.handle(cambiorequest);
  }
}
