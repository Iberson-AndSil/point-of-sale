import { AfterViewInit, Component, OnDestroy, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, map, Observable, scan, shareReplay, startWith, Subscription } from 'rxjs';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-barcode',
  standalone: true,
  imports: [CommonModule, FormsModule,
    BarcodeScannerLivestreamModule, ZXingScannerModule],
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css'],
})

export class BarcodeComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() codeScanner = new EventEmitter<string>();
  @ViewChild('scanner') scanner!: ZXingScannerComponent;

  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.EAN_13];
  devices$ = new BehaviorSubject<MediaDeviceInfo[]>([]);

  selectedDevice$: Observable<MediaDeviceInfo | null> = this.devices$.pipe(
    map((devices) => devices.length > 0 ? devices[0] : null),
    distinctUntilChanged(),
    shareReplay(1)
  );

  enable$ = this.devices$.pipe(map(Boolean));

  toggleCamera$ = new BehaviorSubject<boolean>(false);

  startCamera$ = this.toggleCamera$.pipe(
    scan((acc) => !acc, true),
    startWith(true)
  );

  scanError$ = new BehaviorSubject<string | null>(null);
  private subscriptions: Subscription[] = [];

  scanSuccess$ = new BehaviorSubject<string | null>(null);

  ngOnInit() {
    this.requestCameraPermissions();
    const cameraSub = this.startCamera$.subscribe(start => {
      if (this.scanner) {
        if (start) {
          this.scanner.enable = true;
        } else {
          this.scanner.enable = false;
        }
      } else {
        console.warn('El componente ZXingScannerComponent no está inicializado.');
      }
    });
    this.subscriptions.push(cameraSub);
  }

  ngAfterViewInit() {
    if (this.scanner) {
      this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
        console.log('camaras encontradas... ', devices);
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        this.devices$.next(videoDevices);
        if (videoDevices.length > 0) {
          console.log('camara seleccionada... ', videoDevices[0]);
          setTimeout(() => {
            if (this.scanner) {
              this.scanner.device = videoDevices[0];
              console.log('camara asignada... ', this.scanner.device);
            }
          }, 100);
        }
      });
      this.scanner.scanSuccess.subscribe(result => {
        console.log('Código escaneado con éxito:', result);
        this.scanSuccess$.next(result);
        console.log('Estructura del objeto:', this.scanSuccess$.getValue());
        this.codeScanner.emit(this.scanSuccess$.getValue()?? undefined);
      });
  
      this.scanner.scanError.subscribe(error => {
        console.error('Error de escaneo:', error);
        this.scanError$.next('Error al escanear: ' + error.message);
      });
    } else {
      console.error('El escáner no está disponible en ngAfterViewInit');
    }
  }

  scanError(error: Error) {
    console.error('Error durante el escaneo:', error);
    this.scanError$.next('Error al escanear: ' + error.message);
  }

  requestCameraPermissions() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        console.log('Permisos de cámara concedidos.');
        // stream.getTracks().forEach(track => track.stop()); 
      })
      .catch((error) => {
        console.error('Error solicitando permisos de la cámara:', error);
        alert('Se requieren permisos para usar la cámara.');
      });
  }  

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}