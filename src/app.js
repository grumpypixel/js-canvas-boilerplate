// Example specific code is marked with <dummy> tags.
// Remove or comment-out those lines and blocks and start adding your own code :)

let app = null;

function run(selector, settings) {
	app = new App();
	if (app.init(selector, settings) === false) {
		console.log('Meh. Could not initialize app.');
		return;
	}
	window.addEventListener("resize", onResize);
	window.addEventListener("mousedown", onMouseDown, false);
	setTimeout(() => {
		const canvas = app.getCanvas(); // <dummy/>
		particleAt(canvas.width / 2, canvas.height / 2); // <dummy/>
		window.requestAnimationFrame(updateFrame);
	}, 1);
}

function onResize() {
	app.handleResizeEvent();
}

function onMouseDown(e) {
	particleAt(e.offsetX, e.offsetY); // <dummy/>
}

// <dummy>
function particleAt(x, y) {
	const position = {
		x,
		y,
	};

	const velocity = Util.randomNormal();
	velocity.multiplyScalar(Util.randomFloat(10, 50));

	const radius = Util.randomInt(5, 10)
	const colors = ['#29adbe', '#795cea', '#aa0e4c', '#b8d527', '#fd5f22', '#fd9527'];
	const color = colors[Util.randomInt(0, colors.length - 1)];

	app.createParticle(position, velocity, radius, color);
} // </dummy>

function updateFrame() {
	app.update();
	window.requestAnimationFrame(updateFrame);
}

class App {
	constructor() {
		const _ = this;
		_.bounds = null;
		_.canvas = null;
		_.particles = []; // <dummy/>
		_.settings = {};
		_.timer = null;
	}

	init(selector, settings) {
		const _ = this;

		_.settings = this._mergeSettings(settings);

		const id = selector || _.settings.canvas.defaultSelector;
		_.canvas = _._initCanvas(id);
		if (!_.canvas) {
			return false;
		}

		const {
			width,
			height
		} = _.settings.canvas.fullscreen === true ? _._getWindowSize() : _._getCanvasSize();

		if (_.settings.canvas.fullscreen === true) {
			_._resizeCanvas(width, height);
		}

		_.bounds = new Bounds(0, 0, width, height);
		_._updateBounds(width, height);

		_.timer = new Timer();
		_.timer.start();

		return true;
	}

	update() {
		const _ = this;

		_.timer.update();

		const ctx = _.canvas.getContext('2d');
		if (_.settings.canvas.clear === true) {
			ctx.clearRect(0, 0, _.canvas.width, _.canvas.height);
		}

		if (_.settings.canvas.background.fill === true) {
			ctx.fillStyle = _.settings.canvas.background.style;
			ctx.fillRect(0, 0, _.canvas.width, _.canvas.height);
		}

		// <dummy>
		const deltaTime = _.timer.deltaTime;
		const count = _.particles.length;
		for (let i = 0; i < count; ++i) {
			const particle = _.particles[i];
			particle.update(deltaTime, _.bounds);
			particle.render(ctx);
		} // </dummy>

		// [YOUR RENDER CODE HERE]
		// e.g. Renderer.drawSolidCircleOutline(ctx, _.canvas.width / 2, _.canvas.height / 2, 100, '#f12711', '#111', 4);

		if (_.settings.debug.enable === true) {
			const debug = _.settings.debug;
			if (debug.fps.show === true) {
				const text = debug.fps.prefix + (_.timer.unscaledDeltaTime * 1000).toFixed(0);
				Renderer.drawText(ctx, 0, _.canvas.height - 4, text, debug.color, 'left', debug.font);
			}
		}
	}

	handleResizeEvent() {
		const _ = this;
		if (_.settings.canvas.fullscreen === false) {
			return;
		}

		const {
			width,
			height
		} = _._getWindowSize();


		_._resizeCanvas(width, height);

		const oldBounds = _.bounds.clone();
		_._updateBounds(width, height);
		_._repositionParticles(oldBounds, _.bounds); // <dummy/>
	}

	// <dummy>
	createParticle(position, velocity, radius, color) {
		const particle = new Particle();
		particle.position.set(position.x, position.y);
		particle.velocity.set(velocity.x, velocity.y);
		particle.radius = radius;
		particle.color = color;
		this.particles.push(particle);
	} // </dummy>

	getCanvas() {
		return this.canvas;
	}

	_initCanvas(selector) {
		const element = document.getElementById(selector);
		if (!element) {
			return null;
		}
		if (element.tagName.toLowerCase() === 'canvas') {
			return element;
		}
		const canvas = this._createCanvas(element, selector);
		element.appendChild(canvas);
		return canvas;
	}

	_createCanvas(selector) {
		const _ = this;
		const canvas = document.createElement('canvas');
		const id = `${!selector ? 'canvas' : selector}-${Date.now()}`;
		canvas.setAttribute('id', id);
		canvas.width = _.settings.canvas.creation.width;
		canvas.height = _.settings.canvas.creation.height;
		canvas.style = _.settings.canvas.creation.style;
		return canvas;
	}

	_resizeCanvas(width, height) {
		const _ = this;
		_.canvas.style.width = width + 'px';
		_.canvas.style.height = height + 'px';

		_.canvas.width = width;
		setTimeout(() => {
			_.canvas.height = height;
		}, 1);
	}

	_getCanvasSize() {
		const _ = this;
		const width = _.canvas.width;
		const height = _.canvas.height;
		return {
			width,
			height
		};
	}

	_getWindowSize() {
		const width = document.body.clientWidth;
		const height = document.body.clientHeight;
		return {
			width,
			height
		};
	}

	_updateBounds(width, height) {
		this.bounds.set(0, 0, width, height);
	}

	_mergeSettings(settings) {
		const s = getDefaultSettings();
		if (!settings) {
			return s;
		}
		let t = Object.assign({}, settings);
		return deepExtend(t, s)
	}

	// <dummy>
	_repositionParticles(oldBounds, newBounds) {
		const _ = this;
		const count = _.particles.length;
		for (let i = 0; i < count; ++i) {
			const particle = _.particles[i];
			particle.position.set(
				Util.mapRange(particle.position.x, oldBounds.min.x, oldBounds.max.x, newBounds.min.x, newBounds.max.x),
				Util.mapRange(particle.position.y, oldBounds.min.y, oldBounds.max.y, newBounds.min.y, newBounds.max.y)
			);
		}
	} // </dummy>
}

// <dummy>
class Particle {
	constructor() {
		const _ = this;
		_.position = new Vector2();
		_.velocity = new Vector2();
		_.color = '#f00';
		_.radius = 32;
	}

	update(deltaTime, bounds) {
		const _ = this;
		_.position.addScaledVector(_.velocity, deltaTime);

		const x = _.position.x;
		const y = _.position.y;
		const r = _.radius;

		if (x - r < bounds.min.x) {
			_.position.x = bounds.min.x + r;
			_.velocity.x = -_.velocity.x;
		} else if (x + r > bounds.max.x) {
			_.position.x = bounds.max.x - r;
			_.velocity.x = -_.velocity.x;
		}
		if (y - r < bounds.min.y) {
			_.position.y = bounds.min.y + r;
			_.velocity.y = -_.velocity.y;
		} else if (y + r > bounds.max.y) {
			_.position.y = bounds.max.y - r;
			_.velocity.y = -_.velocity.y;
		}
	}

	render(ctx) {
		const _ = this;
		Renderer.drawSolidCircle(ctx, _.position.x, _.position.y, _.radius, _.color);
	}
} // </dummy>

class Renderer {
	static drawLine(ctx, x1, y1, x2, y2, color, width) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = color;
		ctx.lineWidth = width || 1;
		ctx.stroke()
	}

	static drawCircle(ctx, x, y, radius, color, lineWidth) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth || 1;
		ctx.stroke();
	}

	static drawSolidCircle(ctx, x, y, radius, color) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		if (color) {
			ctx.fillStyle = color;
			ctx.fill();
		}
	}

	static drawSolidCircleOutline(ctx, x, y, radius, color, outlineColor, outlineWidth) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		if (color) {
			ctx.fillStyle = color;
			ctx.fill();
		}
		if (outlineColor) {
			ctx.strokeStyle = outlineColor;
			ctx.lineWidth = outlineWidth;
			ctx.stroke();
		}
	}

	static drawRect(ctx, x, y, width, height, color, lineWidth) {
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.strokeRect(x, y, width, height);
	}

	static drawSolidRect(ctx, x, y, width, height, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);
	}

	static drawText(ctx, x, y, text, color, align, font) {
		ctx.font = font || '16px Verdana';
		ctx.fillStyle = color || '#f0f';
		ctx.textAlign = align || 'center';
		ctx.fillText(text, x, y);
	}
}

class Vector2 {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	addScaledVector(v, s) {
		this.x += v.x * s;
		this.y += v.y * s;
		return this;
	}

	multiplyScalar(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}
}

class Bounds {
	constructor(minx, miny, maxx, maxy) {
		this.min = new Vector2(minx, miny);
		this.max = new Vector2(maxx, maxy);
	}

	set(minx, miny, maxx, maxy) {
		this.min.set(minx, miny);
		this.max.set(maxx, maxy);
	}

	width() {
		return this.max.x - this.min.x;
	}

	height() {
		return this.max.y - this.min.y;
	}

	center() {
		return new Vector2(
			this.width() / 2,
			this.height() / 2
		);
	}

	clone() {
		return new Bounds(this.min.x, this.min.y, this.max.x, this.max.y);
	}
}

class Timer {
	constructor() {
		this.reset();
	}

	start() {
		const _ = this;
		if (_.running) {
			return;
		}
		const now = _.now();
		_.startTime = now;
		_.lastTime = now;
		_.running = true;
	}

	stop() {
		this.running = false;
	}

	toggle() {
		if (this.running) {
			this.stop();
		} else {
			this.start();
		}
	}

	setTimeScale(scale) {
		this.timeScale = scale;
	}

	update() {
		const _ = this;
		if (_.running === false) {
			_.deltaTime = 0;
			return;
		}

		const now = _.now();
		_.totalElapsedTime = now - _.startTime;
		_.elapsedSinceLastFrame = now - _.lastTime;
		_.lastTime = now;

		_.unscaledDeltaTime = _.elapsedSinceLastFrame / 1000.0;
		_.deltaTime = _.unscaledDeltaTime * _.timeScale;
		_.frameCount++;
	}

	now() {
		return Date.now();
	}

	reset() {
		const _ = this;
		_.frameCount = 0;
		_.timeScale = 1.0;
		_.totalElapsedTime = 0;
		_.startTime = null;
		_.lastTime = null;
		_.elapsedSinceLastFrame = 0;
		_.deltaTime = 0.0;
		_.unscaledDeltaTime = 0.0;
		_.running = false;
	}
}

class Util {
	static randomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static randomFloat(min, max) {
		return Math.random() * (max - min) + min;
	}

	static randomNormal() {
		const a = Util.randomFloat(0, Math.PI * 2);
		return new Vector2(Math.cos(a), Math.sin(a));
	}

	static mapRange(x, x0, x1, y0, y1) {
		return (x - x0) * (y1 - y0) / (x1 - x0) + y0;
	}
}

// see https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
// and https://stackoverflow.com/a/48218209
function deepExtend(target, source) {
	const isObject = (obj) => obj && typeof obj === 'object';
	if (!isObject(target) || !isObject(source)) {
		return source;
	}
	Object.keys(source).forEach(key => {
		const targetValue = target[key];
		const sourceValue = source[key];
		if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
			target[key] = targetValue;
		} else if (isObject(targetValue) && isObject(sourceValue)) {
			target[key] = deepExtend(Object.assign({}, targetValue), sourceValue);
		} else {
			target[key] = targetValue !== undefined ? targetValue : sourceValue;
		}
	});
	return target;
}

function getDefaultSettings() {
	return {
		canvas: {
			clear: true,
			fullscreen: true,
			defaultSelector: 'app',
			background: {
				fill: false,
				style: '#400',
			},
		},
		debug: {
			enable: false,
			color: '#ff00ff',
			font: 'bold 16px Courier',
			fps: {
				show: false,
				prefix: 'fps:',
			},
		},
	};
}