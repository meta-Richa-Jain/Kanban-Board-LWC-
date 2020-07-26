import { LightningElement } from "lwc";

import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getOrders from "@salesforce/apex/OrderController.getOrders";

import { STATUS, STAGE_FIELD, AMOUNT_FIELD } from "./utils";

export default class KanbanBoard extends LightningElement {
  orderList;
  error;
  orderId;
  canceledOrders = [];
  inProgressOrders = [];
  completedOrders = [];
  shippedOrders = [];
  inProgressAmount = 0;
  completedAmount = 0;
  canceledAmount = 0;
  shippedAmount = 0;

  connectedCallback() {
    this.handleLoad();
  }

  handleLoad() {
    getOrders()
      .then(result => {
        this.orderList = result;
        this.arrangeOrders(result);
      })
      .catch(error => {
        this.error = error;
      });
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleListItemDrag(event) {
    this.orderId = event.detail;
  }

  handleItemDrop(event) {
    let stage = event.detail;

    this.orderList = JSON.parse(JSON.stringify(this.orderList));

    let index = this.orderList.findIndex(order => {
      return order.Id === this.orderId;
    });

    this.orderList[index][STAGE_FIELD] = stage;

    this.updateOrderList(this.orderList[index]);
    this.arrangeOrders(this.orderList);
  }

  arrangeOrders(orderList) {
    const currInProgressOrders = [];
    const currShippedOrders = [];
    const currCompletedOrders = [];
    const currCanceledOrders = [];

    orderList.forEach(order => {
      if (order[STAGE_FIELD] === STATUS.inProgress) {
        currInProgressOrders.push(order);
      } else if (order[STAGE_FIELD] === STATUS.completed) {
        currCompletedOrders.push(order);
      } else if (order[STAGE_FIELD] === STATUS.shipped) {
        currShippedOrders.push(order);
      } else if (order[STAGE_FIELD] === STATUS.canceled) {
        currCanceledOrders.push(order);
      }
    });

    this.inProgressOrders = currInProgressOrders;
    this.completedOrders = currCompletedOrders;
    this.canceledOrders = currCanceledOrders;
    this.shippedOrders = currShippedOrders;

    this.updateAmount();
  }

  updateAmount() {
    this.inProgressAmount = 0;
    this.completedAmount = 0;
    this.canceledAmount = 0;
    this.shippedAmount = 0;

    this.inProgressOrders.forEach(order => {
      this.inProgressAmount += order[AMOUNT_FIELD];
    });
    this.completedOrders.forEach(order => {
      this.completedAmount += order[AMOUNT_FIELD];
    });
    this.canceledOrders.forEach(order => {
      this.canceledAmount += order[AMOUNT_FIELD];
    });
    this.shippedOrders.forEach(order => {
      this.shippedAmount += order[AMOUNT_FIELD];
    });
  }

  updateOrderList(recordInput) {
    updateRecord({ fields: recordInput })
      .then(() => {
        console.log("Successfully updated");
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error updating record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }

  get status() {
    return STATUS;
  }
}
