require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"autosuggestclass":[function(require,module,exports){
var ResultItem, pdokURL,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Events.ResultSelected = "ResultSelected";

pdokURL = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?q=";

ResultItem = (function(superClass) {
  extend(ResultItem, superClass);

  function ResultItem(options) {
    ResultItem.__super__.constructor.call(this, _.defaults(options, {
      style: {
        fontSize: "16px",
        lineHeight: (48 / 16) + "px",
        color: "#333",
        paddingTop: "24px",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderBottom: "1px solid #ccc",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      backgroundColor: "white",
      result: "",
      resultHighlighted: ""
    }));
    this.result = options.result;
  }

  return ResultItem;

})(Layer);

exports.autoSuggest = (function(superClass) {
  extend(autoSuggest, superClass);

  function autoSuggest(options) {
    var autoSuggestContainer, maxResults, type;
    autoSuggest.__super__.constructor.call(this, _.defaults(options, {
      input: [],
      maxResults: 5,
      type: "adres",
      x: Align.center,
      backgroundColor: null,
      shadowColor: "rgba(0,0,0,0.2)",
      shadowY: 1,
      shadowBlur: 8,
      borderColor: "#ededed"
    }));
    this.input = options.input;
    this.maxResults = options.maxResults;
    this.type = options.type;
    autoSuggestContainer = this;
    type = this.type;
    maxResults = this.maxResults;
    this.x = this.input.x + 1;
    this.y = this.input.maxY + 8;
    this.width = this.input.width - 2;
    this.sendToBack();
    this.input.onValueChange(function() {
      var endpoint, highlighting, i, id, index, input, item, j, len, len1, ref, ref1, result, results, results1;
      input = this;
      autoSuggestContainer.height = 0;
      ref = autoSuggestContainer.children;
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        item.destroy();
      }
      if (this.value.length >= 2) {
        autoSuggestContainer.bringToFront();
        endpoint = Utils.domLoadJSONSync(pdokURL + this.value + (" and type:" + type));
        results = endpoint.response.docs;
        highlighting = endpoint.highlighting;
        ref1 = results.slice(0, maxResults);
        results1 = [];
        for (index = j = 0, len1 = ref1.length; j < len1; index = ++j) {
          result = ref1[index];
          id = result.id;
          item = new ResultItem({
            parent: autoSuggestContainer,
            width: autoSuggestContainer.width,
            height: 48,
            y: 48 * index,
            html: highlighting[id].suggest,
            result: result.weergavenaam
          });
          autoSuggestContainer.height += 48;
          results1.push(item.onTap(function() {
            input.value = this.result;
            autoSuggestContainer.result = this.result;
            autoSuggestContainer.resultHighlighted = highlighting[id].suggest;
            autoSuggestContainer.sendToBack();
            return autoSuggestContainer.emit(Events.ResultSelected, event);
          }));
        }
        return results1;
      }
    });
  }

  return autoSuggest;

})(Layer);


},{}],"autosuggest":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.autoSuggest = function(input, maxResults, type) {
  var getSearchSuggestions, pdokURL, resultItem, searchSuggestions;
  if (maxResults === null) {
    maxResults = 5;
  }
  if (type === null) {
    type = "adres";
  }
  searchSuggestions = new Layer({
    width: input.width,
    height: 0,
    x: Align.center,
    y: input.maxY + 8,
    backgroundColor: null,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowY: 1,
    shadowBlur: 3,
    borderColor: "#ededed",
    visible: false
  });
  resultItem = (function(superClass) {
    extend(resultItem, superClass);

    function resultItem(options) {
      resultItem.__super__.constructor.call(this, _.defaults(options, {
        style: {
          fontSize: "16px",
          lineHeight: (48 / 16) + "px",
          color: "#333",
          paddingTop: "24px",
          paddingLeft: "16px",
          paddingRight: "16px",
          borderBottom: "1px solid #ccc",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        },
        backgroundColor: "white",
        result: "Voorbeeld"
      }));
      this.result = options.result;
    }

    return resultItem;

  })(Layer);
  pdokURL = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?q=";
  getSearchSuggestions = function(input) {
    var endpoint, highlighting, i, id, index, item, j, k, len, len1, ref, ref1, result, results, resultsHeight, suggestionResults;
    suggestionResults = [];
    resultsHeight = 0;
    ref = searchSuggestions.children;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      item = ref[i];
      item.destroy();
    }
    if (input.value.length >= 2) {
      searchSuggestions.bringToFront();
      searchSuggestions.visible = true;
      endpoint = Utils.domLoadJSONSync(pdokURL + input.value + (" and type:" + type));
      results = endpoint.response.docs;
      highlighting = endpoint.highlighting;
      ref1 = results.slice(0, maxResults);
      for (index = k = 0, len1 = ref1.length; k < len1; index = ++k) {
        result = ref1[index];
        id = result.id;
        item = new resultItem({
          parent: searchSuggestions,
          width: searchSuggestions.width,
          height: 48,
          y: 48 * index,
          html: highlighting[id].suggest,
          result: result.weergavenaam
        });
        if (index === maxResults - 1) {
          item.style.borderBottom = "";
        }
        resultsHeight += 48;
        searchSuggestions.height = resultsHeight;
        item.onTap(function() {
          input.value = this.result;
          searchSuggestions.sendToBack();
          return searchSuggestions.visible = false;
        });
      }
      input.onInputBlur(function() {
        return searchSuggestions.sendToBack();
      });
      return input.onInputFocus(function() {
        return searchSuggestions.bringToFront();
      });
    } else {
      searchSuggestions.sendToBack();
      return searchSuggestions.height = 0;
    }
  };
  return input.onValueChange(function() {
    return getSearchSuggestions(this);
  });
};


},{}],"input":[function(require,module,exports){
var wrapInput,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Events.EnterKey = "EnterKey";

Events.SpaceKey = "SpaceKey";

Events.BackspaceKey = "BackspaceKey";

Events.CapsLockKey = "CapsLockKey";

Events.ShiftKey = "ShiftKey";

Events.ValueChange = "ValueChange";

Events.InputFocus = "InputFocus";

Events.InputBlur = "InputBlur";

exports.InputLayer = (function(superClass) {
  extend(InputLayer, superClass);

  function InputLayer(options) {
    var base, currentValue, property, textProperties, value;
    if (options == null) {
      options = {};
    }
    this._setTextProperties = bind(this._setTextProperties, this);
    this._setPlaceholder = bind(this._setPlaceholder, this);
    _.defaults(options, {
      backgroundColor: "#FFF",
      width: 375,
      height: 60,
      padding: {
        left: 20
      },
      text: "Type something...",
      fontSize: 40,
      fontWeight: 300
    });
    if (options.multiLine) {
      if ((base = options.padding).top == null) {
        base.top = 20;
      }
    }
    this._inputElement = document.createElement("input");
    this._inputElement.style.position = "absolute";
    InputLayer.__super__.constructor.call(this, options);
    this._background = void 0;
    this._placeholder = void 0;
    this._isDesignLayer = false;
    this.input = new Layer({
      backgroundColor: "transparent",
      name: "input",
      width: this.width,
      height: this.height,
      parent: this
    });
    if (this.multiLine) {
      this._inputElement = document.createElement("textarea");
    }
    this.input._element.appendChild(this._inputElement);
    this._setTextProperties(this);
    this._inputElement.autocomplete = "off";
    this._inputElement.autocorrect = "off";
    this._inputElement.spellcheck = false;
    this._inputElement.className = "input" + this.id;
    textProperties = {
      text: this.text,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
      fontWeight: this.fontWeight,
      color: this.color,
      backgroundColor: this.backgroundColor,
      width: this.width,
      height: this.height,
      padding: this.padding,
      parent: this.parent
    };
    for (property in textProperties) {
      value = textProperties[property];
      this.on("change:" + property, (function(_this) {
        return function(value) {
          _this._elementHTML.children[0].textContent = "";
          if (_this._isDesignLayer) {
            return;
          }
          _this._setTextProperties(_this);
          return _this._setPlaceholderColor(_this._id, _this.color);
        };
      })(this));
    }
    this._setPlaceholder(this.text);
    this._setPlaceholderColor(this._id, this.color);
    this._elementHTML.children[0].textContent = "";
    this._isFocused = false;
    this._inputElement.onfocus = (function(_this) {
      return function(e) {
        if (_this.focusColor == null) {
          _this.focusColor = "#000";
        }
        _this.emit(Events.InputFocus, event);
        return _this._isFocused = true;
      };
    })(this);
    this._inputElement.onblur = (function(_this) {
      return function(e) {
        _this.emit(Events.InputBlur, event);
        return _this._isFocused = false;
      };
    })(this);
    currentValue = void 0;
    this._inputElement.onkeydown = (function(_this) {
      return function(e) {
        currentValue = _this.value;
        if (e.which === 20) {
          _this.emit(Events.CapsLockKey, event);
        }
        if (e.which === 16) {
          return _this.emit(Events.ShiftKey, event);
        }
      };
    })(this);
    this._inputElement.onkeyup = (function(_this) {
      return function(e) {
        if (currentValue !== _this.value) {
          _this.emit("change:value", _this.value);
          _this.emit(Events.ValueChange, _this.value);
        }
        if (e.which === 13) {
          _this.emit(Events.EnterKey, event);
        }
        if (e.which === 8) {
          _this.emit(Events.BackspaceKey, event);
        }
        if (e.which === 32) {
          _this.emit(Events.SpaceKey, event);
        }
        if (e.which === 20) {
          return _this.emit(Events.CapsLockKey, event);
        }
      };
    })(this);
  }

  InputLayer.prototype._setPlaceholder = function(text) {
    return this._inputElement.placeholder = text;
  };

  InputLayer.prototype._setPlaceholderColor = function(id, color) {
    return document.styleSheets[0].addRule(".input" + id + "::-webkit-input-placeholder", "color: " + color);
  };

  InputLayer.prototype._checkDevicePixelRatio = function() {
    var dpr, ratio;
    ratio = Screen.width / Framer.Device.screen.width;
    if (Utils.isDesktop()) {
      if (ratio < 0.5 && ratio > 0.25) {
        dpr = 1 - ratio;
      } else if (ratio === 0.25) {
        dpr = 1 - (ratio * 2);
      } else {
        dpr = Utils.devicePixelRatio();
      }
      if (Framer.Device.deviceType === "fullscreen") {
        dpr = 2;
      }
    } else {
      if (ratio < 0.5 && ratio > 0.25) {
        dpr = 1 - ratio;
      } else if (ratio === 0.25) {
        dpr = 1 - (ratio * 2);
      } else if (ratio === 0.5) {
        dpr = 1;
      }
    }
    return dpr;
  };

  InputLayer.prototype._setTextProperties = function(layer) {
    var dpr, ref;
    dpr = this._checkDevicePixelRatio();
    if (!this._isDesignLayer) {
      this._inputElement.style.fontFamily = layer.fontFamily;
      this._inputElement.style.fontSize = (layer.fontSize / dpr) + "px";
      this._inputElement.style.fontWeight = (ref = layer.fontWeight) != null ? ref : "normal";
      this._inputElement.style.paddingTop = (layer.padding.top * 2 / dpr) + "px";
      this._inputElement.style.paddingRight = (layer.padding.bottom * 2 / dpr) + "px";
      this._inputElement.style.paddingBottom = (layer.padding.right * 2 / dpr) + "px";
      this._inputElement.style.paddingLeft = (layer.padding.left * 2 / dpr) + "px";
    }
    this._inputElement.style.width = ((layer.width - layer.padding.left * 2) * 2 / dpr) + "px";
    this._inputElement.style.height = (layer.height * 2 / dpr) + "px";
    this._inputElement.style.outline = "none";
    this._inputElement.style.backgroundColor = "transparent";
    this._inputElement.style.cursor = "auto";
    this._inputElement.style.webkitAppearance = "none";
    this._inputElement.style.resize = "none";
    this._inputElement.style.overflow = "hidden";
    return this._inputElement.style.webkitFontSmoothing = "antialiased";
  };

  InputLayer.prototype.addBackgroundLayer = function(layer) {
    this._background = layer;
    this._background.parent = this;
    this._background.name = "background";
    this._background.x = this._background.y = 0;
    this._background._element.appendChild(this._inputElement);
    return this._background;
  };

  InputLayer.prototype.addPlaceHolderLayer = function(layer) {
    var dpr;
    this._isDesignLayer = true;
    this._inputElement.className = "input" + layer.id;
    this.padding = {
      left: 0,
      top: 0
    };
    this._setPlaceholder(layer.text);
    this._setTextProperties(layer);
    this._setPlaceholderColor(layer.id, layer.color);
    this.on("change:color", (function(_this) {
      return function() {
        return _this._setPlaceholderColor(layer.id, _this.color);
      };
    })(this));
    layer.visible = false;
    this._elementHTML.children[0].textContent = "";
    dpr = this._checkDevicePixelRatio();
    this._inputElement.style.fontSize = (layer.fontSize * 2 / dpr) + "px";
    this._inputElement.style.paddingTop = (layer.y * 2 / dpr) + "px";
    this._inputElement.style.paddingLeft = (layer.x * 2 / dpr) + "px";
    this._inputElement.style.width = ((this._background.width - layer.x * 2) * 2 / dpr) + "px";
    if (this.multiLine) {
      this._inputElement.style.height = (this._background.height * 2 / dpr) + "px";
    }
    this.on("change:padding", (function(_this) {
      return function() {
        _this._inputElement.style.paddingTop = (_this.padding.top * 2 / dpr) + "px";
        return _this._inputElement.style.paddingLeft = (_this.padding.left * 2 / dpr) + "px";
      };
    })(this));
    return this._placeholder;
  };

  InputLayer.prototype.focus = function() {
    return this._inputElement.focus();
  };

  InputLayer.define("value", {
    get: function() {
      return this._inputElement.value;
    },
    set: function(value) {
      return this._inputElement.value = value;
    }
  });

  InputLayer.define("focusColor", {
    get: function() {
      return this._inputElement.style.color;
    },
    set: function(value) {
      return this._inputElement.style.color = value;
    }
  });

  InputLayer.define("multiLine", InputLayer.simpleProperty("multiLine", false));

  InputLayer.wrap = function(background, placeholder, options) {
    return wrapInput(new this(options), background, placeholder, options);
  };

  InputLayer.prototype.onEnterKey = function(cb) {
    return this.on(Events.EnterKey, cb);
  };

  InputLayer.prototype.onSpaceKey = function(cb) {
    return this.on(Events.SpaceKey, cb);
  };

  InputLayer.prototype.onBackspaceKey = function(cb) {
    return this.on(Events.BackspaceKey, cb);
  };

  InputLayer.prototype.onCapsLockKey = function(cb) {
    return this.on(Events.CapsLockKey, cb);
  };

  InputLayer.prototype.onShiftKey = function(cb) {
    return this.on(Events.ShiftKey, cb);
  };

  InputLayer.prototype.onValueChange = function(cb) {
    return this.on(Events.ValueChange, cb);
  };

  InputLayer.prototype.onInputFocus = function(cb) {
    return this.on(Events.InputFocus, cb);
  };

  InputLayer.prototype.onInputBlur = function(cb) {
    return this.on(Events.InputBlur, cb);
  };

  return InputLayer;

})(TextLayer);

wrapInput = function(instance, background, placeholder) {
  var input, ref;
  if (!(background instanceof Layer)) {
    throw new Error("InputLayer expects a background layer.");
  }
  if (!(placeholder instanceof TextLayer)) {
    throw new Error("InputLayer expects a text layer.");
  }
  input = instance;
  if (input.__framerInstanceInfo == null) {
    input.__framerInstanceInfo = {};
  }
  if ((ref = input.__framerInstanceInfo) != null) {
    ref.name = instance.constructor.name;
  }
  input.frame = background.frame;
  input.parent = background.parent;
  input.index = background.index;
  input.addBackgroundLayer(background);
  input.addPlaceHolderLayer(placeholder);
  return input;
};


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2VsbGlvdG5vbHRlbi9Qcml2YXRlL2ZyYW1lci1BdXRvU3VnZ2VzdC9hZGRyZXNzLWF1dG8tc3VnZ2VzdC5mcmFtZXIvbW9kdWxlcy9pbnB1dC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9lbGxpb3Rub2x0ZW4vUHJpdmF0ZS9mcmFtZXItQXV0b1N1Z2dlc3QvYWRkcmVzcy1hdXRvLXN1Z2dlc3QuZnJhbWVyL21vZHVsZXMvYXV0b3N1Z2dlc3QuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvZWxsaW90bm9sdGVuL1ByaXZhdGUvZnJhbWVyLUF1dG9TdWdnZXN0L2FkZHJlc3MtYXV0by1zdWdnZXN0LmZyYW1lci9tb2R1bGVzL2F1dG9zdWdnZXN0Y2xhc3MuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudHMuRW50ZXJLZXkgPSBcIkVudGVyS2V5XCJcbkV2ZW50cy5TcGFjZUtleSA9IFwiU3BhY2VLZXlcIlxuRXZlbnRzLkJhY2tzcGFjZUtleSA9IFwiQmFja3NwYWNlS2V5XCJcbkV2ZW50cy5DYXBzTG9ja0tleSA9IFwiQ2Fwc0xvY2tLZXlcIlxuRXZlbnRzLlNoaWZ0S2V5ID0gXCJTaGlmdEtleVwiXG5FdmVudHMuVmFsdWVDaGFuZ2UgPSBcIlZhbHVlQ2hhbmdlXCJcbkV2ZW50cy5JbnB1dEZvY3VzID0gXCJJbnB1dEZvY3VzXCJcbkV2ZW50cy5JbnB1dEJsdXIgPSBcIklucHV0Qmx1clwiXG5cbmNsYXNzIGV4cG9ydHMuSW5wdXRMYXllciBleHRlbmRzIFRleHRMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblxuXHRcdF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjRkZGXCJcblx0XHRcdHdpZHRoOiAzNzVcblx0XHRcdGhlaWdodDogNjBcblx0XHRcdHBhZGRpbmc6XG5cdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHR0ZXh0OiBcIlR5cGUgc29tZXRoaW5nLi4uXCJcblx0XHRcdGZvbnRTaXplOiA0MFxuXHRcdFx0Zm9udFdlaWdodDogMzAwXG5cblx0XHRpZiBvcHRpb25zLm11bHRpTGluZVxuXHRcdFx0b3B0aW9ucy5wYWRkaW5nLnRvcCA/PSAyMFxuXG5cdFx0QF9pbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIlxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0IyBHbG9iYWxzXG5cdFx0QF9iYWNrZ3JvdW5kID0gdW5kZWZpbmVkXG5cdFx0QF9wbGFjZWhvbGRlciA9IHVuZGVmaW5lZFxuXHRcdEBfaXNEZXNpZ25MYXllciA9IGZhbHNlXG5cblx0XHQjIExheWVyIGNvbnRhaW5pbmcgaW5wdXQgZWxlbWVudFxuXHRcdEBpbnB1dCA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRcdG5hbWU6IFwiaW5wdXRcIlxuXHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0aGVpZ2h0OiBAaGVpZ2h0XG5cdFx0XHRwYXJlbnQ6IEBcblxuXHRcdCMgVGV4dCBhcmVhXG5cdFx0aWYgQG11bHRpTGluZVxuXHRcdFx0QF9pbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIilcblxuXHRcdCMgQXBwZW5kIGVsZW1lbnRcblx0XHRAaW5wdXQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoQF9pbnB1dEVsZW1lbnQpXG5cblx0XHQjIE1hdGNoIFRleHRMYXllciBkZWZhdWx0cyBhbmQgdHlwZSBwcm9wZXJ0aWVzXG5cdFx0QF9zZXRUZXh0UHJvcGVydGllcyhAKVxuXG5cdFx0IyBTZXQgYXR0cmlidXRlc1xuXHRcdEBfaW5wdXRFbGVtZW50LmF1dG9jb21wbGV0ZSA9IFwib2ZmXCJcblx0XHRAX2lucHV0RWxlbWVudC5hdXRvY29ycmVjdCA9IFwib2ZmXCJcblx0XHRAX2lucHV0RWxlbWVudC5zcGVsbGNoZWNrID0gZmFsc2VcblxuXHRcdCMgVGhlIGlkIHNlcnZlcyB0byBkaWZmZXJlbnRpYXRlIG11bHRpcGxlIGlucHV0IGVsZW1lbnRzIGZyb20gb25lIGFub3RoZXIuXG5cdFx0IyBUbyBhbGxvdyBzdHlsaW5nIHRoZSBwbGFjZWhvbGRlciBjb2xvcnMgb2Ygc2VwZXJhdGUgZWxlbWVudHMuXG5cdFx0QF9pbnB1dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJpbnB1dFwiICsgQGlkXG5cblx0XHQjIEFsbCBpbmhlcml0ZWQgcHJvcGVydGllc1xuXHRcdHRleHRQcm9wZXJ0aWVzID1cblx0XHRcdHtAdGV4dCwgQGZvbnRGYW1pbHksIEBmb250U2l6ZSwgQGxpbmVIZWlnaHQsIEBmb250V2VpZ2h0LCBAY29sb3IsIEBiYWNrZ3JvdW5kQ29sb3IsIEB3aWR0aCwgQGhlaWdodCwgQHBhZGRpbmcsIEBwYXJlbnR9XG5cblx0XHRmb3IgcHJvcGVydHksIHZhbHVlIG9mIHRleHRQcm9wZXJ0aWVzXG5cblx0XHRcdEBvbiBcImNoYW5nZToje3Byb3BlcnR5fVwiLCAodmFsdWUpID0+XG5cdFx0XHRcdCMgUmVzZXQgdGV4dExheWVyIGNvbnRlbnRzXG5cdFx0XHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHRcdFx0cmV0dXJuIGlmIEBfaXNEZXNpZ25MYXllclxuXHRcdFx0XHRAX3NldFRleHRQcm9wZXJ0aWVzKEApXG5cdFx0XHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihAX2lkLCBAY29sb3IpXG5cblxuXHRcdCMgU2V0IGRlZmF1bHQgcGxhY2Vob2xkZXJcblx0XHRAX3NldFBsYWNlaG9sZGVyKEB0ZXh0KVxuXHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihAX2lkLCBAY29sb3IpXG5cblx0XHQjIFJlc2V0IHRleHRMYXllciBjb250ZW50c1xuXHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHQjIENoZWNrIGlmIGluIGZvY3VzXG5cdFx0QF9pc0ZvY3VzZWQgPSBmYWxzZVxuXG5cdFx0IyBEZWZhdWx0IGZvY3VzIGludGVyYWN0aW9uXG5cdFx0QF9pbnB1dEVsZW1lbnQub25mb2N1cyA9IChlKSA9PlxuXG5cdFx0XHRAZm9jdXNDb2xvciA/PSBcIiMwMDBcIlxuXG5cdFx0XHQjIEVtaXQgZm9jdXMgZXZlbnRcblx0XHRcdEBlbWl0KEV2ZW50cy5JbnB1dEZvY3VzLCBldmVudClcblxuXHRcdFx0QF9pc0ZvY3VzZWQgPSB0cnVlXG5cblx0XHQjIEVtaXQgYmx1ciBldmVudFxuXHRcdEBfaW5wdXRFbGVtZW50Lm9uYmx1ciA9IChlKSA9PlxuXHRcdFx0QGVtaXQoRXZlbnRzLklucHV0Qmx1ciwgZXZlbnQpXG5cblx0XHRcdEBfaXNGb2N1c2VkID0gZmFsc2VcblxuXHRcdCMgVG8gZmlsdGVyIGlmIHZhbHVlIGNoYW5nZWQgbGF0ZXJcblx0XHRjdXJyZW50VmFsdWUgPSB1bmRlZmluZWRcblxuXHRcdCMgU3RvcmUgY3VycmVudCB2YWx1ZVxuXHRcdEBfaW5wdXRFbGVtZW50Lm9ua2V5ZG93biA9IChlKSA9PlxuXHRcdFx0Y3VycmVudFZhbHVlID0gQHZhbHVlXG5cblx0XHRcdCMgSWYgY2FwcyBsb2NrIGtleSBpcyBwcmVzc2VkIGRvd25cblx0XHRcdGlmIGUud2hpY2ggaXMgMjBcblx0XHRcdFx0QGVtaXQoRXZlbnRzLkNhcHNMb2NrS2V5LCBldmVudClcblxuXHRcdFx0IyBJZiBzaGlmdCBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyAxNlxuXHRcdFx0XHRAZW1pdChFdmVudHMuU2hpZnRLZXksIGV2ZW50KVxuXG5cdFx0QF9pbnB1dEVsZW1lbnQub25rZXl1cCA9IChlKSA9PlxuXG5cdFx0XHRpZiBjdXJyZW50VmFsdWUgaXNudCBAdmFsdWVcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6dmFsdWVcIiwgQHZhbHVlKVxuXHRcdFx0XHRAZW1pdChFdmVudHMuVmFsdWVDaGFuZ2UsIEB2YWx1ZSlcblxuXHRcdFx0IyBJZiBlbnRlciBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyAxM1xuXHRcdFx0XHRAZW1pdChFdmVudHMuRW50ZXJLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIGJhY2tzcGFjZSBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyA4XG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5CYWNrc3BhY2VLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIHNwYWNlIGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDMyXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5TcGFjZUtleSwgZXZlbnQpXG5cblx0XHRcdCMgSWYgY2FwcyBsb2NrIGtleSBpcyBwcmVzc2VkIHVwXG5cdFx0XHRpZiBlLndoaWNoIGlzIDIwXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5DYXBzTG9ja0tleSwgZXZlbnQpXG5cblx0X3NldFBsYWNlaG9sZGVyOiAodGV4dCkgPT5cblx0XHRAX2lucHV0RWxlbWVudC5wbGFjZWhvbGRlciA9IHRleHRcblxuXHRfc2V0UGxhY2Vob2xkZXJDb2xvcjogKGlkLCBjb2xvcikgLT5cblx0XHRkb2N1bWVudC5zdHlsZVNoZWV0c1swXS5hZGRSdWxlKFwiLmlucHV0I3tpZH06Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXJcIiwgXCJjb2xvcjogI3tjb2xvcn1cIilcblxuXHRfY2hlY2tEZXZpY2VQaXhlbFJhdGlvOiAtPlxuXHRcdHJhdGlvID0gKFNjcmVlbi53aWR0aCAvIEZyYW1lci5EZXZpY2Uuc2NyZWVuLndpZHRoKVxuXHRcdGlmIFV0aWxzLmlzRGVza3RvcCgpXG5cdFx0XHQjIEAzeFxuXHRcdFx0aWYgcmF0aW8gPCAwLjUgYW5kIHJhdGlvID4gMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gcmF0aW9cblx0XHRcdCMgQDR4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIChyYXRpbyAqIDIpXG5cdFx0XHQjIEAxeCwgQDJ4XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRwciA9IFV0aWxzLmRldmljZVBpeGVsUmF0aW8oKVxuXHRcdFx0aWYgRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlIGlzIFwiZnVsbHNjcmVlblwiXG5cdFx0XHRcdGRwciA9IDJcblx0XHRlbHNlXG5cdFx0XHQjIEAzeFxuXHRcdFx0aWYgcmF0aW8gPCAwLjUgYW5kIHJhdGlvID4gMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gcmF0aW9cblx0XHRcdCMgQDR4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIChyYXRpbyAqIDIpXG5cdFx0XHQjIEAxeCwgQDJ4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuNVxuXHRcdFx0XHRkcHIgPSAxXG5cblx0XHRyZXR1cm4gZHByXG5cblx0X3NldFRleHRQcm9wZXJ0aWVzOiAobGF5ZXIpID0+XG5cblx0XHRkcHIgPSBAX2NoZWNrRGV2aWNlUGl4ZWxSYXRpbygpXG5cblx0XHRpZiBub3QgQF9pc0Rlc2lnbkxheWVyXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250RmFtaWx5ID0gbGF5ZXIuZm9udEZhbWlseVxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSBcIiN7bGF5ZXIuZm9udFNpemUgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IGxheWVyLmZvbnRXZWlnaHQgPyBcIm5vcm1hbFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nVG9wID0gXCIje2xheWVyLnBhZGRpbmcudG9wICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIiN7bGF5ZXIucGFkZGluZy5ib3R0b20gKiAyIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIiN7bGF5ZXIucGFkZGluZy5yaWdodCAqIDIgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSBcIiN7bGF5ZXIucGFkZGluZy5sZWZ0ICogMiAvIGRwcn1weFwiXG5cblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53aWR0aCA9IFwiI3soKGxheWVyLndpZHRoIC0gbGF5ZXIucGFkZGluZy5sZWZ0ICogMikgKiAyIC8gZHByKX1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIje2xheWVyLmhlaWdodCAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidHJhbnNwYXJlbnRcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmN1cnNvciA9IFwiYXV0b1wiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUud2Via2l0QXBwZWFyYW5jZSA9IFwibm9uZVwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucmVzaXplID0gXCJub25lXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53ZWJraXRGb250U21vb3RoaW5nID0gXCJhbnRpYWxpYXNlZFwiXG5cblx0YWRkQmFja2dyb3VuZExheWVyOiAobGF5ZXIpIC0+XG5cdFx0QF9iYWNrZ3JvdW5kID0gbGF5ZXJcblx0XHRAX2JhY2tncm91bmQucGFyZW50ID0gQFxuXHRcdEBfYmFja2dyb3VuZC5uYW1lID0gXCJiYWNrZ3JvdW5kXCJcblx0XHRAX2JhY2tncm91bmQueCA9IEBfYmFja2dyb3VuZC55ID0gMFxuXHRcdEBfYmFja2dyb3VuZC5fZWxlbWVudC5hcHBlbmRDaGlsZChAX2lucHV0RWxlbWVudClcblxuXHRcdHJldHVybiBAX2JhY2tncm91bmRcblxuXHRhZGRQbGFjZUhvbGRlckxheWVyOiAobGF5ZXIpIC0+XG5cblx0XHRAX2lzRGVzaWduTGF5ZXIgPSB0cnVlXG5cdFx0QF9pbnB1dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJpbnB1dFwiICsgbGF5ZXIuaWRcblx0XHRAcGFkZGluZyA9IGxlZnQ6IDAsIHRvcDogMFxuXG5cdFx0QF9zZXRQbGFjZWhvbGRlcihsYXllci50ZXh0KVxuXHRcdEBfc2V0VGV4dFByb3BlcnRpZXMobGF5ZXIpXG5cdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKGxheWVyLmlkLCBsYXllci5jb2xvcilcblxuXHRcdEBvbiBcImNoYW5nZTpjb2xvclwiLCA9PlxuXHRcdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKGxheWVyLmlkLCBAY29sb3IpXG5cblx0XHQjIFJlbW92ZSBvcmlnaW5hbCBsYXllclxuXHRcdGxheWVyLnZpc2libGUgPSBmYWxzZVxuXHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHQjIENvbnZlcnQgcG9zaXRpb24gdG8gcGFkZGluZ1xuXHRcdGRwciA9IEBfY2hlY2tEZXZpY2VQaXhlbFJhdGlvKClcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IFwiI3tsYXllci5mb250U2l6ZSAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7bGF5ZXIueSAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIje2xheWVyLnggKiAyIC8gZHByfXB4XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53aWR0aCA9IFwiI3soQF9iYWNrZ3JvdW5kLndpZHRoIC0gbGF5ZXIueCAqIDIpICogMiAvIGRwcn1weFwiXG5cblx0XHRpZiBAbXVsdGlMaW5lXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIiN7QF9iYWNrZ3JvdW5kLmhlaWdodCAqIDIgLyBkcHJ9cHhcIlxuXG5cdFx0QG9uIFwiY2hhbmdlOnBhZGRpbmdcIiwgPT5cblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7QHBhZGRpbmcudG9wICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiI3tAcGFkZGluZy5sZWZ0ICogMiAvIGRwcn1weFwiXG5cblx0XHRyZXR1cm4gQF9wbGFjZWhvbGRlclxuXG5cdGZvY3VzOiAtPlxuXHRcdEBfaW5wdXRFbGVtZW50LmZvY3VzKClcblxuXHRAZGVmaW5lIFwidmFsdWVcIixcblx0XHRnZXQ6IC0+IEBfaW5wdXRFbGVtZW50LnZhbHVlXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC52YWx1ZSA9IHZhbHVlXG5cblx0QGRlZmluZSBcImZvY3VzQ29sb3JcIixcblx0XHRnZXQ6IC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5jb2xvclxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuY29sb3IgPSB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJtdWx0aUxpbmVcIiwgQHNpbXBsZVByb3BlcnR5KFwibXVsdGlMaW5lXCIsIGZhbHNlKVxuXG5cdCMgTmV3IENvbnN0cnVjdG9yXG5cdEB3cmFwID0gKGJhY2tncm91bmQsIHBsYWNlaG9sZGVyLCBvcHRpb25zKSAtPlxuXHRcdHJldHVybiB3cmFwSW5wdXQobmV3IEAob3B0aW9ucyksIGJhY2tncm91bmQsIHBsYWNlaG9sZGVyLCBvcHRpb25zKVxuXG5cdG9uRW50ZXJLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5FbnRlcktleSwgY2IpXG5cdG9uU3BhY2VLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5TcGFjZUtleSwgY2IpXG5cdG9uQmFja3NwYWNlS2V5OiAoY2IpIC0+IEBvbihFdmVudHMuQmFja3NwYWNlS2V5LCBjYilcblx0b25DYXBzTG9ja0tleTogKGNiKSAtPiBAb24oRXZlbnRzLkNhcHNMb2NrS2V5LCBjYilcblx0b25TaGlmdEtleTogKGNiKSAtPiBAb24oRXZlbnRzLlNoaWZ0S2V5LCBjYilcblx0b25WYWx1ZUNoYW5nZTogKGNiKSAtPiBAb24oRXZlbnRzLlZhbHVlQ2hhbmdlLCBjYilcblx0b25JbnB1dEZvY3VzOiAoY2IpIC0+IEBvbihFdmVudHMuSW5wdXRGb2N1cywgY2IpXG5cdG9uSW5wdXRCbHVyOiAoY2IpIC0+IEBvbihFdmVudHMuSW5wdXRCbHVyLCBjYilcblxud3JhcElucHV0ID0gKGluc3RhbmNlLCBiYWNrZ3JvdW5kLCBwbGFjZWhvbGRlcikgLT5cblx0aWYgbm90IChiYWNrZ3JvdW5kIGluc3RhbmNlb2YgTGF5ZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5wdXRMYXllciBleHBlY3RzIGEgYmFja2dyb3VuZCBsYXllci5cIilcblxuXHRpZiBub3QgKHBsYWNlaG9sZGVyIGluc3RhbmNlb2YgVGV4dExheWVyKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIklucHV0TGF5ZXIgZXhwZWN0cyBhIHRleHQgbGF5ZXIuXCIpXG5cblx0aW5wdXQgPSBpbnN0YW5jZVxuXG5cdGlucHV0Ll9fZnJhbWVySW5zdGFuY2VJbmZvID89IHt9XG5cdGlucHV0Ll9fZnJhbWVySW5zdGFuY2VJbmZvPy5uYW1lID0gaW5zdGFuY2UuY29uc3RydWN0b3IubmFtZVxuXG5cdGlucHV0LmZyYW1lID0gYmFja2dyb3VuZC5mcmFtZVxuXHRpbnB1dC5wYXJlbnQgPSBiYWNrZ3JvdW5kLnBhcmVudFxuXHRpbnB1dC5pbmRleCA9IGJhY2tncm91bmQuaW5kZXhcblxuXHRpbnB1dC5hZGRCYWNrZ3JvdW5kTGF5ZXIoYmFja2dyb3VuZClcblx0aW5wdXQuYWRkUGxhY2VIb2xkZXJMYXllcihwbGFjZWhvbGRlcilcblxuXHRyZXR1cm4gaW5wdXQiLCJleHBvcnRzLmF1dG9TdWdnZXN0ID0gKGlucHV0LCBtYXhSZXN1bHRzLCB0eXBlKSAtPlxuXHRcblx0IyBTZXQgZGVmYXVsdHNcblx0bWF4UmVzdWx0cyA9IDUgaWYgbWF4UmVzdWx0cyBpcyBudWxsXG5cdFxuXHQjIFR5cGUgY2FuIGJlIGdlbWVlbnRlLCB3b29ucGxhYXRzLCB3ZWcsIHBvc3Rjb2RlLCBhZHJlcywgaGVjdG9tZXRlcnBhYWwsIG9yIHBlcmNlZWwuXG5cdHR5cGUgPSBcImFkcmVzXCIgaWYgdHlwZSBpcyBudWxsXG5cblx0IyBTZWFyY2ggc3VnZ2VzdGlvbiBMYXllclxuXHRzZWFyY2hTdWdnZXN0aW9ucyA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBpbnB1dC53aWR0aFxuXHRcdGhlaWdodDogMFxuXHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdHk6IGlucHV0Lm1heFkgKyA4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0c2hhZG93Q29sb3I6IFwicmdiYSgwLDAsMCwwLjIpXCJcblx0XHRzaGFkb3dZOiAxXG5cdFx0c2hhZG93Qmx1cjogM1xuXHRcdGJvcmRlckNvbG9yOiBcIiNlZGVkZWRcIlxuXHRcdHZpc2libGU6IGZhbHNlXG5cdCMgc2VhcmNoU3VnZ2VzdGlvbnMuc2VuZFRvQmFjaygpXG5cblx0IyBDcmVhdGUgaXRlbSBDbGFzc1xuXHRjbGFzcyByZXN1bHRJdGVtIGV4dGVuZHMgTGF5ZXJcblx0XHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdGZvbnRTaXplOiBcIjE2cHhcIlxuXHRcdFx0XHRcdGxpbmVIZWlnaHQ6IFwiI3s0OCAvIDE2fXB4XCJcblx0XHRcdFx0XHRjb2xvcjogXCIjMzMzXCJcblx0XHRcdFx0XHRwYWRkaW5nVG9wOiBcIjI0cHhcIlxuXHRcdFx0XHRcdHBhZGRpbmdMZWZ0OiBcIjE2cHhcIlxuXHRcdFx0XHRcdHBhZGRpbmdSaWdodDogXCIxNnB4XCJcblx0XHRcdFx0XHRib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkICNjY2NcIlxuXHRcdFx0XHRcdHdoaXRlU3BhY2U6IFwibm93cmFwXCJcblx0XHRcdFx0XHRvdmVyZmxvdzogXCJoaWRkZW5cIlxuXHRcdFx0XHRcdHRleHRPdmVyZmxvdzogXCJlbGxpcHNpc1wiXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiXG5cdFx0XHRcdHJlc3VsdDogXCJWb29yYmVlbGRcIlxuXG5cdFx0XHRAcmVzdWx0ID0gb3B0aW9ucy5yZXN1bHRcblxuXG5cblx0IyBQRE9LXG5cdHBkb2tVUkwgPSBcImh0dHBzOi8vZ2VvZGF0YS5uYXRpb25hYWxnZW9yZWdpc3Rlci5ubC9sb2NhdGllc2VydmVyL3YzL3N1Z2dlc3Q/cT1cIlxuXHRcblx0Z2V0U2VhcmNoU3VnZ2VzdGlvbnMgPSAoaW5wdXQpIC0+XG5cdFx0c3VnZ2VzdGlvblJlc3VsdHMgPSBbXVxuXHRcdFxuXHRcdHJlc3VsdHNIZWlnaHQgPSAwXG5cdFx0XG5cdFx0Zm9yIGl0ZW0saSBpbiBzZWFyY2hTdWdnZXN0aW9ucy5jaGlsZHJlblxuXHRcdFx0aXRlbS5kZXN0cm95KClcblx0XHRcdFxuXHRcdGlmIGlucHV0LnZhbHVlLmxlbmd0aCA+PSAyXG5cdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5icmluZ1RvRnJvbnQoKVxuXHRcdFx0IyBzZWFyY2hTdWdnZXN0aW9ucy55ID0gaW5wdXQuc2NyZWVuRnJhbWUueSArIGlucHV0LmhlaWdodCArIDhcblx0XHRcdHNlYXJjaFN1Z2dlc3Rpb25zLnZpc2libGUgPSB0cnVlXG5cdFx0XHRlbmRwb2ludCA9IFV0aWxzLmRvbUxvYWRKU09OU3luYyBwZG9rVVJMICsgaW5wdXQudmFsdWUgKyBcIiBhbmQgdHlwZToje3R5cGV9XCJcblx0XHRcdHJlc3VsdHMgPSBlbmRwb2ludC5yZXNwb25zZS5kb2NzXG5cdFx0XHRoaWdobGlnaHRpbmcgPSBlbmRwb2ludC5oaWdobGlnaHRpbmdcblxuXHRcdFx0XG5cdFx0XHRmb3IgcmVzdWx0LCBpbmRleCBpbiByZXN1bHRzWzAuLi5tYXhSZXN1bHRzXVxuXHRcdFx0XHRpZCA9IHJlc3VsdC5pZFxuXG5cdFx0XHRcdGl0ZW0gPSBuZXcgcmVzdWx0SXRlbVxuXHRcdFx0XHRcdHBhcmVudDogc2VhcmNoU3VnZ2VzdGlvbnNcblx0XHRcdFx0XHR3aWR0aDogc2VhcmNoU3VnZ2VzdGlvbnMud2lkdGhcblx0XHRcdFx0XHRoZWlnaHQ6IDQ4XG5cdFx0XHRcdFx0eTogNDggKiBpbmRleFxuXHRcdFx0XHRcdGh0bWw6IGhpZ2hsaWdodGluZ1tpZF0uc3VnZ2VzdFxuXHRcdFx0XHRcdHJlc3VsdDogcmVzdWx0LndlZXJnYXZlbmFhbVxuXG5cdFx0XHRcdGlmIGluZGV4IGlzIG1heFJlc3VsdHMgLSAxXG5cdFx0XHRcdFx0aXRlbS5zdHlsZS5ib3JkZXJCb3R0b20gPSBcIlwiXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXN1bHRzSGVpZ2h0ICs9IDQ4XG5cdFx0XHRcdFxuXHRcdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5oZWlnaHQgPSByZXN1bHRzSGVpZ2h0XG5cdFx0XHRcdFxuXHRcdFx0XHRpdGVtLm9uVGFwIC0+XG5cdFx0XHRcdFx0aW5wdXQudmFsdWUgPSBAcmVzdWx0XG5cdFx0XHRcdFx0c2VhcmNoU3VnZ2VzdGlvbnMuc2VuZFRvQmFjaygpXG5cdFx0XHRcdFx0c2VhcmNoU3VnZ2VzdGlvbnMudmlzaWJsZSA9IGZhbHNlXG5cblx0XHRcdFxuXHRcdFx0aW5wdXQub25JbnB1dEJsdXIgLT5cblx0XHRcdFx0c2VhcmNoU3VnZ2VzdGlvbnMuc2VuZFRvQmFjaygpXG5cdFx0XHRpbnB1dC5vbklucHV0Rm9jdXMgLT5cblx0XHRcdFx0c2VhcmNoU3VnZ2VzdGlvbnMuYnJpbmdUb0Zyb250KClcblx0XHRlbHNlXG5cdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5zZW5kVG9CYWNrKClcblx0XHRcdHNlYXJjaFN1Z2dlc3Rpb25zLmhlaWdodCA9IDBcblx0XG5cdFxuXHRpbnB1dC5vblZhbHVlQ2hhbmdlIC0+XG5cdFx0Z2V0U2VhcmNoU3VnZ2VzdGlvbnMoQCkiLCIjIEN1c3RvbSBFdmVudHNcbkV2ZW50cy5SZXN1bHRTZWxlY3RlZCA9IFwiUmVzdWx0U2VsZWN0ZWRcIlxuXG4jIFBET0tcbnBkb2tVUkwgPSBcImh0dHBzOi8vZ2VvZGF0YS5uYXRpb25hYWxnZW9yZWdpc3Rlci5ubC9sb2NhdGllc2VydmVyL3YzL3N1Z2dlc3Q/cT1cIlxuXG4jIENyZWF0ZSBpdGVtIENsYXNzIG9ubHkgdG8gdXNlIHdpdGhpbiB0aGlzIG1vZHVsZSwgbm8gZXhwb3J0c1xuY2xhc3MgUmVzdWx0SXRlbSBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0Zm9udFNpemU6IFwiMTZweFwiXG5cdFx0XHRcdGxpbmVIZWlnaHQ6IFwiI3s0OCAvIDE2fXB4XCJcblx0XHRcdFx0Y29sb3I6IFwiIzMzM1wiXG5cdFx0XHRcdHBhZGRpbmdUb3A6IFwiMjRweFwiXG5cdFx0XHRcdHBhZGRpbmdMZWZ0OiBcIjE2cHhcIlxuXHRcdFx0XHRwYWRkaW5nUmlnaHQ6IFwiMTZweFwiXG5cdFx0XHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgI2NjY1wiXG5cdFx0XHRcdHdoaXRlU3BhY2U6IFwibm93cmFwXCJcblx0XHRcdFx0b3ZlcmZsb3c6IFwiaGlkZGVuXCJcblx0XHRcdFx0dGV4dE92ZXJmbG93OiBcImVsbGlwc2lzXCJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiXG5cdFx0XHRyZXN1bHQ6IFwiXCJcblx0XHRcdHJlc3VsdEhpZ2hsaWdodGVkOiBcIlwiXG5cblx0XHRAcmVzdWx0ID0gb3B0aW9ucy5yZXN1bHRcblxuY2xhc3MgZXhwb3J0cy5hdXRvU3VnZ2VzdCBleHRlbmRzIExheWVyXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGlucHV0OiBbXVxuXHRcdFx0bWF4UmVzdWx0czogNVxuXHRcdFx0dHlwZTogXCJhZHJlc1wiXG5cdFx0XHR4OiBBbGlnbi5jZW50ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0c2hhZG93Q29sb3I6IFwicmdiYSgwLDAsMCwwLjIpXCJcblx0XHRcdHNoYWRvd1k6IDFcblx0XHRcdHNoYWRvd0JsdXI6IDhcblx0XHRcdGJvcmRlckNvbG9yOiBcIiNlZGVkZWRcIlxuXG5cdFx0QGlucHV0ID0gb3B0aW9ucy5pbnB1dFxuXHRcdEBtYXhSZXN1bHRzID0gb3B0aW9ucy5tYXhSZXN1bHRzXG5cdFx0QHR5cGUgPSBvcHRpb25zLnR5cGVcblxuXG5cdFx0IyBTdG9yZSB0aGUgb3B0aW9ucyBpbnRvIG5ldyB2YXJpYWJsZXMgZm9yIGxhdGVyIHVzZVxuXHRcdGF1dG9TdWdnZXN0Q29udGFpbmVyID0gQFxuXHRcdHR5cGUgPSBAdHlwZVxuXHRcdG1heFJlc3VsdHMgPSBAbWF4UmVzdWx0c1xuXG5cdFx0IyBQb3NpdGlvbiB0aGUgYXV0b1N1Z2dlc3Rcblx0XHRAeCA9IEBpbnB1dC54ICsgMVxuXHRcdEB5ID0gQGlucHV0Lm1heFkgKyA4XG5cdFx0QHdpZHRoID0gQGlucHV0LndpZHRoIC0gMlxuXHRcdEBzZW5kVG9CYWNrKClcblxuXHRcdCMgU2hvdyBhdXRvIHN1Z2dlc3Rpb25zIHdoaWxlIHR5cGluZ1xuXHRcdEBpbnB1dC5vblZhbHVlQ2hhbmdlIC0+XG5cblx0XHRcdGlucHV0ID0gQFxuXG5cdFx0XHQjIFJlc2V0IHRoZSBoZWlnaHQgb2YgdGhlIGF1dG9TdWdnZXN0Q29udGFpbmVyIHRvIDBcblx0XHRcdGF1dG9TdWdnZXN0Q29udGFpbmVyLmhlaWdodCA9IDBcblxuXHRcdFx0IyBGaXJzdCBkZXN0cm95IGFsbCBjaGlsZHJlbiBvZiB0aGUgYXV0b1N1Z2dlc3RDb250YWluZXJcblx0XHRcdGl0ZW0uZGVzdHJveSgpIGZvciBpdGVtIGluIGF1dG9TdWdnZXN0Q29udGFpbmVyLmNoaWxkcmVuXG5cblx0XHRcdCMgT25seSBzaG93IHNvbWV0aGluZyB3aGVuIHRoZXJlIGFyZSAyIGNoYXJhY3RlcnMgb3IgbW9yZVxuXHRcdFx0aWYgQHZhbHVlLmxlbmd0aCA+PSAyXG5cblx0XHRcdFx0IyBGaXJzdCBzaG93IHRoZSBhdXRvU3VnZ2VzdCBjb250YWluZXJcblx0XHRcdFx0YXV0b1N1Z2dlc3RDb250YWluZXIuYnJpbmdUb0Zyb250KClcblxuXHRcdFx0XHQjIFRoZW4gbG9hZCB0aGUgZGF0YSBmcm9tIHRoZSBQRE9LIGVuZHBvaW50XG5cdFx0XHRcdGVuZHBvaW50ID0gVXRpbHMuZG9tTG9hZEpTT05TeW5jIHBkb2tVUkwgKyBAdmFsdWUgKyBcIiBhbmQgdHlwZToje3R5cGV9XCJcblxuXHRcdFx0XHQjIFNwbGl0IHRoZSBlbmRwb2ludCBpbiByZXN1bHRzXG5cdFx0XHRcdHJlc3VsdHMgPSBlbmRwb2ludC5yZXNwb25zZS5kb2NzXG5cblx0XHRcdFx0IyBBbmQgaGlnaGxpZ2h0ZWQgcmVzdWx0c1xuXHRcdFx0XHRoaWdobGlnaHRpbmcgPSBlbmRwb2ludC5oaWdobGlnaHRpbmdcblxuXHRcdFx0XHQjIExvb3AgdGhyb3VnaCB0aGUgcmVzdWx0cyBhbmQgc2hvdyB0aGUgcmVzdWx0cyBpbiBhIGxpc3Rcblx0XHRcdFx0Zm9yIHJlc3VsdCwgaW5kZXggaW4gcmVzdWx0c1swLi4ubWF4UmVzdWx0c11cblxuXHRcdFx0XHRcdCMgU3RvcmUgdGhlIHVuaXF1ZSBpZCBmb3IgbGF0ZXIgdXNlXG5cdFx0XHRcdFx0aWQgPSByZXN1bHQuaWRcblxuXHRcdFx0XHRcdCMgQ3JlYXRlIHRoZSBpdGVtc1xuXHRcdFx0XHRcdGl0ZW0gPSBuZXcgUmVzdWx0SXRlbVxuXHRcdFx0XHRcdFx0cGFyZW50OiBhdXRvU3VnZ2VzdENvbnRhaW5lclxuXHRcdFx0XHRcdFx0d2lkdGg6IGF1dG9TdWdnZXN0Q29udGFpbmVyLndpZHRoXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDQ4XG5cdFx0XHRcdFx0XHR5OiA0OCAqIGluZGV4XG5cdFx0XHRcdFx0XHQjIEZpbGwgdGhlIGl0ZW0gd2l0aCB0aGUgaGlnaGxpZ2h0ZWQgc3VnZ2VzdGlvblxuXHRcdFx0XHRcdFx0aHRtbDogaGlnaGxpZ2h0aW5nW2lkXS5zdWdnZXN0XG5cdFx0XHRcdFx0XHRyZXN1bHQ6IHJlc3VsdC53ZWVyZ2F2ZW5hYW1cblxuXHRcdFx0XHRcdCMgRm9yIGVhY2ggcmVzdWx0IGFkZCB1cCA0OHB4IHRvIHRoZSBoZWlnaHQgb2YgdGhlIGF1dG9TdWdnZXN0Q29udGFpbmVyXG5cdFx0XHRcdFx0YXV0b1N1Z2dlc3RDb250YWluZXIuaGVpZ2h0ICs9IDQ4XG5cblx0XHRcdFx0XHQjIFRhcHBpbmcgYW4gaXRlbSBwdXRzIGl0cyB2YWx1ZSBpbnRvIHRoZSBpbnB1dCBmaWVsZCBhbmQgdHJpZ2dlcnMgdGhlIHJlc3VsdFNlbGVjdGVkIEV2ZW50XG5cdFx0XHRcdFx0aXRlbS5vblRhcCAtPlxuXHRcdFx0XHRcdFx0aW5wdXQudmFsdWUgPSBAcmVzdWx0XG5cdFx0XHRcdFx0XHRhdXRvU3VnZ2VzdENvbnRhaW5lci5yZXN1bHQgPSBAcmVzdWx0XG5cdFx0XHRcdFx0XHRhdXRvU3VnZ2VzdENvbnRhaW5lci5yZXN1bHRIaWdobGlnaHRlZCA9IGhpZ2hsaWdodGluZ1tpZF0uc3VnZ2VzdFxuXG5cdFx0XHRcdFx0XHQjIEhpZGUgdGhlIGF1dG9TdWdnZXN0Q29udGFpbmVyXG5cdFx0XHRcdFx0XHRhdXRvU3VnZ2VzdENvbnRhaW5lci5zZW5kVG9CYWNrKClcblx0XHRcdFx0XHRcdGF1dG9TdWdnZXN0Q29udGFpbmVyLmVtaXQoRXZlbnRzLlJlc3VsdFNlbGVjdGVkLCBldmVudClcblxuXG5cbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBR0FBO0FEQ0EsSUFBQSxtQkFBQTtFQUFBOzs7QUFBQSxNQUFNLENBQUMsY0FBUCxHQUF3Qjs7QUFHeEIsT0FBQSxHQUFVOztBQUdKOzs7RUFDUSxvQkFBQyxPQUFEO0lBQ1osNENBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxPQUFYLEVBQ0w7TUFBQSxLQUFBLEVBQ0M7UUFBQSxRQUFBLEVBQVUsTUFBVjtRQUNBLFVBQUEsRUFBYyxDQUFDLEVBQUEsR0FBSyxFQUFOLENBQUEsR0FBUyxJQUR2QjtRQUVBLEtBQUEsRUFBTyxNQUZQO1FBR0EsVUFBQSxFQUFZLE1BSFo7UUFJQSxXQUFBLEVBQWEsTUFKYjtRQUtBLFlBQUEsRUFBYyxNQUxkO1FBTUEsWUFBQSxFQUFjLGdCQU5kO1FBT0EsVUFBQSxFQUFZLFFBUFo7UUFRQSxRQUFBLEVBQVUsUUFSVjtRQVNBLFlBQUEsRUFBYyxVQVRkO09BREQ7TUFXQSxlQUFBLEVBQWlCLE9BWGpCO01BWUEsTUFBQSxFQUFRLEVBWlI7TUFhQSxpQkFBQSxFQUFtQixFQWJuQjtLQURLLENBQU47SUFnQkEsSUFBQyxDQUFBLE1BQUQsR0FBVSxPQUFPLENBQUM7RUFqQk47Ozs7R0FEVzs7QUFvQm5C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
