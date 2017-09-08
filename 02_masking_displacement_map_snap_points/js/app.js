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

class Mask {
    constructor(selectElementId) {
        var context = this;

        // Rafraîchit le masque lorsqu'on change le select
        this.selectElement = document.getElementById(selectElementId);
        this.selectElement.addEventListener('change', function(){
            context.update(context)
        });

        DD.masks.push(this);

        // On met à jour l'object sleeve lors de l'init pour qu'il récupère le masque initial
        this.update(context);
    }

    update (ctx) {
        var selectedOption = ctx.selectElement.options[ctx.selectElement.options.selectedIndex];
        var sleevesSVGMaskId = selectedOption.dataset.maskid;
        ctx.svgMask = document.getElementById(sleevesSVGMaskId).outerHTML;
        console.log(sleevesSVGMaskId);
        DD.maskLayer.update();
    }
}

// Dimensions des images telles que récupérées sur lesindépendantes
var sceneWidth = 900;
var sceneHeight = 900;
var tilingSprite = null;

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
            .add('pattern', '../img/patterns/drops2.png')
            .on('progress', DD.loadProgressHandler)
            .load(DD.onResourcesLoaded);

        var toggleDebugBtn = document.getElementById('js-toggle-mask-btn');
        toggleDebugBtn.addEventListener('click', function(e){
            document.getElementById('js-mask').classList.toggle('debug');
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

        DD.maskLayer.init();
        DD.sleeves = new Mask('js-select-sleeves');
        DD.neck = new Mask('js-select-neck');
        DD.back = new Mask('js-select-back');
        DD.length = new Mask('js-select-length');

        DD.patterns.init(resources.pattern);
    },
    masks: [],
    maskLayer: {
        init: function () {
            this.canvasElement = document.getElementById('js-mask');
            this.ctx = this.canvasElement.getContext('2d');

            // Create mask sprite
            this.sprite = new PIXI.Sprite();
            this.texture = new PIXI.Texture.fromCanvas(this.canvasElement);
            this.sprite.texture = this.texture;

            // Assign it to the dress srpite
            DD.dress.sprite.mask = this.sprite;
        },
        update: function () {
            // Fill canvas with WHITE, white "let throught"
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

            // For each "element", draw selected mask to canvas in BLACK, black "masks"
            this.ctx.fillStyle = "black";
            for (var i = DD.masks.length - 1; i >= 0; i--) {
                /*canvg(this.canvasElement, DD.masks[i].svgMask, {
                    ignoreDimensions: true,
                    ignoreClear: true
                });*/

                this.ctx.drawSvg(DD.masks[i].svgMask, 0, 0, 900, 900, {
                    ignoreDimensions: true,
                    ignoreClear: true
                });
            }

            // Update texture, mask will auto-update
            this.texture.update();
        },
        canvasElement: null,
        ctx: null,
        sprite: null,
        texture: null,
    },
    patterns: {
        init: function (resource) {
            //var patternSprite = new PIXI.Sprite(resource.texture);
            tilingSprite = new PIXI.TilingSprite(resource.texture, window.innerWidth, window.innerHeight);
            DD.pixi.stage.addChild(tilingSprite);
            tilingSprite.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
            tilingSprite.mask = DD.maskLayer.sprite;
        }
    }

};
DD.init();