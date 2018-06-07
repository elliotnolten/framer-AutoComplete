require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"autosuggest":[function(require,module,exports){
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
    y: input.maxY,
    backgroundColor: null,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowY: 1,
    shadowBlur: 3,
    borderColor: "#ededed",
    visible: false
  });
  searchSuggestions.sendToBack();
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
      searchSuggestions.y = input.screenFrame.y + input.height + 8;
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
          console.log(this.result);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2VsbGlvdG5vbHRlbi9Qcml2YXRlL2ZyYW1lci1BdXRvU3VnZ2VzdC9hZGRyZXNzLWF1dG8tc3VnZ2VzdC5mcmFtZXIvbW9kdWxlcy9pbnB1dC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9lbGxpb3Rub2x0ZW4vUHJpdmF0ZS9mcmFtZXItQXV0b1N1Z2dlc3QvYWRkcmVzcy1hdXRvLXN1Z2dlc3QuZnJhbWVyL21vZHVsZXMvYXV0b3N1Z2dlc3QuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudHMuRW50ZXJLZXkgPSBcIkVudGVyS2V5XCJcbkV2ZW50cy5TcGFjZUtleSA9IFwiU3BhY2VLZXlcIlxuRXZlbnRzLkJhY2tzcGFjZUtleSA9IFwiQmFja3NwYWNlS2V5XCJcbkV2ZW50cy5DYXBzTG9ja0tleSA9IFwiQ2Fwc0xvY2tLZXlcIlxuRXZlbnRzLlNoaWZ0S2V5ID0gXCJTaGlmdEtleVwiXG5FdmVudHMuVmFsdWVDaGFuZ2UgPSBcIlZhbHVlQ2hhbmdlXCJcbkV2ZW50cy5JbnB1dEZvY3VzID0gXCJJbnB1dEZvY3VzXCJcbkV2ZW50cy5JbnB1dEJsdXIgPSBcIklucHV0Qmx1clwiXG5cbmNsYXNzIGV4cG9ydHMuSW5wdXRMYXllciBleHRlbmRzIFRleHRMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblxuXHRcdF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjRkZGXCJcblx0XHRcdHdpZHRoOiAzNzVcblx0XHRcdGhlaWdodDogNjBcblx0XHRcdHBhZGRpbmc6XG5cdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHR0ZXh0OiBcIlR5cGUgc29tZXRoaW5nLi4uXCJcblx0XHRcdGZvbnRTaXplOiA0MFxuXHRcdFx0Zm9udFdlaWdodDogMzAwXG5cblx0XHRpZiBvcHRpb25zLm11bHRpTGluZVxuXHRcdFx0b3B0aW9ucy5wYWRkaW5nLnRvcCA/PSAyMFxuXG5cdFx0QF9pbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIlxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0IyBHbG9iYWxzXG5cdFx0QF9iYWNrZ3JvdW5kID0gdW5kZWZpbmVkXG5cdFx0QF9wbGFjZWhvbGRlciA9IHVuZGVmaW5lZFxuXHRcdEBfaXNEZXNpZ25MYXllciA9IGZhbHNlXG5cblx0XHQjIExheWVyIGNvbnRhaW5pbmcgaW5wdXQgZWxlbWVudFxuXHRcdEBpbnB1dCA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRcdG5hbWU6IFwiaW5wdXRcIlxuXHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0aGVpZ2h0OiBAaGVpZ2h0XG5cdFx0XHRwYXJlbnQ6IEBcblxuXHRcdCMgVGV4dCBhcmVhXG5cdFx0aWYgQG11bHRpTGluZVxuXHRcdFx0QF9pbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIilcblxuXHRcdCMgQXBwZW5kIGVsZW1lbnRcblx0XHRAaW5wdXQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoQF9pbnB1dEVsZW1lbnQpXG5cblx0XHQjIE1hdGNoIFRleHRMYXllciBkZWZhdWx0cyBhbmQgdHlwZSBwcm9wZXJ0aWVzXG5cdFx0QF9zZXRUZXh0UHJvcGVydGllcyhAKVxuXG5cdFx0IyBTZXQgYXR0cmlidXRlc1xuXHRcdEBfaW5wdXRFbGVtZW50LmF1dG9jb21wbGV0ZSA9IFwib2ZmXCJcblx0XHRAX2lucHV0RWxlbWVudC5hdXRvY29ycmVjdCA9IFwib2ZmXCJcblx0XHRAX2lucHV0RWxlbWVudC5zcGVsbGNoZWNrID0gZmFsc2VcblxuXHRcdCMgVGhlIGlkIHNlcnZlcyB0byBkaWZmZXJlbnRpYXRlIG11bHRpcGxlIGlucHV0IGVsZW1lbnRzIGZyb20gb25lIGFub3RoZXIuXG5cdFx0IyBUbyBhbGxvdyBzdHlsaW5nIHRoZSBwbGFjZWhvbGRlciBjb2xvcnMgb2Ygc2VwZXJhdGUgZWxlbWVudHMuXG5cdFx0QF9pbnB1dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJpbnB1dFwiICsgQGlkXG5cblx0XHQjIEFsbCBpbmhlcml0ZWQgcHJvcGVydGllc1xuXHRcdHRleHRQcm9wZXJ0aWVzID1cblx0XHRcdHtAdGV4dCwgQGZvbnRGYW1pbHksIEBmb250U2l6ZSwgQGxpbmVIZWlnaHQsIEBmb250V2VpZ2h0LCBAY29sb3IsIEBiYWNrZ3JvdW5kQ29sb3IsIEB3aWR0aCwgQGhlaWdodCwgQHBhZGRpbmcsIEBwYXJlbnR9XG5cblx0XHRmb3IgcHJvcGVydHksIHZhbHVlIG9mIHRleHRQcm9wZXJ0aWVzXG5cblx0XHRcdEBvbiBcImNoYW5nZToje3Byb3BlcnR5fVwiLCAodmFsdWUpID0+XG5cdFx0XHRcdCMgUmVzZXQgdGV4dExheWVyIGNvbnRlbnRzXG5cdFx0XHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHRcdFx0cmV0dXJuIGlmIEBfaXNEZXNpZ25MYXllclxuXHRcdFx0XHRAX3NldFRleHRQcm9wZXJ0aWVzKEApXG5cdFx0XHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihAX2lkLCBAY29sb3IpXG5cblxuXHRcdCMgU2V0IGRlZmF1bHQgcGxhY2Vob2xkZXJcblx0XHRAX3NldFBsYWNlaG9sZGVyKEB0ZXh0KVxuXHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihAX2lkLCBAY29sb3IpXG5cblx0XHQjIFJlc2V0IHRleHRMYXllciBjb250ZW50c1xuXHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHQjIENoZWNrIGlmIGluIGZvY3VzXG5cdFx0QF9pc0ZvY3VzZWQgPSBmYWxzZVxuXG5cdFx0IyBEZWZhdWx0IGZvY3VzIGludGVyYWN0aW9uXG5cdFx0QF9pbnB1dEVsZW1lbnQub25mb2N1cyA9IChlKSA9PlxuXG5cdFx0XHRAZm9jdXNDb2xvciA/PSBcIiMwMDBcIlxuXG5cdFx0XHQjIEVtaXQgZm9jdXMgZXZlbnRcblx0XHRcdEBlbWl0KEV2ZW50cy5JbnB1dEZvY3VzLCBldmVudClcblxuXHRcdFx0QF9pc0ZvY3VzZWQgPSB0cnVlXG5cblx0XHQjIEVtaXQgYmx1ciBldmVudFxuXHRcdEBfaW5wdXRFbGVtZW50Lm9uYmx1ciA9IChlKSA9PlxuXHRcdFx0QGVtaXQoRXZlbnRzLklucHV0Qmx1ciwgZXZlbnQpXG5cblx0XHRcdEBfaXNGb2N1c2VkID0gZmFsc2VcblxuXHRcdCMgVG8gZmlsdGVyIGlmIHZhbHVlIGNoYW5nZWQgbGF0ZXJcblx0XHRjdXJyZW50VmFsdWUgPSB1bmRlZmluZWRcblxuXHRcdCMgU3RvcmUgY3VycmVudCB2YWx1ZVxuXHRcdEBfaW5wdXRFbGVtZW50Lm9ua2V5ZG93biA9IChlKSA9PlxuXHRcdFx0Y3VycmVudFZhbHVlID0gQHZhbHVlXG5cblx0XHRcdCMgSWYgY2FwcyBsb2NrIGtleSBpcyBwcmVzc2VkIGRvd25cblx0XHRcdGlmIGUud2hpY2ggaXMgMjBcblx0XHRcdFx0QGVtaXQoRXZlbnRzLkNhcHNMb2NrS2V5LCBldmVudClcblxuXHRcdFx0IyBJZiBzaGlmdCBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyAxNlxuXHRcdFx0XHRAZW1pdChFdmVudHMuU2hpZnRLZXksIGV2ZW50KVxuXG5cdFx0QF9pbnB1dEVsZW1lbnQub25rZXl1cCA9IChlKSA9PlxuXG5cdFx0XHRpZiBjdXJyZW50VmFsdWUgaXNudCBAdmFsdWVcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6dmFsdWVcIiwgQHZhbHVlKVxuXHRcdFx0XHRAZW1pdChFdmVudHMuVmFsdWVDaGFuZ2UsIEB2YWx1ZSlcblxuXHRcdFx0IyBJZiBlbnRlciBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyAxM1xuXHRcdFx0XHRAZW1pdChFdmVudHMuRW50ZXJLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIGJhY2tzcGFjZSBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyA4XG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5CYWNrc3BhY2VLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIHNwYWNlIGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDMyXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5TcGFjZUtleSwgZXZlbnQpXG5cblx0XHRcdCMgSWYgY2FwcyBsb2NrIGtleSBpcyBwcmVzc2VkIHVwXG5cdFx0XHRpZiBlLndoaWNoIGlzIDIwXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5DYXBzTG9ja0tleSwgZXZlbnQpXG5cblx0X3NldFBsYWNlaG9sZGVyOiAodGV4dCkgPT5cblx0XHRAX2lucHV0RWxlbWVudC5wbGFjZWhvbGRlciA9IHRleHRcblxuXHRfc2V0UGxhY2Vob2xkZXJDb2xvcjogKGlkLCBjb2xvcikgLT5cblx0XHRkb2N1bWVudC5zdHlsZVNoZWV0c1swXS5hZGRSdWxlKFwiLmlucHV0I3tpZH06Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXJcIiwgXCJjb2xvcjogI3tjb2xvcn1cIilcblxuXHRfY2hlY2tEZXZpY2VQaXhlbFJhdGlvOiAtPlxuXHRcdHJhdGlvID0gKFNjcmVlbi53aWR0aCAvIEZyYW1lci5EZXZpY2Uuc2NyZWVuLndpZHRoKVxuXHRcdGlmIFV0aWxzLmlzRGVza3RvcCgpXG5cdFx0XHQjIEAzeFxuXHRcdFx0aWYgcmF0aW8gPCAwLjUgYW5kIHJhdGlvID4gMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gcmF0aW9cblx0XHRcdCMgQDR4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIChyYXRpbyAqIDIpXG5cdFx0XHQjIEAxeCwgQDJ4XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRwciA9IFV0aWxzLmRldmljZVBpeGVsUmF0aW8oKVxuXHRcdFx0aWYgRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlIGlzIFwiZnVsbHNjcmVlblwiXG5cdFx0XHRcdGRwciA9IDJcblx0XHRlbHNlXG5cdFx0XHQjIEAzeFxuXHRcdFx0aWYgcmF0aW8gPCAwLjUgYW5kIHJhdGlvID4gMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gcmF0aW9cblx0XHRcdCMgQDR4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIChyYXRpbyAqIDIpXG5cdFx0XHQjIEAxeCwgQDJ4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuNVxuXHRcdFx0XHRkcHIgPSAxXG5cblx0XHRyZXR1cm4gZHByXG5cblx0X3NldFRleHRQcm9wZXJ0aWVzOiAobGF5ZXIpID0+XG5cblx0XHRkcHIgPSBAX2NoZWNrRGV2aWNlUGl4ZWxSYXRpbygpXG5cblx0XHRpZiBub3QgQF9pc0Rlc2lnbkxheWVyXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250RmFtaWx5ID0gbGF5ZXIuZm9udEZhbWlseVxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSBcIiN7bGF5ZXIuZm9udFNpemUgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IGxheWVyLmZvbnRXZWlnaHQgPyBcIm5vcm1hbFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nVG9wID0gXCIje2xheWVyLnBhZGRpbmcudG9wICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIiN7bGF5ZXIucGFkZGluZy5ib3R0b20gKiAyIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIiN7bGF5ZXIucGFkZGluZy5yaWdodCAqIDIgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSBcIiN7bGF5ZXIucGFkZGluZy5sZWZ0ICogMiAvIGRwcn1weFwiXG5cblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53aWR0aCA9IFwiI3soKGxheWVyLndpZHRoIC0gbGF5ZXIucGFkZGluZy5sZWZ0ICogMikgKiAyIC8gZHByKX1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIje2xheWVyLmhlaWdodCAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidHJhbnNwYXJlbnRcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmN1cnNvciA9IFwiYXV0b1wiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUud2Via2l0QXBwZWFyYW5jZSA9IFwibm9uZVwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucmVzaXplID0gXCJub25lXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53ZWJraXRGb250U21vb3RoaW5nID0gXCJhbnRpYWxpYXNlZFwiXG5cblx0YWRkQmFja2dyb3VuZExheWVyOiAobGF5ZXIpIC0+XG5cdFx0QF9iYWNrZ3JvdW5kID0gbGF5ZXJcblx0XHRAX2JhY2tncm91bmQucGFyZW50ID0gQFxuXHRcdEBfYmFja2dyb3VuZC5uYW1lID0gXCJiYWNrZ3JvdW5kXCJcblx0XHRAX2JhY2tncm91bmQueCA9IEBfYmFja2dyb3VuZC55ID0gMFxuXHRcdEBfYmFja2dyb3VuZC5fZWxlbWVudC5hcHBlbmRDaGlsZChAX2lucHV0RWxlbWVudClcblxuXHRcdHJldHVybiBAX2JhY2tncm91bmRcblxuXHRhZGRQbGFjZUhvbGRlckxheWVyOiAobGF5ZXIpIC0+XG5cblx0XHRAX2lzRGVzaWduTGF5ZXIgPSB0cnVlXG5cdFx0QF9pbnB1dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJpbnB1dFwiICsgbGF5ZXIuaWRcblx0XHRAcGFkZGluZyA9IGxlZnQ6IDAsIHRvcDogMFxuXG5cdFx0QF9zZXRQbGFjZWhvbGRlcihsYXllci50ZXh0KVxuXHRcdEBfc2V0VGV4dFByb3BlcnRpZXMobGF5ZXIpXG5cdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKGxheWVyLmlkLCBsYXllci5jb2xvcilcblxuXHRcdEBvbiBcImNoYW5nZTpjb2xvclwiLCA9PlxuXHRcdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKGxheWVyLmlkLCBAY29sb3IpXG5cblx0XHQjIFJlbW92ZSBvcmlnaW5hbCBsYXllclxuXHRcdGxheWVyLnZpc2libGUgPSBmYWxzZVxuXHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHQjIENvbnZlcnQgcG9zaXRpb24gdG8gcGFkZGluZ1xuXHRcdGRwciA9IEBfY2hlY2tEZXZpY2VQaXhlbFJhdGlvKClcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IFwiI3tsYXllci5mb250U2l6ZSAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7bGF5ZXIueSAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIje2xheWVyLnggKiAyIC8gZHByfXB4XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53aWR0aCA9IFwiI3soQF9iYWNrZ3JvdW5kLndpZHRoIC0gbGF5ZXIueCAqIDIpICogMiAvIGRwcn1weFwiXG5cblx0XHRpZiBAbXVsdGlMaW5lXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIiN7QF9iYWNrZ3JvdW5kLmhlaWdodCAqIDIgLyBkcHJ9cHhcIlxuXG5cdFx0QG9uIFwiY2hhbmdlOnBhZGRpbmdcIiwgPT5cblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7QHBhZGRpbmcudG9wICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiI3tAcGFkZGluZy5sZWZ0ICogMiAvIGRwcn1weFwiXG5cblx0XHRyZXR1cm4gQF9wbGFjZWhvbGRlclxuXG5cdGZvY3VzOiAtPlxuXHRcdEBfaW5wdXRFbGVtZW50LmZvY3VzKClcblxuXHRAZGVmaW5lIFwidmFsdWVcIixcblx0XHRnZXQ6IC0+IEBfaW5wdXRFbGVtZW50LnZhbHVlXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC52YWx1ZSA9IHZhbHVlXG5cblx0QGRlZmluZSBcImZvY3VzQ29sb3JcIixcblx0XHRnZXQ6IC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5jb2xvclxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuY29sb3IgPSB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJtdWx0aUxpbmVcIiwgQHNpbXBsZVByb3BlcnR5KFwibXVsdGlMaW5lXCIsIGZhbHNlKVxuXG5cdCMgTmV3IENvbnN0cnVjdG9yXG5cdEB3cmFwID0gKGJhY2tncm91bmQsIHBsYWNlaG9sZGVyLCBvcHRpb25zKSAtPlxuXHRcdHJldHVybiB3cmFwSW5wdXQobmV3IEAob3B0aW9ucyksIGJhY2tncm91bmQsIHBsYWNlaG9sZGVyLCBvcHRpb25zKVxuXG5cdG9uRW50ZXJLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5FbnRlcktleSwgY2IpXG5cdG9uU3BhY2VLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5TcGFjZUtleSwgY2IpXG5cdG9uQmFja3NwYWNlS2V5OiAoY2IpIC0+IEBvbihFdmVudHMuQmFja3NwYWNlS2V5LCBjYilcblx0b25DYXBzTG9ja0tleTogKGNiKSAtPiBAb24oRXZlbnRzLkNhcHNMb2NrS2V5LCBjYilcblx0b25TaGlmdEtleTogKGNiKSAtPiBAb24oRXZlbnRzLlNoaWZ0S2V5LCBjYilcblx0b25WYWx1ZUNoYW5nZTogKGNiKSAtPiBAb24oRXZlbnRzLlZhbHVlQ2hhbmdlLCBjYilcblx0b25JbnB1dEZvY3VzOiAoY2IpIC0+IEBvbihFdmVudHMuSW5wdXRGb2N1cywgY2IpXG5cdG9uSW5wdXRCbHVyOiAoY2IpIC0+IEBvbihFdmVudHMuSW5wdXRCbHVyLCBjYilcblxud3JhcElucHV0ID0gKGluc3RhbmNlLCBiYWNrZ3JvdW5kLCBwbGFjZWhvbGRlcikgLT5cblx0aWYgbm90IChiYWNrZ3JvdW5kIGluc3RhbmNlb2YgTGF5ZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5wdXRMYXllciBleHBlY3RzIGEgYmFja2dyb3VuZCBsYXllci5cIilcblxuXHRpZiBub3QgKHBsYWNlaG9sZGVyIGluc3RhbmNlb2YgVGV4dExheWVyKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIklucHV0TGF5ZXIgZXhwZWN0cyBhIHRleHQgbGF5ZXIuXCIpXG5cblx0aW5wdXQgPSBpbnN0YW5jZVxuXG5cdGlucHV0Ll9fZnJhbWVySW5zdGFuY2VJbmZvID89IHt9XG5cdGlucHV0Ll9fZnJhbWVySW5zdGFuY2VJbmZvPy5uYW1lID0gaW5zdGFuY2UuY29uc3RydWN0b3IubmFtZVxuXG5cdGlucHV0LmZyYW1lID0gYmFja2dyb3VuZC5mcmFtZVxuXHRpbnB1dC5wYXJlbnQgPSBiYWNrZ3JvdW5kLnBhcmVudFxuXHRpbnB1dC5pbmRleCA9IGJhY2tncm91bmQuaW5kZXhcblxuXHRpbnB1dC5hZGRCYWNrZ3JvdW5kTGF5ZXIoYmFja2dyb3VuZClcblx0aW5wdXQuYWRkUGxhY2VIb2xkZXJMYXllcihwbGFjZWhvbGRlcilcblxuXHRyZXR1cm4gaW5wdXQiLCJleHBvcnRzLmF1dG9TdWdnZXN0ID0gKGlucHV0LCBtYXhSZXN1bHRzLCB0eXBlKSAtPlxuXHRcblx0IyBTZXQgZGVmYXVsdHNcblx0bWF4UmVzdWx0cyA9IDUgaWYgbWF4UmVzdWx0cyBpcyBudWxsXG5cdFxuXHQjIFR5cGUgY2FuIGJlIGdlbWVlbnRlLCB3b29ucGxhYXRzLCB3ZWcsIHBvc3Rjb2RlLCBhZHJlcywgaGVjdG9tZXRlcnBhYWwsIG9yIHBlcmNlZWwuXG5cdHR5cGUgPSBcImFkcmVzXCIgaWYgdHlwZSBpcyBudWxsXG5cblx0IyBTZWFyY2ggc3VnZ2VzdGlvbiBMYXllclxuXHRzZWFyY2hTdWdnZXN0aW9ucyA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBpbnB1dC53aWR0aFxuXHRcdGhlaWdodDogMFxuXHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdHk6IGlucHV0Lm1heFlcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRzaGFkb3dDb2xvcjogXCJyZ2JhKDAsMCwwLDAuMilcIlxuXHRcdHNoYWRvd1k6IDFcblx0XHRzaGFkb3dCbHVyOiAzXG5cdFx0Ym9yZGVyQ29sb3I6IFwiI2VkZWRlZFwiXG5cdFx0dmlzaWJsZTogZmFsc2Vcblx0c2VhcmNoU3VnZ2VzdGlvbnMuc2VuZFRvQmFjaygpXG5cblx0IyBDcmVhdGUgaXRlbSBDbGFzc1xuXHRjbGFzcyByZXN1bHRJdGVtIGV4dGVuZHMgTGF5ZXJcblx0XHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdGZvbnRTaXplOiBcIjE2cHhcIlxuXHRcdFx0XHRcdGxpbmVIZWlnaHQ6IFwiI3s0OCAvIDE2fXB4XCJcblx0XHRcdFx0XHRjb2xvcjogXCIjMzMzXCJcblx0XHRcdFx0XHRwYWRkaW5nVG9wOiBcIjI0cHhcIlxuXHRcdFx0XHRcdHBhZGRpbmdMZWZ0OiBcIjE2cHhcIlxuXHRcdFx0XHRcdHBhZGRpbmdSaWdodDogXCIxNnB4XCJcblx0XHRcdFx0XHRib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkICNjY2NcIlxuXHRcdFx0XHRcdHdoaXRlU3BhY2U6IFwibm93cmFwXCJcblx0XHRcdFx0XHRvdmVyZmxvdzogXCJoaWRkZW5cIlxuXHRcdFx0XHRcdHRleHRPdmVyZmxvdzogXCJlbGxpcHNpc1wiXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiXG5cdFx0XHRcdHJlc3VsdDogXCJWb29yYmVlbGRcIlxuXG5cdFx0XHRAcmVzdWx0ID0gb3B0aW9ucy5yZXN1bHRcblxuXG5cblx0IyBQRE9LXG5cdHBkb2tVUkwgPSBcImh0dHBzOi8vZ2VvZGF0YS5uYXRpb25hYWxnZW9yZWdpc3Rlci5ubC9sb2NhdGllc2VydmVyL3YzL3N1Z2dlc3Q/cT1cIlxuXHRcblx0Z2V0U2VhcmNoU3VnZ2VzdGlvbnMgPSAoaW5wdXQpIC0+XG5cdFx0c3VnZ2VzdGlvblJlc3VsdHMgPSBbXVxuXHRcdFxuXHRcdHJlc3VsdHNIZWlnaHQgPSAwXG5cdFx0XG5cdFx0Zm9yIGl0ZW0saSBpbiBzZWFyY2hTdWdnZXN0aW9ucy5jaGlsZHJlblxuXHRcdFx0aXRlbS5kZXN0cm95KClcblx0XHRcdFxuXHRcdGlmIGlucHV0LnZhbHVlLmxlbmd0aCA+PSAyXG5cdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5icmluZ1RvRnJvbnQoKVxuXHRcdFx0c2VhcmNoU3VnZ2VzdGlvbnMueSA9IGlucHV0LnNjcmVlbkZyYW1lLnkgKyBpbnB1dC5oZWlnaHQgKyA4XG5cdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0ZW5kcG9pbnQgPSBVdGlscy5kb21Mb2FkSlNPTlN5bmMgcGRva1VSTCArIGlucHV0LnZhbHVlICsgXCIgYW5kIHR5cGU6I3t0eXBlfVwiXG5cdFx0XHRyZXN1bHRzID0gZW5kcG9pbnQucmVzcG9uc2UuZG9jc1xuXHRcdFx0aGlnaGxpZ2h0aW5nID0gZW5kcG9pbnQuaGlnaGxpZ2h0aW5nXG5cblx0XHRcdFxuXHRcdFx0Zm9yIHJlc3VsdCwgaW5kZXggaW4gcmVzdWx0c1swLi4ubWF4UmVzdWx0c11cblx0XHRcdFx0aWQgPSByZXN1bHQuaWRcblxuXHRcdFx0XHRpdGVtID0gbmV3IHJlc3VsdEl0ZW1cblx0XHRcdFx0XHRwYXJlbnQ6IHNlYXJjaFN1Z2dlc3Rpb25zXG5cdFx0XHRcdFx0d2lkdGg6IHNlYXJjaFN1Z2dlc3Rpb25zLndpZHRoXG5cdFx0XHRcdFx0aGVpZ2h0OiA0OFxuXHRcdFx0XHRcdHk6IDQ4ICogaW5kZXhcblx0XHRcdFx0XHRodG1sOiBoaWdobGlnaHRpbmdbaWRdLnN1Z2dlc3Rcblx0XHRcdFx0XHRyZXN1bHQ6IHJlc3VsdC53ZWVyZ2F2ZW5hYW1cblx0XHRcdFx0XG5cdFx0XHRcdGlmIGluZGV4IGlzIG1heFJlc3VsdHMgLSAxXG5cdFx0XHRcdFx0aXRlbS5zdHlsZS5ib3JkZXJCb3R0b20gPSBcIlwiXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXN1bHRzSGVpZ2h0ICs9IDQ4XG5cdFx0XHRcdFxuXHRcdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5oZWlnaHQgPSByZXN1bHRzSGVpZ2h0XG5cdFx0XHRcdFxuXHRcdFx0XHRpdGVtLm9uVGFwIC0+XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgQHJlc3VsdFxuXHRcdFx0XHRcdGlucHV0LnZhbHVlID0gQHJlc3VsdFxuXHRcdFx0XHRcdHNlYXJjaFN1Z2dlc3Rpb25zLnNlbmRUb0JhY2soKVxuXHRcdFx0XHRcdHNlYXJjaFN1Z2dlc3Rpb25zLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRpbnB1dC5vbklucHV0Qmx1ciAtPlxuXHRcdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5zZW5kVG9CYWNrKClcblx0XHRcdGlucHV0Lm9uSW5wdXRGb2N1cyAtPlxuXHRcdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5icmluZ1RvRnJvbnQoKVxuXHRcdGVsc2Vcblx0XHRcdHNlYXJjaFN1Z2dlc3Rpb25zLnNlbmRUb0JhY2soKVxuXHRcdFx0c2VhcmNoU3VnZ2VzdGlvbnMuaGVpZ2h0ID0gMFxuXHRcblx0XG5cdGlucHV0Lm9uVmFsdWVDaGFuZ2UgLT5cblx0XHRnZXRTZWFyY2hTdWdnZXN0aW9ucyhAKSIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBRUFBO0FEQUEsSUFBQTs7O0FBQUEsT0FBTyxDQUFDLFdBQVIsR0FBc0IsU0FBQyxLQUFELEVBQVEsVUFBUixFQUFvQixJQUFwQjtBQUdyQixNQUFBO0VBQUEsSUFBa0IsVUFBQSxLQUFjLElBQWhDO0lBQUEsVUFBQSxHQUFhLEVBQWI7O0VBR0EsSUFBa0IsSUFBQSxLQUFRLElBQTFCO0lBQUEsSUFBQSxHQUFPLFFBQVA7O0VBR0EsaUJBQUEsR0FBd0IsSUFBQSxLQUFBLENBQ3ZCO0lBQUEsS0FBQSxFQUFPLEtBQUssQ0FBQyxLQUFiO0lBQ0EsTUFBQSxFQUFRLENBRFI7SUFFQSxDQUFBLEVBQUcsS0FBSyxDQUFDLE1BRlQ7SUFHQSxDQUFBLEVBQUcsS0FBSyxDQUFDLElBSFQ7SUFJQSxlQUFBLEVBQWlCLElBSmpCO0lBS0EsV0FBQSxFQUFhLGlCQUxiO0lBTUEsT0FBQSxFQUFTLENBTlQ7SUFPQSxVQUFBLEVBQVksQ0FQWjtJQVFBLFdBQUEsRUFBYSxTQVJiO0lBU0EsT0FBQSxFQUFT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
