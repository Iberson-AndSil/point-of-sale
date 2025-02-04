import { Component, Output, ViewChild, EventEmitter, Input, ElementRef } from '@angular/core';
import { SaleService } from '../../core/services/sale.service';
import { Trx } from '../../models/product.models';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';
import { NgxPrintModule } from 'ngx-print';
import { FormsModule } from '@angular/forms';
import { BluetoothService } from '../../core/services/bluetooth.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, NgxPrintModule, FormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})

export class InvoiceComponent {

  trx!: Trx;
  @ViewChild('notification') notificationComponent!: NotificationComponent;
  @ViewChild('printTrigger') printTrigger!: ElementRef<HTMLInputElement>;
  @Output() type = new EventEmitter<string>();
  @Input() isPrinter: boolean = true;
  sales: Trx[] = [];


  constructor(public sale: SaleService, private bluetoothService: BluetoothService) {
    
    this.sale.trx$.subscribe(trx => {
      this.trx = trx;
      console.log('Transación',this.trx);
    });
  }

  device: BluetoothDevice | null | undefined;
  error: any;

  searchDevices(evt: Event) {
    evt.preventDefault();
    this.requestDevices();
  }

  async requestDevices() {
    try {
      this.device = await this.bluetoothService.requestDevices();
      if (this.device) {
        console.log('Dispositivo encontrado:', this.device.name);
        await this.connectToDevice(this.device);
      } else {
        console.warn('No se encontró un dispositivo compatible.');
      }
    } catch (err) {
      this.error = err;
      console.error('Error al buscar dispositivos:', err);
    }
  }

  async connectToDevice(device: BluetoothDevice) {
    try {
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('No se pudo conectar al servidor GATT.');
      }

      console.log('Conectado al GATT -->', server);

      await new Promise(resolve => setTimeout(resolve, 5000));

      const services = await server['getPrimaryServices']();
      console.log("Servicios disponibles:", services.map((service: { uuid: any; }) => service.uuid));


      // const characteristics = await service.getCharacteristics();
      // if (Array.isArray(characteristics)) {
      //   characteristics.forEach((char) => {
      //     if (char && typeof char.uuid === 'string') {
      //       console.log('Característica:', char.uuid);
      //     }
      //   });
      // }

    } catch (error) {
      console.error('Error al conectar al dispositivo:', error);
    }
  }

    printInvoice() {
        window.print();
    }

  triggerNotification(message: string, backgroundColor: string) {
    this.notificationComponent.show(message, backgroundColor);
  }

  emitType(type: string) {
    this.type.emit(type);
  }
}