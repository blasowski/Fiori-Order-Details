sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/model/odata/v2/ODataModel",
        "sap/ui/model/json/JSONModel"
    ],
    function (Controller, History, ODataModel, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.details.controller.NewProfile", {
            onInit: function () {
                this._onTableLoad();
            },

            _onTableLoad: function () {
                var oInfo = new JSONModel({
                    name: "Name",
                    description: "Description",
                    enabled: false,
                });
                this.getView().setModel(oInfo, "info");
                var oTable = this.getView().byId("daysTable");
                var oCEDI = this.getView().byId("CEDI").getValue();
                var nameColumn = new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Name"
                    })
                });
                oTable.addColumn(nameColumn);
                var descColumn = new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Description"
                    })
                });
                oTable.addColumn(descColumn);
                for (var i = 0; i < oCEDI; i++) {
                    var cedi = new sap.m.Column({
                        styleClass: "yellow",
                        header: new sap.m.Label({
                            text: i + 1
                        })
                    });
                    oTable.addColumn(cedi);
                }
                var oPOS = this.getView().byId("POS").getValue();
                for (var i = 0; i < oPOS; i++) {
                    var sum = parseInt(oCEDI) + i
                    var pos = new sap.m.Column({
                        styleClass: "orange",
                        header: new sap.m.Label({
                            text: sum + 1
                        })
                    });
                    oTable.addColumn(pos);
                }
                var oInfoCells = [];
                var name = new sap.m.Text({
                    text: "{info>/name}"
                });
                var description = new sap.m.Text({
                    text: "{info>/description}"
                });
                oInfoCells.push(name, description);
                var aList = new sap.m.ColumnListItem({
                    cells: oInfoCells
                });
                oTable.bindItems("info>/", aList)
            },

            addCEDI: function () {
                var oCEDI = this.getView().byId("CEDI").getValue();
                var oTable = this.getView().byId("daysTable")
                var oAdd = parseInt(oCEDI);
                this.getView().byId("CEDI").setValue(oAdd + 1);
                oTable.removeAllColumns();
                this._onTableLoad();
            },
            removeCEDI: function () {
                var oCEDI = this.getView().byId("CEDI").getValue();
                var oTable = this.getView().byId("daysTable")
                var oAdd = parseInt(oCEDI);
                this.getView().byId("CEDI").setValue(oAdd - 1);
                oTable.removeAllColumns();
                this._onTableLoad();
            },
            addPOS: function () {
                var oPOS = this.getView().byId("POS").getValue();
                var oTable = this.getView().byId("daysTable")
                var oAdd = parseInt(oPOS);
                this.getView().byId("POS").setValue(oAdd + 1);
                oTable.removeAllColumns();
                this._onTableLoad();
            },
            removePOS: function () {
                var oPOS = this.getView().byId("POS").getValue();
                var oTable = this.getView().byId("daysTable")
                var oAdd = parseInt(oPOS);
                this.getView().byId("POS").setValue(oAdd - 1);
                oTable.removeAllColumns();
                this._onTableLoad();
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