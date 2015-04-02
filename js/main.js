function Swatches($s) {
	var instance, $swatches;

	/**
	 * Creates a Swatches.
	 * @class
	 * @constructor
	 */
	function Swatches($s) {
		if ($s.length === 1) {
			instance = this;
			$swatches = $s;
			$swatches.find('.swatch-item').each(function (index, item) {
				$(item).css('background-color', $(item).attr('data-color'));
				$(item).click(function () {
					$swatches.find('.current-color > .swatch-item').css('background-color', $(item).attr('data-color'));
					$swatches.find('.current-color > input[name="color"]').val($(item).attr('data-color'));
				});
			});
		}
		else {
			return null;
		}
	}

	Swatches.prototype = {
		/**
		 * Gets all swatch items.
		 *
		 * @return {Object} Returns all swatch items.
		 */
		getSwatchItems: function() {
			return $swatches.find('.current-color > .swatch-item');
		}
	};

	return new Swatches($s);
}

function Canvas($c) {
	var instance, $canvas, context;

	/**
	 * Initializes the style of the canvas.
	 *
	 * @param {Object} $c The <canvas> jQuery object.
	 */
	function styleInit() {
		$canvas[0].width = 800;
		$canvas[0].height = $(window).height() / 2;
		context.strokeStyle = 'lawngreen';
		context.shadowColor = context.strokeStyle;
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

	Canvas.prototype = {
		/**
		 * Draw line onto canvas.
		 *
		 * @param {Object} context The 2D context of canvas.
		 * @param {Object} from The start point of line.
		 * @param {Object} to The end point of line.
		 * @param {String} color The color of line (optional).
		 */
		drawLine: function(from, to) {
			context.beginPath();
			context.moveTo(from.x, from.y);
			context.lineTo(to.x, to.y);
			context.stroke();
			context.closePath();
		},

		/**
		 * Retrieves the current position of mouse
		 * on canvas.
		 *
		 * @param {Object} $canvas The <canvas> jQuery object.
		 * @param {Object} evt The event object.
		 * @return {Object} Returns the mouse position object
		 * containing x-axis and y-axis value.
		 */
		getMousePosition: function(canvas, evt) {
			var rect = canvas.getBoundingClientRect();

			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}
	};

	return new Canvas($c);
};

/** Entry point of JavaScript. **/
$(document).ready(function () {
	var canvas = new Canvas($("#myCanvas"));
	var swatches = new Swatches($(".swatches"));
});