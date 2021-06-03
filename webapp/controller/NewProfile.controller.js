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
                var oRow = new JSONModel({
                    value1: ""
                });
                this.getView().setModel(oRow, "onerow");
                var oInfo = new JSONModel({
                    name: "Name",
                    description: "Description",
                    enabled: false,
                });
                this.getView().setModel(oInfo, "info");
                var oTable = this.getView().byId("daysTable");
                var oCEDI = this.getView().byId("CEDI").getValue();
                var nameColumn = new sap.m.Column({
                    hAlign: "Center",
                    header: new sap.m.Label({
                        text: "Name"
                    })
                });
                oTable.addColumn(nameColumn);
                var descColumn = new sap.m.Column({
                    hAlign: "Center",
                    header: new sap.m.Label({
                        text: "Description"
                    })
                });
                oTable.addColumn(descColumn);
                for (var i = 0; i < oCEDI; i++) {
                    var cedi = new sap.m.Column({
                        hAlign: "Center",
                        styleClass: "Yellow",
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
                        hAlign: "Center",
                        styleClass: "Orange",
                        header: new sap.m.Label({
                            text: sum + 1
                        })
                    });
                    oTable.addColumn(pos);
                }
                var aInfoCells = [];
                var name = new sap.m.Text({
                    text: "{info>/name}"
                });
                var description = new sap.m.Text({
                    text: "{info>/description}"
                });
                aInfoCells.push(name, description);

                var aCEDIPOS = []
                var oCEDIPOS = parseInt(oCEDI) + parseInt(oPOS);

                for (var i = 0; i < oCEDIPOS; i++) {
                    var cell = new sap.m.Input({
                        textAlign: "Center",
                        value: oCEDIPOS
                    });
                    aCEDIPOS.push(cell)
                }
                var aCells = aInfoCells.concat(aCEDIPOS);
                var oInfo = new sap.m.ColumnListItem({
                    cells: aCells
                });
                oTable.bindItems("onerow>/", oInfo)

                var items = [];
                var cells = []
                items.push(oTable.mAggregations.items);
                cells.push(items[0][0].mAggregations.cells);
                
                // for (var i = 0

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