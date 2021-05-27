sap.ui.define(["app/model/DateFormatter"], function(DateFormatter) {
	return {
		numberUnit: function(sValue) {
		},
		date: function(date) {
			return new DateFormatter({now: Date.now}).format(date);
		}

	};
});