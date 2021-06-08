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
                var main = this;
                for (let i = 0; i < oCediPos; i++) {
                    var cell = new sap.m.Input({
                        change: function () {
                            var aNewValues = [];
                            var oCellNumber = oTable["mAggregations"]["items"][0]["mAggregations"]["cells"].length;
                            for (let i = 2; i < oCellNumber; i++) {
                                var newValueString = oTable["mAggregations"]["items"][0]["mAggregations"]["cells"][i]["mProperties"]["value"];
                                var newValue = parseFloat(newValueString);
                                aNewValues.push(newValue);
                            }
                            for (let i = 0; i < aNewValues.length; i++) {
                                var olditem = aOldValues[i];
                                var newitem = aNewValues[i];
                                if (newitem !== olditem) {
                                    var aResultValues = olditem - newitem;
                                }
                            }
                            var aAllCells = oTable["mAggregations"]["items"][0]["mAggregations"]["cells"];
                            var aCells = aAllCells.slice(2);
                            var oDivide = aResultValues / (aCells.length - 1);
                            var that = this;
                            for (let i = 2; i < aAllCells.length; i++) {
                                if (aOldValues[i - 2] == aNewValues[i - 2]) {
                                    var getNewValue = that["oParent"]["mAggregations"]["cells"][i].getValue();
                                    var changeNewValue = (parseFloat(getNewValue) + oDivide).toFixed(1);
                                    that["oParent"]["mAggregations"]["cells"][i].setValue(changeNewValue)
                                    aOldValues.splice(i - 2, 1, parseFloat(changeNewValue));
                                }
                                if (aOldValues[i - 2] !== aNewValues[i - 2]) {
                                    console.log(1);
                                }
                            }
                            var oSumCellValues = aOldValues.reduce((a, b) => a + b);
                            var oSumResult = Math.floor(oSumCellValues - aResultValues);
                            if (oSumResult !== 100) {
                                console.log("sum is:" + oSumResult)
                                main.getView().byId("errorMessage").setProperty("visible", true);
                            } else if (oSumResult == 100) {
                                main.getView().byId("errorMessage").setProperty("visible", false);
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

                var aOldValues = [];
                for (let i = 2; i < oTable["mAggregations"]["items"][0]["mAggregations"]["cells"].length; i++) {
                    var oldValueString = oTable["mAggregations"]["items"][0]["mAggregations"]["cells"][i]["mProperties"]["value"];
                    var oldValue = parseFloat(oldValueString);
                    aOldValues.push(oldValue);
                }

                var oSumCellValues = aOldValues.reduce((a, b) => a + b);
                var oSumResult = Math.floor(oSumCellValues);
                if (oSumResult !== 100) {
                    console.log("sum:" + oSumResult)
                    main.getView().byId("errorMessage").setProperty("visible", true);
                } else if (oSumResult == 100) {
                    console.log("sum:" + oSumResult)
                    main.getView().byId("errorMessage").setProperty("visible", false);
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