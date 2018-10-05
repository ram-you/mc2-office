if (typeof XLSX == 'undefined') var XLSX = require('xlsx');

var excel = {
  get_radio_value: function(radioName) {
    var radios = document.getElementsByName(radioName);
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        return radios[i].value;
      }
    }
  },

  to_json: function(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
      var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      if (roa.length > 0) {
        result[sheetName] = roa;
      }
    });
    return result;
  },

 

  to_csv: function(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
      var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      if (csv.length > 0) {
        result.push("SHEET: " + sheetName);
        result.push("");
        result.push(csv);
      }
    });
    return result.join("\n");
  },

  to_formulae: function(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
      var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
      if (formulae.length > 0) {
        result.push("SHEET: " + sheetName);
        result.push("");
        result.push(formulae.join("\n"));
      }
    });
    return result.join("\n");
  },



  process_wb: function(wb) {
    var output = "";
    switch (get_radio_value("format")) {
      case "json":
        output = JSON.stringify(to_json(wb), 2, 2);
        break;
      case "form":
        output = to_formulae(wb);
        break;
      default:
        output = to_csv(wb);
    }
    return output
  },

}

module.exports = excel