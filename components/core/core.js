$(document).ready(function(){
    
    var btnNext = $('#btnNext');
    var mapa = $('#mapa');
    btnNext.hide();
    initialize();
    
    /**
     * @function - carregamento da page completo.
     * @autor Julio Silva 09/11/2016
     * @constructor - Inicializador da aplicação
     */
    function initialize(){

        //vars
        var stage;
        var navPoints = {
            objMap: undefined,
            objectsStage: []
        };
        var mapa = {
            objStage: undefined,
            objCore: undefined
        };
        var currentPoint = 0;

        mapa.objCore = new MapCore(core);

        function core() {

            //criar o obj stage
            stage = new createjs.Stage("canvas");

            //criar o obj mapa
            mapa.objStage = new createjs.Bitmap(mapa.objCore.getPathImage());

            //adicionar mapa ao stage
            stage.addChild(mapa.objStage);

            //obter os pontos no mapa.
            navPoints.objMap = mapa.objCore.getMap().getNavPoints();

            //criar os objetos no stage
            for(var i = 0; i < navPoints.objMap.length; i++){

                var point = new createjs.Bitmap('images/point.png');
                point.x = navPoints.objMap[i].point.x;
                point.y = navPoints.objMap[i].point.y;
                navPoints.objectsStage.push(point);
                stage.addChild(point);
            }

            /*
             createjs.Ticker.setFPS(60);
             createjs.Ticker.addEventListener("tick", stage);
             */

            navPoints.objMap[currentPoint].animation(stage);
        };
        
        btnNext.show();
        btnNext.unbind("click");
        btnNext.click(function(){
            if( !mapa.objCore.getMap().isAnimating() ){
                currentPoint++;
                if(currentPoint > (mapa.objCore.getMap().getNavPoints().length - 1) )
                    currentPoint = 0;
                navPoints.objMap[currentPoint].animation(stage);
            }
        });
    };
    
    /**
     * @function - Core para controle de mapa.
     * @autor Julio Silva 09/11/2016
     * @constructor - Class
     */
    function MapCore(callback){

        var _self = this;
        var _mapDiv = document.getElementById('mapa');
        var _mapImage;
        var _pathImage;
        var _map = new Map();
        var _canvas;
        
        /**
         * @function Carregar um mapa (imagem)
         */
        _self.loadMap = function _loadMap(){

            if(!_map.getCurrentMap()){
                console.log("Não há um mapa definido");
                return;
            }

            _self.imgCreate("images/" + _map.getCurrentMap());
        };

        /**
         * @function Criar elemento img
         */
        _self.imgCreate =  function __imgCreate(src, alt, title) {

            _mapImage =  new Image() || document.createElement('img');

            _mapImage.onload = function __onloadImage(e){

                _map.setImageSize({width:_mapImage.clientWidth, height: _mapImage.clientHeight});

                _self.createCanvas(_mapImage.width,_mapImage.height);

                if (callback && typeof callback == 'function') {

                    callback();
                }
            };

            _mapImage.src = src;

            _pathImage = src;

            if (alt != undefined)
                _mapImage.alt = alt;

            if (title != undefined)
                _mapImage.title = title;
        };

        /**
         * @function Criar elemento canvas
         */
        _self.createCanvas = function __createCanvas(_width, _height) {

            _self.destroyCanvas();
            _canvas  = document.createElement('canvas');
            _canvas.setAttribute("id", "canvas");
            _canvas.setAttribute("width", _width);
            _canvas.setAttribute("height", _height);
            _mapDiv.appendChild(_canvas);

            debugMousePosition();

        };

        /**
         * @function Obter coordenadas click mouse no canvas
         */
        function debugMousePosition(){

            _canvas.addEventListener("mousedown", getPosition, false);

            function getPosition(event) {
                var x = event.x;
                var y = event.y;

                var canvas = document.getElementById("canvas");

                x -= canvas.offsetLeft;
                y -= canvas.offsetTop;

                console.log("x:" + x + " y:" + y);
            }
        }

        /**
         * @function Destruir elemento canvas
         */
        _self.destroyCanvas = function __destroyCanvas() {

            if ( _mapDiv != null )
                if ( _canvas != null )
                    _mapDiv.removeChild( _canvas );
        };

        /**
         * GETTERS
         */
        _self.getMapDiv = function _getMapDiv(){
            return _mapDiv;
        };
        _self.getMapImage = function _getMapImage(){
            return _mapImage;
        };
        _self.getPathImage = function _getPathImage(){
            return _pathImage;
        };
        _self.getMap = function _getMap(){
            return _map;
        };
        _self.getCanvas = function _getCanvas(){
            return _canvas;
        };

        _self.loadMap();
    };

    /**
     * @function - configuração do mapa.
     * @autor Julio Silva 09/11/2016
     * @constructor - singleton (static)
     */
    function Map(){

            //ref.
            var _self = this;

            //properties
            var currentMap = 'map2.png';
            var list = ['map1.png', 'map2.png'];
            var size = {
                width: '1103 px',
                height: '875 px'
            };
            var navPoints = [
                {
                    point: {x:400, y:100},
                    animation: function (_stage, _callback) {
                        _animationState = true;
                        _stage.alpha = 0;
                        _stage.x = 0;
                        _stage.y = 0;
                        _stage.scaleX = 1;
                        _stage.scaleY = 1;
                        createjs.Tween.get(_stage, {loop: false})
                                .to({alpha: 1}, 1500, createjs.Ease.getPowInOut(2))
                                .to({x: 0, scaleX: 3, scaleY: 3}, 3000, createjs.Ease.getPowInOut(4))
                                .call( internalCallback, [_callback] );
                        executeAnimation(_stage);
                    }
                },
                {
                    point: {x:145, y:90},
                    animation: function (_stage, _callback) {
                        _animationState = true;
                        createjs.Tween.get(_stage, {loop: false})
                            .to({x: 0, y:0, scaleX: 1, scaleY: 1}, 1500, createjs.Ease.getPowInOut(4))
                            .to({x: -620, scaleX: 3, scaleY: 3}, 3000, createjs.Ease.getPowInOut(4))
                            .call( internalCallback, [_callback] );
                        executeAnimation(_stage);
                    }
                },
                {
                    point: {x:880, y:175},
                    animation: function (_stage, _callback) {
                        _animationState = true;
                        createjs.Tween.get(_stage, {loop: false})
                                .to({x: 0, y:0, scaleX: 1, scaleY: 1}, 1500, createjs.Ease.getPowInOut(4))
                                .to({x: -2000, y:-300, scaleX: 3, scaleY: 3}, 3000, createjs.Ease.getPowInOut(4))
                                .call( internalCallback, [_callback] );
                        executeAnimation(_stage);
                    }
                },
                {
                    point: {x:1130, y:275},
                    animation: function (_stage, _callback) {
                        _animationState = true;
                        createjs.Tween.get(_stage, {loop: false})
                                .to({x: 0, y:0, scaleX: 1, scaleY: 1}, 1500, createjs.Ease.getPowInOut(4))
                                .to({x: -2750, y:-500, scaleX: 3, scaleY: 3}, 3000, createjs.Ease.getPowInOut(4))
                                .call( internalCallback, [_callback] );
                        executeAnimation(_stage);
                    }
                },
                {
                    point: {x:600, y:400},
                    animation: function (_stage, _callback) {
                        _animationState = true;
                        createjs.Tween.get(_stage, {loop: false})
                            .to({x: 0, y:0, scaleX: 1, scaleY: 1}, 1500, createjs.Ease.getPowInOut(4))
                            .to({x: -1250, y: -890,scaleX: 3, scaleY: 3}, 3000, createjs.Ease.getPowInOut(4))
                            .call(internalCallback, [_callback]);
                        executeAnimation(_stage);
                    }
                }
            ];
            var imgSize = {
                width:'0',
                height: '0'
            };
            var _animationState = false;

            _self.setCurrentMap = function __setCurrentMap(_map){

                if( typeof _size !== 'string'){
                    console.warn('setCurrentMap deve conter uma string: "100px"');
                    return;
                }

                currentMap = _map;
            };

            _self.getCurrentMap = function __getCurrentMap( ){
                return currentMap;
            };

            _self.getMapsList = function __getMapsList( ){
                return list;
            };

            _self.setMapSize = function __setMapSize(_size){

                if( typeof _size !== 'object'){
                    console.warn('setMapSize deve conter um objeto com propriedades width e height');
                    return;
                }

                size = _size;
            };

            _self.getMapSize = function __getMapSize( ){
                return size;
            };

            _self.setNavPoints = function __setNavPoints(_navPoints){

                if( typeof _navPoints !== 'array'){
                    console.warn('setNavPoints deve ser um array');
                    return;
                }

                navPoints = _navPoints;
            };

            _self.getNavPoints = function __getNavPoints( ){
                return navPoints;
            };

            _self.addNavPoint = function __addNavPoint(_navPoint){

                if( typeof _navPoints !== 'object'){
                    console.warn('setNavPoint deve ser um objeto -> {x:"0px", y:"0px"}');
                    return;
                }

                navPoints.push(_navPoints);
            };

            _self.removeNavPoints = function __removeNavPoints(_index){

                if ( navPoints[_index] == undefined )
                    return;

                navPoints.splice(1, _index);
            };

            _self.setImageSize = function __setImageSize(_imgSize){

                if( typeof _imgSize !== 'object'){
                    console.warn('setImageSize deve conter um objeto: {width:"0", height:"0"}');
                    return;
                }

                imgSize = _imgSize;
            };

            _self.getImageSize = function __getImageSize( ){
                return currentMap;
            };

            _self.isAnimating = function __isAnimating( ){
                return _animationState;
            };

            function executeAnimation(_stage){
                createjs.Ticker.setFPS(60);
                createjs.Ticker.addEventListener("tick", _stage);
            };

            function internalCallback(_callback){

                _animationState = false;

                if ( typeof _callback == 'function')
                    _callback();
            };
        };
    
});
 
