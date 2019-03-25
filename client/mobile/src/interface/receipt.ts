export interface IReceipt {
    location?: string;
    name?: string;
    info?: string;
    date?: string;
    subtotal?: number;
    tax?: number;
    total?: number;
    items: IReceiptItem[];
}

export interface IReceiptItem {
    text: string;
    name?: string;
    qty?: number;
    price?: number;
    tax?: number;
    total?: number;

}

