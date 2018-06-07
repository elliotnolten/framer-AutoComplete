require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"autosuggest":[function(require,module,exports){
exports.autoSuggest = function(input, maxResults, type) {
  var getSearchSuggestions, pdokURL, searchSuggestions;
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
        item = new Layer({
          parent: searchSuggestions,
          width: searchSuggestions.width,
          height: 48,
          html: highlighting[id].suggest,
          style: {
            fontSize: "16px",
            lineHeight: (48 / 16) + "px",
            color: "#333",
            paddingTop: "24px",
            paddingLeft: "16px",
            paddingRight: "16px",
            borderBottom: "1px solid #ccc",
            width: (input.width - 32) + "px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          },
          y: 48 * index,
          backgroundColor: "white"
        });
        if (index === maxResults - 1) {
          item.style.borderBottom = "";
        }
        resultsHeight += 48;
        searchSuggestions.height = resultsHeight;
        item.onClick(function() {
          input.value = result.weergavenaam;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2VsbGlvdG5vbHRlbi9Qcml2YXRlL2ZyYW1lci1BdXRvU3VnZ2VzdC9hZGRyZXNzLWF1dG8tc3VnZ2VzdC5mcmFtZXIvbW9kdWxlcy9pbnB1dC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9lbGxpb3Rub2x0ZW4vUHJpdmF0ZS9mcmFtZXItQXV0b1N1Z2dlc3QvYWRkcmVzcy1hdXRvLXN1Z2dlc3QuZnJhbWVyL21vZHVsZXMvYXV0b3N1Z2dlc3QuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudHMuRW50ZXJLZXkgPSBcIkVudGVyS2V5XCJcbkV2ZW50cy5TcGFjZUtleSA9IFwiU3BhY2VLZXlcIlxuRXZlbnRzLkJhY2tzcGFjZUtleSA9IFwiQmFja3NwYWNlS2V5XCJcbkV2ZW50cy5DYXBzTG9ja0tleSA9IFwiQ2Fwc0xvY2tLZXlcIlxuRXZlbnRzLlNoaWZ0S2V5ID0gXCJTaGlmdEtleVwiXG5FdmVudHMuVmFsdWVDaGFuZ2UgPSBcIlZhbHVlQ2hhbmdlXCJcbkV2ZW50cy5JbnB1dEZvY3VzID0gXCJJbnB1dEZvY3VzXCJcbkV2ZW50cy5JbnB1dEJsdXIgPSBcIklucHV0Qmx1clwiXG5cbmNsYXNzIGV4cG9ydHMuSW5wdXRMYXllciBleHRlbmRzIFRleHRMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblxuXHRcdF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjRkZGXCJcblx0XHRcdHdpZHRoOiAzNzVcblx0XHRcdGhlaWdodDogNjBcblx0XHRcdHBhZGRpbmc6XG5cdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHR0ZXh0OiBcIlR5cGUgc29tZXRoaW5nLi4uXCJcblx0XHRcdGZvbnRTaXplOiA0MFxuXHRcdFx0Zm9udFdlaWdodDogMzAwXG5cblx0XHRpZiBvcHRpb25zLm11bHRpTGluZVxuXHRcdFx0b3B0aW9ucy5wYWRkaW5nLnRvcCA/PSAyMFxuXG5cdFx0QF9pbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIlxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0IyBHbG9iYWxzXG5cdFx0QF9iYWNrZ3JvdW5kID0gdW5kZWZpbmVkXG5cdFx0QF9wbGFjZWhvbGRlciA9IHVuZGVmaW5lZFxuXHRcdEBfaXNEZXNpZ25MYXllciA9IGZhbHNlXG5cblx0XHQjIExheWVyIGNvbnRhaW5pbmcgaW5wdXQgZWxlbWVudFxuXHRcdEBpbnB1dCA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRcdG5hbWU6IFwiaW5wdXRcIlxuXHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0aGVpZ2h0OiBAaGVpZ2h0XG5cdFx0XHRwYXJlbnQ6IEBcblxuXHRcdCMgVGV4dCBhcmVhXG5cdFx0aWYgQG11bHRpTGluZVxuXHRcdFx0QF9pbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIilcblxuXHRcdCMgQXBwZW5kIGVsZW1lbnRcblx0XHRAaW5wdXQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoQF9pbnB1dEVsZW1lbnQpXG5cblx0XHQjIE1hdGNoIFRleHRMYXllciBkZWZhdWx0cyBhbmQgdHlwZSBwcm9wZXJ0aWVzXG5cdFx0QF9zZXRUZXh0UHJvcGVydGllcyhAKVxuXG5cdFx0IyBTZXQgYXR0cmlidXRlc1xuXHRcdEBfaW5wdXRFbGVtZW50LmF1dG9jb21wbGV0ZSA9IFwib2ZmXCJcblx0XHRAX2lucHV0RWxlbWVudC5hdXRvY29ycmVjdCA9IFwib2ZmXCJcblx0XHRAX2lucHV0RWxlbWVudC5zcGVsbGNoZWNrID0gZmFsc2VcblxuXHRcdCMgVGhlIGlkIHNlcnZlcyB0byBkaWZmZXJlbnRpYXRlIG11bHRpcGxlIGlucHV0IGVsZW1lbnRzIGZyb20gb25lIGFub3RoZXIuXG5cdFx0IyBUbyBhbGxvdyBzdHlsaW5nIHRoZSBwbGFjZWhvbGRlciBjb2xvcnMgb2Ygc2VwZXJhdGUgZWxlbWVudHMuXG5cdFx0QF9pbnB1dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJpbnB1dFwiICsgQGlkXG5cblx0XHQjIEFsbCBpbmhlcml0ZWQgcHJvcGVydGllc1xuXHRcdHRleHRQcm9wZXJ0aWVzID1cblx0XHRcdHtAdGV4dCwgQGZvbnRGYW1pbHksIEBmb250U2l6ZSwgQGxpbmVIZWlnaHQsIEBmb250V2VpZ2h0LCBAY29sb3IsIEBiYWNrZ3JvdW5kQ29sb3IsIEB3aWR0aCwgQGhlaWdodCwgQHBhZGRpbmcsIEBwYXJlbnR9XG5cblx0XHRmb3IgcHJvcGVydHksIHZhbHVlIG9mIHRleHRQcm9wZXJ0aWVzXG5cblx0XHRcdEBvbiBcImNoYW5nZToje3Byb3BlcnR5fVwiLCAodmFsdWUpID0+XG5cdFx0XHRcdCMgUmVzZXQgdGV4dExheWVyIGNvbnRlbnRzXG5cdFx0XHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHRcdFx0cmV0dXJuIGlmIEBfaXNEZXNpZ25MYXllclxuXHRcdFx0XHRAX3NldFRleHRQcm9wZXJ0aWVzKEApXG5cdFx0XHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihAX2lkLCBAY29sb3IpXG5cblxuXHRcdCMgU2V0IGRlZmF1bHQgcGxhY2Vob2xkZXJcblx0XHRAX3NldFBsYWNlaG9sZGVyKEB0ZXh0KVxuXHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihAX2lkLCBAY29sb3IpXG5cblx0XHQjIFJlc2V0IHRleHRMYXllciBjb250ZW50c1xuXHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHQjIENoZWNrIGlmIGluIGZvY3VzXG5cdFx0QF9pc0ZvY3VzZWQgPSBmYWxzZVxuXG5cdFx0IyBEZWZhdWx0IGZvY3VzIGludGVyYWN0aW9uXG5cdFx0QF9pbnB1dEVsZW1lbnQub25mb2N1cyA9IChlKSA9PlxuXG5cdFx0XHRAZm9jdXNDb2xvciA/PSBcIiMwMDBcIlxuXG5cdFx0XHQjIEVtaXQgZm9jdXMgZXZlbnRcblx0XHRcdEBlbWl0KEV2ZW50cy5JbnB1dEZvY3VzLCBldmVudClcblxuXHRcdFx0QF9pc0ZvY3VzZWQgPSB0cnVlXG5cblx0XHQjIEVtaXQgYmx1ciBldmVudFxuXHRcdEBfaW5wdXRFbGVtZW50Lm9uYmx1ciA9IChlKSA9PlxuXHRcdFx0QGVtaXQoRXZlbnRzLklucHV0Qmx1ciwgZXZlbnQpXG5cblx0XHRcdEBfaXNGb2N1c2VkID0gZmFsc2VcblxuXHRcdCMgVG8gZmlsdGVyIGlmIHZhbHVlIGNoYW5nZWQgbGF0ZXJcblx0XHRjdXJyZW50VmFsdWUgPSB1bmRlZmluZWRcblxuXHRcdCMgU3RvcmUgY3VycmVudCB2YWx1ZVxuXHRcdEBfaW5wdXRFbGVtZW50Lm9ua2V5ZG93biA9IChlKSA9PlxuXHRcdFx0Y3VycmVudFZhbHVlID0gQHZhbHVlXG5cblx0XHRcdCMgSWYgY2FwcyBsb2NrIGtleSBpcyBwcmVzc2VkIGRvd25cblx0XHRcdGlmIGUud2hpY2ggaXMgMjBcblx0XHRcdFx0QGVtaXQoRXZlbnRzLkNhcHNMb2NrS2V5LCBldmVudClcblxuXHRcdFx0IyBJZiBzaGlmdCBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyAxNlxuXHRcdFx0XHRAZW1pdChFdmVudHMuU2hpZnRLZXksIGV2ZW50KVxuXG5cdFx0QF9pbnB1dEVsZW1lbnQub25rZXl1cCA9IChlKSA9PlxuXG5cdFx0XHRpZiBjdXJyZW50VmFsdWUgaXNudCBAdmFsdWVcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6dmFsdWVcIiwgQHZhbHVlKVxuXHRcdFx0XHRAZW1pdChFdmVudHMuVmFsdWVDaGFuZ2UsIEB2YWx1ZSlcblxuXHRcdFx0IyBJZiBlbnRlciBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyAxM1xuXHRcdFx0XHRAZW1pdChFdmVudHMuRW50ZXJLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIGJhY2tzcGFjZSBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyA4XG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5CYWNrc3BhY2VLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIHNwYWNlIGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDMyXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5TcGFjZUtleSwgZXZlbnQpXG5cblx0XHRcdCMgSWYgY2FwcyBsb2NrIGtleSBpcyBwcmVzc2VkIHVwXG5cdFx0XHRpZiBlLndoaWNoIGlzIDIwXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5DYXBzTG9ja0tleSwgZXZlbnQpXG5cblx0X3NldFBsYWNlaG9sZGVyOiAodGV4dCkgPT5cblx0XHRAX2lucHV0RWxlbWVudC5wbGFjZWhvbGRlciA9IHRleHRcblxuXHRfc2V0UGxhY2Vob2xkZXJDb2xvcjogKGlkLCBjb2xvcikgLT5cblx0XHRkb2N1bWVudC5zdHlsZVNoZWV0c1swXS5hZGRSdWxlKFwiLmlucHV0I3tpZH06Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXJcIiwgXCJjb2xvcjogI3tjb2xvcn1cIilcblxuXHRfY2hlY2tEZXZpY2VQaXhlbFJhdGlvOiAtPlxuXHRcdHJhdGlvID0gKFNjcmVlbi53aWR0aCAvIEZyYW1lci5EZXZpY2Uuc2NyZWVuLndpZHRoKVxuXHRcdGlmIFV0aWxzLmlzRGVza3RvcCgpXG5cdFx0XHQjIEAzeFxuXHRcdFx0aWYgcmF0aW8gPCAwLjUgYW5kIHJhdGlvID4gMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gcmF0aW9cblx0XHRcdCMgQDR4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIChyYXRpbyAqIDIpXG5cdFx0XHQjIEAxeCwgQDJ4XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRwciA9IFV0aWxzLmRldmljZVBpeGVsUmF0aW8oKVxuXHRcdFx0aWYgRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlIGlzIFwiZnVsbHNjcmVlblwiXG5cdFx0XHRcdGRwciA9IDJcblx0XHRlbHNlXG5cdFx0XHQjIEAzeFxuXHRcdFx0aWYgcmF0aW8gPCAwLjUgYW5kIHJhdGlvID4gMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gcmF0aW9cblx0XHRcdCMgQDR4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIChyYXRpbyAqIDIpXG5cdFx0XHQjIEAxeCwgQDJ4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuNVxuXHRcdFx0XHRkcHIgPSAxXG5cblx0XHRyZXR1cm4gZHByXG5cblx0X3NldFRleHRQcm9wZXJ0aWVzOiAobGF5ZXIpID0+XG5cblx0XHRkcHIgPSBAX2NoZWNrRGV2aWNlUGl4ZWxSYXRpbygpXG5cblx0XHRpZiBub3QgQF9pc0Rlc2lnbkxheWVyXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250RmFtaWx5ID0gbGF5ZXIuZm9udEZhbWlseVxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSBcIiN7bGF5ZXIuZm9udFNpemUgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IGxheWVyLmZvbnRXZWlnaHQgPyBcIm5vcm1hbFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nVG9wID0gXCIje2xheWVyLnBhZGRpbmcudG9wICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIiN7bGF5ZXIucGFkZGluZy5ib3R0b20gKiAyIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIiN7bGF5ZXIucGFkZGluZy5yaWdodCAqIDIgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSBcIiN7bGF5ZXIucGFkZGluZy5sZWZ0ICogMiAvIGRwcn1weFwiXG5cblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53aWR0aCA9IFwiI3soKGxheWVyLndpZHRoIC0gbGF5ZXIucGFkZGluZy5sZWZ0ICogMikgKiAyIC8gZHByKX1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIje2xheWVyLmhlaWdodCAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidHJhbnNwYXJlbnRcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmN1cnNvciA9IFwiYXV0b1wiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUud2Via2l0QXBwZWFyYW5jZSA9IFwibm9uZVwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucmVzaXplID0gXCJub25lXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53ZWJraXRGb250U21vb3RoaW5nID0gXCJhbnRpYWxpYXNlZFwiXG5cblx0YWRkQmFja2dyb3VuZExheWVyOiAobGF5ZXIpIC0+XG5cdFx0QF9iYWNrZ3JvdW5kID0gbGF5ZXJcblx0XHRAX2JhY2tncm91bmQucGFyZW50ID0gQFxuXHRcdEBfYmFja2dyb3VuZC5uYW1lID0gXCJiYWNrZ3JvdW5kXCJcblx0XHRAX2JhY2tncm91bmQueCA9IEBfYmFja2dyb3VuZC55ID0gMFxuXHRcdEBfYmFja2dyb3VuZC5fZWxlbWVudC5hcHBlbmRDaGlsZChAX2lucHV0RWxlbWVudClcblxuXHRcdHJldHVybiBAX2JhY2tncm91bmRcblxuXHRhZGRQbGFjZUhvbGRlckxheWVyOiAobGF5ZXIpIC0+XG5cblx0XHRAX2lzRGVzaWduTGF5ZXIgPSB0cnVlXG5cdFx0QF9pbnB1dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJpbnB1dFwiICsgbGF5ZXIuaWRcblx0XHRAcGFkZGluZyA9IGxlZnQ6IDAsIHRvcDogMFxuXG5cdFx0QF9zZXRQbGFjZWhvbGRlcihsYXllci50ZXh0KVxuXHRcdEBfc2V0VGV4dFByb3BlcnRpZXMobGF5ZXIpXG5cdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKGxheWVyLmlkLCBsYXllci5jb2xvcilcblxuXHRcdEBvbiBcImNoYW5nZTpjb2xvclwiLCA9PlxuXHRcdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKGxheWVyLmlkLCBAY29sb3IpXG5cblx0XHQjIFJlbW92ZSBvcmlnaW5hbCBsYXllclxuXHRcdGxheWVyLnZpc2libGUgPSBmYWxzZVxuXHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHQjIENvbnZlcnQgcG9zaXRpb24gdG8gcGFkZGluZ1xuXHRcdGRwciA9IEBfY2hlY2tEZXZpY2VQaXhlbFJhdGlvKClcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IFwiI3tsYXllci5mb250U2l6ZSAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7bGF5ZXIueSAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIje2xheWVyLnggKiAyIC8gZHByfXB4XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53aWR0aCA9IFwiI3soQF9iYWNrZ3JvdW5kLndpZHRoIC0gbGF5ZXIueCAqIDIpICogMiAvIGRwcn1weFwiXG5cblx0XHRpZiBAbXVsdGlMaW5lXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIiN7QF9iYWNrZ3JvdW5kLmhlaWdodCAqIDIgLyBkcHJ9cHhcIlxuXG5cdFx0QG9uIFwiY2hhbmdlOnBhZGRpbmdcIiwgPT5cblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7QHBhZGRpbmcudG9wICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiI3tAcGFkZGluZy5sZWZ0ICogMiAvIGRwcn1weFwiXG5cblx0XHRyZXR1cm4gQF9wbGFjZWhvbGRlclxuXG5cdGZvY3VzOiAtPlxuXHRcdEBfaW5wdXRFbGVtZW50LmZvY3VzKClcblxuXHRAZGVmaW5lIFwidmFsdWVcIixcblx0XHRnZXQ6IC0+IEBfaW5wdXRFbGVtZW50LnZhbHVlXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC52YWx1ZSA9IHZhbHVlXG5cblx0QGRlZmluZSBcImZvY3VzQ29sb3JcIixcblx0XHRnZXQ6IC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5jb2xvclxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuY29sb3IgPSB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJtdWx0aUxpbmVcIiwgQHNpbXBsZVByb3BlcnR5KFwibXVsdGlMaW5lXCIsIGZhbHNlKVxuXG5cdCMgTmV3IENvbnN0cnVjdG9yXG5cdEB3cmFwID0gKGJhY2tncm91bmQsIHBsYWNlaG9sZGVyLCBvcHRpb25zKSAtPlxuXHRcdHJldHVybiB3cmFwSW5wdXQobmV3IEAob3B0aW9ucyksIGJhY2tncm91bmQsIHBsYWNlaG9sZGVyLCBvcHRpb25zKVxuXG5cdG9uRW50ZXJLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5FbnRlcktleSwgY2IpXG5cdG9uU3BhY2VLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5TcGFjZUtleSwgY2IpXG5cdG9uQmFja3NwYWNlS2V5OiAoY2IpIC0+IEBvbihFdmVudHMuQmFja3NwYWNlS2V5LCBjYilcblx0b25DYXBzTG9ja0tleTogKGNiKSAtPiBAb24oRXZlbnRzLkNhcHNMb2NrS2V5LCBjYilcblx0b25TaGlmdEtleTogKGNiKSAtPiBAb24oRXZlbnRzLlNoaWZ0S2V5LCBjYilcblx0b25WYWx1ZUNoYW5nZTogKGNiKSAtPiBAb24oRXZlbnRzLlZhbHVlQ2hhbmdlLCBjYilcblx0b25JbnB1dEZvY3VzOiAoY2IpIC0+IEBvbihFdmVudHMuSW5wdXRGb2N1cywgY2IpXG5cdG9uSW5wdXRCbHVyOiAoY2IpIC0+IEBvbihFdmVudHMuSW5wdXRCbHVyLCBjYilcblxud3JhcElucHV0ID0gKGluc3RhbmNlLCBiYWNrZ3JvdW5kLCBwbGFjZWhvbGRlcikgLT5cblx0aWYgbm90IChiYWNrZ3JvdW5kIGluc3RhbmNlb2YgTGF5ZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5wdXRMYXllciBleHBlY3RzIGEgYmFja2dyb3VuZCBsYXllci5cIilcblxuXHRpZiBub3QgKHBsYWNlaG9sZGVyIGluc3RhbmNlb2YgVGV4dExheWVyKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIklucHV0TGF5ZXIgZXhwZWN0cyBhIHRleHQgbGF5ZXIuXCIpXG5cblx0aW5wdXQgPSBpbnN0YW5jZVxuXG5cdGlucHV0Ll9fZnJhbWVySW5zdGFuY2VJbmZvID89IHt9XG5cdGlucHV0Ll9fZnJhbWVySW5zdGFuY2VJbmZvPy5uYW1lID0gaW5zdGFuY2UuY29uc3RydWN0b3IubmFtZVxuXG5cdGlucHV0LmZyYW1lID0gYmFja2dyb3VuZC5mcmFtZVxuXHRpbnB1dC5wYXJlbnQgPSBiYWNrZ3JvdW5kLnBhcmVudFxuXHRpbnB1dC5pbmRleCA9IGJhY2tncm91bmQuaW5kZXhcblxuXHRpbnB1dC5hZGRCYWNrZ3JvdW5kTGF5ZXIoYmFja2dyb3VuZClcblx0aW5wdXQuYWRkUGxhY2VIb2xkZXJMYXllcihwbGFjZWhvbGRlcilcblxuXHRyZXR1cm4gaW5wdXQiLCJleHBvcnRzLmF1dG9TdWdnZXN0ID0gKGlucHV0LCBtYXhSZXN1bHRzLCB0eXBlKSAtPlxuXHRcblx0IyBTZXQgZGVmYXVsdHNcblx0bWF4UmVzdWx0cyA9IDUgaWYgbWF4UmVzdWx0cyBpcyBudWxsXG5cdFxuXHQjIFR5cGUgY2FuIGJlIGdlbWVlbnRlLCB3b29ucGxhYXRzLCB3ZWcsIHBvc3Rjb2RlLCBhZHJlcywgaGVjdG9tZXRlcnBhYWwsIG9yIHBlcmNlZWwuXG5cdHR5cGUgPSBcImFkcmVzXCIgaWYgdHlwZSBpcyBudWxsXG5cblx0IyBTZWFyY2ggc3VnZ2VzdGlvbiBMYXllclxuXHRzZWFyY2hTdWdnZXN0aW9ucyA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBpbnB1dC53aWR0aFxuXHRcdGhlaWdodDogMFxuXHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdHk6IGlucHV0Lm1heFlcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRzaGFkb3dDb2xvcjogXCJyZ2JhKDAsMCwwLDAuMilcIlxuXHRcdHNoYWRvd1k6IDFcblx0XHRzaGFkb3dCbHVyOiAzXG5cdFx0Ym9yZGVyQ29sb3I6IFwiI2VkZWRlZFwiXG5cdFx0dmlzaWJsZTogZmFsc2Vcblx0c2VhcmNoU3VnZ2VzdGlvbnMuc2VuZFRvQmFjaygpXG5cblx0IyBQRE9LXG5cdHBkb2tVUkwgPSBcImh0dHBzOi8vZ2VvZGF0YS5uYXRpb25hYWxnZW9yZWdpc3Rlci5ubC9sb2NhdGllc2VydmVyL3YzL3N1Z2dlc3Q/cT1cIlxuXHRcblx0Z2V0U2VhcmNoU3VnZ2VzdGlvbnMgPSAoaW5wdXQpIC0+XG5cdFx0c3VnZ2VzdGlvblJlc3VsdHMgPSBbXVxuXHRcdFxuXHRcdHJlc3VsdHNIZWlnaHQgPSAwXG5cdFx0XG5cdFx0Zm9yIGl0ZW0saSBpbiBzZWFyY2hTdWdnZXN0aW9ucy5jaGlsZHJlblxuXHRcdFx0aXRlbS5kZXN0cm95KClcblx0XHRcdFxuXHRcdGlmIGlucHV0LnZhbHVlLmxlbmd0aCA+PSAyXG5cdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5icmluZ1RvRnJvbnQoKVxuXHRcdFx0c2VhcmNoU3VnZ2VzdGlvbnMueSA9IGlucHV0LnNjcmVlbkZyYW1lLnkgKyBpbnB1dC5oZWlnaHQgKyA4XG5cdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0ZW5kcG9pbnQgPSBVdGlscy5kb21Mb2FkSlNPTlN5bmMgcGRva1VSTCArIGlucHV0LnZhbHVlICsgXCIgYW5kIHR5cGU6I3t0eXBlfVwiXG5cdFx0XHRyZXN1bHRzID0gZW5kcG9pbnQucmVzcG9uc2UuZG9jc1xuXHRcdFx0aGlnaGxpZ2h0aW5nID0gZW5kcG9pbnQuaGlnaGxpZ2h0aW5nXG5cblx0XHRcdFxuXHRcdFx0Zm9yIHJlc3VsdCwgaW5kZXggaW4gcmVzdWx0c1swLi4ubWF4UmVzdWx0c11cblx0XHRcdFx0aWQgPSByZXN1bHQuaWRcblx0XHRcdFx0aXRlbSA9IG5ldyBMYXllclxuXHRcdFx0XHRcdHBhcmVudDogc2VhcmNoU3VnZ2VzdGlvbnNcblx0XHRcdFx0XHR3aWR0aDogc2VhcmNoU3VnZ2VzdGlvbnMud2lkdGhcblx0XHRcdFx0XHRoZWlnaHQ6IDQ4XG5cdFx0XHRcdFx0aHRtbDogaGlnaGxpZ2h0aW5nW2lkXS5zdWdnZXN0XG5cdFx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0XHRmb250U2l6ZTogXCIxNnB4XCJcblx0XHRcdFx0XHRcdGxpbmVIZWlnaHQ6IFwiI3s0OCAvIDE2fXB4XCJcblx0XHRcdFx0XHRcdGNvbG9yOiBcIiMzMzNcIlxuXHRcdFx0XHRcdFx0cGFkZGluZ1RvcDogXCIyNHB4XCJcblx0XHRcdFx0XHRcdHBhZGRpbmdMZWZ0OiBcIjE2cHhcIlxuXHRcdFx0XHRcdFx0cGFkZGluZ1JpZ2h0OiBcIjE2cHhcIlxuXHRcdFx0XHRcdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCAjY2NjXCJcblx0XHRcdFx0XHRcdHdpZHRoOiBcIiN7aW5wdXQud2lkdGggLSAzMn1weFwiXG5cdFx0XHRcdFx0XHR3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiXG5cdFx0XHRcdFx0XHRvdmVyZmxvdzogXCJoaWRkZW5cIlxuXHRcdFx0XHRcdFx0dGV4dE92ZXJmbG93OiBcImVsbGlwc2lzXCJcblx0XHRcdFx0XHR5OiA0OCAqIGluZGV4XG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCJcblx0XHRcdFx0XG5cdFx0XHRcdGlmIGluZGV4IGlzIG1heFJlc3VsdHMgLSAxXG5cdFx0XHRcdFx0aXRlbS5zdHlsZS5ib3JkZXJCb3R0b20gPSBcIlwiXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXN1bHRzSGVpZ2h0ICs9IDQ4XG5cdFx0XHRcdFxuXHRcdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5oZWlnaHQgPSByZXN1bHRzSGVpZ2h0XG5cdFx0XHRcdFxuXHRcdFx0XHRpdGVtLm9uQ2xpY2sgLT5cblx0XHRcdFx0XHRpbnB1dC52YWx1ZSA9IHJlc3VsdC53ZWVyZ2F2ZW5hYW1cblx0XHRcdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5zZW5kVG9CYWNrKClcblx0XHRcdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0aW5wdXQub25JbnB1dEJsdXIgLT5cblx0XHRcdFx0c2VhcmNoU3VnZ2VzdGlvbnMuc2VuZFRvQmFjaygpXG5cdFx0XHRpbnB1dC5vbklucHV0Rm9jdXMgLT5cblx0XHRcdFx0c2VhcmNoU3VnZ2VzdGlvbnMuYnJpbmdUb0Zyb250KClcblx0XHRlbHNlXG5cdFx0XHRzZWFyY2hTdWdnZXN0aW9ucy5zZW5kVG9CYWNrKClcblx0XHRcdHNlYXJjaFN1Z2dlc3Rpb25zLmhlaWdodCA9IDBcblx0XG5cdFxuXHRpbnB1dC5vblZhbHVlQ2hhbmdlIC0+XG5cdFx0Z2V0U2VhcmNoU3VnZ2VzdGlvbnMoQCkiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUVBQTtBREFBLE9BQU8sQ0FBQyxXQUFSLEdBQXNCLFNBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsSUFBcEI7QUFHckIsTUFBQTtFQUFBLElBQWtCLFVBQUEsS0FBYyxJQUFoQztJQUFBLFVBQUEsR0FBYSxFQUFiOztFQUdBLElBQWtCLElBQUEsS0FBUSxJQUExQjtJQUFBLElBQUEsR0FBTyxRQUFQOztFQUdBLGlCQUFBLEdBQXdCLElBQUEsS0FBQSxDQUN2QjtJQUFBLEtBQUEsRUFBTyxLQUFLLENBQUMsS0FBYjtJQUNBLE1BQUEsRUFBUSxDQURSO0lBRUEsQ0FBQSxFQUFHLEtBQUssQ0FBQyxNQUZUO0lBR0EsQ0FBQSxFQUFHLEtBQUssQ0FBQyxJQUhUO0lBSUEsZUFBQSxFQUFpQixJQUpqQjtJQUtBLFdBQUEsRUFBYSxpQkFMYjtJQU1BLE9BQUEsRUFBUyxDQU5UO0lBT0EsVUFBQSxFQUFZLENBUFo7SUFRQSxXQUFBLEVBQWEsU0FSYjtJQVNBLE9BQUEsRUFBUyxLQVRUO0dBRHVCO0VBV3hCLGlCQUFpQixDQUFDLFVBQWxCLENBQUE7RUFHQSxPQUFBLEdBQVU7RUFFVixvQkFBQSxHQUF1QixTQUFDLEtBQUQ7QUFDdEIsUUFBQTtJQUFBLGlCQUFBLEdBQW9CO0lBRXBCLGFBQUEsR0FBZ0I7QUFFaEI7QUFBQSxTQUFBLDZDQUFBOztNQUNDLElBQUksQ0FBQyxPQUFMLENBQUE7QUFERDtJQUdBLElBQUcsS0FBSyxD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
