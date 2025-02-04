import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Trx } from '../../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private trxSource = new BehaviorSubject<Trx>({
    trxid: 1,
    date: new Date(),
    client: { id: 3, name: '--', address: "--", identitydocumentid: 1, identitynumber: '00000000' },
    details: [],
    payments: [],
    neto: 0,
    discount: 0,
    voucher: "",
    total: 0,
    voucherid:0,
  });

  trx$ = this.trxSource.asObservable();

  constructor() {}

  // metodo para actualizar trx
  updateTrx(newTrx: Trx) {
    this.trxSource.next(newTrx);
  }

  // metodo para obtener el valor actual de trx sin suscribirse
  getCurrentTrx(): Trx {
    return this.trxSource.getValue();
  }
}
