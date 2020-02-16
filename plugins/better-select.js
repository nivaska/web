var niv = niv || {};
niv.plugins = niv.plugins || {};
niv.plugins.betterSelect = niv.plugins.betterSelect || {};

(function() {
  var loadFilterDropDownOptions = function(filterConfig) {
    console.log("Loading options for custom filter controls");

    if (
      $(".multiselect-dropdown .ms-dropdown-chkbox .ms-dropdown-placeholder")
        .length === 0
    ) {
      console.log("filter options are already loaded");
      return;
    }

    var ctx = SP.ClientContext.get_current();
    var targetList = ctx
      .get_web()
      .get_lists()
      .getByTitle(filterConfig.ListTitle);
    var query = SP.CamlQuery.createAllItemsQuery();
    var listItems = targetList.getItems(query);

    ctx.load(listItems, "Include(" + filterConfig.FieldNames.join(",") + ")");
    ctx.executeQueryAsync(
      function(args) {
        var itemEnumerator = listItems.getEnumerator();

        var filterOptions = {};
        $.each(filterConfig.FieldNames, function(index, value) {
          filterOptions[value] = [];
        });

        while (itemEnumerator.moveNext()) {
          var listItem = itemEnumerator.get_current();
          $.each(filterConfig.FieldNames, function(index, value) {
            var fieldValue = listItem.get_item(value);
            if (filterConfig.IsLookup[index] === true) {
              if (fieldValue)
                filterOptions[value].push(
                  listItem.get_item(value).get_lookupValue()
                );
            } else {
              filterOptions[value].push(fieldValue);
            }
          });
        }

        $.each(filterConfig.FieldNames, function(index, value) {
          filterOptions[value] = unique(filterOptions[value]).sort();

          var outputHtml = [];
          $.each(filterOptions[value], function(i, option) {
            var encodedValue = encodeAllChars(option);
            outputHtml.push(
              '<label title="' +
                option +
                '"><input type="checkbox" value="' +
                encodedValue +
                '" />' +
                option +
                "</label>"
            );
          });

          $("#" + value + ".multiselect-dropdown .checkboxes").html(
            outputHtml.join("")
          );
        });

        // reslect all previously selected options
        preselectFilterOptions();
      },
      function(sender, args) {
        console.log("Error loading filter choices from the SP list");
        console.log(args.get_message());
      }
    );
  };

  var configCustomFilter = function(targetElement, executeHandler) {
    //Configure event handlers
    //Configure close button
    $(targetElement)
      .find(".multiselect-dropdown .btn-dropdown-close")
      .off();
    $(targetElement)
      .find(".multiselect-dropdown .btn-dropdown-close")
      .on("click", function(event) {
        var dropDownParent = $(this).closest(".multiselect-dropdown");
        dropDownParent.find(".ms-dropdown-chkbox").hide();
        event.preventDefault();
      });

    $(targetElement)
      .find(".multiselect-dropdown .ms-selectbox")
      .off();
    $(targetElement)
      .find(".multiselect-dropdown .ms-selectbox")
      .on("click", function(event) {
        var dropDownParent = $(this).closest(".multiselect-dropdown");
        dropDownParent.find(".ms-dropdown-chkbox").toggle();
        event.preventDefault();
      });

    $(targetElement)
      .find(".multiselect-dropdown #select-all")
      .off();
    $(targetElement)
      .find(".multiselect-dropdown #select-all")
      .on("click", function(event) {
        var dropDownParent = $(this).closest(".multiselect-dropdown");
        dropDownParent.find("input:checkbox").prop("checked", true);
        event.preventDefault();
      });

    $(targetElement)
      .find(".multiselect-dropdown #unselect-all")
      .off();
    $(targetElement)
      .find(".multiselect-dropdown #unselect-all")
      .on("click", function(event) {
        var dropDownParent = $(this).closest(".multiselect-dropdown");
        dropDownParent.find("input:checkbox").prop("checked", false);
        event.preventDefault();
      });

    // Configure search text box
    $(".multiselect-dropdown #searchDropDown").off();
    $(".multiselect-dropdown #searchDropDown").on(
      "input propertychange paste",
      function(event) {
        var searchText = $(this).val();
        var dropDownParent = $(this).closest(".multiselect-dropdown");

        if (searchText == "") {
          dropDownParent.find(".checkboxes label").show();
        } else {
          var allCheckBoxes = dropDownParent.find(".checkboxes label");
          $(allCheckBoxes).hide();

          searchText = searchText.toLowerCase();
          var visibleElements = $(allCheckBoxes).filter(function() {
            return (
              $(this)
                .text()
                .toLowerCase()
                .indexOf(searchText) == 0
            );
          });

          $(visibleElements).show();
        }
      }
    );

    $(".multiselect-dropdown .btn-dropdown-filter").off();
    $(".multiselect-dropdown .btn-dropdown-filter").on("click", function(
      event
    ) {
      var dropDownParent = $(this).closest(".multiselect-dropdown");
      var checkedFilterOptions = [];
      $(dropDownParent)
        .find(".checkboxes input:checked")
        .each(function() {
          checkedFilterOptions.push($(this).attr("value"));
        });

      //var baseUrl = filterConfig.ListViewUrl;
      //if (filterConfig.hasOwnProperty("Views") && filterConfig.Views[ctx.BaseViewID] != undefined) {
      //    baseUrl = filterConfig.Views[ctx.BaseViewID];
      //}

      if (checkedFilterOptions.length > 0) {
        var paramFilterName =
          checkedFilterOptions.length > 1
            ? "-FilterFields1="
            : "-FilterField1=";
        var paramValueName =
          checkedFilterOptions.length > 1
            ? "-FilterValues1="
            : "-FilterValue1=";

        var fieldName = $(dropDownParent)[0].id;
        var queryStringHash =
          paramFilterName +
          encodeAllChars(fieldName) +
          paramValueName +
          checkedFilterOptions.join(encodeURIComponent(";#"));
        var currentHash = window.location.hash;
        var indexOfFilter = currentHash.indexOf("=");
        window.location.hash =
          currentHash.substring(0, indexOfFilter + 1) +
          "-ShowInGrid%3DTrue" +
          encodeURIComponent(queryStringHash);
      } else {
        var indexOfFilter = currentHash.indexOf("=");
        window.location.hash =
          currentHash.substring(0, indexOfFilter + 1) + "-ShowInGrid%3DTrue";
      }

      event.preventDefault();
    });

    loadFilterDropDownOptions(filterConfig);
  };

  var getCustomFilterHtml = function(fieldName, controlLabel) {
    var returnString =
      '<div class="multiselect-dropdown" id="' +
      fieldName +
      '">' +
      '    <div class="ms-selectbox">' +
      '      <div class="select-button">' +
      controlLabel +
      '<span style="float:right">&#x25BC;</span></div>' +
      '      <div class="ms-overSelect"></div>' +
      "    </div>" +
      '    <div class="ms-dropdown-chkbox">' +
      "      <div>" +
      '        <button id="select-all" class="btn-dropdown-select">Select All</button>' +
      '        <button id="unselect-all" class="btn-dropdown-select">Clear All</button>       ' +
      '        <button class="btn-dropdown-filter">Filter</button>' +
      '        <button title="Close" class="btn-dropdown-close"">×</button>' +
      "      </div>" +
      "      <div>" +
      '        <input type="text" class="filter-options-search" autocomplete="off" placeholder="Search..." id="searchDropDown" value=""/>' +
      "      </div>" +
      '      <div class="checkboxes">' +
      '        <label class="ms-dropdown-placeholder">No Items Available</label>' +
      "      </div>" +
      "    </div>" +
      "  </div>";

    return returnString;
  };

  this.init = function(targetElement, options) {
    $(targetElement).html(getCustomFilterHtml(options["label"]));
  };
}.apply(niv.plugins.betterSelect));

(function($) {
  $.fn.betterSelect = function(options) {
    // This is the easiest way to have default options.
    var settings = $.extend(
      {
        list: [],
        listGetter: function() {},
        label: "Select Options",
        executeSelected: function(selectedOptions) {
          alert(selectedOptions.length);
        }
      },
      options
    );

    var targetElement = this.filter("div");
    if (targetElement.length > 0) {
      niv.plugins.betterSelect.init(targetElement[0], settings);
    }
  };
})(jQuery);
