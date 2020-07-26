import stage from "@salesforce/schema/Order__c.Stage__c";
import amount from "@salesforce/schema/Order__c.Amount__c";

export const STAGE_FIELD = stage.fieldApiName;
export const AMOUNT_FIELD = amount.fieldApiName;

export const STATUS = {
  inProgress: "In Progress",
  shipped: "Shipped",
  completed: "Completed",
  canceled: "Canceled"
};
