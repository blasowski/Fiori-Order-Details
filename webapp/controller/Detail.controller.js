sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
],
    function (Controller, History, BusyIndicator, ODataModel, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.details.controller.Detail", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {
                BusyIndicator.show();
                var oModel = new ODataModel("./V2/Northwind/Northwind.svc", true);
                var oStore = new JSONModel();
                var oStore2 = new JSONModel();
                var oArgs = oEvent.getParameter("arguments");
                var that = this;
                oModel.read("/Orders(" + oArgs.OrderID + ")/Order_Details", {
                    urlParameters: { "$expand": "Product" },
                    success: function (oData) {
                        oStore.setProperty("/", oData.results);
                        that.getView().setModel(oStore, "mDetails");
                        BusyIndicator.hide();
                    },
                });
                oModel.read("/Orders(" + oArgs.OrderID + ")", {
                    success: function (oData) {
                        oStore2.setProperty("/", oData);
                        that.getView().setModel(oStore2, "mTitle");
                    },
                });
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("homepage", true);
                }
            }
        });
    });