sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast"
    ],
    function (Controller, History, BusyIndicator, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("sap.btp.details.controller.NewProfile", {
            onInit: function () {
                BusyIndicator.hide();
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
                var oCedi = this.getView().byId("CEDI").getValue();
                var oPos = this.getView().byId("POS").getValue();
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
                for (let i = 0; i < oCedi; i++) {
                    var cedi = new sap.m.Column({
                        hAlign: "Center",
                        styleClass: "Yellow",
                        header: new sap.m.Label({
                            text: i + 1
                        })
                    });
                    oTable.addColumn(cedi);
                }
                for (let i = 0; i < oPos; i++) {
                    var sum = parseInt(oCedi) + i
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

                var aCells = [];
                var oCediPos = parseInt(oCedi) + parseInt(oPos);
                var oResults = parseFloat(100 / oCediPos).toFixed(1);
                var that = this;
                for (let i = 0; i < oCediPos; i++) {
                    var cell = new sap.m.Input({
                        change: function () {
                            var aCellsToModify = [];
                            var aChangedValue = [];
                            var aStoredValue = [];
                            for (let i = 0; i < oCorrectCells.length; i++) {
                                var newValueString = oCorrectCells[i].getValue();
                                var newValue = parseFloat(newValueString);
                                aChangedValue.push(newValue);
                            }
                            for (let i = 0; i < oCorrectCells.length; i++) {
                                if (aStartingValue[i] == aChangedValue[i]) {
                                    aCellsToModify.push(i);
                                } else if (!(aStartingValue[i] == aChangedValue[i])) {
                                    aStoredValue.splice(i, 1, aChangedValue[i]);
                                }
                            }
                            var oStoredResult = aStoredValue.reduce((a, b) => a + b);
                            var oResult = parseFloat(((100 - oStoredResult) / (aCellsToModify.length)).toFixed(1));
                            var oResultLeeway = (100 - ((oResult * aCellsToModify.length) + oStoredResult)) / 0.1;
                            for (let i = 0; i < oCorrectCells.length; i++) {
                                if (aStartingValue[i] == aChangedValue[i]) {
                                    oCorrectCells[i].setValue(oResult);
                                    aChangedValue.splice(i, 1, oResult);
                                    aStartingValue.splice(i, 1, oResult);
                                }
                            }
                            if (oResultLeeway < 0) {
                                var oCorrectedResult = parseFloat(oResult - 0.1);
                                for (let i = 0; i < -(oResultLeeway); i++) {
                                    if (aStartingValue[i] == aChangedValue[i]) {
                                        oCorrectCells[oCorrectCells.length - i].setValue(oCorrectedResult);
                                        aChangedValue.splice(oCorrectCells.length - i, 1, oCorrectedResult);
                                        aStartingValue.splice(oCorrectCells.length - i, 1, oCorrectedResult);
                                    } else if (aStartingValue[i] !== aChangedValue[i]) {
                                        i++; // aumentare ???
                                    }
                                }
                            }
                            if (oResultLeeway > 0) {
                                var oCorrectedResult = parseFloat(oResult + 0.1);
                                for (let i = 0; i < oResultLeeway; i++) {
                                    if (aStartingValue[i] == aChangedValue[i]) {
                                        oCorrectCells[i].setValue(oCorrectedResult);
                                        aChangedValue.splice(i, 1, oCorrectedResult);
                                        aStartingValue.splice(i, 1, oCorrectedResult);
                                    } else if (aStartingValue[i] !== aChangedValue[i]) {
                                        i++; // aumentare  ???
                                    }
                                }
                            }
                            var oCheckTotal = ((100 / parseInt(aChangedValue.reduce((a, b) => a + b))) * 100).toFixed();
                            if (oCheckTotal != 100) {
                                that.getView().byId("errorMessage").setProperty("visible", true);
                            } else if (oCheckTotal == 100) {
                                that.getView().byId("errorMessage").setProperty("visible", false);
                            }
                        },
                        textAlign: "Center",
                        type: "Number",
                        value: oResults
                    });
                    aCells.push(cell)
                }
                var aCells = aInfoCells.concat(aCells);
                var oInfo = new sap.m.ColumnListItem({
                    cells: aCells
                });
                oTable.bindItems("onerow>/", oInfo);
                this.getView().byId("daysTotal").setValue(oCediPos);
                var oAllCells = oTable["mAggregations"]["items"][0]["mAggregations"]["cells"];
                var oCorrectCells = oAllCells.slice(2);
                var aStartingValue = [];
                for (let i = 0; i < oCorrectCells.length; i++) {
                    var oldValueString = oCorrectCells[i].getValue();
                    var oldValue = parseFloat(oldValueString);
                    aStartingValue.push(oldValue);
                }
                var oStartingValuesSum = aStartingValue.reduce((a, b) => a + b);
                var oStartingCheck = parseInt(oStartingValuesSum);
                if (oStartingCheck !== 100) {
                    that.getView().byId("errorMessage").setProperty("visible", true);
                } else if (oStartingCheck == 100) {
                    that.getView().byId("errorMessage").setProperty("visible", false);
                }
            },

            changeCEDI: function () {
                var oTable = this.getView().byId("daysTable")
                oTable.removeAllColumns();
                this._onTableLoad();
            },
            changePOS: function () {
                var oTable = this.getView().byId("daysTable")
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