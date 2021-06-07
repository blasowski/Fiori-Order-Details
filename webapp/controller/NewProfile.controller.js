sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast"
    ],
    function (Controller, History, JSONModel, MessageToast) {
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

                var aCells = []
                var oCEDIPOS = parseInt(oCEDI) + parseInt(oPOS);
                var oResults = parseFloat(100 / oCEDIPOS).toFixed(2);

                for (var i = 0; i < oCEDIPOS; i++) {
                    var cell = new sap.m.Input({
                        liveChange: "onChangeValue",
                        change: "onChangeValue",
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
                this.getView().byId("daysTotal").setValue(oCEDIPOS);
            },

            onChangeValue: function () {
                var oRow = new JSONModel({
                    value1: ""
                });
                this.getView().setModel(oRow, "onerow");
                var oTable = this.getView().byId("daysTable");
                var cellCount = oTable["mAggregations"]["items"][0]["mAggregations"]["cells"].length;
                var aCells = []
                for (var i = 2; i < cellCount; i++) {
                    aCells.push(oTable["mAggregations"]["items"][0]["mAggregations"]["cells"][i]["mProperties"]["value"])
                }
                var aResults = []
                for (var i = 0; i < aCells.length; i++) {
                    var floatCells = parseFloat(aCells[i])
                    aResults.push(floatCells);
                }
                var reduceResults = aResults.reduce(function (a, b) {
                    return a + b;
                }, 0).toFixed(2);
                var oResults = parseFloat(reduceResults);

                if (oResults !== 100) {
                    this.getView().byId("errorMessage").setProperty("visible", true)
                } else if (oResults = 100) {
                    this.getView().byId("errorMessage").setProperty("visible", false)
                }

                var sum = function (acc, itemValue) {
                    return acc + itemValue;
                };

                var newCells = function (itemIdx, newValue, items) {
                    if (!Number.isInteger(itemIdx) || itemIdx < 0 || itemIdx >= items.length) return items;
                    var total = items.reduce(sum, 0),
                        origItemValue = items[itemIdx],
                        diffValue = origItemValue - newValue,
                        totalForRemainItems = total + diffValue,
                        numItems = items.length - 1;
                    if (diffValue === 0 || totalForRemainItems < 0) return items;
                    var newItems = [].concat(items);
                    newItems.splice(itemIdx, 1);
                    var itemValue = Math.floor(totalForRemainItems / numItems);
                    var extra = totalForRemainItems - (numItems * itemValue);
                    newItems.forEach(function (item, idx) {
                        newItems[idx] = (idx === 0) ? itemValue + extra : itemValue;
                    });
                    newItems.splice(itemIdx, 0, newValue);
                    return newItems;
                };

                

                var aNewResults = newCells(1, 10, aResults);

                oTable.removeAllItems();
                var aInfoCells = [];
                var name = new sap.m.Text({
                    text: "{info>/name}"
                });
                var description = new sap.m.Text({
                    text: "{info>/description}"
                });
                aInfoCells.push(name, description);
                var oldCells = [];
                for (var i = 0; i < cellCount; i++) {
                    var cell = new sap.m.Input({
                        liveChange: "onChangeValue",
                        change: "onChangeValue",
                        textAlign: "Center",
                        type: "Number",
                        value: aNewResults[i]
                    });
                    oldCells.push(cell)
                }
                var oldCells = aInfoCells.concat(oldCells);
                var oInfo = new sap.m.ColumnListItem({
                    cells: oldCells
                });
                oTable.bindItems("onerow>/", oInfo);
                
                console.log(aResults);
                console.log(aNewResults);

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