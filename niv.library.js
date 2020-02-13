var niv = niv || {};
niv.lib = niv.utils || {};

(function() {
  var pad2 = function(number) {
    return (number < 10 ? "0" : "") + number;
  };

  this.unique = function(array) {
    return $.grep(array, function(el, index) {
      return index === $.inArray(el, array);
    });
  };

  this.copyToClipboard = function(copyText) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(copyText).select();
    document.execCommand("copy");
    $temp.remove();
  };

  this.getDayString = function(inputDate) {
    var outputDate = new Date(inputDate);
    var dd = String(pad2(outputDate.getDate()));
    var mm = String(pad2(outputDate.getMonth() + 1));
    var yyyy = outputDate.getFullYear();
    return mm + "/" + dd + "/" + yyyy;
  };

  // encodes all special characters (encodeURIComponent does not encode all)
  this.encodeURIAllChars = function(strToEncode) {
    return encodeURIComponent(strToEncode)
      .replace(/#/g, "%23")
      .replace(/\*/g, "%2a")
      .replace(/!/g, "%21")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/-/g, "%2d")
      .replace(/\./g, "%2e")
      .replace(/_/g, "%5f")
      .replace(/~/g, "%7e")
      .replace(/'/g, "%27");
  };
}.apply(niv.utils));
