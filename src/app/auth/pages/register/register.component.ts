import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import  Swal  from "sweetalert2";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  miFormulario:FormGroup = this.fb.group({
    name:['', [ Validators.required, Validators.minLength(3)]],
    email:['', [ Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(  private fb: FormBuilder,
                private authService : AuthService,
                private router: Router) { }

  ngOnInit(): void {
  }

  prueba(){

    const {name, email, password} = this.miFormulario.value;

    this.authService.registro(name, email, password)
    .subscribe(ok =>{

      if(ok === true){
        this.router.navigateByUrl('/dashboard');
      } else {
        Swal.fire('Error', ok, 'error');
      }
  })

}

}
