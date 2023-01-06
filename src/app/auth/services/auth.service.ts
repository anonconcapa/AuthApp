import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interface';
import { catchError, map, of, tap, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario () {
    return{...this._usuario}
  }

  constructor( private http: HttpClient) { }
// REGISTRO
  registro( name: string, email: string, password: string){

    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password};

    return this.http.post<AuthResponse>(url, body)
    .pipe(tap( resp=> {
      if(resp.ok){
        localStorage.setItem('token', resp.token!)
        this._usuario ={
          name:resp.name!,
          uid:resp.uid!,
          email:email
        }
      }
    }),
      map(resp=> resp.ok),
      catchError( err => of(err.error.msg)))
  }
// LOGIN

  login( email:string, password:string ){

    const url = `${this.baseUrl}/auth`;
    const body = { email, password};

    return this.http.post<AuthResponse>(url, body)
    .pipe(tap( resp=> {
      if(resp.ok){
        localStorage.setItem('token', resp.token!)
        this._usuario ={
          name:resp.name!,
          uid:resp.uid!,
          email:email
        }
      }
    }),
      map(resp=> resp.ok),
      catchError( err => of(err.error.msg)))
  }

  validarToken():Observable<boolean>{
    const url =`${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '')

    return this.http.get<AuthResponse | any>( url, { headers } )
    .pipe(
      map( resp => {
        
        this._usuario ={
          name:resp.name!,
          uid:resp.uid!,
          email:resp.email
        }
        
        return resp.ok
      }),
      catchError(err=> of(false))
    )
  }

  logout(){
    localStorage.clear();
  }

}
