class Layer {
    constructor(resource) {
        var context = this;
        this.sprite = new PIXI.Sprite(resource.texture);

        this.scaleDownIfNeeded();

        // Center model in scene
        context.sprite.x = DD.pixi.renderer.width / 2;
        context.sprite.y = DD.pixi.renderer.height / 2;

        // Set model's anchor to it's center so it appears
        // right in the middle of the screen
        context.sprite.anchor.x = 0.5;
        context.sprite.anchor.y = 0.5;

        // Let it be
        DD.pixi.stage.addChild(context.sprite);
    }

    scaleDownIfNeeded () {
        var maxModelDimension = Math.max(this.sprite.width, this.sprite.height);
        var minWindowDimension = Math.min(window.innerWidth, window.innerHeight);
        if (maxModelDimension > minWindowDimension) {
            var newScale = minWindowDimension / maxModelDimension
            this.sprite.scale.x = newScale;
            this.sprite.scale.y = newScale;
        }
    }
}

// Dimensions des images telles que récupérées sur lesindépendantes
var sceneWidth = 900;
var sceneHeight = 900;
var displacementFilter;
var displacementSprite;
var mask = null;

var DD = {
    init: function () {
        // Create a Pixi app and append it's canvas to the DOM
        DD.pixi = new PIXI.Application({
            width: sceneWidth,
            height: sceneHeight
        });
        document.body.appendChild(DD.pixi.view);
        DD.pixi.renderer.transparent = true;

        PIXI.loader
            .add('background', '../img/model.png')
            .add('dress', '../img/masking-experiments/dress.png')
            .add('cutout', '../img/masking-experiments/model-cutout.png')
            .on('progress', DD.loadProgressHandler)
            .load(DD.onResourcesLoaded);

        var slider = document.getElementById('js-dress-length-slider');
        slider.addEventListener('input', function(e){
            DD.dressMask.update(this.value);
        })

        var toggleMaskBtn = document.getElementById('js-toggle-mask-btn');
        toggleMaskBtn.addEventListener('click', function(e){
            if (DD.dress.sprite.mask) {
                DD.dress.sprite.mask = null
            } else {
                DD.dress.sprite.mask = DD.dressMask.graphics
            }
        })
    },
    loadProgressHandler: function(loader, resource){
        // Could later on be used to display a loader!
        //Display the file `url` currently being loaded
        console.log("loading: " + resource.name);

        //Display the precentage of files currently loaded
        console.log("progress: " + loader.progress + "%");
    },
    onResourcesLoaded: function(loader, resources) {
        // Once every asset is loaded, we can now add them to the screen in the correct order.
        // pixijs doesn't provide an easy way to explicit a zOrder per texture.
        // Worth checking out: https://github.com/pixijs/pixi.js/issues/300#issuecomment-86127171
        // and https://pixijs.github.io/examples/#/display/zorder.js
        DD.background = new Layer(resources.background);
        DD.dress = new Layer(resources.dress);
        //DD.model = new Layer(resources.cutout);

        // Add a displacement map to the dress, so the mask doesnt make "perfect computer cuts"
        displacementSprite = PIXI.Sprite.fromImage('../img/displacement-map.png');
        displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
        DD.pixi.stage.addChild(displacementSprite);
        //DD.dress.sprite.filters = [displacementFilter];

        DD.sleeves.init();
    },
    sleeves: {
        init: function(){
			/*
			 // AVEC UN GRAPHICS
			 DD.dress.sprite.alpha = 0;
			 var mask = new PIXI.Graphics();
			 mask.beginFill(0xFF00BB, 0.25);
			 mask.drawRect(100, 100, 200, 200);
			 mask.endFill();
			 DD.pixi.stage.addChild(mask);
			 DD.background.sprite.mask = mask;
			 */
			/*
            // AVEC UNE TEXTURE
            mask = PIXI.Sprite.fromImage('../img/sleeves/sleeves-1-alpha-mask.png');
            DD.pixi.stage.addChild(mask);
            DD.dress.sprite.mask = mask;
            */
			// AVEC UN SVG TRANSFÉRÉ SUR UN CANVAS
            var canvas = document.getElementById('sleeves-mask');
            var ctx = canvas.getContext('2d');

            // Fill canvas with black
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw our mask in white
            var svg = document.getElementById('sleeves-1-mask').outerHTML;
            ctx.fillStyle = "white";
            ctx.drawSvg(svg, 0, 0, 900, 900);

            //var texture =
            mask = new PIXI.Sprite(new PIXI.Texture.fromCanvas(canvas));
            DD.pixi.stage.addChild(mask);
            DD.dress.sprite.mask = mask;
        },
    }
}
DD.init();