sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
],
    function (Controller, History, BusyIndicator, ODataModel, JSONModel, Fragment, MessageToast) {
        "use strict";

        return Controller.extend("sap.btp.details.controller.Product", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("product").attachPatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {
                // BusyIndicator.show();
                var oModel = new ODataModel("./V2/Northwind/Northwind.svc", true);
                var oStore = new JSONModel();
                var oArgs = oEvent.getParameter("arguments");
                var oProduct = "(OrderID=" + oArgs.OrderID + ",ProductID=" + oArgs.ProductID + ")";
                var that = this;
                oModel.read("/Order_Details" + oProduct, {
                    urlParameters: { "$expand": "Product" },
                    success: function (oData) {
                        oStore.setProperty("/", oData);
                        oStore.setProperty("/Product", oData.Product);
                        that.getView().setModel(oStore, "products");
                        // BusyIndicator.hide();
                    }
                });
                this.getView().bindElement("/Product/");
                this._formFragments = {};
                this._showFormFragment("view/ProductDisplay");
            },

            onEditPress: function () {
                var oView = this.getView();
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        id: oView.getId(), name: "sap.btp.details.view.ProductChange",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },

            onResetPress: function () {
                location.reload();
                this.byId("openDialog").close();
            },

            onSavePress: function () {
                var oSaveMessage = "Product Saved!"
                MessageToast.show(oSaveMessage);
                this.byId("openDialog").close();
            },

            _getFormFragment: function (sFragmentName) {
                var pFormFragment = this._formFragments[sFragmentName],
                    oView = this.getView();
                if (!pFormFragment) {
                    pFormFragment = Fragment.load({
                        id: oView.getId(),
                        name: "sap.btp.details." + sFragmentName
                    });
                    this._formFragments[sFragmentName] = pFormFragment;
                }
                return pFormFragment;
            },

            _showFormFragment: function (sFragmentName) {
                var oPage = this.byId("productPage");
                oPage.removeAllContent();
                this._getFormFragment(sFragmentName).then(function (oVBox) {
                    oPage.insertContent(oVBox);
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