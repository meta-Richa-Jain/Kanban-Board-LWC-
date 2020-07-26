import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class OrderCard extends NavigationMixin(LightningElement) {
  @api order;

  handleViewRecord() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.order.Id,
        objectApiName: "Order__c",
        actionName: "view"
      }
    });
  }

  handleDrag() {
    this.dispatchEvent(
      new CustomEvent("itemdrag", {
        detail: this.order.Id
      })
    );
  }
}
