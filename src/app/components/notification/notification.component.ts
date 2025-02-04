import { Component,ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  encapsulation: ViewEncapsulation.None
})

export class NotificationComponent {
  isVisible: boolean = false;
  message: string = '';
  backgroundColor: string = 'gray';

  constructor(private cdr: ChangeDetectorRef) {}

  show(message: string, backgroundColor?: string) {
    this.message = message;
    if (backgroundColor) {
      this.backgroundColor = backgroundColor;
    }
    this.isVisible = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.hide();
    }, 2000);
  }

  hide() {
    this.isVisible = false;
    this.cdr.detectChanges();
  }
}