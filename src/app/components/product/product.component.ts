import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Detail, Product, Trx } from '../../models/product.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NotificationComponent } from '../notification/notification.component';
import { SaleService } from "../../core/services/sale.service";

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
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, NotificationComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent {

  detailEdit: Detail | undefined;
  product: Product[] = [...ELEMENT_DATA];
  showContent: boolean = false;
  searchTerm: string = '';
  showDialogProduct: boolean = false;
  trx!: Trx;
  quantity: number = 1;
  @ViewChild('notification') notificationComponent!: NotificationComponent;
  @Output() type = new EventEmitter<string>();
  @Output() newInvoice = new EventEmitter<boolean>();

  constructor(public sale: SaleService) {
    this.sale.trx$.subscribe(trx => {
      this.trx = trx;
    });
  }

  openProductDialog(product: Product) {
    const exists = this.trx?.details.some(d => d.product.id === product.id);
    this.quantity = 1
    if (exists) {
      this.detailEdit = this.trx?.details.find(d => d.product.id === product.id);
    } else {
      this.detailEdit = {
        id: this.trx.details.length + 1,
        product: product,
        quantity: 1,
        comment: "",
        newPrice: 0,
        discount: 0,
        totalmoney: 0
      };
    }
    this.showDialogProduct = true;
  }

  saveChanges() {
    const updatedTrx = { ...this.trx };
    const existingDetail = updatedTrx.details.find(p => p.id === this.detailEdit?.id);
    if (existingDetail) {
      this.detailEdit!.quantity = Number((existingDetail.quantity + this.quantity).toFixed(2));
      this.triggerNotification("Se aumentó al mismo producto", "var(--color-green)");
    } else {
      this.detailEdit!.quantity = this.quantity;
      updatedTrx.details.push(this.detailEdit!);
      this.triggerNotification("Producto nuevo agregado", "var(--color-green)");
    }
    this.detailEdit!.newPrice = Number((this.detailEdit!.quantity * (this.detailEdit!.product.unitprice ?? 0)).toFixed(2));
    this.sale.updateTrx(updatedTrx);
    this.closeProductDialog();
  }

  onSearch(inputElement: HTMLInputElement) {
    const term = this.searchTerm.trim().toLowerCase();
    this.product = term
      ? this.product.filter(f => f.name.toLowerCase().includes(term))
      : [...ELEMENT_DATA];
    inputElement.blur();
  }

  changeContent() {
    this.showContent = !this.showContent;
  }

  loadProducts() {
    this.searchTerm = "";
    this.product = [...ELEMENT_DATA];
  }

  closeProductDialog() {
    this.showDialogProduct = false;
    this.detailEdit = {
      id: 0,
      product: {} as Product,
      quantity: 0,
      comment: "",
      newPrice: 0,
      discount: 0,
      totalmoney: 0,
    };
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectText(event: Event) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  triggerNotification(message: string, backgroundColor: string) {
    this.notificationComponent.show(message, backgroundColor);
  }

  bottomCount() {
    if (this.trx.details.length > 0) {
      this.emitType("home");
    } else {
      this.triggerNotification("Selecciona productos", "var(--color-griss)");
    }
  }

  emitType(type: string) {
    this.type.emit(type);
  }

  onEnter(inputElement: HTMLInputElement) {
    inputElement.blur();
  }
}