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
                var oData = [];
                var oJSON = [{
                    value: ''
                }];
                oData.push(this.getView().getModel("details").getData());
                var oTable = this.getView().byId("detailTable");

                for (var i = 0; i < oData[0].length; i++) {
                var oProduct = oData[0][i].ProductID;
                var oPrice = oData[0][i].UnitPrice;
                oJSON[0][oProduct] = oPrice;
                }

                console.log(oJSON);

                oTable.removeAllColumns();
                oTable.removeAllItems();
                for (var i = 0; i < oData[0].length; i++) {
                    var oColumn = new sap.m.Column( {
                        header: new sap.m.Label({
                            text: "No. " + oData[0][i].ProductID
                        })
                    });
                    oTable.addColumn(oColumn);
                }
                var oCell = [];
                for (var i = 0; i < oData[0].length; i++) {
                    var cell = new sap.m.Text({
                        text: ((oData[0][i].UnitPrice * 100) / 100).toFixed(2) + " EUR"
                    });
                    oCell.push(cell);
                }
                var aColList = new sap.m.ColumnListItem({
                    cells: oCell
                });
                oTable.bindItems("details>/", aColList);
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