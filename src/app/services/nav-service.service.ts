import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavServiceService {

  constructor(private router: Router) { }

  navTo(any){
    this.router.navigateByUrl(any)
  }
  
}
