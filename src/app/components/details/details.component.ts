import { Component, OnInit, Output, ViewChild, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import { CommonModule } from '@angular/common'
import { Client, Detail, Payment, Product, Trx } from '../../models/product.models';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotificationComponent } from "../notification/notification.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SaleService } from '../../core/services/sale.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, NotificationComponent, MatFormFieldModule, MatIconModule, 
    MatIconModule, MatDatepickerModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './details.component.html',
  providers: [
    provideNativeDateAdapter(),
  ],
  styleUrls: ['./css/details.component.css', './css/dialog.css', './css/material.css', './css/products.css','./css/payment.css']
})
export class DetailsComponent implements OnInit {

  deleteDetail!: Detail;
  detailEdit!: Detail;
  showModifierDialog: boolean = false;
  trx!: Trx;
  showDropdown: boolean = false;
  placeholderText: string = 'DNI (8 dígitos)';
  showClientDialog: boolean = false;
  previousDocumentType = 'DNI';
  isclean: boolean = false;
  moneyInput: number = 0;
  moneyTurned: number = 0;
  showDebt: number = 0;
  aux: number = 0;
  sum: number = 0;
  turnet: boolean = false;
  @Output() type = new EventEmitter<string>();
  paymentMethods = ['Efectivo', 'YAPE', 'PLIN', 'VISA', 'Transferencia'];
  getpayment: Payment = { id: 1, method: "", amount: 0, date: new Date(), change: 0 };
  @Input() sales: Trx[] = [];
  @Output() salesEmitter = new EventEmitter<any[]>();
  isDisabledInput: boolean = false;
  maxLength: number = 8;
  voucherselected: number = 1;
  voucherTypes = [{id:1,name: 'Boleta'}, {id:3,name: 'Nota de Venta'}, {id:2,name: 'Factura'}];
  selectOptionPay: string="";
  optionPay!: FormGroup;
  optionsPay: string[] = ['Contado', 'Crédito'];
  quotasAutomatics=[{label:'Interes(%):', value:0}, {label:'C. Coutas:', value:0}, {label:'Frec. Cuota:', value:0}];
  quotasManual:string[]=['Cuota:', 'Monto:', 'F. Vencimiento:'];
  defaultOptionPay:string='Contado';
  isCredit:boolean=false;
  isChecked:boolean=false;
  currentDate: Date = new Date();
  constructor(public sale: SaleService) {
    this.sale.trx$.subscribe(trx => {
      this.trx = trx;
    });
  }

  initializeDetail(): Detail {
    return { id: this.sales.length + 1, product: {} as Product, quantity: 0, comment: "", newPrice: 0, discount: 0, totalmoney: 0 };
  }

  addQuota(){
    
  }

  cleanTrx() {
    const detailIndex = this.sales.findIndex(t => t.trxid === this.trx.trxid);
    if (detailIndex !== -1) {
      const newTrx = {
        trxid: this.trx.trxid,
        date: new Date(),
        client: { id: 0, name: '', address: '', identitydocumentid: 0, identitynumber: '0000000' },
        details: [],
        payments: [],
        neto: 0,
        total: 0,
        voucher: "",
        discount: 0,
        voucherid: 0,
      };
      this.sales[detailIndex] = newTrx;
      this.trx = newTrx;
    }
    this.moneyInput = 0;
    this.moneyTurned = 0;
    this.sale.updateTrx(this.trx);
    this.isclean = false;
    this.triggerNotification("¡Limpieza exitosa!", "var(--color-green)");
  }

  updateDiscount() {
    if (this.trx.discount <= this.trx.total) {
      this.trx.neto !== 0 && (this.trx.total = Number((this.trx.neto - this.trx.discount).toFixed(2)));
      this.showDebt = this.trx.total;
      this.moneyInput = this.trx.total;
      this.trx.payments[0].amount = this.trx.total;
      this.showDebt = 0;
      this.moneyTurned = 0;
    } else if (this.trx.discount > this.trx.total) {
      this.trx.discount = 0;
      this.triggerNotification("El descuento es muy alto", "var(--color-griss)");
    }
  }

  operationsTrx() {
    this.trx.neto = 0;
    this.trx.details.forEach(det => { this.trx.neto = Number((this.trx.neto + det.newPrice).toFixed(2)); });
    this.trx.total = Number((this.trx.neto - this.trx.discount).toFixed(2));
    this.trx.payments[0]?.amount ? this.moneyInput = this.trx.payments[0]?.amount : this.moneyInput = this.trx.total;
    this.sum = this.trx.payments.reduce((sum, payment) => sum + payment.amount, 0);
    if (this.sum > this.trx.total) {
      this.moneyTurned = Number((this.sum - this.trx.total).toFixed(2));
      this.turnet = true
    } else this.sum < this.trx.total && (this.showDebt = Number((this.trx.total - this.sum).toFixed(2)));
  }

  ngOnInit(): void {
    if (this.trx.details.length != 0 && !this.sales.some(sale => sale.trxid === this.trx.trxid)) {
      this.trx.trxid = this.sales.length + 1;
      this.sales.push({ ...this.trx });
    }
    this.typePay = new FormGroup({
      pay: new FormControl(this.trx.payments[0]?.method || 'Efectivo')
    });
    
    this.typePay.get('pay')?.valueChanges.subscribe((value: string) => {
      this.getpayment.method = value;
      this.trx.payments[0].method = value;
    });

    this.optionPay = new FormGroup({
      methodPay: new FormControl(this.defaultOptionPay)
    });
    this.optionPay.get('methodPay')?.valueChanges.subscribe((value) => {this.defaultOptionPay = value;});
    
    this.operationsTrx();
    this.moneyInput=this.trx.total

    this.trx.total > 0 && (this.isDisabledInput = true);
    
    this.trx.payments.length === 0 && (this.trx.payments.push({ ...this.getpayment }));
    this.trx.payments[0].amount = this.moneyInput;
    
    const sum = this.trx.payments.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (sum <= this.trx.total) {
      this.showDebt = Number((this.trx.total - sum).toFixed(2));
      this.moneyTurned=0;
    } else if (sum > this.trx.total) {
      this.showDebt = 0;    
    }
  }

  saveChanges() {
    const exists = this.trx.details.some(d => d.id === this.detailEdit.id);
    this.detailEdit.newPrice = Number((this.detailEdit.product.unitprice * this.detailEdit.quantity).toFixed(2));
    
    if (exists) {
      const index = this.trx.details.findIndex(d=>d.id===this.detailEdit.id)
      index!==-1 && (this.trx.details[index]={...this.detailEdit});
    }else if (!exists){this.trx.details.push({ ...this.detailEdit });}

    this.sale.updateTrx(this.trx);
    this.ngOnInit();
    this.closeProductDialog();
    this.triggerNotification("Cambios guardados", "var(--color-green)");
  }

  openProductDialog(detail: Detail) {
    this.deleteDetail = detail;
    this.detailEdit = {...detail};
    this.showModifierDialog = true;
  }

  deleteProduct() {
    this.trx.details = this.trx.details.filter(d => d.id !== this.deleteDetail.id);
    this.showModifierDialog = false;
    this.sale.updateTrx(this.trx);
    this.ngOnInit();
    this.triggerNotification("Producto eliminado", "var(--color-griss)");
  }

  onEnter(inputElement: HTMLInputElement) {
    inputElement.blur();
  }

  typeVoucher: FormGroup = new FormBuilder().group({
    voucher: ['Boleta']
  });

  onSelectedVoucher(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    let textoSeleccionado = selectElement.options[selectElement.selectedIndex].text;
    let obj = this.voucherTypes.find(el=>el.name.trim() === textoSeleccionado);
    this.trx.voucherid = obj!.id;
    this.trx.voucher = obj!.name;
  }

  editClient(client: Client) {
    this.trx.client = client;
    this.showClientDialog = true;
  }

  closeProductDialog() {
    this.showModifierDialog = false;
    this.detailEdit = this.initializeDetail();
  }

  selectText(event: Event) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  increaseQuantity(): void {
    this.detailEdit.quantity++;
  }

  decreaseQuantity(): void {
    this.detailEdit.quantity > 1 && this.detailEdit.quantity--;
  }


  @ViewChild('notification') notificationComponent!: NotificationComponent;

  triggerNotification(message: string, backgroundColor: string) {
    this.notificationComponent.show(message, backgroundColor);
  }

  typeDocument = new FormGroup({
    documentNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ])
  });

  typePay: FormGroup = new FormBuilder().group({
    pay: ['Efectivo']
  });

  selectOption(option: string) {
    if (option === this.previousDocumentType) {
      this.showDropdown = false;
      return;
    }
    this.showDropdown = false;
    this.previousDocumentType = option;
    this.typeDocument.get('documentNumber')?.setValue('');
    if (option === 'DNI') {
      this.placeholderText = 'DNI (8 dígitos)';
      this.maxLength = 8;
    } else if (option === 'RUC') {
      this.placeholderText = 'RUC (11 dígitos)';
      this.maxLength = 11;
    } else if (option === 'Carnet') {
      this.placeholderText = 'Carnet de extranjería (12 dígitos)';
      this.maxLength = 12;
    } else if (option === 'Pasaporte') {
      this.placeholderText = 'Pasaporte (12 dígitos)';
      this.maxLength = 12;
    }
  }

  restrictInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value.length > this.maxLength && (value = value.slice(0, this.maxLength));
    input.value = value;
    this.typeDocument.get('documentNumber')?.setValue(value, { emitEvent: false });
  }

  addPayPart() {
    this.aux = this.trx.payments.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (this.moneyTurned < this.trx.total && this.moneyInput!==this.trx.total && this.aux<this.trx.total) {
      const index = this.trx.payments.length;
      this.getpayment.method = this.paymentMethods[(index) % this.paymentMethods.length];
      this.getpayment.id = this.trx.payments.length + 1;
      this.getpayment.amount = this.showDebt;
      this.trx.payments.push(this.getpayment);

      const sum = this.trx.payments.reduce((sum, item) => sum + (item.amount || 0), 0);
      sum <= this.trx.total && (this.showDebt = Number((this.trx.total - sum).toFixed(2)));
      sum > this.trx.total && (this.showDebt = 0);

      this.getpayment = { id: 0, method: "Efectivo", amount: 0, date: new Date(), change: 0 };
      setTimeout(() => {
        const lastRow = document.querySelector('.pay__parts:last-child') as HTMLElement;
        if (lastRow) {
          lastRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          const lastInput = lastRow.querySelector('input') as HTMLInputElement;
          if (lastInput) {
            lastInput.focus();
          }
        }
      }, 100);
    } else {
      this.triggerNotification("Monto completo o excedido", "var(--color-griss)");
    }
  }

  updatePayment(value: number | Payment | null) {
    this.turnet = false;
    if (value === null) {
      this.showDebt = 0;
      this.moneyTurned = 0;
      return;
    }
    if (typeof value === 'number') {
      if (value <= this.trx.total) {
        this.trx.payments[0].amount = this.moneyInput;
        this.moneyTurned = 0;
        this.showDebt = this.trx.payments.reduce((sum, item) => sum + (item.amount || 0), 0);
        this.showDebt <= this.trx.total && (this.showDebt = Number((this.trx.total - this.showDebt).toFixed(2)));
        this.showDebt > this.trx.total && (this.showDebt = 0);
      } else if (value > this.trx.total) {
        this.trx.payments[0].amount = value;
        this.getpayment.method == 'Efectivo' && (this.turnet = true);     
        this.showDebt = this.trx.payments.reduce((sum, item) => sum + (item.amount || 0), 0);
        this.moneyTurned = Number((this.showDebt - this.trx.total).toFixed(2));
        this.showDebt = 0;
      }
    } else if (typeof value === 'object' && value !== null) {
      value.amount <= this.trx.total && (this.trx.payments.find(d => d.id === value.id)!.amount = value.amount);
      this.aux = this.trx.payments.reduce((sum, item) => sum + (item.amount || 0), 0);
      if (this.aux <= this.trx.total) {
        this.moneyTurned=0;
        this.showDebt = Number((this.trx.total - this.aux).toFixed(2));
        
      } else if (this.aux > this.trx.total) {
        this.showDebt = 0;
        value.method == 'Efectivo' && (this.turnet = true);
        this.moneyTurned = Number((this.aux - this.trx.total).toFixed(2));
        console.log(this.moneyTurned);
        
      }
    }
  }

  payToVoucher() {
    if (this.trx.voucher === "") {
      this.trx.voucher = "Boleta";
      this.trx.voucherid= 1;
    }
    this.aux = this.trx.payments.reduce((sum, item) => sum + (item.amount || 0), 0);

    if (this.trx.details.length > 0 ) {
      if (this.showDebt == 0 && this.aux==this.trx.total) {
        const index = this.sales.findIndex(sale => sale.trxid === this.trx.trxid);
        if (index !== -1) {
          this.sales[index] = { ...this.trx };
        }
        this.trx.trxid = this.sales.length + 1;
        this.salesEmitter.emit(this.sales);
        this.emitType("voucher");
      } else {
        this.triggerNotification("Pago incompleto o excedido", "var(--color-orange)");
      }
    } else {
      this.triggerNotification("Selecciona productos", "var(--color-griss)");
    }
  }

  emitType(type: string) {
    this.type.emit(type);
  }

  isDeleteMethod = false;

  deletePayment!: Payment;
  showMetohd(payment: Payment) {
    this.isDeleteMethod = true;
    this.deletePayment = payment;
  }

  removePayPart() {
    const index = this.trx.payments.findIndex(p => p.id === this.deletePayment.id);
    index !== -1 && this.trx.payments.splice(index, 1);
    this.aux = this.trx.payments.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (this.aux > this.trx.total) {
      this.moneyTurned = Number((this.aux - this.trx.total).toFixed(2));
    } else if (this.aux <= this.trx.total) {
      this.showDebt = Number((this.trx.total - this.aux).toFixed(2));
    }
    this.isDeleteMethod = false;
    this.deletePayment = { id: 1, method: "Efectivo", amount: 0, date: new Date(), change: 0 }
    this.triggerNotification("Se eliminó el método de pago", "var(--color-griss)");
  }


}