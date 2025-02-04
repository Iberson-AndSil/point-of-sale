import { Component, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export default class LoginComponent {

  @Output() onLoginSuccessEvent = new EventEmitter<void>();

  title = 'Sales-mobile';
  auth = {username: "", password: ""};

  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login(this.auth.username, this.auth.password).subscribe({
        next: ()=>this.onLoginSuccess(),
        error: (error) => console.log('LOGIN ERROR', error)
    })
  }

  onLoginSuccess(): void {
    this.onLoginSuccessEvent.emit();
    
  }

  authtenticated(): void {
    this.authService.isAuthenticated();
  }

}