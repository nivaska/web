var niv = niv || {};
niv.plugins = niv.plugins || {};
niv.plugins.contextmenu = niv.plugins.contextmenu || {};

(function() {
  var ctxmenu =
    '<nav id="plugin-context-menu" data-active="false" class="context-menu">' +
    '  <div class="context-menu-items">' +
    '  <div onclick="">' +
    "Copy to clipboard";
  "  </div>" + "  </div>" + "</nav>";

  var checkClickedInsideElement = function(e, parentElement) {
    var el = e.srcElement || e.target;
    if ($(parentElement).contains(el)) {
      return el;
    }
    return false;
  };

  var toggleMenuOn = function() {
    $("#plugin-context-menu").attr("data-active", "true");
  };

  var toggleMenuOff = function() {
    $("#plugin-context-menu").attr("data-active", "false");
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
    window.onload = function() {
      // $(targetElement).off("contextmenu");
      $(targetElement).contextmenu(function(e) {
        if (checkClickedInsideElement(e, targetElement)) {
          e.preventDefault();
          e.stopPropagation();

          toggleMenuOn();
          positionContextMenu(e);
        } else {
          toggleMenuOff();
        }
      });
    };
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
  $.fn.contextmenu = function(options) {
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
