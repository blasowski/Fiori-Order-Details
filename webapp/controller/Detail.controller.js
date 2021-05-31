sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/odata/v2/ODataModel",
        "sap/ui/model/json/JSONModel"
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
                    urlParameters: {
                        "$expand": "Product"
                    },
                    success: function (oData) {
                        oStore.setProperty("/", oData.results);
                        that.getView().setModel(oStore, "details");
                        that._onTableLoaded();
                    },
                });
                oModel.read("/Orders(" + oArgs.OrderID + ")", {
                    success: function (oData) {
                        oStore2.setProperty("/", oData);
                        that.getView().setModel(oStore2, "orders");
                        BusyIndicator.hide();
                    },
                });
            },

            _onTableLoaded: function () {
                var oStore = new JSONModel();
                var oStore2 = new JSONModel();
                var oData = [];
                var oJSON = [{}];
                oData.push(this.getView().getModel("details").getData());
                var oTable = this.getView().byId("detailTable");
                oTable.removeAllColumns();
                oTable.removeAllItems();
                for (var i = 0; i < oData[0].length; i++) {
                    var oProduct = oData[0][i].ProductID;
                    var oPrice = oData[0][i].UnitPrice;
                    oJSON[0][oProduct] = oPrice;
                }
                var aKeys = []
                aKeys.push(Object.keys(oJSON[0]))
                var aValues = []
                aValues.push(Object.values(oJSON[0]))
                oStore.setProperty("/", aKeys[0]);
                oStore2.setProperty("/", aValues)
                this.getView().setModel(oStore, "Product");
                this.getView().setModel(oStore2, "Price");
                for (var i = 0; i < oData[0].length; i++) {
                    var oColumn = new sap.m.Column({
                        header: new sap.m.Label({
                            text: "{Product>/" + [i] + "}"
                        })
                    });
                    oTable.addColumn(oColumn);
                }
                var oCell = [];
                for (var i = 0; i < oData[0].length; i++) {
                    var cell = new sap.m.Text({
                        text: "{Price>/0/" + [i] + "}"
                    });
                    oCell.push(cell);
                }
                var aColList = new sap.m.ColumnListItem({
                    cells: oCell
                });
                oTable.bindItems("Price>/", aColList);
            },

            onPress: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oModel = oEvent.getSource();
                var selectedOrderID = oModel.getBindingContext("details").getProperty("OrderID");
                var selectedProductID = oModel.getBindingContext("details").getProperty("ProductID");
                oRouter.navTo("product", {
                    OrderID: selectedOrderID,
                    ProductID: selectedProductID,
                });
            },
            
            onNavBack: function () {
                var oTableRem = this.getView().byId("detailTable");
                oTableRem.removeAllColumns();
                oTableRem.removeAllItems();
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