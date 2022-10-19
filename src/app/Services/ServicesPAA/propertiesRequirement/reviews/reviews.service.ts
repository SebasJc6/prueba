import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { deleteReviewsI, getAllReviewsI, postReviewsI, putGetReviewsI, putUpdateReviewsI } from 'src/app/Models/ModelsPAA/propertiesRequirement/Reviews/reviews.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  logicUrl: string = environment.baseUrl.logic;
  genericUrl: string = environment.baseUrl.generic;
  token = sessionStorage.getItem('token');

  headers: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + this.token,
  });
  constructor(private http: HttpClient) { }

  getAllReviews(Modificacion_ID: number): Observable<getAllReviewsI> {
    let dir = this.logicUrl + 'Revisiones/Modificacion/' + Modificacion_ID
    return this.http.get<getAllReviewsI>(dir, { headers: this.headers });
  }

  postReviews(form: postReviewsI): Observable<any> {
    let dir = this.logicUrl + 'Revisiones/Create/Modificacion'
    return this.http.post<any>(dir, form, { headers: this.headers });
  }

  putUpdateReviews(form: putUpdateReviewsI): Observable<any> {
    let dir = this.logicUrl + 'Revisiones/Update/Modificacion'
    return this.http.put<any>(dir, form, { headers: this.headers });
  }

  putGetReviews(form: putGetReviewsI): Observable<any> {
    let dir = this.logicUrl + 'Revisiones/Enviar/Solicitud'
    return this.http.put<any>(dir, form, { headers: this.headers });
  }

  deleteReviews(form: deleteReviewsI) {
    let dir = this.logicUrl + 'Revisiones/Delete'
    return this.http.delete(dir, { body: form, headers: this.headers });
  }
}
