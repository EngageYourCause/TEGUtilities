# TEG Utilities

A collection of useful code. There's a prettier version of this documentation at [https://pbjteg.github.io/TEGUtilities/](https://pbjteg.github.io/TEGUtilities/).

## Requires

* [ECMAScript 6 compliant environment](https://www.w3schools.com/Js/js_es6.asp)

## Provided

* [TEGUtilities.js](src/TEGUtilities.js)

## Installation

Link the JavaScript in the `<head>` element of the page.

```javascript
  <script src="https://foo.bar.com/path/to/files/TEGUtilities.js" type="text/javascript"></script>
```

Create a new `TEGUtilties` object in a `<script>` element or external JavaScript file.

```javascript
window.tu = new TEGUtilities();
```

## Methods

### `between( value, minimum, maximum )`

Returns `true` if `value` is strictly between `minimum` and `maximum`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `value` | Number | `0` | The value to be compared. |
| `minimum` | Number | `0` | The minimum value of the acceptable range. `value` must be larger than `minimum`. |
| `maximum` | Number | `0` | The maximum value of the acceptable range. `value` must be smaller than `maximum`. |

### `betweenInclude( value, minimum, maximum, include )`

Returns `true` if `value` is strictly between `minimum` and `maximum`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `value` | Number | `0` | The value to be compared. |
| `minimum` | Number | `0` | The minimum value of the acceptable range. |
| `maximum` | Number |  | `0` | The maximum value of the acceptable range. |
| `include` | Number | `TEGUtilities.BTWN_INCL_NONE` (`0`) | Indicates which, if either, of the limit values should be included in the acceptable range. See [Constants](#constants) below. |

### `debounce( originalFunction, timout, otherArgs )`

Returns a debounced function which is prevented from running more than once in `timout` milliseconds.

| Parameter | Type | Description |
|---|---|---|
| `originalFunction` | Function | The function to debounce. |
| `timeout` | Number | The number of milliseconds to wait before allowing `originalFunction` to run again. |
| `otherArgs` | Array | An array of values passed to `originalFunction` as parameters. |

### `throttle( originalFunction, timout, otherArgs )`

Returns a throttled function which will run once and then not again for `timout` milliseconds.

| Parameter | Type | Description |
|---|---|---|
| `originalFunction` | Function | The function to throttle. |
| `timeout` | Number | The number of milliseconds to wait before allowing `originalFunction` to run again. |
| `otherArgs` | Array | An array of values passed to `originalFunction` as parameters. |

## Constants

All four constants are convenience values for the `include` parameter of the `betweenInclude()` method above.

| Constant | Value | Description |
|---|---|---|
| `TEGUtilities.BTWN_INCL_NONE` | `0` | Indicates that the acceptable range excludes the minimum and maximum values. |
| `TEGUtilities.BTWN_INCL_LOWER` | `1` | Indicates that the acceptable range includes the minimum value. |
| `TEGUtilities.BTWN_INCL_HIGHER` | `2` | Indicates that the acceptable range includes the maximum value. |
| `TEGUtilities.BTWN_INCL_BOTH` | `3` | Indicates that the acceptable range includes the minimum and maximum values. |

## Objects

### windowSize

Provides easy window size detection.

#### Initialization

Initialize the `windowSize` object with a call to `init()` in a `<script>` element or `.js` file. See [`options`](#options) below.

```javascript
  // This is the initialization script from test/windowSizeExample.html
  var tu = new TEGUtilities();
  tu.windowSize.init({
                    afterWindowSize : function() {
                      document.querySelector('#isSmall').textContent = tu.windowSize.isSmall;
                      document.querySelector('#isMedium').textContent = tu.windowSize.isMedium;
                      document.querySelector('#isLarge').textContent = tu.windowSize.isLarge;
                      document.querySelector('#isLarger').textContent = tu.windowSize.isLarger;
                      document.querySelector('#isTall').textContent = tu.windowSize.isTall;
                    }
                  });
  /* windowSize doesn't attach itself to the window.onresize listener
   * because of possible conflicts with whatever app is using it.
   * There's also some context issues that may arise. When attaching,
   * it's best to use the throttle method (see below) so you don't use
   * too many resources.
   */
  window.onresize = tu.throttle(tu.windowSize.update, 300);
```

### windowSize Properties

See the `inclusive` option below.

| Property | Description |
|---|---|
| `isSmall` | `true` if the viewing window is smaller than or equal to `windowSize.options.smallMaxWidth`.|
| `isMedium` | `true` if the viewing window width is between `windowSize.options.smallMaxWidth` and `windowSize.options.mediumMaxWidth`. |
| `isLarge` | `true` if the viewing window width is between `windowSize.options.mediumMaxWidth` and `windowSize.options.largeMaxWidth`. |
| `isLarger` | `true` if the viewing window is larger than `windowSize.options.largeMaxWidth`. This comparison is not affected by the `inclusive` option above as there is only the “smaller” value to compare against. |
| `isTall` | `true` if the viewing window is taller than `windowSize.options.tallMinHeight`. |

### windowSize Methods

#### `init(options)`

Initializes the windowSize object. See [windowSize Initialization](#initialization) above.

| Parameter | Type | Description |
|---|---|---|
| `options` | Collection | A collection of values to configure `windowSize`. See Options below. |

##### Options

The `options` parameter is a set of values to determine what view port sizes fit in to which of the categories defined as properties above.

| Option | Type | Default | Description  |
|---|---|---|---|
| `smallMaxWidth` | Number | `740` | Maximum width in pixels of a "small" screen like a smartphone or tablet in portrait orientation. |
| `mediumMaxWidth` | Number | `1024` | Maximum width in pixels of a "medium" screen like a tablet in landscape orientation. |
| `largeMaxWidth` | Number | `1024` | Maximum width in pixels of a "large" screen like a desktop computer screen. |
| `tallMinHeight` | Number | `1024` | Minimum height in pixels of a "tall" screen like a desktop computer screen in portrait view.|
| `inclusive` | Boolean | `true` | Whether the break points above should be included in the size comparison. If `true`, the larger number will be included in the accepted range of sizes. See [`betweeninclude`](#betweeninclude-value-minimum-maximum-include-) above. |
| afterWindowSize | Function | `function(){}` | Code to run after the window size is recalculated by the [`update`](#update) method below. |


#### `update()`

Updates the window size flags. Designed to be run as the `window.onresize` event handler. See [windowSize Properties](#windowsize-properties) above.
