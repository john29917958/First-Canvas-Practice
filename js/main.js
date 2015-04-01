/**
 * Initialization function.
 *
 * @param {Object} $canvas The <canvas> jQuery object.
 * @return {Object} Returns the <canvas> jQuery
 * object if initialization succeeded, reutrn
 * False otherwise.
 */
function init($canvas) {
	var context;

	if ($canvas.length > 0) {
		styleInit($canvas);
		bindDrawEvent($canvas);
		bindClearEvent($('button.btn-clear'), $canvas);
		//handleWindowResize($canvas);
		return $canvas;
	}
	else {
		return null;
	}
}

/**
 * Initializes the style of the canvas.
 *
 * @param {Object} $canvas The <canvas> jQuery object.
 */
function styleInit($canvas) {
	var context = $canvas[0].getContext('2d');

	$canvas[0].width = 800;
	$canvas[0].height = $(window).height() / 2;
	context.strokeStyle = '#66FF66';
	context.shadowColor = context.strokeStyle;
	context.shadowBlur = 5;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
}

/**
 * Binding all functions to implement the drawing
 * feature of canvas.
 *
 * @param {Object} $canvas The <canvas> jQuery object.
 */
function bindDrawEvent($canvas) {
	var context = $canvas[0].getContext('2d');

	$canvas.mousedown(function (e) {
		var pos = getMousePosition($canvas[0], e);

		$canvas.mousemove(function (e) {
			var newPos = getMousePosition($canvas[0], e);

			drawLine(context, {x: pos.x, y: pos.y}, {x: newPos.x, y: newPos.y});
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
function bindClearEvent($button, $canvas) {
	var context = $canvas[0].getContext('2d');

	$button.click(function (e) {
		context.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
	});
}

function handleWindowResize($canvas) {
	var context = $canvas[0].getContext('2d');

	$(window).resize(function () {
		context.save();
		$canvas.unbind();
		$(window).unbind('resize');
		init($canvas);
		context.restore();
	});
}

/**
 * Retrieves the current position of mouse
 * on canvas.
 *
 * @param {Object} $canvas The <canvas> jQuery object.
 * @param {Object} evt The event object.
 * @return {Object} Returns the mouse position object
 * containing x-axis and y-axis value.
 */
function getMousePosition(canvas, evt) {
	var rect = canvas.getBoundingClientRect();

	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

/**
 * Draw line onto canvas.
 *
 * @param {Object} context The 2D context of canvas.
 * @param {Object} from The start point of line.
 * @param {Object} to The end point of line.
 * @param {String} color The color of line (optional).
 */
function drawLine(context, from, to, color) {
	if (color) {
		context.strokeStyle = color;
	}

	context.beginPath();
	context.moveTo(from.x, from.y);
	context.lineTo(to.x, to.y);
	context.stroke();
	context.closePath();
}

/** Entry point of JavaScript. **/
$(document).ready(function () {
	var $myCanvas = $("#myCanvas");

	init($myCanvas);
});