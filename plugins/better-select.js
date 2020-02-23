var niv = niv || {};
niv.plugins = niv.plugins || {};
niv.plugins.betterSelect = niv.plugins.betterSelect || {};

(function() {
  this.closeDropdown = function() {
    var dropDownParent = $(event.target).closest(".multiselect-dropdown");
    dropDownParent.find(".ms-dropdown-chkbox").hide();
    event.preventDefault();
  };

  this.toggleDropdown = function() {
    var dropDownParent = $(event.target).closest(".multiselect-dropdown");
    dropDownParent.find(".ms-dropdown-chkbox").toggle();
    event.preventDefault();
  };

  this.selectUnselectAll = function(selectAll) {
    var dropDownParent = $(event.target).closest(".multiselect-dropdown");
    if (selectAll === true) {
      dropDownParent.find("input:checkbox").prop("checked", true);
    } else {
      dropDownParent.find("input:checkbox").prop("checked", false);
    }
    event.preventDefault();
  };

  this.searchFilters = function() {
    var searchText = $(event.target).val();
    var dropDownParent = $(event.target).closest(".multiselect-dropdown");

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
  };

  this.executeSelected = function() {
    var selectedValues = [];
    var dropDownParent = $(event.target).closest(".multiselect-dropdown");

    $(dropDownParent)
      .find(".ms-dropdown-chkbox input:checked")
      .each(function() {
        selectedValues.push($(this).val());
      });

    if (this.customExecuteHandler) {
      this.customExecuteHandler(selectedValues);
    }
  };

  var getCustomFilterHtml = function(controlLabel, optionsHtml) {
    var returnString =
      '<div class="multiselect-dropdown" >' +
      '    <div class="ms-selectbox" onclick="niv.plugins.betterSelect.toggleDropdown()">' +
      '      <div class="select-button">' +
      controlLabel +
      '<span style="float:right">&#x25BC;</span></div>' +
      '      <div class="ms-overSelect"></div>' +
      "    </div>" +
      '    <div class="ms-dropdown-chkbox">' +
      "      <div>" +
      '        <button id="select-all" class="btn-dropdown-select" onclick="niv.plugins.betterSelect.selectUnselectAll(true)">Select All</button>' +
      '        <button id="unselect-all" class="btn-dropdown-select" onclick="niv.plugins.betterSelect.selectUnselectAll(false)">Clear All</button>       ' +
      '        <button class="btn-dropdown-filter" onclick="niv.plugins.betterSelect.executeSelected()">Filter</button>' +
      '        <button title="Close" class="btn-dropdown-close" onclick="niv.plugins.betterSelect.closeDropdown()">x</button>' +
      "      </div>" +
      "      <div>" +
      '        <input type="text" class="filter-options-search" autocomplete="off" oninput="niv.plugins.betterSelect.searchFilters()" placeholder="Search..." id="searchDropDown" value=""/>' +
      "      </div>" +
      '      <div class="checkboxes">' +
      optionsHtml +
      "      </div>" +
      "    </div>" +
      "  </div>";

    return returnString;
  };

  var insertOptions = function(optionsList) {
    var outputHtml =
      '<label class="ms-dropdown-placeholder">No Items Available</label>';
    if (optionsList.length > 0) {
      outputHtml = "";
      $.map(optionsList, function(val, i) {
        outputHtml =
          outputHtml +
          '<label><input type="checkbox" value="' +
          val +
          '" />' +
          val +
          "</label>";
      });
    }
    return outputHtml;
  };

  this.init = function(targetElement, options) {
    $(targetElement).html(
      getCustomFilterHtml(options.label, insertOptions(options.list))
    );

    this.customExecuteHandler = options.executeSelected;
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
        showExecuteButton: true,
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
