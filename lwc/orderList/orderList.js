import { LightningElement, api } from "lwc";

export default class OrderList extends LightningElement {
  @api orderlist;
  @api stage;
  @api amount;

  handleDragOver(event) {
    event.preventDefault();
  }

  handleItemDrag(event) {
    this.dispatchEvent(
      new CustomEvent("listitemdrag", {
        detail: event.detail
      })
    );
  }

  handleDrop() {
    this.dispatchEvent(
      new CustomEvent("itemdrop", {
        detail: this.stage
      })
    );
  }

  get header() {
    return this.stage + " (" + this.orderlist.length + ")";
  }
}
