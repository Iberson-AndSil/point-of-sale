export interface Product {
    id: string;
    name: string;
    unitmeasure: string;
    stock: number;
    unitprice: number;
    image: string;
}

export interface Detail {
    id: number,
    product: Product,
    quantity: number,
    comment: string,
    newPrice: number,
    discount: number,
    totalmoney: number,
}

export interface Payment {
    id?: number,
    method: string,
    amount: number,
    date?: Date,
    change?: number
}

export interface Client {
    id: number;
    name: string;
    address: string;
    identitynumber: string;
    identitydocumentid: number;
}

export interface Trx {
    
    trxid?: number;
    date: Date;
    client: Client;
    details: Detail[];
    payments: Payment[];
    voucher: string;
    neto: number;
    discount: number;
    total: number;
    voucherid: number;
}
