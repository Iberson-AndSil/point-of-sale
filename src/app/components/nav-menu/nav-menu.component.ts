import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgOptimizedImage, CommonModule } from '@angular/common'

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})

export default class NavMenuComponent {
  someCondition: any;

  //@Output() onLogOutEvent = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    //this.onLogOutEvent.emit();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  @Input() otherType!: string;
  
  type: string = "sales";

  @Output() typeChange = new EventEmitter<string>();

  setDialogType(type: string) {
    this.type = type;
    this.typeChange.emit(type);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['otherType']) {
      this.type = this.otherType;
    }
  }
}
