import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule, DatePipe  } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ProductComponent } from "../../components/product/product.component";
import { Trx, Product } from '../../models/product.models';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import NavMenuComponent from "../../components/nav-menu/nav-menu.component";
import { DetailsComponent } from "../../components/details/details.component";
import { NotificationComponent } from '../../components/notification/notification.component';
import { BarcodeComponent } from "../../components/barcode/barcode.component";
import { SaleService } from '../../core/services/sale.service';
import { InvoiceComponent } from "../../components/invoice/invoice.component";
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

const ELEMENT_DATA: Product[] = [
  { id: "5901234123457", name: 'SIN_IGV PRODUCTO 1', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "2", name: 'SIN_IGV PRODUCTO 8', unitmeasure: 'NIU', stock: 23, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "3", name: 'ALOJAMIENTO SIMPLE PRODUCTO 2', unitmeasure: 'NIU', stock: 12, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "4", name: 'SIN_IGV PRODUCTO 12', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "5", name: 'SIN_IGV PRODUCTO 6', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "6", name: 'SIN_IGV PRODUCTO 4', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "7", name: 'ALOJAMIENTO SIMPLE PRODUCTO 3', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "8", name: 'SIN_IGV PRODUCTO 9', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "9", name: 'SIN_IGV PRODUCTO 1', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "10", name: 'SIN_IGV PRODUCTO 1', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "11", name: 'SIN_IGV PRODUCTO 1', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "12", name: 'SIN_IGV PRODUCTO 1', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "13", name: 'ALOJAMIENTO SIMPLE PRODUCTO 2', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "14", name: 'SIN_IGV PRODUCTO 1', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
  { id: "15", name: 'SIN_IGV PRODUCTO 1', unitmeasure: 'NIU', stock: 33, unitprice: 29.33, image: ' https://via.placeholder.com/150 ' },
];


@Component({
  selector: 'app-sales',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [CommonModule, FormsModule, ProductComponent, ReactiveFormsModule,
    NavMenuComponent, DetailsComponent, NotificationComponent, BarcodeComponent, InvoiceComponent, 
    MatFormFieldModule, MatDatepickerModule, MatPaginatorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sales.component.html',
  styleUrl: './css/sales.component.css',
})

export default class SalesComponent {
  isExpanded: boolean = false;
  product: Product[] = [...ELEMENT_DATA];
  sales: Trx[] = [];
  showDeleteModal: boolean = false;
  varScanner = "";
  type: string = "sales";
  facturaSales: String = "";
  idF: number = 0;
  openedPanels: number = 0;
  isOpen = false;
  searchTerm: string = '';
  trx!: Trx;
  printer: boolean = false;
  searchForm: FormGroup
  results: any[] = [];
  myForm: FormGroup = new FormBuilder().group({
    opcion: ['opcion1']
  });
  search='';

  constructor(public sale: SaleService, private fb: FormBuilder, private paginatorIntl: MatPaginatorIntl) {
    const today = new Date();

    this.searchForm = this.fb.group({
      query: [''],
      start: [today],  
      end: [today]     
    });
    this.sale.trx$.subscribe(trx => {
      this.trx = trx;
    });
    
    this.paginatorIntl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, length);
      return `${startIndex + 1} – ${endIndex} de ${length}`;
    }
  }


  toggleDropdown(): void {
    this.isExpanded = !this.isExpanded;

    const arrowIcon = document.getElementById('arrowIcon');
    const container = document.getElementById("container");
    const message = document.getElementById("message");

    if (arrowIcon) {
      arrowIcon.style.transform = this.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
      arrowIcon.style.transition = 'transform 0.3s ease';
    }
    if (container) {
      container.style.height = this.isExpanded ? '58vh' : '66vh';
    }
    if (message) {
      message.style.height = this.isExpanded ? '36vh' : '52vh';
    }

  }

  onSearch(): void {
    const { query, start, end } = this.searchForm.value;
  
    // Formatear fechas a dd/MM/yy usando Intl.DateTimeFormat
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    };
  
    const formattedStart = start 
      ? new Intl.DateTimeFormat('es-ES', options).format(new Date(start)) 
      : null;
    const formattedEnd = end 
      ? new Intl.DateTimeFormat('es-ES', options).format(new Date(end)) 
      : null;
  
    console.log('Criterios Formateados:', { query, start: formattedStart, end: formattedEnd });
  
    // Simulación de datos
    const mockData = [
      { name: 'Evento 1', date: '01/12/24' }, // Fechas simuladas ya en formato dd/MM/yy
      { name: 'Evento 2', date: '05/12/24' },
      { name: 'Evento 3', date: '10/12/24' }
    ];
  
    // Filtrar por texto y rango de fechas
    this.results = mockData.filter(item => {
      const matchText = query 
        ? item.name.toLowerCase().includes(query.toLowerCase()) 
        : true;
  
      const matchStartDate = formattedStart 
        ? new Date(item.date.split('/').reverse().join('-')) >= new Date(start) 
        : true;
  
      const matchEndDate = formattedEnd 
        ? new Date(item.date.split('/').reverse().join('-')) <= new Date(end) 
        : true;
  
      return matchText && matchStartDate && matchEndDate;
    });
  
    console.log('Resultados Filtrados:', this.results);
  }

  updateType(newType: string) {
    this.type = newType; 
    this.type=="hm"&&this.newTrx();
  }
  
  setNewInvoice(newInvoice: boolean){
    if (newInvoice) {
      this.sales.push(this.trx);
    }
  }

  receiveSales(sales: Trx[]){
    this.sales=sales;
  }

  newTrx() {
    this.trx = {
      trxid: this.sales.length + 1,
      date: new Date(),
      client: { id: 1, name: 'Iberson Silva Ch.', address: "--", identitydocumentid: 1, identitynumber: '73463363' },
      details: [],
      payments: [],
      neto: 0,
      total: 0,
      voucher: "",
      discount: 0,
      voucherid: 0
    };
    this.sale.updateTrx(this.trx);
    this.setDialogType('home');
  }

  setDialogType(type: string) {
    this.isExpanded = false;
    this.type = type;
  }

  getValuescanner(valueScanner: string) {
    if (valueScanner.length > 0) {
      this.setDialogType('home');
      this.varScanner = valueScanner;
      const existingDetail = this.trx.details.find(d => d.product.id === valueScanner);
      if (existingDetail) {
        existingDetail.quantity = Number((existingDetail.quantity + 1).toFixed(2));
        existingDetail.newPrice = Number((existingDetail.quantity * existingDetail.product.unitprice).toFixed(2));
        this.trx.details = [...this.trx.details];
        this.triggerNotification("Producto aumentado", "var(--color-green)");
      } else {
        const newProduct = this.product.find(p => p.id === valueScanner);
        if (newProduct) {
          this.trx.details.push({id: this.trx.details.length + 1, product: newProduct, quantity: 1, comment: "", 
              newPrice: newProduct.unitprice, discount: 0, totalmoney: 0}
          );
          this.triggerNotification("Nuevo producto agregado", "var(--color-green)");
        }else if(!newProduct){
          this.triggerNotification("Producto no encontrado", "var(--color-orange)");
        }
      }
      this.sale.updateTrx(this.trx);     
    }
  }

  duplicateInvoice(sale: Trx){
    const duplicatedInvoice: Trx = {
      ...sale, 
      trxid: this.sales.length + 1,
      date: new Date(),
      details: sale.details.map(detail => ({ ...detail })),
      payments: sale.payments.map(payment => ({ ...payment })),
    };
    this.sales.push(duplicatedInvoice);
    this.trx = {...duplicatedInvoice};
    this.setDialogType('home');
  }

  showPrinter(){
    this.printer=!this.printer;
    console.log("cambió?..> ", this.printer);
  }

  togglePanel(idFactura: number) {
    if (this.openedPanels === idFactura) {
      this.openedPanels = 0;
    } else {
      this.openedPanels = idFactura;
    }
  }

  delete() {
    this.sales = this.sales.filter(e => e.trxid != this.idF);
    this.showDeleteModal = false;
  }

  openDelete(IdFactura: number) {
    this.idF = IdFactura;
    this.showDeleteModal = true;
  }

  closeDelete() {
    this.showDeleteModal = false;
  }

  panel() {
    this.isOpen = !this.isOpen;
  }

  onClientSearch() {}

  editFactura(trx: Trx) {
    this.isExpanded = false;
    this.trx = trx;
    this.sale.updateTrx(this.trx);
    this.setDialogType('home');
  }

  // notificaciones...
  @ViewChild('notification') notificationComponent!: NotificationComponent;

  triggerNotification(message: string, backgroundColor: string) {
    this.notificationComponent.show(message, backgroundColor);
  }

  setVoucher() {
    this.isExpanded = false;
    if (this.trx.total) {
      this.setDialogType('voucher')
    }
  }

  selectText(event: Event) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  onEnter(inputElement: HTMLInputElement) {
    inputElement.blur();
  }
}