'use strict';

var Swatches = (function() {
  var instance, $swatches;

  /**
   * Creates a Swatches.
   * @class
   * @constructor
   *
   * @param {Object} $s The Swatches panel jQuery object.
   * @return {Object} Returns an instance of Swatches if
   * the number of given Swatches panel is one, returns
   * Null otherwise.
   */
  function Swatches($s) {
    if ($s.length === 1) {
      instance = this;
      $swatches = $s;
      $swatches.find('.swatch-item').each(function (index, item) {
        $(item).css('background-color', $(item).attr('data-color'));
      });
      this.getCurrentColorElements().$input.focusin(function () {
        var $tutorial = $('.tutorial[data-type="color"]');

        if ($tutorial) {
          $tutorial.slideDown('slow');
        }
      });
    }
    else {
      return null;
    }
  }

  /**
   * Gets all swatch items.
   *
   * @return {Object} Returns all swatch items.
   */
  Swatches.prototype.getSwatchItems = function() {
    return $swatches.find('.swatch-item');
  };

  /**
   * Gets the current color in rgb(R, G, B, A) form.
   *
   * @return {JSON} Return the current color.
   */
  Swatches.prototype.getCurrentColor = function() {
    var currentColor = $swatches.find('.current-color > .swatch-item').css('background-color'),
        colorPattern = /[0-9][0-9]?[0-9]?/,
        opacityPattern = /([0]\.[0-9][0-9]?|1)/,
        r, g, b, a;

    r = colorPattern.exec(currentColor);
    currentColor = currentColor.replace(r, '');
    g = colorPattern.exec(currentColor);
    currentColor = currentColor.replace(g, '');
    b = colorPattern.exec(currentColor);
    currentColor = currentColor.replace(b, '');
    a = opacityPattern.exec(currentColor);
    if (a === null) {
      a = 1;
    }

    return {
      r: r,
      g: g,
      b: b,
      a: a
    };
  };

  /**
   * Retrives the elements which is response of presenting
   * what current color is.
   *
   * @return {Object} Returns a JSON object which contains
   * two jQuery object: $swatch and an input field - $input.
   */
  Swatches.prototype.getCurrentColorElements = function() {
    var $currentColorPanel = $swatches.children('.current-color');

    return {
      $swatch: $currentColorPanel.children('.swatch-item'),
      $input: $currentColorPanel.children('.color-name')
    };
  };

  /**
   * Set the current color.
   *
   * @param {String} color The color to be set.
   */
  Swatches.prototype.setColor = function(color) {
    var currentColor = this.getCurrentColorElements();
    
    currentColor.$swatch.css('background-color', color);
    currentColor.$input.val(color);
  };

  return Swatches;
})();

var AdjustBar = (function () {
  /**
   * Creates an AdjustBar.
   * @class 
   */
  function AdjustBar(bar) {
    if ($(bar).length === 1) {
      this.$adjustBar = $(bar);
      this.$increaseButton = this.$adjustBar.children('.increase');
      this.$decreaseButton = this.$adjustBar.children('.decrease');
      this.$input = this.$adjustBar.children('input');
      this.currentValue = 0;
      this.$input.click(function (e) {
        $(this).select();
      });
      /*
      $input.focusin(function () {
        var $tutorial = $('.tutorial[data-type="line-width"]');
        if ($tutorial) {
          $tutorial.slideDown();
        }
      });
      */
    }
    else {
      return null;
    }
  }

  /**
   * Gets all components of AdjustBar as jQuery
   * objects.
   *
   * @return {JSON} Returns a JSON object containing
   * all components of AdjustBar as jQuery objects.
   */
  AdjustBar.prototype.getElements = function() {
    return {
      $increaseButton: this.$increaseButton,
      $decreaseButton: this.$decreaseButton,
      $input: this.$input
    };
  };

  /**
   * Gets the current value.
   *
   * @return {Integer} Returns the current value.
   */
  AdjustBar.prototype.getValue = function() {
    return this.currentValue;
  };

  /**
   * Set the current value.
   *
   * @param {Integer} value The value to be set.
   */
  AdjustBar.prototype.setValue = function(value) {
    this.currentValue = value;
    this.$input.val(value);
  }

  return AdjustBar;
})();

var LineWidthResizer = (function () {
  /**
   * Creates a LineWidthResizer.
   * @class
   * @constructor
   *
   * @param {Selector} | {Object} resizer The line
   * width resizer HTML element or CSS selector.
   * @return {Object} Returns an instance of
   * LineWidthResizer. Returns Null if the given
   * parameter is invalid.
   */
  function LineWidthResizer(resizer) {
    if ($(resizer).length === 1) {
      AdjustBar.call(this, resizer);
      this.setValue(1);
      this.$input.val(this.$input.val() + 'px');
    }
    else {
      return null;
    }
  }

  // LineWidthResizer extends AdjustBar.
  LineWidthResizer.prototype = Object.create(AdjustBar.prototype);
  LineWidthResizer.prototype.constructor = LineWidthResizer;

  /**
   * Set the current line width.
   *
   * @param {Integer} | {String} width The width of line.
   * @return {Integer} Returns the width back if setting
   * is succeeded, returns 0 if setting is failed.
   */
  LineWidthResizer.prototype.setLineWidth = function(width) {
    var pixelPattern = /[1-9][0-9]*/;

    if (pixelPattern.test(width) && width < 9999) {
      this.setValue(width);
      this.$input.val(this.$input.val() + 'px');

      return width;
    }
    else {
      this.$input.val(this.getValue() + 'px');

      return 0;
    }
  };

  /**
   * Gets the current line width.
   *
   * @return {Integer} Returns the current line width.
   */
  LineWidthResizer.prototype.getLineWidth = function() {
    return this.getValue();
  };

  return LineWidthResizer;
})();

var OpacityManager = (function () {
  function OpacityManager(opacityManager) {
    if ($(opacityManager).length === 1) {
      AdjustBar.call(this, opacityManager);
      this.setValue(100);
      this.$input.val(this.$input.val() + '%');
    }
    else {
      return null;
    }
  }

  // OpacityManager extends AdjustBar.
  OpacityManager.prototype = Object.create(AdjustBar.prototype);
  OpacityManager.prototype.constructor = OpacityManager;

  /**
   * Set the opacity value.
   *
   * @param {Integer} opacity The opacity by 100% ratio to be set.
   * @return {Integer} Returns the set opacity value, returns -1 if
   * setting failed.
   */
  OpacityManager.prototype.setOpacity = function(opacity) {
    var opacityPattern = /[0-9][0-9]?[0-9]?/;

    if (opacityPattern.test(opacity) && opacity <= 100) {
      this.setValue(opacity);
      this.$input.val(this.$input.val() + '%');

      return this.getValue();
    }
    else {
      this.$input.val(this.getValue() + '%');

      return -1;
    }
  };

  /**
   * Gets the current opacity value by 100%.
   *
   * @return {Integer} Returns the current opacity value.
   */
  OpacityManager.prototype.getOpacity = function() {
    return this.getValue();
  };

  return OpacityManager;
})();

var Canvas = (function() {
  var instance, $canvas, context, currentColor;

  /**
   * Initializes the style of the canvas.
   *
   * @param {Object} $c The <canvas> jQuery object.
   */
  function styleInit() {
    $canvas[0].width = 800;
    $canvas[0].height = $(window).height() * 2 / 3;
    instance.setColor('lawngreen');
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
  }

  /**
   * Binding all functions to implement the drawing
   * feature of canvas.
   *
   * @param {Object} $canvas The <canvas> jQuery object.
   */
  function bindDrawEvent() {
    var mousePressed = false,
        pos = null;

    $canvas.mouseout(function (e) {
      mousePressed = false;
    });

    $canvas.mousedown(function (e) {
      mousePressed = true;
      pos = instance.getMousePosition($canvas[0], e);
    });

    $canvas.mouseup(function (e) {
      mousePressed = false;
      pos = null;
    });

    $canvas.mousemove(function (e) {
      var newPos;

      if (mousePressed) {
        newPos = instance.getMousePosition($canvas[0], e);
        instance.drawLine({x: pos.x, y: pos.y}, {x: newPos.x, y: newPos.y});
        pos = newPos;
      }
    });
  }

  /**
   * Binding the event of cleaning canvas when
   * the button clicked.
   *
   * @param {Object} $button The clear button jQuery object.
   * @param {Object} $canvas The <canvas> jQuery object.
   */
  function bindClearEvent() {
    $('button.btn-clear').click(function (e) {
      context.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
    });
  }

  /**
   * Creates a Canvas.
   * @class
   * @constructor
   *
   * @param {Object} $c The canvas jQuery object.
   * @return {Object} Returns a Canvas instance if
   * the number of given canvas jQuery object is one,
   * returns Null otherwise.
   */
  function Canvas($c) {
    if ($c.length == 1) {
      instance = this;
      $canvas = $c;
      context = $canvas[0].getContext('2d');

      styleInit();
      bindDrawEvent();
      bindClearEvent();
    }
    else {
      return null;
    }
  }

   
  /**
   * Draw line onto canvas.
   *
   * @param {Object} context The 2D context of canvas.
   * @param {Object} from The start point of line.
   * @param {Object} to The end point of line.
   * @param {String} color The color of line (optional).
   */
  Canvas.prototype.drawLine = function(from, to) {
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.closePath();
  };

  /**
   * Retrieves the current position of mouse
   * on canvas.
   *
   * @param {Object} $canvas The <canvas> jQuery object.
   * @param {Object} evt The event object.
   * @return {Object} Returns the mouse position object
   * containing x-axis and y-axis value.
   */
  Canvas.prototype.getMousePosition = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();

    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  /**
   * Set the current color.
   *
   * @param {String} color The color to be set.
   */
  Canvas.prototype.setColor = function(color) {
    context.strokeStyle = color;
    context.shadowColor = context.strokeStyle;
    currentColor = color;
  };

  /**
   * Gets the current color.
   *
   * @return {String} Returns the current color.
   */
  Canvas.prototype.getColor = function() {
    return currentColor;
  }

  /**
   * Set the line width.
   *
   * @param {Integer} The width of line.
   */
  Canvas.prototype.setLineWidth = function(lineWidth) {
    context.lineWidth = lineWidth;
  };

  return Canvas;
})();

var PainterActionController = (function () {
  var instance, canvas, swatches, lineWidthResizer, opacityManager;

  /**
   * Bind all event handlers to elements.
   */
  function registerActions() {
    // Clicked on swatche items.
    swatches.getSwatchItems().click(function() {
      instance.switchColor($(this).attr('data-color'));
    });

    // Typed and entered on input on swatches panel.
    swatches.getCurrentColorElements().$input.keydown(function (e) {
      var color;

      if (e.keyCode === 13 && (color = $(this).val())) {
        instance.switchColor(color);
      }
    });

    // Increase line width by 1 if increase button clicked.
    lineWidthResizer.getElements().$increaseButton.click(function () {
      instance.setLineWidth(lineWidthResizer.getLineWidth() + 1);
    });

    // Decrease line width by 1 if decrease button cliecked.
    lineWidthResizer.getElements().$decreaseButton.click(function () {
      instance.setLineWidth(lineWidthResizer.getLineWidth() - 1);
    });

    // Set the line width by the value of input of LineWidthResizer.
    lineWidthResizer.getElements().$input.keydown(function (e) {
      if (e.keyCode === 13) {
        instance.setLineWidth($(this).val());
      }
    });

    // Increase line opacity by 1 if increase button clicked.
    opacityManager.getElements().$increaseButton.click(function () {
      instance.setOpacity(opacityManager.getOpacity() + 1);
    });

    // Decrease line opacity by 1 if increase button clicked.
    opacityManager.getElements().$decreaseButton.click(function () {
      instance.setOpacity(opacityManager.getOpacity() - 1);
    });

    // Set the line opacity by the value of input of OpacityManager.
    opacityManager.getElements().$input.keydown(function (e) {
      if (e.keyCode === 13) {
        instance.setOpacity($(this).val());
      }
    });
  }

  /**
   * Creates a PainterActionController.
   * @class
   * @constructor
   *
   * @param {Object} c A Canvas object.
   * @param {Object} s A Swatches object.
   * @param {Object} l A LineWidthResizer object.
   * @param {Object} o An OpacityManager object.
   * @return {Object} Returns an instance of
   * PainterActionController if the given
   * Canvas and Swatches instance exists,
   * returns Null otherwise.
   */
  function PainterActionController(c, s, l, o) {
    if (c && s) {
      instance = this;
      canvas = c;
      swatches = s;
      lineWidthResizer = l;
      opacityManager = o;

      registerActions();
    }
    else {
      return null;
    }
  }

  /**
   * Switch color when a swatch item on Swatches panel is clicked.
   *
   * @param {String} color The color to be set.
   */
  PainterActionController.prototype.switchColor = function(color) {
    swatches.setColor(color);
    canvas.setColor(color);
    opacityManager.setOpacity(100);
  };

  /**
   * Set the line width to LineWidthResizer and Canvas.
   *
   * @param {Integer} line
   */
  PainterActionController.prototype.setLineWidth = function(lineWidth) {
    var width = lineWidthResizer.setLineWidth(lineWidth);

    if (width > 0) {
      canvas.setLineWidth(width);
    }
    else {
      alert('Wow~ that\'s amazing!\nBut I\'m unable to do that for you :(\nPlease make sure the input is digit, is greater than 0 and is less than 9999.\nThank you :)');
    }
  };

  /**
   * Set the line opacity to OpacityManager, Canvas and Swatches.
   *
   * @param {Integer} opacity The opacity to be set.
   */
  PainterActionController.prototype.setOpacity = function(opacity) {
    var opacity = opacityManager.setOpacity(opacity),
        currentColor = swatches.getCurrentColor(),
        newColor = 'rgba(' + currentColor.r + ',' + currentColor.g + ',' + currentColor.b + ',' + opacity / 100 + ')';

    if (opacity !== -1) {
      canvas.setColor(newColor);
      swatches.setColor(newColor);
    }
    else {
      alert('Wow~ that\'s amazing!\nBut I\'m unable to do that for you :(\nPlease make sure the input is digit, and is within 0~100.\nThank you :)');
    }
  };

  return PainterActionController;
})();

function initTutorials() {
  var $tutorials = $('.tutorial');

  $tutorials.find('.btn-close').click(function () {
    var tutorial = $(this).closest('.tutorial');

    $(tutorial).animate({
      top: -800
    }, 1000, function () {
      $(tutorial).remove();
    });
  });
}

/** Entry point of JavaScript. **/
$(document).ready(function () {
  var canvas = new Canvas($("#myCanvas")),
      swatches = new Swatches($(".swatches")),
      lineWidthResizer = new LineWidthResizer($('.line-width-resizer')),
      opacityManager = new OpacityManager($('.opacity-manager')),
      painterActionController = new PainterActionController(canvas, swatches, lineWidthResizer, opacityManager);
      initTutorials();
});