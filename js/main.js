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
    var currentColorPanel = this.getCurrentColorElements();
    
    currentColorPanel.$swatch.css('background-color', color);
    currentColorPanel.$input.val(color);
  };

  return Swatches;
})();

var Canvas = (function() {
  var instance, $canvas, context;

  /**
   * Initializes the style of the canvas.
   *
   * @param {Object} $c The <canvas> jQuery object.
   */
  function styleInit() {
    $canvas[0].width = 800;
    $canvas[0].height = $(window).height() / 2;
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
    $canvas.mousedown(function (e) {
      var pos = instance.getMousePosition($canvas[0], e);

      $canvas.mousemove(function (e) {
        var newPos = instance.getMousePosition($canvas[0], e);

        instance.drawLine({x: pos.x, y: pos.y}, {x: newPos.x, y: newPos.y});
        pos = newPos;
      });
    }).mouseup(function (e) {
      $canvas.unbind('mousemove');
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
  }

  return Canvas;
})();

var PainterActionController = (function () {
  var instance, canvas, swatches;

  /**
   * Bind all event handlers to elements.
   */
  function registerRoutes() {
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
  }

  /**
   * Creates a PainterActionController.
   * @class
   * @constructor
   *
   * @param {Object} c A Canvas object.
   * @param {Object} s A Swatches object.
   * @return {Object} Returns an instance of
   * PainterActionController if the given
   * Canvas and Swatches instance exists,
   * returns Null otherwise.
   */
  function PainterActionController(c, s) {
    if (c && s) {
      instance = this;
      canvas = c;
      swatches = s;

      registerRoutes();
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
    canvas.setColor(color);
    swatches.setColor(color);
  };

  return PainterActionController;
})();

/** Entry point of JavaScript. **/
$(document).ready(function () {
  var canvas = new Canvas($("#myCanvas")),
      swatches = new Swatches($(".swatches")),
      painterActionController = new PainterActionController(canvas, swatches);
});