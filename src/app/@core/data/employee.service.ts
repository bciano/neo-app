import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const API_URL = 'http://ec2-18-222-116-18.us-east-2.compute.amazonaws.com:4114/api/employee';

@Injectable()
export class EmployeeService {

  constructor(private http:HttpClient){}

  getEmployees() {
    return this.http.get<Results>(API_URL);
  }

  createEmployee(data){
    console.log('createEmployee');
    return this.http.put(API_URL, data);
  }

  updateEmployee(data, newData){
    console.log('updateEmployee');
    return this.http.post(API_URL + '/' + data.id, newData);
  }

  deleteEmployee(data){
    console.log('deleteEmployee' + data.id);
    return this.http.delete(API_URL + '/' + data.id, data);
  }
  
}

export interface Results {
  results: Employee[];
}

export interface Employee {
  id: number;
  name: string;
}

