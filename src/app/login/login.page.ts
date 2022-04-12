import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthServiceService } from '../services/auth-service.service';
import { NavServiceService } from '../services/nav-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public navTo: NavServiceService, public authService: AuthServiceService, public afAuth: AngularFireAuth) { }

  scannerEnabled: boolean = false;  
  result: any;

  ngOnInit() {
  }

  activateCam(){
    this.scannerEnabled = true;
  }

  async scanSuccessHandler(event){
    this.scannerEnabled = false;
    this.result = this.authService.decrypt(event);
    
    var email = this.result.substring(0, this.result.indexOf('&'));
    var password = this.result.substring(this.result.indexOf('&') + 1);
    this.authService.signInWithEmailAndPassword(email, password)
  }

  cancelScan(){
    this.scannerEnabled = false;
  }

}
