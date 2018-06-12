require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"autocomplete":[function(require,module,exports){
var ResultItem, pdokURL,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Events.ResultSelected = "ResultSelected";

Events.ResultGenerated = "ResultGenerated";

pdokURL = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?q=";

ResultItem = (function(superClass) {
  extend(ResultItem, superClass);

  function ResultItem(options) {
    ResultItem.__super__.constructor.call(this, _.defaults(options, {
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
    var autoCompleteContainer, maxResults, styleResults, type;
    AutoComplete.__super__.constructor.call(this, _.defaults(options, {
      input: [],
      maxResults: 5,
      type: "adres",
      x: Align.center,
      backgroundColor: null,
      shadowColor: "rgba(0,0,0,0.2)",
      shadowY: 1,
      shadowBlur: 8,
      borderColor: "#ededed",
      resultStyle: {
        fontSize: "16px",
        lineHeight: (48 / 16) + "px",
        color: "#333",
        paddingTop: "24px",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderBottom: "1px solid #ccc",
        color: "#333",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        backgroundColor: "white"
      }
    }));
    this.input = options.input;
    this.maxResults = options.maxResults;
    this.type = options.type;
    this.resultStyle = options.resultStyle;
    autoCompleteContainer = this;
    type = this.type;
    maxResults = this.maxResults;
    styleResults = this.resultStyle;
    this._x = this.input.screenFrame.x + 1;
    this._y = this.input.screenFrame.y + this.input.height + 8;
    this._width = this.input.width - 2;
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
        autoCompleteContainer.emit(Events.ResultGenerated, event);
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
            result: result.weergavenaam,
            style: styleResults
          });
          if (index === maxResults - 1) {
            item.style.borderBottom = "none";
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2VsbGlvdG5vbHRlbi9Qcml2YXRlL2ZyYW1lci1BdXRvQ29tcGxldGUvZHV0Y2gtY2l0aWVzLXBpY3R1cmVzLmZyYW1lci9tb2R1bGVzL2lucHV0LmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2VsbGlvdG5vbHRlbi9Qcml2YXRlL2ZyYW1lci1BdXRvQ29tcGxldGUvZHV0Y2gtY2l0aWVzLXBpY3R1cmVzLmZyYW1lci9tb2R1bGVzL2F1dG9jb21wbGV0ZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50cy5FbnRlcktleSA9IFwiRW50ZXJLZXlcIlxuRXZlbnRzLlNwYWNlS2V5ID0gXCJTcGFjZUtleVwiXG5FdmVudHMuQmFja3NwYWNlS2V5ID0gXCJCYWNrc3BhY2VLZXlcIlxuRXZlbnRzLkNhcHNMb2NrS2V5ID0gXCJDYXBzTG9ja0tleVwiXG5FdmVudHMuU2hpZnRLZXkgPSBcIlNoaWZ0S2V5XCJcbkV2ZW50cy5WYWx1ZUNoYW5nZSA9IFwiVmFsdWVDaGFuZ2VcIlxuRXZlbnRzLklucHV0Rm9jdXMgPSBcIklucHV0Rm9jdXNcIlxuRXZlbnRzLklucHV0Qmx1ciA9IFwiSW5wdXRCbHVyXCJcblxuY2xhc3MgZXhwb3J0cy5JbnB1dExheWVyIGV4dGVuZHMgVGV4dExheWVyXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXG5cdFx0Xy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNGRkZcIlxuXHRcdFx0d2lkdGg6IDM3NVxuXHRcdFx0aGVpZ2h0OiA2MFxuXHRcdFx0cGFkZGluZzpcblx0XHRcdFx0bGVmdDogMjBcblx0XHRcdHRleHQ6IFwiVHlwZSBzb21ldGhpbmcuLi5cIlxuXHRcdFx0Zm9udFNpemU6IDQwXG5cdFx0XHRmb250V2VpZ2h0OiAzMDBcblxuXHRcdGlmIG9wdGlvbnMubXVsdGlMaW5lXG5cdFx0XHRvcHRpb25zLnBhZGRpbmcudG9wID89IDIwXG5cblx0XHRAX2lucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiXG5cblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHQjIEdsb2JhbHNcblx0XHRAX2JhY2tncm91bmQgPSB1bmRlZmluZWRcblx0XHRAX3BsYWNlaG9sZGVyID0gdW5kZWZpbmVkXG5cdFx0QF9pc0Rlc2lnbkxheWVyID0gZmFsc2VcblxuXHRcdCMgTGF5ZXIgY29udGFpbmluZyBpbnB1dCBlbGVtZW50XG5cdFx0QGlucHV0ID0gbmV3IExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRcdFx0bmFtZTogXCJpbnB1dFwiXG5cdFx0XHR3aWR0aDogQHdpZHRoXG5cdFx0XHRoZWlnaHQ6IEBoZWlnaHRcblx0XHRcdHBhcmVudDogQFxuXG5cdFx0IyBUZXh0IGFyZWFcblx0XHRpZiBAbXVsdGlMaW5lXG5cdFx0XHRAX2lucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKVxuXG5cdFx0IyBBcHBlbmQgZWxlbWVudFxuXHRcdEBpbnB1dC5fZWxlbWVudC5hcHBlbmRDaGlsZChAX2lucHV0RWxlbWVudClcblxuXHRcdCMgTWF0Y2ggVGV4dExheWVyIGRlZmF1bHRzIGFuZCB0eXBlIHByb3BlcnRpZXNcblx0XHRAX3NldFRleHRQcm9wZXJ0aWVzKEApXG5cblx0XHQjIFNldCBhdHRyaWJ1dGVzXG5cdFx0QF9pbnB1dEVsZW1lbnQuYXV0b2NvbXBsZXRlID0gXCJvZmZcIlxuXHRcdEBfaW5wdXRFbGVtZW50LmF1dG9jb3JyZWN0ID0gXCJvZmZcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnNwZWxsY2hlY2sgPSBmYWxzZVxuXG5cdFx0IyBUaGUgaWQgc2VydmVzIHRvIGRpZmZlcmVudGlhdGUgbXVsdGlwbGUgaW5wdXQgZWxlbWVudHMgZnJvbSBvbmUgYW5vdGhlci5cblx0XHQjIFRvIGFsbG93IHN0eWxpbmcgdGhlIHBsYWNlaG9sZGVyIGNvbG9ycyBvZiBzZXBlcmF0ZSBlbGVtZW50cy5cblx0XHRAX2lucHV0RWxlbWVudC5jbGFzc05hbWUgPSBcImlucHV0XCIgKyBAaWRcblxuXHRcdCMgQWxsIGluaGVyaXRlZCBwcm9wZXJ0aWVzXG5cdFx0dGV4dFByb3BlcnRpZXMgPVxuXHRcdFx0e0B0ZXh0LCBAZm9udEZhbWlseSwgQGZvbnRTaXplLCBAbGluZUhlaWdodCwgQGZvbnRXZWlnaHQsIEBjb2xvciwgQGJhY2tncm91bmRDb2xvciwgQHdpZHRoLCBAaGVpZ2h0LCBAcGFkZGluZywgQHBhcmVudH1cblxuXHRcdGZvciBwcm9wZXJ0eSwgdmFsdWUgb2YgdGV4dFByb3BlcnRpZXNcblxuXHRcdFx0QG9uIFwiY2hhbmdlOiN7cHJvcGVydHl9XCIsICh2YWx1ZSkgPT5cblx0XHRcdFx0IyBSZXNldCB0ZXh0TGF5ZXIgY29udGVudHNcblx0XHRcdFx0QF9lbGVtZW50SFRNTC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IFwiXCJcblxuXHRcdFx0XHRyZXR1cm4gaWYgQF9pc0Rlc2lnbkxheWVyXG5cdFx0XHRcdEBfc2V0VGV4dFByb3BlcnRpZXMoQClcblx0XHRcdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKEBfaWQsIEBjb2xvcilcblxuXG5cdFx0IyBTZXQgZGVmYXVsdCBwbGFjZWhvbGRlclxuXHRcdEBfc2V0UGxhY2Vob2xkZXIoQHRleHQpXG5cdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKEBfaWQsIEBjb2xvcilcblxuXHRcdCMgUmVzZXQgdGV4dExheWVyIGNvbnRlbnRzXG5cdFx0QF9lbGVtZW50SFRNTC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IFwiXCJcblxuXHRcdCMgQ2hlY2sgaWYgaW4gZm9jdXNcblx0XHRAX2lzRm9jdXNlZCA9IGZhbHNlXG5cblx0XHQjIERlZmF1bHQgZm9jdXMgaW50ZXJhY3Rpb25cblx0XHRAX2lucHV0RWxlbWVudC5vbmZvY3VzID0gKGUpID0+XG5cblx0XHRcdEBmb2N1c0NvbG9yID89IFwiIzAwMFwiXG5cblx0XHRcdCMgRW1pdCBmb2N1cyBldmVudFxuXHRcdFx0QGVtaXQoRXZlbnRzLklucHV0Rm9jdXMsIGV2ZW50KVxuXG5cdFx0XHRAX2lzRm9jdXNlZCA9IHRydWVcblxuXHRcdCMgRW1pdCBibHVyIGV2ZW50XG5cdFx0QF9pbnB1dEVsZW1lbnQub25ibHVyID0gKGUpID0+XG5cdFx0XHRAZW1pdChFdmVudHMuSW5wdXRCbHVyLCBldmVudClcblxuXHRcdFx0QF9pc0ZvY3VzZWQgPSBmYWxzZVxuXG5cdFx0IyBUbyBmaWx0ZXIgaWYgdmFsdWUgY2hhbmdlZCBsYXRlclxuXHRcdGN1cnJlbnRWYWx1ZSA9IHVuZGVmaW5lZFxuXG5cdFx0IyBTdG9yZSBjdXJyZW50IHZhbHVlXG5cdFx0QF9pbnB1dEVsZW1lbnQub25rZXlkb3duID0gKGUpID0+XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBAdmFsdWVcblxuXHRcdFx0IyBJZiBjYXBzIGxvY2sga2V5IGlzIHByZXNzZWQgZG93blxuXHRcdFx0aWYgZS53aGljaCBpcyAyMFxuXHRcdFx0XHRAZW1pdChFdmVudHMuQ2Fwc0xvY2tLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIHNoaWZ0IGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDE2XG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5TaGlmdEtleSwgZXZlbnQpXG5cblx0XHRAX2lucHV0RWxlbWVudC5vbmtleXVwID0gKGUpID0+XG5cblx0XHRcdGlmIGN1cnJlbnRWYWx1ZSBpc250IEB2YWx1ZVxuXHRcdFx0XHRAZW1pdChcImNoYW5nZTp2YWx1ZVwiLCBAdmFsdWUpXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5WYWx1ZUNoYW5nZSwgQHZhbHVlKVxuXG5cdFx0XHQjIElmIGVudGVyIGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDEzXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5FbnRlcktleSwgZXZlbnQpXG5cblx0XHRcdCMgSWYgYmFja3NwYWNlIGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDhcblx0XHRcdFx0QGVtaXQoRXZlbnRzLkJhY2tzcGFjZUtleSwgZXZlbnQpXG5cblx0XHRcdCMgSWYgc3BhY2Uga2V5IGlzIHByZXNzZWRcblx0XHRcdGlmIGUud2hpY2ggaXMgMzJcblx0XHRcdFx0QGVtaXQoRXZlbnRzLlNwYWNlS2V5LCBldmVudClcblxuXHRcdFx0IyBJZiBjYXBzIGxvY2sga2V5IGlzIHByZXNzZWQgdXBcblx0XHRcdGlmIGUud2hpY2ggaXMgMjBcblx0XHRcdFx0QGVtaXQoRXZlbnRzLkNhcHNMb2NrS2V5LCBldmVudClcblxuXHRfc2V0UGxhY2Vob2xkZXI6ICh0ZXh0KSA9PlxuXHRcdEBfaW5wdXRFbGVtZW50LnBsYWNlaG9sZGVyID0gdGV4dFxuXG5cdF9zZXRQbGFjZWhvbGRlckNvbG9yOiAoaWQsIGNvbG9yKSAtPlxuXHRcdGRvY3VtZW50LnN0eWxlU2hlZXRzWzBdLmFkZFJ1bGUoXCIuaW5wdXQje2lkfTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlclwiLCBcImNvbG9yOiAje2NvbG9yfVwiKVxuXG5cdF9jaGVja0RldmljZVBpeGVsUmF0aW86IC0+XG5cdFx0cmF0aW8gPSAoU2NyZWVuLndpZHRoIC8gRnJhbWVyLkRldmljZS5zY3JlZW4ud2lkdGgpXG5cdFx0aWYgVXRpbHMuaXNEZXNrdG9wKClcblx0XHRcdCMgQDN4XG5cdFx0XHRpZiByYXRpbyA8IDAuNSBhbmQgcmF0aW8gPiAwLjI1XG5cdFx0XHRcdGRwciA9IDEgLSByYXRpb1xuXHRcdFx0IyBANHhcblx0XHRcdGVsc2UgaWYgcmF0aW8gaXMgMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gKHJhdGlvICogMilcblx0XHRcdCMgQDF4LCBAMnhcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZHByID0gVXRpbHMuZGV2aWNlUGl4ZWxSYXRpbygpXG5cdFx0XHRpZiBGcmFtZXIuRGV2aWNlLmRldmljZVR5cGUgaXMgXCJmdWxsc2NyZWVuXCJcblx0XHRcdFx0ZHByID0gMlxuXHRcdGVsc2Vcblx0XHRcdCMgQDN4XG5cdFx0XHRpZiByYXRpbyA8IDAuNSBhbmQgcmF0aW8gPiAwLjI1XG5cdFx0XHRcdGRwciA9IDEgLSByYXRpb1xuXHRcdFx0IyBANHhcblx0XHRcdGVsc2UgaWYgcmF0aW8gaXMgMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gKHJhdGlvICogMilcblx0XHRcdCMgQDF4LCBAMnhcblx0XHRcdGVsc2UgaWYgcmF0aW8gaXMgMC41XG5cdFx0XHRcdGRwciA9IDFcblxuXHRcdHJldHVybiBkcHJcblxuXHRfc2V0VGV4dFByb3BlcnRpZXM6IChsYXllcikgPT5cblxuXHRcdGRwciA9IEBfY2hlY2tEZXZpY2VQaXhlbFJhdGlvKClcblxuXHRcdGlmIG5vdCBAX2lzRGVzaWduTGF5ZXJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmZvbnRGYW1pbHkgPSBsYXllci5mb250RmFtaWx5XG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IFwiI3tsYXllci5mb250U2l6ZSAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gbGF5ZXIuZm9udFdlaWdodCA/IFwibm9ybWFsXCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7bGF5ZXIucGFkZGluZy50b3AgKiAyIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiI3tsYXllci5wYWRkaW5nLmJvdHRvbSAqIDIgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ0JvdHRvbSA9IFwiI3tsYXllci5wYWRkaW5nLnJpZ2h0ICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiI3tsYXllci5wYWRkaW5nLmxlZnQgKiAyIC8gZHByfXB4XCJcblxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLndpZHRoID0gXCIjeygobGF5ZXIud2lkdGggLSBsYXllci5wYWRkaW5nLmxlZnQgKiAyKSAqIDIgLyBkcHIpfXB4XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIiN7bGF5ZXIuaGVpZ2h0ICogMiAvIGRwcn1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuY3Vyc29yID0gXCJhdXRvXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53ZWJraXRBcHBlYXJhbmNlID0gXCJub25lXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5yZXNpemUgPSBcIm5vbmVcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLndlYmtpdEZvbnRTbW9vdGhpbmcgPSBcImFudGlhbGlhc2VkXCJcblxuXHRhZGRCYWNrZ3JvdW5kTGF5ZXI6IChsYXllcikgLT5cblx0XHRAX2JhY2tncm91bmQgPSBsYXllclxuXHRcdEBfYmFja2dyb3VuZC5wYXJlbnQgPSBAXG5cdFx0QF9iYWNrZ3JvdW5kLm5hbWUgPSBcImJhY2tncm91bmRcIlxuXHRcdEBfYmFja2dyb3VuZC54ID0gQF9iYWNrZ3JvdW5kLnkgPSAwXG5cdFx0QF9iYWNrZ3JvdW5kLl9lbGVtZW50LmFwcGVuZENoaWxkKEBfaW5wdXRFbGVtZW50KVxuXG5cdFx0cmV0dXJuIEBfYmFja2dyb3VuZFxuXG5cdGFkZFBsYWNlSG9sZGVyTGF5ZXI6IChsYXllcikgLT5cblxuXHRcdEBfaXNEZXNpZ25MYXllciA9IHRydWVcblx0XHRAX2lucHV0RWxlbWVudC5jbGFzc05hbWUgPSBcImlucHV0XCIgKyBsYXllci5pZFxuXHRcdEBwYWRkaW5nID0gbGVmdDogMCwgdG9wOiAwXG5cblx0XHRAX3NldFBsYWNlaG9sZGVyKGxheWVyLnRleHQpXG5cdFx0QF9zZXRUZXh0UHJvcGVydGllcyhsYXllcilcblx0XHRAX3NldFBsYWNlaG9sZGVyQ29sb3IobGF5ZXIuaWQsIGxheWVyLmNvbG9yKVxuXG5cdFx0QG9uIFwiY2hhbmdlOmNvbG9yXCIsID0+XG5cdFx0XHRAX3NldFBsYWNlaG9sZGVyQ29sb3IobGF5ZXIuaWQsIEBjb2xvcilcblxuXHRcdCMgUmVtb3ZlIG9yaWdpbmFsIGxheWVyXG5cdFx0bGF5ZXIudmlzaWJsZSA9IGZhbHNlXG5cdFx0QF9lbGVtZW50SFRNTC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IFwiXCJcblxuXHRcdCMgQ29udmVydCBwb3NpdGlvbiB0byBwYWRkaW5nXG5cdFx0ZHByID0gQF9jaGVja0RldmljZVBpeGVsUmF0aW8oKVxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmZvbnRTaXplID0gXCIje2xheWVyLmZvbnRTaXplICogMiAvIGRwcn1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ1RvcCA9IFwiI3tsYXllci55ICogMiAvIGRwcn1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSBcIiN7bGF5ZXIueCAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLndpZHRoID0gXCIjeyhAX2JhY2tncm91bmQud2lkdGggLSBsYXllci54ICogMikgKiAyIC8gZHByfXB4XCJcblxuXHRcdGlmIEBtdWx0aUxpbmVcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiI3tAX2JhY2tncm91bmQuaGVpZ2h0ICogMiAvIGRwcn1weFwiXG5cblx0XHRAb24gXCJjaGFuZ2U6cGFkZGluZ1wiLCA9PlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ1RvcCA9IFwiI3tAcGFkZGluZy50b3AgKiAyIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIje0BwYWRkaW5nLmxlZnQgKiAyIC8gZHByfXB4XCJcblxuXHRcdHJldHVybiBAX3BsYWNlaG9sZGVyXG5cblx0Zm9jdXM6IC0+XG5cdFx0QF9pbnB1dEVsZW1lbnQuZm9jdXMoKVxuXG5cdEBkZWZpbmUgXCJ2YWx1ZVwiLFxuXHRcdGdldDogLT4gQF9pbnB1dEVsZW1lbnQudmFsdWVcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBfaW5wdXRFbGVtZW50LnZhbHVlID0gdmFsdWVcblxuXHRAZGVmaW5lIFwiZm9jdXNDb2xvclwiLFxuXHRcdGdldDogLT5cblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmNvbG9yXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5jb2xvciA9IHZhbHVlXG5cblx0QGRlZmluZSBcIm11bHRpTGluZVwiLCBAc2ltcGxlUHJvcGVydHkoXCJtdWx0aUxpbmVcIiwgZmFsc2UpXG5cblx0IyBOZXcgQ29uc3RydWN0b3Jcblx0QHdyYXAgPSAoYmFja2dyb3VuZCwgcGxhY2Vob2xkZXIsIG9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHdyYXBJbnB1dChuZXcgQChvcHRpb25zKSwgYmFja2dyb3VuZCwgcGxhY2Vob2xkZXIsIG9wdGlvbnMpXG5cblx0b25FbnRlcktleTogKGNiKSAtPiBAb24oRXZlbnRzLkVudGVyS2V5LCBjYilcblx0b25TcGFjZUtleTogKGNiKSAtPiBAb24oRXZlbnRzLlNwYWNlS2V5LCBjYilcblx0b25CYWNrc3BhY2VLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5CYWNrc3BhY2VLZXksIGNiKVxuXHRvbkNhcHNMb2NrS2V5OiAoY2IpIC0+IEBvbihFdmVudHMuQ2Fwc0xvY2tLZXksIGNiKVxuXHRvblNoaWZ0S2V5OiAoY2IpIC0+IEBvbihFdmVudHMuU2hpZnRLZXksIGNiKVxuXHRvblZhbHVlQ2hhbmdlOiAoY2IpIC0+IEBvbihFdmVudHMuVmFsdWVDaGFuZ2UsIGNiKVxuXHRvbklucHV0Rm9jdXM6IChjYikgLT4gQG9uKEV2ZW50cy5JbnB1dEZvY3VzLCBjYilcblx0b25JbnB1dEJsdXI6IChjYikgLT4gQG9uKEV2ZW50cy5JbnB1dEJsdXIsIGNiKVxuXG53cmFwSW5wdXQgPSAoaW5zdGFuY2UsIGJhY2tncm91bmQsIHBsYWNlaG9sZGVyKSAtPlxuXHRpZiBub3QgKGJhY2tncm91bmQgaW5zdGFuY2VvZiBMYXllcilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dExheWVyIGV4cGVjdHMgYSBiYWNrZ3JvdW5kIGxheWVyLlwiKVxuXG5cdGlmIG5vdCAocGxhY2Vob2xkZXIgaW5zdGFuY2VvZiBUZXh0TGF5ZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5wdXRMYXllciBleHBlY3RzIGEgdGV4dCBsYXllci5cIilcblxuXHRpbnB1dCA9IGluc3RhbmNlXG5cblx0aW5wdXQuX19mcmFtZXJJbnN0YW5jZUluZm8gPz0ge31cblx0aW5wdXQuX19mcmFtZXJJbnN0YW5jZUluZm8/Lm5hbWUgPSBpbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lXG5cblx0aW5wdXQuZnJhbWUgPSBiYWNrZ3JvdW5kLmZyYW1lXG5cdGlucHV0LnBhcmVudCA9IGJhY2tncm91bmQucGFyZW50XG5cdGlucHV0LmluZGV4ID0gYmFja2dyb3VuZC5pbmRleFxuXG5cdGlucHV0LmFkZEJhY2tncm91bmRMYXllcihiYWNrZ3JvdW5kKVxuXHRpbnB1dC5hZGRQbGFjZUhvbGRlckxheWVyKHBsYWNlaG9sZGVyKVxuXG5cdHJldHVybiBpbnB1dCIsIiMgQ3VzdG9tIEV2ZW50c1xuRXZlbnRzLlJlc3VsdFNlbGVjdGVkID0gXCJSZXN1bHRTZWxlY3RlZFwiXG5FdmVudHMuUmVzdWx0R2VuZXJhdGVkID0gXCJSZXN1bHRHZW5lcmF0ZWRcIlxuXG4jIFBET0tcbnBkb2tVUkwgPSBcImh0dHBzOi8vZ2VvZGF0YS5uYXRpb25hYWxnZW9yZWdpc3Rlci5ubC9sb2NhdGllc2VydmVyL3YzL3N1Z2dlc3Q/cT1cIlxuXG4jIENyZWF0ZSBpdGVtIENsYXNzIG9ubHkgdG8gdXNlIHdpdGhpbiB0aGlzIG1vZHVsZSwgbm8gZXhwb3J0c1xuY2xhc3MgUmVzdWx0SXRlbSBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRyZXN1bHRJRDogXCJcIlxuXHRcdFx0cmVzdWx0OiBcIlwiXG5cdFx0XHRyZXN1bHRIaWdobGlnaHRlZDogXCJcIlxuXG5cdFx0QHJlc3VsdElEID0gb3B0aW9ucy5yZXN1bHRJRFxuXHRcdEByZXN1bHQgPSBvcHRpb25zLnJlc3VsdFxuXHRcdEByZXN1bHRIaWdobGlnaHRlZCA9IG9wdGlvbnMucmVzdWx0SGlnaGxpZ2h0ZWRcblxuY2xhc3MgZXhwb3J0cy5BdXRvQ29tcGxldGUgZXh0ZW5kcyBMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRpbnB1dDogW11cblx0XHRcdG1heFJlc3VsdHM6IDVcblx0XHRcdHR5cGU6IFwiYWRyZXNcIlxuXHRcdFx0eDogQWxpZ24uY2VudGVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdHNoYWRvd0NvbG9yOiBcInJnYmEoMCwwLDAsMC4yKVwiXG5cdFx0XHRzaGFkb3dZOiAxXG5cdFx0XHRzaGFkb3dCbHVyOiA4XG5cdFx0XHRib3JkZXJDb2xvcjogXCIjZWRlZGVkXCJcblx0XHRcdHJlc3VsdFN0eWxlOlxuXHRcdFx0XHRmb250U2l6ZTogXCIxNnB4XCJcblx0XHRcdFx0bGluZUhlaWdodDogXCIjezQ4IC8gMTZ9cHhcIlxuXHRcdFx0XHRjb2xvcjogXCIjMzMzXCJcblx0XHRcdFx0cGFkZGluZ1RvcDogXCIyNHB4XCJcblx0XHRcdFx0cGFkZGluZ0xlZnQ6IFwiMTZweFwiXG5cdFx0XHRcdHBhZGRpbmdSaWdodDogXCIxNnB4XCJcblx0XHRcdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCAjY2NjXCJcblx0XHRcdFx0Y29sb3I6IFwiIzMzM1wiXG5cdFx0XHRcdHdoaXRlU3BhY2U6IFwibm93cmFwXCJcblx0XHRcdFx0b3ZlcmZsb3c6IFwiaGlkZGVuXCJcblx0XHRcdFx0dGV4dE92ZXJmbG93OiBcImVsbGlwc2lzXCJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCJcblxuXHRcdEBpbnB1dCA9IG9wdGlvbnMuaW5wdXRcblx0XHRAbWF4UmVzdWx0cyA9IG9wdGlvbnMubWF4UmVzdWx0c1xuXHRcdEB0eXBlID0gb3B0aW9ucy50eXBlXG5cdFx0QHJlc3VsdFN0eWxlID0gb3B0aW9ucy5yZXN1bHRTdHlsZVxuXG5cblx0XHQjIFN0b3JlIHRoZSBvcHRpb25zIGludG8gbmV3IHZhcmlhYmxlcyBmb3IgbGF0ZXIgdXNlXG5cdFx0YXV0b0NvbXBsZXRlQ29udGFpbmVyID0gQFxuXHRcdHR5cGUgPSBAdHlwZVxuXHRcdG1heFJlc3VsdHMgPSBAbWF4UmVzdWx0c1xuXHRcdHN0eWxlUmVzdWx0cyA9IEByZXN1bHRTdHlsZVxuXG5cdFx0IyBQb3NpdGlvbiB0aGUgYXV0b0NvbXBsZXRlXG5cdFx0QF94ID0gQGlucHV0LnNjcmVlbkZyYW1lLnggKyAxXG5cdFx0QF95ID0gQGlucHV0LnNjcmVlbkZyYW1lLnkgKyBAaW5wdXQuaGVpZ2h0ICsgOFxuXHRcdEBfd2lkdGggPSBAaW5wdXQud2lkdGggLSAyXG5cdFx0QHNlbmRUb0JhY2soKVxuXG5cdFx0IyBTaG93IGF1dG8gQ29tcGxldGVpb25zIHdoaWxlIHR5cGluZ1xuXHRcdEBpbnB1dC5vblZhbHVlQ2hhbmdlIC0+XG5cblx0XHRcdGlucHV0ID0gQFxuXG5cdFx0XHQjIFJlc2V0IHRoZSBoZWlnaHQgb2YgdGhlIGF1dG9Db21wbGV0ZUNvbnRhaW5lciB0byAwXG5cdFx0XHRhdXRvQ29tcGxldGVDb250YWluZXIuaGVpZ2h0ID0gMFxuXG5cdFx0XHQjIEZpcnN0IGRlc3Ryb3kgYWxsIGNoaWxkcmVuIG9mIHRoZSBhdXRvQ29tcGxldGVDb250YWluZXJcblx0XHRcdGl0ZW0uZGVzdHJveSgpIGZvciBpdGVtIGluIGF1dG9Db21wbGV0ZUNvbnRhaW5lci5jaGlsZHJlblxuXG5cdFx0XHQjIE9ubHkgc2hvdyBzb21ldGhpbmcgd2hlbiB0aGVyZSBhcmUgMiBjaGFyYWN0ZXJzIG9yIG1vcmVcblx0XHRcdGlmIEB2YWx1ZS5sZW5ndGggPj0gMlxuXG5cdFx0XHRcdCMgRmlyc3Qgc2hvdyB0aGUgYXV0b0NvbXBsZXRlIGNvbnRhaW5lclxuXHRcdFx0XHRhdXRvQ29tcGxldGVDb250YWluZXIuYnJpbmdUb0Zyb250KClcblxuXHRcdFx0XHQjIFRoZW4gbG9hZCB0aGUgZGF0YSBmcm9tIHRoZSBQRE9LIGVuZHBvaW50XG5cdFx0XHRcdGVuZHBvaW50ID0gVXRpbHMuZG9tTG9hZEpTT05TeW5jIHBkb2tVUkwgKyBAdmFsdWUgKyBcIiBhbmQgdHlwZToje3R5cGV9XCJcblxuXHRcdFx0XHQjIFNwbGl0IHRoZSBlbmRwb2ludCBpbiByZXN1bHRzXG5cdFx0XHRcdHJlc3VsdHMgPSBlbmRwb2ludC5yZXNwb25zZS5kb2NzXG5cblx0XHRcdFx0IyBBbmQgaGlnaGxpZ2h0ZWQgcmVzdWx0c1xuXHRcdFx0XHRoaWdobGlnaHRpbmcgPSBlbmRwb2ludC5oaWdobGlnaHRpbmdcblxuXHRcdFx0XHQjIEVtaXQgdGhlIFJlc3VsdEdlbmVyYXRlZCBFdmVudFxuXHRcdFx0XHRhdXRvQ29tcGxldGVDb250YWluZXIuZW1pdChFdmVudHMuUmVzdWx0R2VuZXJhdGVkLCBldmVudClcblxuXHRcdFx0XHQjIExvb3AgdGhyb3VnaCB0aGUgcmVzdWx0cyBhbmQgc2hvdyB0aGUgcmVzdWx0cyBpbiBhIGxpc3Rcblx0XHRcdFx0Zm9yIHJlc3VsdCwgaW5kZXggaW4gcmVzdWx0c1swLi4ubWF4UmVzdWx0c11cblxuXHRcdFx0XHRcdCMgU3RvcmUgdGhlIHVuaXF1ZSBpZCBmb3IgbGF0ZXIgdXNlXG5cdFx0XHRcdFx0aWQgPSByZXN1bHQuaWRcblxuXHRcdFx0XHRcdCMgQ3JlYXRlIHRoZSBpdGVtc1xuXHRcdFx0XHRcdGl0ZW0gPSBuZXcgUmVzdWx0SXRlbVxuXHRcdFx0XHRcdFx0cGFyZW50OiBhdXRvQ29tcGxldGVDb250YWluZXJcblx0XHRcdFx0XHRcdHdpZHRoOiBhdXRvQ29tcGxldGVDb250YWluZXIud2lkdGhcblx0XHRcdFx0XHRcdGhlaWdodDogNDhcblx0XHRcdFx0XHRcdHk6IDQ4ICogaW5kZXhcblx0XHRcdFx0XHRcdCMgRmlsbCB0aGUgaXRlbSB3aXRoIHRoZSBoaWdobGlnaHRlZCBzdWdnZXN0aW9uXG5cdFx0XHRcdFx0XHRyZXN1bHRJRDogaWRcblx0XHRcdFx0XHRcdGh0bWw6IGhpZ2hsaWdodGluZ1tpZF0uc3VnZ2VzdFxuXHRcdFx0XHRcdFx0cmVzdWx0OiByZXN1bHQud2VlcmdhdmVuYWFtXG5cdFx0XHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHRcdFx0c3R5bGVSZXN1bHRzXG5cdFx0XHRcdFx0IyBSZW1vdmUgYm9yZGVyIGZyb20gbGFzdCBpdGVtXG5cdFx0XHRcdFx0aWYgaW5kZXggPT0gbWF4UmVzdWx0cyAtIDFcblx0XHRcdFx0XHRcdGl0ZW0uc3R5bGUuYm9yZGVyQm90dG9tID0gXCJub25lXCJcblxuXG5cblx0XHRcdFx0XHQjIEZvciBlYWNoIHJlc3VsdCBhZGQgdXAgNDhweCB0byB0aGUgaGVpZ2h0IG9mIHRoZSBhdXRvQ29tcGxldGVDb250YWluZXJcblx0XHRcdFx0XHRhdXRvQ29tcGxldGVDb250YWluZXIuaGVpZ2h0ICs9IDQ4XG5cblx0XHRcdFx0XHQjIFRhcHBpbmcgYW4gaXRlbSBwdXRzIGl0cyB2YWx1ZSBpbnRvIHRoZSBpbnB1dCBmaWVsZCBhbmQgdHJpZ2dlcnMgdGhlIHJlc3VsdFNlbGVjdGVkIEV2ZW50XG5cdFx0XHRcdFx0aXRlbS5vblRhcCAtPlxuXHRcdFx0XHRcdFx0aW5wdXQudmFsdWUgPSBAcmVzdWx0XG5cdFx0XHRcdFx0XHRhdXRvQ29tcGxldGVDb250YWluZXIucmVzdWx0ID0gQHJlc3VsdFxuXHRcdFx0XHRcdFx0YXV0b0NvbXBsZXRlQ29udGFpbmVyLnJlc3VsdEhpZ2hsaWdodGVkID0gaGlnaGxpZ2h0aW5nW0ByZXN1bHRJRF0uc3VnZ2VzdFxuXG5cdFx0XHRcdFx0XHQjIEhpZGUgdGhlIGF1dG9Db21wbGV0ZUNvbnRhaW5lclxuXHRcdFx0XHRcdFx0YXV0b0NvbXBsZXRlQ29udGFpbmVyLnNlbmRUb0JhY2soKVxuXHRcdFx0XHRcdFx0YXV0b0NvbXBsZXRlQ29udGFpbmVyLmVtaXQoRXZlbnRzLlJlc3VsdFNlbGVjdGVkLCBldmVudClcblxuXG5cbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBRUFBO0FEQ0EsSUFBQSxtQkFBQTtFQUFBOzs7QUFBQSxNQUFNLENBQUMs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
