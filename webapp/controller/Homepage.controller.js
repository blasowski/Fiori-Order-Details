sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, BusyIndicator, ODataModel, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("sap.btp.details.controller.Homepage", {

        onInit: function () {
            BusyIndicator.show();
            var oModel = new ODataModel("./V2/Northwind/Northwind.svc", true);
            var oStore = new JSONModel();
            var that = this;
            oModel.read('/Orders', {
                urlParameters: {
                    "$expand": "Order_Details"
                },
                success: function (oData) {
                    oStore.setProperty("/Orders", oData.results);
                    that.getView().setModel(oStore, "mMain");
                    BusyIndicator.hide();
                }
            });
        },

        onSearch: function () {
            var aSearchFilters = [];
            // ComboBox
            var aComboBoxKeys = this.getView().byId("fbComboBox").getSelectedKeys();
            for (var i = 0; i < aComboBoxKeys.length; i++) {
                aSearchFilters.push(new Filter({
                    path: "OrderID",
                    operator: FilterOperator.EQ,
                    value1: aComboBoxKeys[i]
                }, true));
            };
            // Customer ID Filter
            var aCustomerFilter = this.getView().byId("fbCustomerID").getProperty("value");
            if (aCustomerFilter.length > 0) {
                aSearchFilters.push(new Filter({
                    path: "CustomerID",
                    operator: FilterOperator.Contains,
                    value1: aCustomerFilter
                }, true));
            };
            // Shiping City Filter
            var aShipCityFilter = this.getView().byId("fbShipCity").getProperty("value");
            if (aShipCityFilter.length > 0) {
                aSearchFilters.push(new Filter({
                    path: "ShipCity",
                    operator: FilterOperator.Contains,
                    value1: aShipCityFilter
                }, true));
            };
            // Shipping Country Filter
            var aShipCountryFilter = this.getView().byId("fbShipCountry").getProperty("value");
            if (aShipCountryFilter.length > 0) {
                aSearchFilters.push(new Filter({
                    path: "ShipCountry",
                    operator: FilterOperator.Contains,
                    value1: aShipCountryFilter
                }, true));
            };
            var oTable = this.getView().byId("mainTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aSearchFilters);
        },

        onPress: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oModel = oEvent.getSource();
            var selectedOrderID = oModel.getBindingContext("mMain").getProperty("OrderID");
            var selectedProductID = oModel.getBindingContext("mMain").getProperty("ProductID");
            oRouter.navTo("detail", {
                OrderID: selectedOrderID,
                ProductID: selectedProductID,
            });
        },

        onReset: function () {
            var oList = this.getView().byId("mainTable");
            var oBinding = oList.getBinding("items");
            oBinding.filter([]);
        },

        onClear: function () {
            var clearCustomer = this.getView().byId("fbCustomerID");
            clearCustomer.clear();
            var clearCity = this.getView().byId("fbShipCity");
            clearCity.clear();
            var clearCountry = this.getView().byId("fbShipCountry");
            clearCountry.clear();
        }
    });
});