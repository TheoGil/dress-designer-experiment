class Layer {
	constructor(name, src) {
		var context = this;
		this.loader = new PIXI.loaders.Loader();
		this.sprite = null;
		
		this.loader.add(name, src).load(function(loader, resources) {
			context.sprite = new PIXI.Sprite(resources[name].texture);
			
			DD.utils.scaleDownIfNeeded(context.sprite);

			// Center model in scene
			context.sprite.x = DD.pixi.renderer.width / 2;
			context.sprite.y = DD.pixi.renderer.height / 2;

			// Set model's anchor to it's center so it appears
			// right in the middle of the screen
			context.sprite.anchor.x = 0.5;
			context.sprite.anchor.y = 0.5;

			// Let it be
			DD.pixi.stage.addChild(context.sprite);
		});
	}

	get area() {
		return this.calcArea();
	}

	calcArea() {
		return this.largeur * this.hauteur;
	}
}

// Dimensions des images telles que récupérées sur lesindépendantes
var sceneWidth = 900;
var sceneHeight = 900;

var DD = {
	init: function () {
		// Create a Pixi app and append it's canvas to the DOM
		DD.pixi = new PIXI.Application({
			width: sceneWidth,
			height: sceneHeight
		});
		document.body.appendChild(DD.pixi.view);
	},
	background: new Layer('background', 'src/img/model.png'),
	dress: new Layer('dress', 'src/img/masking-experiments/dress.png'),
	model: new Layer('model', 'src/img/masking-experiments/model-cutout.png'),
	utils: {
		scaleDownIfNeeded: function(sprite) {
			var maxModelDimension = Math.max(sprite.width, sprite.height);
			var minWindowDimension = Math.min(window.innerWidth, window.innerHeight);
			if (maxModelDimension > minWindowDimension) {
				var newScale = minWindowDimension / maxModelDimension
				sprite.scale.x = newScale;
				sprite.scale.y = newScale;
			}
		}
	}
}
DD.init();