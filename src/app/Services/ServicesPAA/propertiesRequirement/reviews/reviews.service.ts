import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { deleteReviewsI, getAllReviewsI, postReviewsI, putGetReviewsI, putUpdateReviewsI } from 'src/app/Models/ModelsPAA/propertiesRequirement/Reviews/reviews.interface';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  logicUrl: string = environment.baseUrl.logic;
  genericUrl: string = environment.baseUrl.generic;

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getAllReviews(Modificacion_ID: number): Observable<getAllReviewsI> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Revisiones/Modificacion/' + Modificacion_ID
    return this.http.get<getAllReviewsI>(dir, { headers: headers });
  }

  postReviews(form: postReviewsI): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Revisiones/Create/Modificacion'
    return this.http.post<any>(dir, form, { headers: headers });
  }

  putUpdateReviews(form: putUpdateReviewsI): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Revisiones/Update/Modificacion'
    return this.http.put<any>(dir, form, { headers: headers });
  }

  putGetReviews(form: putGetReviewsI): Observable<any> {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Revisiones/Enviar/Solicitud'
    return this.http.put<any>(dir, form, { headers: headers });
  }

  deleteReviews(form: deleteReviewsI) {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getCookie('token'),
    });

    let dir = this.logicUrl + 'Revisiones/Delete'
    return this.http.delete(dir, { body: form, headers: headers });
  }
}
