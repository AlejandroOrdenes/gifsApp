import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '5hOs89CKH8GqSYgntBTYNPPO8y8Kwkvu';
  private _historial: string[] = [];
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  public resultados: Gif[] = [];


  get historial() {
    return [...this._historial];
  }

  constructor ( private http: HttpClient ) {
  
    this._historial = JSON.parse(localStorage.getItem( 'historial' )!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados' )!) || [];
  }

  buscarGifs( query: string ) {

    query = query.trim().toLowerCase();

    if( !this._historial.includes( query ) ) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0, 10);

      //Grabando Historial en local storage
      localStorage.setItem( 'historial', JSON.stringify( this._historial ) );
      
    }
    
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '20')
      .set('q', query);
    

    //OBTENIENDO LA RESPUESTA
    this.http.get<SearchGifsResponse>( `${this.servicioUrl}/search`, { params })
      .subscribe( (resp: any) => {
        
        this.resultados = resp.data;
        localStorage.setItem( 'resultados', JSON.stringify( this.resultados) );
      });
  } 

}
