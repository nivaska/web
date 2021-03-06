var niv = niv || {};
niv.plugins = niv.plugins || {};
niv.plugins.multiselect = niv.plugins.multiselect || {};

(function() {
  this.closeDropdown = function() {
    var dropDownParent = $(event.target).closest(".multiselect-dropdown");
    dropDownParent.find(".ms-dropdown-chkbox").slideUp(300);
    event.preventDefault();
  };

  this.toggleDropdown = function() {
    var dropDownParent = $(event.target).closest(".multiselect-dropdown");
    dropDownParent.find(".ms-dropdown-chkbox").slideToggle(300);
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

  var getCustomFilterHtml = function(controlLabel, optionsHtml, executeBtn) {
    var returnString =
      '<div class="multiselect-dropdown" >' +
      '    <div class="ms-selectbox">' +
      '      <div class="select-button" onclick="niv.plugins.multiselect.toggleDropdown()">' +
      controlLabel +
      '<span style="float:right">&#x25BC;</span></div>' +
      '    <div class="ms-dropdown-chkbox">' +
      "      <div>" +
      '        <button id="select-all" class="btn-dropdown-select" onclick="niv.plugins.multiselect.selectUnselectAll(true)">Select All</button>' +
      '        <button id="unselect-all" class="btn-dropdown-select" onclick="niv.plugins.multiselect.selectUnselectAll(false)">Clear All</button>       ' +
      executeBtn +
      '        <button title="Close" class="btn-dropdown-close" onclick="niv.plugins.multiselect.closeDropdown()">x</button>' +
      "      </div>" +
      "      <div>" +
      '        <input type="text" class="filter-options-search" autocomplete="off" oninput="niv.plugins.multiselect.searchFilters()" placeholder="Search..." id="searchDropDown" value=""/>' +
      "      </div>" +
      '      <div class="checkboxes">' +
      optionsHtml +
      "      </div>" +
      "    </div>" +
      "  </div>";

    return returnString;
  };

  var executeSelectedBtn = function(showButton) {
    if (showButton === true) {
      return '<button class="btn-dropdown-filter" onclick="niv.plugins.multiselect.executeSelected()">Execute</button>';
    }

    return "";
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

  this.selectedValues = function(targetElement) {
    var selectedValues = [];
    var dropDownParent = $(targetElement).find(".multiselect-dropdown");

    $(dropDownParent)
      .find(".ms-dropdown-chkbox input:checked")
      .each(function() {
        selectedValues.push($(this).val());
      });
    return selectedValues;
  };

  this.init = function(targetElement, options) {
    $(targetElement).html(
      getCustomFilterHtml(
        options.label,
        insertOptions(options.dropdownList),
        executeSelectedBtn(options.showExecuteButton)
      )
    );

    if (options.showExecuteButton === true) {
      this.customExecuteHandler = options.executeSelected;
    }
  };
}.apply(niv.plugins.multiselect));

(function($) {
  $.fn.multiselect = function(options) {
    var settings = $.extend(
      {
        dropdownList: [],
        label: "Select Options",
        showExecuteButton: false,
        executeSelected: function(selectedOptions) {
          alert(
            "No 'executeSelected' function configured in the options." +
              "\nExecuting the default function.\n\n" +
              selectedOptions.length +
              " options selected"
          );
        }
      },
      options
    );

    var targetElement = $(this).filter("div");
    if (targetElement.length > 0) {
      niv.plugins.multiselect.init(targetElement[0], settings);
    }

    this.getSelectedValues = niv.plugins.multiselect.selectedValues(
      targetElement[0]
    );
  };
})(jQuery);
