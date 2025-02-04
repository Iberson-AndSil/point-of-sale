import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import NavMenuComponent from './components/nav-menu/nav-menu.component';
// import { AuthService } from './core/services/auth.service';
import LoginComponent from './auth/login.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,NavMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    event.preventDefault();
  }

  title = 'doncaerp-mobile';
  auth = {username: "", password: ""};

  public isAuthenticated: boolean = false;

  // onActivate(component: any) {
  //   if (component instanceof LoginComponent) {
  //     component.onLoginSuccessEvent.subscribe(() => this.onLoginSuccess());
  //   }
  // }
  

  // constructor(private authService: AuthService,  private router: Router) {}

  // ngOnInit(): void {
  //   this.onLoginSuccess();
  // }

  // onLoginSuccess(): void {
  //   this.isAuthenticated = this.authService.isAuthenticated();
  //   console.log('onLoginSuccess', this.isAuthenticated);
  //   this.router.navigate(['/sales']);
  // }



}
