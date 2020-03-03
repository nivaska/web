var niv = niv || {};
niv.utils = niv.utils || {};
niv.utils.dom = niv.utils.dom || {};

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

(function() {
  this.getClickCords = function(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;

    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      posy =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    };
  };
}.apply(niv.utils.dom));
