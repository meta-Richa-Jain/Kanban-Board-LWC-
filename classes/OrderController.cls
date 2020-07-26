public with sharing class OrderController {
    @AuraEnabled (cacheable=true)
    public static List<Order__c> getOrders(){
        return[SELECT Id, Name, Stage__c, Amount__c FROM Order__c];
    }

    @AuraEnabled(cacheable = true)
    public static List<String> getAllStatus()
    {
       List<String> options = new List<String>();
       Schema.DescribeFieldResult fieldResult = Order__c.Stage__c.getDescribe();
       List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
       for( Schema.PicklistEntry f : ple)
       {
               options.add(f.getLabel());
       }     
       return options;
    }
}