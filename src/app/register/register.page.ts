import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { NavServiceService } from '../services/nav-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(public navTo: NavServiceService, public authService: AuthServiceService) { }

  ngOnInit() {
  }

  email;
  password;
  passwordConfirm;

}
