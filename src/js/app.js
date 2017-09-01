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
		
		// Bring the giiiiirlz
		DD.model.load('src/img/model.png');
		
		// Cover them up!
		DD.dress.load('src/img/dress.png');
		
		// Create a mask for the sleeves
		//DD.sleeves.init();
	},
	model: {
		loader: null,
		load: function (texture) {
			DD.model.loader = new PIXI.loaders.Loader();
			DD.model.loader.add('model', texture).load(function(loader, resources) {
				DD.model.sprite = new PIXI.Sprite(resources.model.texture);

				DD.utils.scaleDownIfNeeded(DD.model.sprite);

				// Center model in scene
				DD.model.sprite.x = DD.pixi.renderer.width / 2;
				DD.model.sprite.y = DD.pixi.renderer.height / 2;

				// Set model's anchor to it's center so it appears
				// right in the middle of the screen
				DD.model.sprite.anchor.x = 0.5;
				DD.model.sprite.anchor.y = 0.5;

				// Let it be
				DD.pixi.stage.addChild(DD.model.sprite);
			});
		},
		sprite: null,
	},
	dress: {
		loader: null,
		load: function (texture) {
			DD.dress.loader = new PIXI.loaders.Loader();
			DD.dress.loader.add('dress', texture).load(function(loader, resources) {
				DD.dress.sprite = new PIXI.Sprite(resources.dress.texture);

				DD.utils.scaleDownIfNeeded(DD.dress.sprite);

				// Center model in scene
				DD.model.sprite.x = DD.pixi.renderer.width / 2;
				DD.model.sprite.y = DD.pixi.renderer.height / 2;

				// Set model's anchor to it's center so it appears
				// right in the middle of the screen
				DD.model.sprite.anchor.x = 0.5;
				DD.model.sprite.anchor.y = 0.5;

				// Let it be
				DD.pixi.stage.addChild(DD.dress.sprite);
			});
		},
		sprite: null,
	},
	sleeves: {
		init: function () {
			var sleevesMask = new PIXI.Graphics();

			// set a fill and line style
			sleevesMask.beginFill(0xFF3300);
			sleevesMask.lineStyle(10, 0xffd900, 1);

			// draw a shape
			sleevesMask.moveTo(400, 250);
			sleevesMask.lineTo(250, 50);
			sleevesMask.lineTo(100, 100);
			sleevesMask.lineTo(250, 220);
			sleevesMask.lineTo(50, 220);
			sleevesMask.lineTo(50, 50);
			sleevesMask.endFill();
			
			DD.pixi.stage.addChild(sleevesMask);
			console.log(sleevesMask);
		}
	},
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