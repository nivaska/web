# MultiSelect Dropdown

This is a jquery plugin to create multiselect html dropdown

## Usage

```javascript
$("#testDiv").multiselect();
```

Following configuration options are available:

### Example

```javascript
$("#testDiv").multiselect({
  label: "Select Fruit",
  dropdownList: ["Apple", "Banana", "Mango"],
  showExecuteButton: true,
  executeSelected: function(selectedValues) {
    alert("I selected " + selectedValues.length + " options");
  }
});
```
