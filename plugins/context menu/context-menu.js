var niv = niv || {};
niv.plugins = niv.plugins || {};
niv.plugins.contextmenu = niv.plugins.contextmenu || {};

(function() {
  var ctxmenu =
    '<nav id="plugin-context-menu" data-active="false" class="context-menu">' +
    '  <div class="context-menu-items">' +
    '  <button onclick="niv.plugins.contextmenu.checkUrbanDictioanry()" class="context-menu-item">' +
    "Search Urban Dictionary" +
    " </button>" +
    '  <button onclick="niv.plugins.contextmenu.copyToClipboard()" class="context-menu-item">' +
    "Copy to clipboard" +
    " </button>" +
    '  <button onclick="niv.plugins.contextmenu.SearchWiki()" class="context-menu-item">' +
    "Search Wiki" +
    " </button>" +
    "  </div>" +
    '  <div class="context-menu-extension" data-active="false">' +
    "  </div>" +
    "</nav>";

  var toggelExtensionOff = function() {
    $(".context-menu-extension").html("");
    $(".context-menu-extension").attr("data-active", "false");
  };

  var getSelectionText = function() {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  };

  this.SearchWiki = function() {
    $(".context-menu-extension")
      .attr("data-active", "true")
      .html("Getting results..");

    fetch(
      "http://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=" +
        getSelectionText(),
      {
        method: "GET"
      }
    )
      .then(response => {
        var results = response.json();
        results.then(data => {
          // $(".context-menu-extension").html(data);
          $(".context-menu-extension").html(data.query.search[0]["snippet"]);
        });
      })
      .catch(err => {
        $(".context-menu-extension").html("Error getting results");
      });
  };
  this.checkUrbanDictioanry = function() {
    $(".context-menu-extension")
      .attr("data-active", "true")
      .html("Getting results..");

    fetch(
      "https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=" +
        getSelectionText(),
      {
        method: "GET",
        headers: {
          "x-rapidapi-host":
            "mashape-community-urban-dictionary.p.rapidapi.com",
          "x-rapidapi-key": "c2020e1d85msh5f7543791f8e0bbp1702f9jsn10420dd9998d"
        }
      }
    )
      .then(response => {
        var results = response.json();
        results.then(data => {
          $(".context-menu-extension").html(data.list[0]["definition"]);
        });
      })
      .catch(err => {
        $(".context-menu-extension").html("Error getting results");
      });
  };

  this.copyToClipboard = function() {
    toggelExtensionOff();

    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(getSelectionText()).select();
    document.execCommand("copy");
    $temp.remove();
  };

  var toggleMenuOn = function() {
    $("#plugin-context-menu").attr("data-active", "true");
  };

  var toggleMenuOff = function() {
    $("#plugin-context-menu").attr("data-active", "false");
    toggelExtensionOff();
  };

  var getClickCords = function(e) {
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

  var positionContextMenu = function(e) {
    var clickCoords = getClickCords(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;

    var menu = $("#plugin-context-menu");
    var menuWidth = menu.width() + 4;
    var menuHeight = menu.height() + 4;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    if (windowWidth - clickCoordsX < menuWidth) {
      $(menu).css("left", windowWidth - menuWidth + "px");
    } else {
      $(menu).css("left", clickCoordsX + "px");
    }

    if (windowHeight - clickCoordsY < menuHeight) {
      $(menu).css("top", windowHeight - menuHeight + "px");
    } else {
      $(menu).css("top", clickCoordsY + "px");
    }
  };

  // hide context menu on mouse left click or window resize
  var configureEventListeners = function() {
    $(document).on("click", function(e) {
      var targetElement = e.target;
      if ($(targetElement).hasClass("context-menu-item")) {
        return;
      }

      var button = e.which || e.button;
      if (button === 1) {
        toggleMenuOff();
      }
    });

    window.onresize = function() {
      toggleMenuOff();
    };
  };

  var initContextListener = function(targetElement) {
    // $(targetElement).off("contextmenu");
    $(targetElement).contextmenu(function(e) {
      e.preventDefault();
      e.stopPropagation();

      toggleMenuOn();
      positionContextMenu(e);
    });
  };

  this.init = function(targetElement, options) {
    if ($("#plugin-context-menu").length == 0) {
      $("body").append(ctxmenu);
    }

    initContextListener(targetElement);
    configureEventListeners();
  };
}.apply(niv.plugins.contextmenu));

(function($) {
  $.fn.customContextMenu = function(options) {
    var settings = $.extend(
      {
        label: "Select Options"
      },
      options
    );

    var targetElement = $(this).filter("div");
    if (targetElement.length > 0) {
      niv.plugins.contextmenu.init(targetElement[0], settings);
    }
  };
})(jQuery);
