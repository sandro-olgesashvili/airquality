import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Air } from '../interface/air';

@Injectable({
  providedIn: 'root',
})
export class AirService {
  httpHeader = new HttpHeaders({
    'X-RapidAPI-Key': '55b13ad738msheeacc756f83c254p16b5a7jsn254b40268447',
    'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com',
  });

  constructor(private http: HttpClient) {}

  getData(latData: number, lonData: number): Observable<Air> {
    return this.http.get<Air>(
      'https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality',
      { headers: this.httpHeader, params: { lat: latData, lon: lonData } }
    );
  }
}
