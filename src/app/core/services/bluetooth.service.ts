import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  isBluetoothApiSupported(): boolean {
    return !!navigator.bluetooth;
  }

  async requestDevices(): Promise<BluetoothDevice | null> {
    if (!this.isBluetoothApiSupported()) {
      throw new Error('Web Bluetooth API no es compatible con este navegador.');
    }

    try {
      const options: BluetoothRequestDeviceOptions = {
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      };

      const device = await navigator.bluetooth.requestDevice(options);
      return device;
    } catch (error) {
      console.error('Error al solicitar dispositivo Bluetooth:', error);
      return null;
    }
  }
}