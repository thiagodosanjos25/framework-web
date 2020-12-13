import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Agendamento } from './agendamento';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  
  //Chamando a api localhost:3000/agendamento
  private resource = 'agendamento';
  api = environment.urlBase+'/'+this.resource;

  // requisições get, post, a partir do Angular
  constructor(private httpClient: HttpClient) { }

  // Headers (cabeçalhos), vai trocar aplicativos do tipo json, os tipos de dados
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  // Obtêm todos os agendamentos usando o verbo GET, 
  // e chama uma array de lista de agendamentos
  getAgendamentos(): Observable<Agendamento[]> {
    return this.httpClient.get<Agendamento[]>(this.api)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

    // Obtem todos os agendamentos pelo método GET e captura pelo ID
    getAgendamentoByID(valor:number): Observable<Agendamento> {
      return this.httpClient.get<Agendamento>(this.api+'/'+valor)
        .pipe(
          retry(2),
          catchError(this.handleError))
    }

    // Salva um agendamento
    saveAgendamento(agendamento: Agendamento): Observable<Agendamento> {
      console.log( JSON.stringify(agendamento));
      return this.httpClient.post<Agendamento>(this.api, JSON.stringify(agendamento), this.httpOptions)
        .pipe(
          retry(2),
          catchError(this.handleError)
        )
    }

    // Atualiza um agendamento
    updateAgendamento(agendamento: Agendamento): Observable<Agendamento> {
      return this.httpClient.put<Agendamento>(this.api + '/' + agendamento.id, JSON.stringify(agendamento), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
    }

    // Deleta um agendamento
    deleteAgendamento(agendamento: Agendamento) {
      return this.httpClient.delete<Agendamento>(this.api + '/' + agendamento.id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
    }
  
  createAgendamento() {
    return this.httpClient.get<Agendamento>(this.api )
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  
  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
      console.log(errorMessage, 'Client Error');
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `mensagem: ${error.message}`;
      console.log(errorMessage, 'Server Error');
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };

}
