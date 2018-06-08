require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"autocomplete":[function(require,module,exports){
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
      resultID: "",
      result: "",
      resultHighlighted: ""
    }));
    this.resultID = options.resultID;
    this.result = options.result;
    this.resultHighlighted = options.resultHighlighted;
  }

  return ResultItem;

})(Layer);

exports.AutoComplete = (function(superClass) {
  extend(AutoComplete, superClass);

  function AutoComplete(options) {
    var autoCompleteContainer, maxResults, type;
    AutoComplete.__super__.constructor.call(this, _.defaults(options, {
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
    autoCompleteContainer = this;
    type = this.type;
    maxResults = this.maxResults;
    this.x = this.input.x + 1;
    this.y = this.input.maxY + 8;
    this.width = this.input.width - 2;
    this.sendToBack();
    this.input.onValueChange(function() {
      var endpoint, highlighting, i, id, index, input, item, j, len, len1, ref, ref1, result, results, results1;
      input = this;
      autoCompleteContainer.height = 0;
      ref = autoCompleteContainer.children;
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        item.destroy();
      }
      if (this.value.length >= 2) {
        autoCompleteContainer.bringToFront();
        endpoint = Utils.domLoadJSONSync(pdokURL + this.value + (" and type:" + type));
        results = endpoint.response.docs;
        highlighting = endpoint.highlighting;
        ref1 = results.slice(0, maxResults);
        results1 = [];
        for (index = j = 0, len1 = ref1.length; j < len1; index = ++j) {
          result = ref1[index];
          id = result.id;
          item = new ResultItem({
            parent: autoCompleteContainer,
            width: autoCompleteContainer.width,
            height: 48,
            y: 48 * index,
            resultID: id,
            html: highlighting[id].suggest,
            result: result.weergavenaam
          });
          autoCompleteContainer.height += 48;
          results1.push(item.onTap(function() {
            input.value = this.result;
            autoCompleteContainer.result = this.result;
            autoCompleteContainer.resultHighlighted = highlighting[this.resultID].suggest;
            autoCompleteContainer.sendToBack();
            return autoCompleteContainer.emit(Events.ResultSelected, event);
          }));
        }
        return results1;
      }
    });
  }

  return AutoComplete;

})(Layer);


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2VsbGlvdG5vbHRlbi9Qcml2YXRlL2ZyYW1lci1BdXRvU3VnZ2VzdC9hZGRyZXNzLWF1dG8tc3VnZ2VzdC5mcmFtZXIvbW9kdWxlcy9pbnB1dC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9lbGxpb3Rub2x0ZW4vUHJpdmF0ZS9mcmFtZXItQXV0b1N1Z2dlc3QvYWRkcmVzcy1hdXRvLXN1Z2dlc3QuZnJhbWVyL21vZHVsZXMvYXV0b2NvbXBsZXRlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiRXZlbnRzLkVudGVyS2V5ID0gXCJFbnRlcktleVwiXG5FdmVudHMuU3BhY2VLZXkgPSBcIlNwYWNlS2V5XCJcbkV2ZW50cy5CYWNrc3BhY2VLZXkgPSBcIkJhY2tzcGFjZUtleVwiXG5FdmVudHMuQ2Fwc0xvY2tLZXkgPSBcIkNhcHNMb2NrS2V5XCJcbkV2ZW50cy5TaGlmdEtleSA9IFwiU2hpZnRLZXlcIlxuRXZlbnRzLlZhbHVlQ2hhbmdlID0gXCJWYWx1ZUNoYW5nZVwiXG5FdmVudHMuSW5wdXRGb2N1cyA9IFwiSW5wdXRGb2N1c1wiXG5FdmVudHMuSW5wdXRCbHVyID0gXCJJbnB1dEJsdXJcIlxuXG5jbGFzcyBleHBvcnRzLklucHV0TGF5ZXIgZXh0ZW5kcyBUZXh0TGF5ZXJcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cblx0XHRfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI0ZGRlwiXG5cdFx0XHR3aWR0aDogMzc1XG5cdFx0XHRoZWlnaHQ6IDYwXG5cdFx0XHRwYWRkaW5nOlxuXHRcdFx0XHRsZWZ0OiAyMFxuXHRcdFx0dGV4dDogXCJUeXBlIHNvbWV0aGluZy4uLlwiXG5cdFx0XHRmb250U2l6ZTogNDBcblx0XHRcdGZvbnRXZWlnaHQ6IDMwMFxuXG5cdFx0aWYgb3B0aW9ucy5tdWx0aUxpbmVcblx0XHRcdG9wdGlvbnMucGFkZGluZy50b3AgPz0gMjBcblxuXHRcdEBfaW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCJcblxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdCMgR2xvYmFsc1xuXHRcdEBfYmFja2dyb3VuZCA9IHVuZGVmaW5lZFxuXHRcdEBfcGxhY2Vob2xkZXIgPSB1bmRlZmluZWRcblx0XHRAX2lzRGVzaWduTGF5ZXIgPSBmYWxzZVxuXG5cdFx0IyBMYXllciBjb250YWluaW5nIGlucHV0IGVsZW1lbnRcblx0XHRAaW5wdXQgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0XHRuYW1lOiBcImlucHV0XCJcblx0XHRcdHdpZHRoOiBAd2lkdGhcblx0XHRcdGhlaWdodDogQGhlaWdodFxuXHRcdFx0cGFyZW50OiBAXG5cblx0XHQjIFRleHQgYXJlYVxuXHRcdGlmIEBtdWx0aUxpbmVcblx0XHRcdEBfaW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpXG5cblx0XHQjIEFwcGVuZCBlbGVtZW50XG5cdFx0QGlucHV0Ll9lbGVtZW50LmFwcGVuZENoaWxkKEBfaW5wdXRFbGVtZW50KVxuXG5cdFx0IyBNYXRjaCBUZXh0TGF5ZXIgZGVmYXVsdHMgYW5kIHR5cGUgcHJvcGVydGllc1xuXHRcdEBfc2V0VGV4dFByb3BlcnRpZXMoQClcblxuXHRcdCMgU2V0IGF0dHJpYnV0ZXNcblx0XHRAX2lucHV0RWxlbWVudC5hdXRvY29tcGxldGUgPSBcIm9mZlwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuYXV0b2NvcnJlY3QgPSBcIm9mZlwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3BlbGxjaGVjayA9IGZhbHNlXG5cblx0XHQjIFRoZSBpZCBzZXJ2ZXMgdG8gZGlmZmVyZW50aWF0ZSBtdWx0aXBsZSBpbnB1dCBlbGVtZW50cyBmcm9tIG9uZSBhbm90aGVyLlxuXHRcdCMgVG8gYWxsb3cgc3R5bGluZyB0aGUgcGxhY2Vob2xkZXIgY29sb3JzIG9mIHNlcGVyYXRlIGVsZW1lbnRzLlxuXHRcdEBfaW5wdXRFbGVtZW50LmNsYXNzTmFtZSA9IFwiaW5wdXRcIiArIEBpZFxuXG5cdFx0IyBBbGwgaW5oZXJpdGVkIHByb3BlcnRpZXNcblx0XHR0ZXh0UHJvcGVydGllcyA9XG5cdFx0XHR7QHRleHQsIEBmb250RmFtaWx5LCBAZm9udFNpemUsIEBsaW5lSGVpZ2h0LCBAZm9udFdlaWdodCwgQGNvbG9yLCBAYmFja2dyb3VuZENvbG9yLCBAd2lkdGgsIEBoZWlnaHQsIEBwYWRkaW5nLCBAcGFyZW50fVxuXG5cdFx0Zm9yIHByb3BlcnR5LCB2YWx1ZSBvZiB0ZXh0UHJvcGVydGllc1xuXG5cdFx0XHRAb24gXCJjaGFuZ2U6I3twcm9wZXJ0eX1cIiwgKHZhbHVlKSA9PlxuXHRcdFx0XHQjIFJlc2V0IHRleHRMYXllciBjb250ZW50c1xuXHRcdFx0XHRAX2VsZW1lbnRIVE1MLmNoaWxkcmVuWzBdLnRleHRDb250ZW50ID0gXCJcIlxuXG5cdFx0XHRcdHJldHVybiBpZiBAX2lzRGVzaWduTGF5ZXJcblx0XHRcdFx0QF9zZXRUZXh0UHJvcGVydGllcyhAKVxuXHRcdFx0XHRAX3NldFBsYWNlaG9sZGVyQ29sb3IoQF9pZCwgQGNvbG9yKVxuXG5cblx0XHQjIFNldCBkZWZhdWx0IHBsYWNlaG9sZGVyXG5cdFx0QF9zZXRQbGFjZWhvbGRlcihAdGV4dClcblx0XHRAX3NldFBsYWNlaG9sZGVyQ29sb3IoQF9pZCwgQGNvbG9yKVxuXG5cdFx0IyBSZXNldCB0ZXh0TGF5ZXIgY29udGVudHNcblx0XHRAX2VsZW1lbnRIVE1MLmNoaWxkcmVuWzBdLnRleHRDb250ZW50ID0gXCJcIlxuXG5cdFx0IyBDaGVjayBpZiBpbiBmb2N1c1xuXHRcdEBfaXNGb2N1c2VkID0gZmFsc2VcblxuXHRcdCMgRGVmYXVsdCBmb2N1cyBpbnRlcmFjdGlvblxuXHRcdEBfaW5wdXRFbGVtZW50Lm9uZm9jdXMgPSAoZSkgPT5cblxuXHRcdFx0QGZvY3VzQ29sb3IgPz0gXCIjMDAwXCJcblxuXHRcdFx0IyBFbWl0IGZvY3VzIGV2ZW50XG5cdFx0XHRAZW1pdChFdmVudHMuSW5wdXRGb2N1cywgZXZlbnQpXG5cblx0XHRcdEBfaXNGb2N1c2VkID0gdHJ1ZVxuXG5cdFx0IyBFbWl0IGJsdXIgZXZlbnRcblx0XHRAX2lucHV0RWxlbWVudC5vbmJsdXIgPSAoZSkgPT5cblx0XHRcdEBlbWl0KEV2ZW50cy5JbnB1dEJsdXIsIGV2ZW50KVxuXG5cdFx0XHRAX2lzRm9jdXNlZCA9IGZhbHNlXG5cblx0XHQjIFRvIGZpbHRlciBpZiB2YWx1ZSBjaGFuZ2VkIGxhdGVyXG5cdFx0Y3VycmVudFZhbHVlID0gdW5kZWZpbmVkXG5cblx0XHQjIFN0b3JlIGN1cnJlbnQgdmFsdWVcblx0XHRAX2lucHV0RWxlbWVudC5vbmtleWRvd24gPSAoZSkgPT5cblx0XHRcdGN1cnJlbnRWYWx1ZSA9IEB2YWx1ZVxuXG5cdFx0XHQjIElmIGNhcHMgbG9jayBrZXkgaXMgcHJlc3NlZCBkb3duXG5cdFx0XHRpZiBlLndoaWNoIGlzIDIwXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5DYXBzTG9ja0tleSwgZXZlbnQpXG5cblx0XHRcdCMgSWYgc2hpZnQga2V5IGlzIHByZXNzZWRcblx0XHRcdGlmIGUud2hpY2ggaXMgMTZcblx0XHRcdFx0QGVtaXQoRXZlbnRzLlNoaWZ0S2V5LCBldmVudClcblxuXHRcdEBfaW5wdXRFbGVtZW50Lm9ua2V5dXAgPSAoZSkgPT5cblxuXHRcdFx0aWYgY3VycmVudFZhbHVlIGlzbnQgQHZhbHVlXG5cdFx0XHRcdEBlbWl0KFwiY2hhbmdlOnZhbHVlXCIsIEB2YWx1ZSlcblx0XHRcdFx0QGVtaXQoRXZlbnRzLlZhbHVlQ2hhbmdlLCBAdmFsdWUpXG5cblx0XHRcdCMgSWYgZW50ZXIga2V5IGlzIHByZXNzZWRcblx0XHRcdGlmIGUud2hpY2ggaXMgMTNcblx0XHRcdFx0QGVtaXQoRXZlbnRzLkVudGVyS2V5LCBldmVudClcblxuXHRcdFx0IyBJZiBiYWNrc3BhY2Uga2V5IGlzIHByZXNzZWRcblx0XHRcdGlmIGUud2hpY2ggaXMgOFxuXHRcdFx0XHRAZW1pdChFdmVudHMuQmFja3NwYWNlS2V5LCBldmVudClcblxuXHRcdFx0IyBJZiBzcGFjZSBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyAzMlxuXHRcdFx0XHRAZW1pdChFdmVudHMuU3BhY2VLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIGNhcHMgbG9jayBrZXkgaXMgcHJlc3NlZCB1cFxuXHRcdFx0aWYgZS53aGljaCBpcyAyMFxuXHRcdFx0XHRAZW1pdChFdmVudHMuQ2Fwc0xvY2tLZXksIGV2ZW50KVxuXG5cdF9zZXRQbGFjZWhvbGRlcjogKHRleHQpID0+XG5cdFx0QF9pbnB1dEVsZW1lbnQucGxhY2Vob2xkZXIgPSB0ZXh0XG5cblx0X3NldFBsYWNlaG9sZGVyQ29sb3I6IChpZCwgY29sb3IpIC0+XG5cdFx0ZG9jdW1lbnQuc3R5bGVTaGVldHNbMF0uYWRkUnVsZShcIi5pbnB1dCN7aWR9Ojotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVyXCIsIFwiY29sb3I6ICN7Y29sb3J9XCIpXG5cblx0X2NoZWNrRGV2aWNlUGl4ZWxSYXRpbzogLT5cblx0XHRyYXRpbyA9IChTY3JlZW4ud2lkdGggLyBGcmFtZXIuRGV2aWNlLnNjcmVlbi53aWR0aClcblx0XHRpZiBVdGlscy5pc0Rlc2t0b3AoKVxuXHRcdFx0IyBAM3hcblx0XHRcdGlmIHJhdGlvIDwgMC41IGFuZCByYXRpbyA+IDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIHJhdGlvXG5cdFx0XHQjIEA0eFxuXHRcdFx0ZWxzZSBpZiByYXRpbyBpcyAwLjI1XG5cdFx0XHRcdGRwciA9IDEgLSAocmF0aW8gKiAyKVxuXHRcdFx0IyBAMXgsIEAyeFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkcHIgPSBVdGlscy5kZXZpY2VQaXhlbFJhdGlvKClcblx0XHRcdGlmIEZyYW1lci5EZXZpY2UuZGV2aWNlVHlwZSBpcyBcImZ1bGxzY3JlZW5cIlxuXHRcdFx0XHRkcHIgPSAyXG5cdFx0ZWxzZVxuXHRcdFx0IyBAM3hcblx0XHRcdGlmIHJhdGlvIDwgMC41IGFuZCByYXRpbyA+IDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIHJhdGlvXG5cdFx0XHQjIEA0eFxuXHRcdFx0ZWxzZSBpZiByYXRpbyBpcyAwLjI1XG5cdFx0XHRcdGRwciA9IDEgLSAocmF0aW8gKiAyKVxuXHRcdFx0IyBAMXgsIEAyeFxuXHRcdFx0ZWxzZSBpZiByYXRpbyBpcyAwLjVcblx0XHRcdFx0ZHByID0gMVxuXG5cdFx0cmV0dXJuIGRwclxuXG5cdF9zZXRUZXh0UHJvcGVydGllczogKGxheWVyKSA9PlxuXG5cdFx0ZHByID0gQF9jaGVja0RldmljZVBpeGVsUmF0aW8oKVxuXG5cdFx0aWYgbm90IEBfaXNEZXNpZ25MYXllclxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udEZhbWlseSA9IGxheWVyLmZvbnRGYW1pbHlcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmZvbnRTaXplID0gXCIje2xheWVyLmZvbnRTaXplIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBsYXllci5mb250V2VpZ2h0ID8gXCJub3JtYWxcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ1RvcCA9IFwiI3tsYXllci5wYWRkaW5nLnRvcCAqIDIgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIje2xheWVyLnBhZGRpbmcuYm90dG9tICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nQm90dG9tID0gXCIje2xheWVyLnBhZGRpbmcucmlnaHQgKiAyIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIje2xheWVyLnBhZGRpbmcubGVmdCAqIDIgLyBkcHJ9cHhcIlxuXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUud2lkdGggPSBcIiN7KChsYXllci53aWR0aCAtIGxheWVyLnBhZGRpbmcubGVmdCAqIDIpICogMiAvIGRwcil9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiI3tsYXllci5oZWlnaHQgKiAyIC8gZHByfXB4XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5vdXRsaW5lID0gXCJub25lXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5jdXJzb3IgPSBcImF1dG9cIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLndlYmtpdEFwcGVhcmFuY2UgPSBcIm5vbmVcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnJlc2l6ZSA9IFwibm9uZVwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUud2Via2l0Rm9udFNtb290aGluZyA9IFwiYW50aWFsaWFzZWRcIlxuXG5cdGFkZEJhY2tncm91bmRMYXllcjogKGxheWVyKSAtPlxuXHRcdEBfYmFja2dyb3VuZCA9IGxheWVyXG5cdFx0QF9iYWNrZ3JvdW5kLnBhcmVudCA9IEBcblx0XHRAX2JhY2tncm91bmQubmFtZSA9IFwiYmFja2dyb3VuZFwiXG5cdFx0QF9iYWNrZ3JvdW5kLnggPSBAX2JhY2tncm91bmQueSA9IDBcblx0XHRAX2JhY2tncm91bmQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoQF9pbnB1dEVsZW1lbnQpXG5cblx0XHRyZXR1cm4gQF9iYWNrZ3JvdW5kXG5cblx0YWRkUGxhY2VIb2xkZXJMYXllcjogKGxheWVyKSAtPlxuXG5cdFx0QF9pc0Rlc2lnbkxheWVyID0gdHJ1ZVxuXHRcdEBfaW5wdXRFbGVtZW50LmNsYXNzTmFtZSA9IFwiaW5wdXRcIiArIGxheWVyLmlkXG5cdFx0QHBhZGRpbmcgPSBsZWZ0OiAwLCB0b3A6IDBcblxuXHRcdEBfc2V0UGxhY2Vob2xkZXIobGF5ZXIudGV4dClcblx0XHRAX3NldFRleHRQcm9wZXJ0aWVzKGxheWVyKVxuXHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihsYXllci5pZCwgbGF5ZXIuY29sb3IpXG5cblx0XHRAb24gXCJjaGFuZ2U6Y29sb3JcIiwgPT5cblx0XHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihsYXllci5pZCwgQGNvbG9yKVxuXG5cdFx0IyBSZW1vdmUgb3JpZ2luYWwgbGF5ZXJcblx0XHRsYXllci52aXNpYmxlID0gZmFsc2Vcblx0XHRAX2VsZW1lbnRIVE1MLmNoaWxkcmVuWzBdLnRleHRDb250ZW50ID0gXCJcIlxuXG5cdFx0IyBDb252ZXJ0IHBvc2l0aW9uIHRvIHBhZGRpbmdcblx0XHRkcHIgPSBAX2NoZWNrRGV2aWNlUGl4ZWxSYXRpbygpXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSBcIiN7bGF5ZXIuZm9udFNpemUgKiAyIC8gZHByfXB4XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nVG9wID0gXCIje2xheWVyLnkgKiAyIC8gZHByfXB4XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiI3tsYXllci54ICogMiAvIGRwcn1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUud2lkdGggPSBcIiN7KEBfYmFja2dyb3VuZC53aWR0aCAtIGxheWVyLnggKiAyKSAqIDIgLyBkcHJ9cHhcIlxuXG5cdFx0aWYgQG11bHRpTGluZVxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIje0BfYmFja2dyb3VuZC5oZWlnaHQgKiAyIC8gZHByfXB4XCJcblxuXHRcdEBvbiBcImNoYW5nZTpwYWRkaW5nXCIsID0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nVG9wID0gXCIje0BwYWRkaW5nLnRvcCAqIDIgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSBcIiN7QHBhZGRpbmcubGVmdCAqIDIgLyBkcHJ9cHhcIlxuXG5cdFx0cmV0dXJuIEBfcGxhY2Vob2xkZXJcblxuXHRmb2N1czogLT5cblx0XHRAX2lucHV0RWxlbWVudC5mb2N1cygpXG5cblx0QGRlZmluZSBcInZhbHVlXCIsXG5cdFx0Z2V0OiAtPiBAX2lucHV0RWxlbWVudC52YWx1ZVxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQudmFsdWUgPSB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJmb2N1c0NvbG9yXCIsXG5cdFx0Z2V0OiAtPlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuY29sb3Jcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmNvbG9yID0gdmFsdWVcblxuXHRAZGVmaW5lIFwibXVsdGlMaW5lXCIsIEBzaW1wbGVQcm9wZXJ0eShcIm11bHRpTGluZVwiLCBmYWxzZSlcblxuXHQjIE5ldyBDb25zdHJ1Y3RvclxuXHRAd3JhcCA9IChiYWNrZ3JvdW5kLCBwbGFjZWhvbGRlciwgb3B0aW9ucykgLT5cblx0XHRyZXR1cm4gd3JhcElucHV0KG5ldyBAKG9wdGlvbnMpLCBiYWNrZ3JvdW5kLCBwbGFjZWhvbGRlciwgb3B0aW9ucylcblxuXHRvbkVudGVyS2V5OiAoY2IpIC0+IEBvbihFdmVudHMuRW50ZXJLZXksIGNiKVxuXHRvblNwYWNlS2V5OiAoY2IpIC0+IEBvbihFdmVudHMuU3BhY2VLZXksIGNiKVxuXHRvbkJhY2tzcGFjZUtleTogKGNiKSAtPiBAb24oRXZlbnRzLkJhY2tzcGFjZUtleSwgY2IpXG5cdG9uQ2Fwc0xvY2tLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5DYXBzTG9ja0tleSwgY2IpXG5cdG9uU2hpZnRLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5TaGlmdEtleSwgY2IpXG5cdG9uVmFsdWVDaGFuZ2U6IChjYikgLT4gQG9uKEV2ZW50cy5WYWx1ZUNoYW5nZSwgY2IpXG5cdG9uSW5wdXRGb2N1czogKGNiKSAtPiBAb24oRXZlbnRzLklucHV0Rm9jdXMsIGNiKVxuXHRvbklucHV0Qmx1cjogKGNiKSAtPiBAb24oRXZlbnRzLklucHV0Qmx1ciwgY2IpXG5cbndyYXBJbnB1dCA9IChpbnN0YW5jZSwgYmFja2dyb3VuZCwgcGxhY2Vob2xkZXIpIC0+XG5cdGlmIG5vdCAoYmFja2dyb3VuZCBpbnN0YW5jZW9mIExheWVyKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIklucHV0TGF5ZXIgZXhwZWN0cyBhIGJhY2tncm91bmQgbGF5ZXIuXCIpXG5cblx0aWYgbm90IChwbGFjZWhvbGRlciBpbnN0YW5jZW9mIFRleHRMYXllcilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dExheWVyIGV4cGVjdHMgYSB0ZXh0IGxheWVyLlwiKVxuXG5cdGlucHV0ID0gaW5zdGFuY2VcblxuXHRpbnB1dC5fX2ZyYW1lckluc3RhbmNlSW5mbyA/PSB7fVxuXHRpbnB1dC5fX2ZyYW1lckluc3RhbmNlSW5mbz8ubmFtZSA9IGluc3RhbmNlLmNvbnN0cnVjdG9yLm5hbWVcblxuXHRpbnB1dC5mcmFtZSA9IGJhY2tncm91bmQuZnJhbWVcblx0aW5wdXQucGFyZW50ID0gYmFja2dyb3VuZC5wYXJlbnRcblx0aW5wdXQuaW5kZXggPSBiYWNrZ3JvdW5kLmluZGV4XG5cblx0aW5wdXQuYWRkQmFja2dyb3VuZExheWVyKGJhY2tncm91bmQpXG5cdGlucHV0LmFkZFBsYWNlSG9sZGVyTGF5ZXIocGxhY2Vob2xkZXIpXG5cblx0cmV0dXJuIGlucHV0IiwiIyBDdXN0b20gRXZlbnRzXG5FdmVudHMuUmVzdWx0U2VsZWN0ZWQgPSBcIlJlc3VsdFNlbGVjdGVkXCJcblxuIyBQRE9LXG5wZG9rVVJMID0gXCJodHRwczovL2dlb2RhdGEubmF0aW9uYWFsZ2VvcmVnaXN0ZXIubmwvbG9jYXRpZXNlcnZlci92My9zdWdnZXN0P3E9XCJcblxuIyBDcmVhdGUgaXRlbSBDbGFzcyBvbmx5IHRvIHVzZSB3aXRoaW4gdGhpcyBtb2R1bGUsIG5vIGV4cG9ydHNcbmNsYXNzIFJlc3VsdEl0ZW0gZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdGZvbnRTaXplOiBcIjE2cHhcIlxuXHRcdFx0XHRsaW5lSGVpZ2h0OiBcIiN7NDggLyAxNn1weFwiXG5cdFx0XHRcdGNvbG9yOiBcIiMzMzNcIlxuXHRcdFx0XHRwYWRkaW5nVG9wOiBcIjI0cHhcIlxuXHRcdFx0XHRwYWRkaW5nTGVmdDogXCIxNnB4XCJcblx0XHRcdFx0cGFkZGluZ1JpZ2h0OiBcIjE2cHhcIlxuXHRcdFx0XHRib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkICNjY2NcIlxuXHRcdFx0XHR3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiXG5cdFx0XHRcdG92ZXJmbG93OiBcImhpZGRlblwiXG5cdFx0XHRcdHRleHRPdmVyZmxvdzogXCJlbGxpcHNpc1wiXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIlxuXHRcdFx0cmVzdWx0SUQ6IFwiXCJcblx0XHRcdHJlc3VsdDogXCJcIlxuXHRcdFx0cmVzdWx0SGlnaGxpZ2h0ZWQ6IFwiXCJcblxuXHRcdEByZXN1bHRJRCA9IG9wdGlvbnMucmVzdWx0SURcblx0XHRAcmVzdWx0ID0gb3B0aW9ucy5yZXN1bHRcblx0XHRAcmVzdWx0SGlnaGxpZ2h0ZWQgPSBvcHRpb25zLnJlc3VsdEhpZ2hsaWdodGVkXG5cbmNsYXNzIGV4cG9ydHMuQXV0b0NvbXBsZXRlIGV4dGVuZHMgTGF5ZXJcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0aW5wdXQ6IFtdXG5cdFx0XHRtYXhSZXN1bHRzOiA1XG5cdFx0XHR0eXBlOiBcImFkcmVzXCJcblx0XHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHRzaGFkb3dDb2xvcjogXCJyZ2JhKDAsMCwwLDAuMilcIlxuXHRcdFx0c2hhZG93WTogMVxuXHRcdFx0c2hhZG93Qmx1cjogOFxuXHRcdFx0Ym9yZGVyQ29sb3I6IFwiI2VkZWRlZFwiXG5cblx0XHRAaW5wdXQgPSBvcHRpb25zLmlucHV0XG5cdFx0QG1heFJlc3VsdHMgPSBvcHRpb25zLm1heFJlc3VsdHNcblx0XHRAdHlwZSA9IG9wdGlvbnMudHlwZVxuXG5cblx0XHQjIFN0b3JlIHRoZSBvcHRpb25zIGludG8gbmV3IHZhcmlhYmxlcyBmb3IgbGF0ZXIgdXNlXG5cdFx0YXV0b0NvbXBsZXRlQ29udGFpbmVyID0gQFxuXHRcdHR5cGUgPSBAdHlwZVxuXHRcdG1heFJlc3VsdHMgPSBAbWF4UmVzdWx0c1xuXG5cdFx0IyBQb3NpdGlvbiB0aGUgYXV0b0NvbXBsZXRlXG5cdFx0QHggPSBAaW5wdXQueCArIDFcblx0XHRAeSA9IEBpbnB1dC5tYXhZICsgOFxuXHRcdEB3aWR0aCA9IEBpbnB1dC53aWR0aCAtIDJcblx0XHRAc2VuZFRvQmFjaygpXG5cblx0XHQjIFNob3cgYXV0byBDb21wbGV0ZWlvbnMgd2hpbGUgdHlwaW5nXG5cdFx0QGlucHV0Lm9uVmFsdWVDaGFuZ2UgLT5cblxuXHRcdFx0aW5wdXQgPSBAXG5cblx0XHRcdCMgUmVzZXQgdGhlIGhlaWdodCBvZiB0aGUgYXV0b0NvbXBsZXRlQ29udGFpbmVyIHRvIDBcblx0XHRcdGF1dG9Db21wbGV0ZUNvbnRhaW5lci5oZWlnaHQgPSAwXG5cblx0XHRcdCMgRmlyc3QgZGVzdHJveSBhbGwgY2hpbGRyZW4gb2YgdGhlIGF1dG9Db21wbGV0ZUNvbnRhaW5lclxuXHRcdFx0aXRlbS5kZXN0cm95KCkgZm9yIGl0ZW0gaW4gYXV0b0NvbXBsZXRlQ29udGFpbmVyLmNoaWxkcmVuXG5cblx0XHRcdCMgT25seSBzaG93IHNvbWV0aGluZyB3aGVuIHRoZXJlIGFyZSAyIGNoYXJhY3RlcnMgb3IgbW9yZVxuXHRcdFx0aWYgQHZhbHVlLmxlbmd0aCA+PSAyXG5cblx0XHRcdFx0IyBGaXJzdCBzaG93IHRoZSBhdXRvQ29tcGxldGUgY29udGFpbmVyXG5cdFx0XHRcdGF1dG9Db21wbGV0ZUNvbnRhaW5lci5icmluZ1RvRnJvbnQoKVxuXG5cdFx0XHRcdCMgVGhlbiBsb2FkIHRoZSBkYXRhIGZyb20gdGhlIFBET0sgZW5kcG9pbnRcblx0XHRcdFx0ZW5kcG9pbnQgPSBVdGlscy5kb21Mb2FkSlNPTlN5bmMgcGRva1VSTCArIEB2YWx1ZSArIFwiIGFuZCB0eXBlOiN7dHlwZX1cIlxuXG5cdFx0XHRcdCMgU3BsaXQgdGhlIGVuZHBvaW50IGluIHJlc3VsdHNcblx0XHRcdFx0cmVzdWx0cyA9IGVuZHBvaW50LnJlc3BvbnNlLmRvY3NcblxuXHRcdFx0XHQjIEFuZCBoaWdobGlnaHRlZCByZXN1bHRzXG5cdFx0XHRcdGhpZ2hsaWdodGluZyA9IGVuZHBvaW50LmhpZ2hsaWdodGluZ1xuXG5cdFx0XHRcdCMgTG9vcCB0aHJvdWdoIHRoZSByZXN1bHRzIGFuZCBzaG93IHRoZSByZXN1bHRzIGluIGEgbGlzdFxuXHRcdFx0XHRmb3IgcmVzdWx0LCBpbmRleCBpbiByZXN1bHRzWzAuLi5tYXhSZXN1bHRzXVxuXG5cdFx0XHRcdFx0IyBTdG9yZSB0aGUgdW5pcXVlIGlkIGZvciBsYXRlciB1c2Vcblx0XHRcdFx0XHRpZCA9IHJlc3VsdC5pZFxuXG5cdFx0XHRcdFx0IyBDcmVhdGUgdGhlIGl0ZW1zXG5cdFx0XHRcdFx0aXRlbSA9IG5ldyBSZXN1bHRJdGVtXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGF1dG9Db21wbGV0ZUNvbnRhaW5lclxuXHRcdFx0XHRcdFx0d2lkdGg6IGF1dG9Db21wbGV0ZUNvbnRhaW5lci53aWR0aFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiA0OFxuXHRcdFx0XHRcdFx0eTogNDggKiBpbmRleFxuXHRcdFx0XHRcdFx0IyBGaWxsIHRoZSBpdGVtIHdpdGggdGhlIGhpZ2hsaWdodGVkIHN1Z2dlc3Rpb25cblx0XHRcdFx0XHRcdHJlc3VsdElEOiBpZFxuXHRcdFx0XHRcdFx0aHRtbDogaGlnaGxpZ2h0aW5nW2lkXS5zdWdnZXN0XG5cdFx0XHRcdFx0XHRyZXN1bHQ6IHJlc3VsdC53ZWVyZ2F2ZW5hYW1cblxuXHRcdFx0XHRcdCMgRm9yIGVhY2ggcmVzdWx0IGFkZCB1cCA0OHB4IHRvIHRoZSBoZWlnaHQgb2YgdGhlIGF1dG9Db21wbGV0ZUNvbnRhaW5lclxuXHRcdFx0XHRcdGF1dG9Db21wbGV0ZUNvbnRhaW5lci5oZWlnaHQgKz0gNDhcblxuXHRcdFx0XHRcdCMgVGFwcGluZyBhbiBpdGVtIHB1dHMgaXRzIHZhbHVlIGludG8gdGhlIGlucHV0IGZpZWxkIGFuZCB0cmlnZ2VycyB0aGUgcmVzdWx0U2VsZWN0ZWQgRXZlbnRcblx0XHRcdFx0XHRpdGVtLm9uVGFwIC0+XG5cdFx0XHRcdFx0XHRpbnB1dC52YWx1ZSA9IEByZXN1bHRcblx0XHRcdFx0XHRcdGF1dG9Db21wbGV0ZUNvbnRhaW5lci5yZXN1bHQgPSBAcmVzdWx0XG5cdFx0XHRcdFx0XHRhdXRvQ29tcGxldGVDb250YWluZXIucmVzdWx0SGlnaGxpZ2h0ZWQgPSBoaWdobGlnaHRpbmdbQHJlc3VsdElEXS5zdWdnZXN0XG5cblx0XHRcdFx0XHRcdCMgSGlkZSB0aGUgYXV0b0NvbXBsZXRlQ29udGFpbmVyXG5cdFx0XHRcdFx0XHRhdXRvQ29tcGxldGVDb250YWluZXIuc2VuZFRvQmFjaygpXG5cdFx0XHRcdFx0XHRhdXRvQ29tcGxldGVDb250YWluZXIuZW1pdChFdmVudHMuUmVzdWx0U2VsZWN0ZWQsIGV2ZW50KVxuXG5cblxuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFFQUE7QURDQSxJQUFBLG1CQUFBO0VBQUE7OztBQUFBLE1BQU0sQ0FBQyxjQUFQLEdBQXdCOztBQUd4QixPQUFBLEdBQVU7O0FBR0o7OztFQUNRLG9CQUFDLE9BQUQ7SUFDWiw0Q0FBTSxDQUFDLENBQUMsUUFBRixDQUFXLE9BQVgsRUFDTDtNQUFBLEtBQUEsRUFDQztRQUFBLFFBQUEsRUFBVSxNQUFWO1FBQ0EsVUFBQSxFQUFjLENBQUMsRUFBQSxHQUFLLEVBQU4sQ0FBQSxHQUFTLElBRHZCO1FBRUEsS0FBQSxFQUFPLE1BRlA7UUFHQSxVQUFBLEVBQVksTUFIWjtRQUlBLFdBQUEsRUFBYSxNQUpiO1FBS0EsWUFBQSxFQUFjLE1BTGQ7UUFNQSxZQUFBLEVBQWMsZ0JBTmQ7UUFPQSxVQUFBLEVBQVksUUFQWjtRQVFBLFFBQUEsRUFBVSxRQVJWO1FBU0EsWUFBQSxFQUFjLFVBVGQ7T0FERDtNQVdBLGVBQUEsRUFBaUIsT0FYakI7TUFZQSxRQUFBLEVBQVUsRUFaVjtNQWFBLE1BQUEsRUFBUSxFQWJSO01BY0EsaUJBQUEsRUFBbUIsRUFkbkI7S0FESyxDQUFOO0lBaUJBLElBQUMsQ0FBQSxRQUFELEdBQVksT0FBTyxDQUFDO0lBQ3BCLElBQUMs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
