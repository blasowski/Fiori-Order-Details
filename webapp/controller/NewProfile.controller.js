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
                this._renderChart();
            },

            _onTableLoad: function () {
                this.getView().byId("errorMessage").setProperty("visible", false);
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
                    styleClass: "sapUiSizeCompact ",
                    header: new sap.m.Label({
                        text: "Name"
                    })
                });
                oTable.addColumn(nameColumn);
                var descColumn = new sap.m.Column({
                    hAlign: "Center",
                    styleClass: "sapUiSizeCompact",
                    header: new sap.m.Label({
                        text: "Description"
                    })
                });
                oTable.addColumn(descColumn);
                for (let i = 0; i < oCedi; i++) {
                    var cedi = new sap.m.Column({
                        minScreenWidth: "Small",
                        hAlign: "Center",
                        styleClass: "Yellow sapUiSizeCompact",
                        header: new sap.m.Label({
                            text: i + 1
                        })
                    });
                    oTable.addColumn(cedi);
                }
                for (let i = 0; i < oPos; i++) {
                    var sum = parseInt(oCedi) + i
                    var pos = new sap.m.Column({
                        minScreenWidth: "Small",
                        hAlign: "Center",
                        styleClass: "Orange sapUiSizeCompact",
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
                            that.getView().byId("errorMessage").setProperty("visible", false);
                            var aCellsToModify = [];
                            var aChangedValue = [];
                            var aStoredValue = [];
                            for (let i = 0; i < oCells.length; i++) {
                                var getValue = oCells[i].getValue();
                                getValue = getValue.replace(",", ".");
                                getValue = getValue.replace("%", "");
                                var newValue = parseFloat(getValue);
                                aChangedValue.push(newValue);
                            }
                            for (let i = 0; i < oCells.length; i++) {
                                if (aStartingValue[i] == aChangedValue[i]) {
                                    aCellsToModify.push(i);
                                } else if (!(aStartingValue[i] == aChangedValue[i])) {
                                    aStoredValue.splice(i, 1, aChangedValue[i]);
                                }
                            }
                            var oStoredResult = aStoredValue.reduce((a, b) => a + b);
                            var oResult = parseFloat(((100 - oStoredResult) / (aCellsToModify.length)).toFixed(1));
                            var oResultLeeway = parseFloat((100 - ((oResult * aCellsToModify.length) + oStoredResult)).toFixed(1)) / 0.1;
                            for (let i = 0; i < oCells.length; i++) {
                                if (aStartingValue[i] == aChangedValue[i]) {
                                    var newResult = oResult;
                                    oCells[i].setValue(parseFloat(newResult.toFixed(1)));
                                    aChangedValue.splice(i, 1, newResult);
                                    aStartingValue.splice(i, 1, newResult);
                                }
                            }
                            if (oResultLeeway > 0) {
                                let oCorrectedResult = oResult + 0.1;
                                for (let i = 0; i < oResultLeeway; i++) {
                                    if (aStartingValue[i] == aChangedValue[i]) {
                                        oCells[i].setValue(parseFloat(oCorrectedResult.toFixed(1)));
                                        aChangedValue.splice(i, 1, oCorrectedResult);
                                        aStartingValue.splice(i, 1, oCorrectedResult);
                                    } else if (aStartingValue[i] !== aChangedValue[i]) {
                                        oResultLeeway++;
                                    }
                                }
                            }
                            if (oResultLeeway < 0) {
                                let oCorrectedResult = oResult - 0.1;
                                for (let i = 1; i < -(oResultLeeway); i++) {
                                    if (aStartingValue[oCells.length - i] == aChangedValue[oCells.length - i]) {
                                        oCells[oCells.length - i].setValue(parseFloat(oCorrectedResult.toFixed(1)));
                                        aChangedValue.splice(oCells.length - i, 1, oCorrectedResult);
                                        aStartingValue.splice(oCells.length - i, 1, oCorrectedResult);
                                    } else if (aStartingValue[i] !== aChangedValue[i]) {
                                        oResultLeeway--;
                                    }
                                }
                            }
                            var oCheckTotal = parseInt(((100 / parseInt(aChangedValue.reduce((a, b) => a + b))) * 100).toFixed(1));
                            if (oCheckTotal != 100) {
                                that.getView().byId("errorMessage").setProperty("visible", true);
                            } else if (oCheckTotal == 100) {
                                that.getView().byId("errorMessage").setProperty("visible", false);
                            }
                            that._renderChart();
                            for (let i = 0; i < oCells.length; i++) {
                                var oldFormat = (oCells[i].getValue()).toString();
                                oldFormat = oldFormat.replace("%", "");
                                var newFormat = oldFormat.replace(".", ",") + "%";
                                oCells[i].setValue(newFormat);
                            }
                        },
                        textAlign: "Center",
                        value: ((oResults).toString()).replace(".", ",") + "%"
                    });
                    aCells.push(cell)
                }
                var aCells = aInfoCells.concat(aCells);
                var oInfo = new sap.m.ColumnListItem({
                    cells: aCells
                });
                oTable.bindItems("onerow>/", oInfo);
                var oCells = oTable["mAggregations"]["items"][0]["mAggregations"]["cells"].slice(2);
                var aStartingValue = [];
                for (let i = 0; i < oCells.length; i++) {
                    var oldValueString = oCells[i].getValue();
                    oldValueString = oldValueString.replace(",", ".");
                    oldValueString = oldValueString.replace("%", "");
                    var oldValue = parseFloat(oldValueString);
                    aStartingValue.push(oldValue);
                }
            },

            _renderChart: function () {
                var oData = {
                    data: []
                };
                var oTable = this.getView().byId("daysTable");
                var oCells = oTable["mAggregations"]["items"][0]["mAggregations"]["cells"].slice(2);
                for (let i = 0; i < oCells.length; i++) {
                    var oValue = oCells[i].getProperty("value");
                    oValue = oValue.replace(",", ".");
                    oValue = oValue.replace("%", "");
                    var oUpdate = {
                        "Days": i + 1,
                        "Values": oValue,
                    }
                    oData["data"].push(oUpdate);
                }
                var oJSONModel = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(oJSONModel, "chartData");
                var oVizFrame = this.getView().byId("vizFrame");
                oVizFrame.setVizProperties({
                    legend: {
                        visible: false
                    },
                    tooltip: {
                        visible: true
                    },
                    title: {
                        visible: false
                    }
                });
                oVizFrame.setModel(oJSONModel, "chartData");
                oVizFrame.setVizType("line");
            },

            changeCEDI: function () {
                var oTable = this.getView().byId("daysTable")
                oTable.removeAllColumns();
                this._onTableLoad();
                this._renderChart();
            },
            changePOS: function () {
                var oTable = this.getView().byId("daysTable")
                oTable.removeAllColumns();
                this._onTableLoad();
                this._renderChart();
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