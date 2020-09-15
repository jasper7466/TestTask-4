!function(t){var e={};function s(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,s),o.l=!0,o.exports}s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)s.d(i,o,function(e){return t[e]}.bind(null,o));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=28)}([function(t,e,s){"use strict";s.r(e),s.d(e,"images",(function(){return i})),s.d(e,"superSprites",(function(){return o})),s.d(e,"config",(function(){return n}));var i={tile:s(1),tileBlock:s(2),field:s(3),moves:s(4),bar:s(5),barBack:s(6),scorePanel:s(7),topPanel:s(8),background:s(9),startBackground:s(10),progressPanel:s(11),pauseBase:s(12),pauseHover:s(13),pausePress:s(14),buttonBase1:s(15),buttonHover1:s(16),buttonPress1:s(17),buttonBase2:s(18),buttonHover2:s(19),buttonPress2:s(20)},o={blue:s(21),purple:s(22),red:s(23),yellow:s(24),green:s(25),brown:s(26)},n={screenWidth:1e3,screenHeight:700,gridWidth:500,gridHeight:500,gridX:50,gridY:150,cellsX:7,cellsY:7,variety:5,scoreToWin:2e3,movesLimit:50,shuffles:3,minGroup:2,superGroup:4,boosters:2,boostR:1,preloaderDelay:1500}},function(t,e,s){t.exports=s.p+"./images/tile.png"},function(t,e,s){t.exports=s.p+"./images/blocks.png"},function(t,e,s){t.exports=s.p+"./images/field.png"},function(t,e,s){t.exports=s.p+"./images/moves.png"},function(t,e,s){t.exports=s.p+"./images/bar.png"},function(t,e,s){t.exports=s.p+"./images/bar_back.png"},function(t,e,s){t.exports=s.p+"./images/score_panel.png"},function(t,e,s){t.exports=s.p+"./images/top_panel.png"},function(t,e,s){t.exports=s.p+"./images/background.png"},function(t,e,s){t.exports=s.p+"./images/start_background.png"},function(t,e,s){t.exports=s.p+"./images/progress_panel.png"},function(t,e,s){t.exports=s.p+"./images/pause_base.png"},function(t,e,s){t.exports=s.p+"./images/pause_hover.png"},function(t,e,s){t.exports=s.p+"./images/pause_press.png"},function(t,e,s){t.exports=s.p+"./images/button1_base.png"},function(t,e,s){t.exports=s.p+"./images/button1_hover.png"},function(t,e,s){t.exports=s.p+"./images/button1_press.png"},function(t,e,s){t.exports=s.p+"./images/button2_base.png"},function(t,e,s){t.exports=s.p+"./images/button2_hover.png"},function(t,e,s){t.exports=s.p+"./images/button2_press.png"},function(t,e,s){t.exports=s.p+"./images/bolt-1-blue.png"},function(t,e,s){t.exports=s.p+"./images/bolt-2-purple.png"},function(t,e,s){t.exports=s.p+"./images/bolt-3-red.png"},function(t,e,s){t.exports=s.p+"./images/bolt-4-yellow.png"},function(t,e,s){t.exports=s.p+"./images/bolt-5-green.png"},function(t,e,s){t.exports=s.p+"./images/bolt-6-brown.png"},function(t,e,s){},function(t,e,s){"use strict";s.r(e);s(27);var i=s(0);function o(t,e){return t=Math.ceil(t),e=Math.floor(e),Math.floor(Math.random()*(e-t+1))+t}class n{constructor(t,e,s,i,o){this._cellsX=t,this._cellsY=e,this._variety=s-1,this._minGroup=i,this._superGroup=o,this._field=[],this._empty_cell=-1,this._super_cell=s,this._group=void 0}init(){this._field=[];for(let t=0;t<this._cellsY;t++)for(let e=0;e<this._cellsX;e++){let s={type:this._empty_cell,x:e,y:t,dx:e,dy:t};this._field.push(s)}this.randomFill()}randomFill(){const t=this._field.filter(t=>t.type===this._empty_cell);return t.forEach(t=>t.type=o(0,this._variety)),t}getCell(t,e){return this._field.find(s=>s.x==t&&s.y==e)}setSuperCell(t,e){this.getCell(t,e).type=this._super_cell}isSupercell(t,e){return this.getCell(t,e).type==this._super_cell}_getGroup(t,e,s,i=[]){const o=t>=0&&t<this._cellsX,n=e>=0&&e<this._cellsY;if(!o||!n)return i;if(void 0===s)return s=this.getCell(t,e).type,this._getGroup(t,e,s,i);if(this.getCell(t,e).type!=s)return i;if(i.find(s=>s.x==t&&s.y==e))return i;i.push({x:t,y:e});return[{x:t+1,y:e},{x:t-1,y:e},{x:t,y:e+1},{x:t,y:e-1}].forEach(t=>this._getGroup(t.x,t.y,s,i)),i}getGroup(t,e){return this.getCell(t,e).type==this._super_cell?this._group=this.getCross(t,e):this._group=this._getGroup(t,e),this._group}getCross(t,e){this._group=[];for(let t=0;t<this._cellsX;t++)this._group.push({x:t,y:e});for(let e=0;e<this._cellsY;e++)this._group.push({x:t,y:e});return this._group}getRadius(t,e,s){const i=Math.max(t-s,0),o=Math.min(t+s,this._cellsX-1),n=Math.max(e-s,0),h=Math.min(e+s,this._cellsY-1);this._group=[];for(let t=i;t<=o;t++)for(let e=n;e<=h;e++)this._group.push({x:t,y:e});return this._group}getRow(t,e){const s=[];for(let t=0;t<this._cellsX;t++)s.push({x:t,y:e});return this._group=s,this._group}clearCell(t,e){this.getCell(t,e).type=this._empty_cell}clearGroup(){this._group.forEach(t=>this.clearCell(t.x,t.y))}isEmpty(t,e){return this.getCell(t,e).type==this._empty_cell}swapCells(t,e,s,i){let o=this.getCell(t,e),n=this.getCell(s,i);o.x=s,o.y=i,n.x=t,n.y=e}getChanges(){return this._field.filter(t=>(t.x!=t.dx||t.y!=t.dy)&&t.type!=this._empty_cell)}fixChanges(){this._field.forEach(t=>{t.dx=t.x,t.dy=t.y})}collapse(){this.clearGroup();for(let t=0;t<this._cellsX;t++){let e=0;for(let s=this._cellsY-1;s>=0;s--)this.isEmpty(t,s)?e++:this.swapCells(t,s,t,s+e)}}shuffle(){this._field.forEach(t=>{let e=o(0,this._field.length-1);this.swapCells(t.x,t.y,this._field[e].x,this._field[e].y)})}getMoves(){let t=0,e=this._field.slice(0);for(;e.length>0;){const s=e[0],i=this._getGroup(s.x,s.y);i.length>=this._minGroup&&t++,i.forEach(t=>{e=e.filter(e=>e.x!=t.x||e.y!=t.y)})}return t}}class h{constructor(t,e,s,i){this._container=t,this._canvas=document.createElement("canvas"),this._canvas.width=e,this._canvas.height=s,this._ctx=this._canvas.getContext("2d"),this._renderQueue=[],this._renderScene=void 0,this._taskQueue=[],this._stopEngine=!0,this._background_color=i,this._background_image=void 0,this._canvas.textContent="Sorry, but your browser is not supported :(",this._canvas.addEventListener("mousedown",t=>this._mouseDown(t)),this._canvas.addEventListener("mouseup",t=>this._mouseUp(t)),this._canvas.addEventListener("mousemove",t=>this._mouseMove(t)),this.deploy()}getContext(){return this._ctx}deploy(){this._container.appendChild(this._canvas)}setBackgroundImage(t){this._background_image=t}retract(){this._container.removeChild(this._canvas)}clear(){this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height),this._background_image?this._ctx.drawImage(this._background_image,0,0,this._canvas.width,this._canvas.height):this._background_color&&(this._ctx.fillStyle=this._background_color,this._ctx.fillRect(0,0,this._canvas.width,this._canvas.height))}addLayer(t){this._renderQueue.push(t)}addTask(t){this._taskQueue.push(t)}clearTasks(){this._taskQueue=[]}setScene(t){this._renderScene=t}clearScene(){this._renderScene=void 0}renderEngineStart(){this._stopEngine=!1,this._renderStep()}renderEngineStop(){this._stopEngine=!0}_renderStep(){this._stopEngine||(this.clear(),this._renderScene?this._renderScene.render(this._ctx):this._renderQueue.forEach(t=>t.render(this._ctx)),this._taskQueue.forEach(t=>t()),requestAnimationFrame(()=>this._renderStep()))}_mouseDown(t){let e=t.offsetX,s=t.offsetY;this._renderScene?this._renderScene.onPress(e,s):this._renderQueue.forEach(t=>t.onPress(e,s))}_mouseUp(t){let e=t.offsetX,s=t.offsetY;this._renderScene?this._renderScene.onRelease(e,s):this._renderQueue.forEach(t=>t.onRelease(e,s))}_mouseMove(t){let e=t.offsetX,s=t.offsetY;this._renderScene?this._renderScene.onMove(e,s):this._renderQueue.forEach(t=>t.onMove(e,s))}}class r{constructor(t){this.imageFiles=t,this.images={}}load(){const t=[];for(let e in this.imageFiles)t.push(this._loadImage(e,this.imageFiles[e]));return Promise.all(t)}_loadImage(t,e){return new Promise((s,i)=>{const o=new Image;this.images[t]=o,o.onload=()=>s(t),o.onerror=s=>{console.log(`Image load error: ${t}, ${e}`),i(s)},o.src=e})}}class a{constructor(){this.images=[]}init(t,e){this._image=t,this._divider=e,this._spriteWidth=t.width/e}split(){const t=document.createElement("canvas"),e=t.getContext("2d"),s=[];t.width=this._spriteWidth,t.height=this._image.height;for(let i=0;i<this._divider;i++)e.clearRect(0,0,t.width,t.height),s.push(this._splitPart(t,e,i));return Promise.all(s)}_splitPart(t,e,s){return new Promise((i,o)=>{const n=new Image,h=this._spriteWidth*s,r=this._spriteWidth,a=t.height;e.drawImage(this._image,h,0,r,a,0,0,t.width,t.height);const l=t.toDataURL("image/png");n.onload=()=>i(n),n.onerror=t=>{console.log("Image load error: "+l),o(t)},this.images.push(n),n.src=l})}}class l{constructor(){this._x=0,this._y=0,this._dx=0,this._dy=0,this._width=0,this._height=0,this._anchorX=0,this._anchorY=0,this._background=void 0,this._alpha=1,this._borders={leftTop:0,rightTop:0,leftBottom:0,rightBottom:0},this._hitbox={left:0,right:0,top:0,bottom:0},this._clickHandler=void 0,this._pressHandler=void 0,this._releaseHandler=void 0,this._hoverHandler=void 0,this._hoverInHandler=void 0,this._hoverOutHandler=void 0,this._removeHandler=void 0,this._isPressed=!1,this._isHovered=!1,this._eEnabled=!0,this._serialTaskQueue=[],this._parallelTaskQueue=[]}setPosition(t,e){this._x=t,this._y=e,this._refresh()}_refresh(){this._dx=this._x-this._width*this._anchorX,this._dy=this._y-this._height*this._anchorY,this._borders.leftTop=this._dx,this._borders.leftTop=this._dx;const t=this._width*this._anchorX,e=this._height*this._anchorY;this._x,this._width,this._hitbox.left,this._x,this._width,this._width,this._hitbox.right,this._y,this._height,this._hitbox.top,this._y,this._height,this._height,this._hitbox.bottom}getPosition(){return{x:this._x,y:this._y}}setX(t){this._x=t,this._refresh()}setY(t){this._y=t,this._refresh()}setSize(t,e){this._width=t,this._height=e,this._refresh()}getSize(){return{width:this._width,height:this._height}}setAnchor(t,e){this._anchorX=t,this._anchorY=e,this._refresh()}setHitbox(t,e,s,i){this._hitbox.left=t,this._hitbox.right=e,this._hitbox.top=s,this._hitbox.bottom=i}setBackgroundImage(t){this._background=t}resizeOnBackground(){this._width=this._background.width,this._height=this._background.height,this._refresh()}scaleOnBackground(t){this._width=this._background.width*t,this._height=this._background.height*t,this._refresh()}scaleOnBackgroundWidth(t){const e=t/this._background.width;this.scaleOnBackground(e)}scaleOnBackgroundHeight(t){const e=t/this._background.height;this.scaleOnBackground(e)}_isHit(t,e){const s=this._dx+this._width*this._hitbox.left,i=this._dx+this._width-this._width*this._hitbox.right,o=this._dy+this._height*this._hitbox.top,n=this._dy+this._height-this._height*this._hitbox.bottom;return!!(t>=s&&t<i&&e>=o&&e<n)}onPress(t,e){this._isHit(t,e)&&(this._isPressed=!0,this._pressHandler&&this._eEnabled&&this._pressHandler(this))}onRelease(t,e){this._isPressed&&(this._isPressed=!1,this._releaseHandler&&this._eEnabled&&this._releaseHandler(this),this._isHit(t,e)&&this._eEnabled&&this._onClick())}onMove(t,e){let s=this._isHit(t,e);this._isHovered||!s?!this._isHovered||s?this._isHovered&&s&&this._hoverHandler&&this._eEnabled&&this._hoverHandler():this._hoverOutHandler&&this._eEnabled&&(this._isHovered=!1,this._hoverOutHandler()):this._hoverInHandler&&this._eEnabled&&(this._isHovered=!0,this._hoverInHandler())}_onClick(){this._clickHandler&&this._eEnabled&&this._clickHandler(this)}onRemove(){this._removeHandler&&this._eEnabled&&this._clickHandler(this)}setClickHandler(t){this._clickHandler=t}setRemoveHandler(t){this._removeHandler=t}setHoverInHandler(t){this._hoverInHandler=t}setHoverOutHandler(t){this._hoverOutHandler=t}setHoverHandler(t){this._hoverHandler=t}setPressHandler(t){this._pressHandler=t}setReleaseHandler(t){this._releaseHandler=t}addParallelTask(t){this._parallelTaskQueue.push(t)}addSerialTask(t){this._serialTaskQueue.push(t)}getSerialQueueSize(){return this._serialTaskQueue.length}getParallelQueueSize(){return this._parallelTaskQueue.length}disableEvents(){this._eEnabled=!1}enableEvents(){this._eEnabled=!0}render(t){t.globalAlpha=this._alpha,this._parallelTaskQueue.forEach(t=>{t(this)&&(this._parallelTaskQueue=this._parallelTaskQueue.filter(e=>e!=t))}),this._serialTaskQueue.length>0&&this._serialTaskQueue[0](this)&&this._serialTaskQueue.shift(),null!=this._background&&t.drawImage(this._background,this._dx,this._dy,this._width,this._height),t.globalAlpha=this.alpha}}const c=[0,.109375];function g(t,e){if(e<0||void 0===e)return;const s=new l;return s.setBackgroundImage(t[e]),s.resizeOnBackground(),s.setAnchor(...c),s}class d{constructor(){this.collection={}}addComponent(t,e){this.collection[t]=e}onPress(t,e){for(let s in this.collection)this.collection[s].onPress(t,e)}onRelease(t,e){for(let s in this.collection)this.collection[s].onRelease(t,e)}onMove(t,e){for(let s in this.collection)this.collection[s].onMove(t,e)}render(t){for(let e in this.collection)this.collection[e].render(t)}}class u extends l{constructor(t,e,s=1){super(),this._cellsX=t,this._cellsY=e,this._ratio=s,this._collection=[],this._stepX=0,this._stepY=0,this._paddingV=.1,this._paddingH=.1,this._removeQueue=[],this._eventPropagation=!0}_gridRecalc(){this._stepX=(this._width-this._width*this._paddingH)/this._cellsX,this._stepY=(this._height-this._height*this._paddingV)/this._cellsY}setSize(t,e){super.setSize(t,e),this._gridRecalc()}getInstanceAddress(t){const e=this._collection.find(e=>e.instance===t);return{x:e.cellX,y:e.cellY}}updateItems(){this._collection.forEach(t=>{null!=t.updateX&&(t.cellX=t.updateX),null!=t.updateY&&(t.cellY=t.updateY)})}sortCollection(){this._collection.sort((t,e)=>e.cellY-t.cellY)}addItem(t,e,s){const i=this.getCellLocation(e,s);t.setPosition(i.x,i.y),t.scaleOnBackgroundWidth(this._stepX);const o={instance:t,cellX:e,cellY:s,updateX:void 0,updateY:void 0};this._collection.push(o)}getCell(t,e){return this._collection.find(s=>s.cellX===t&&s.cellY===e)}getInstance(t,e){return this.getCell(t,e).instance}getCellLocation(t,e){return{x:this._x+this._stepX*t+this._width*this._paddingV/2,y:this._y+this._stepY*e+this._height*this._paddingH/2}}removeItem(t){this._removeQueue.push(t)}onPress(t,e){super.onPress(t,e),this._eventPropagation&&this._collection.forEach(s=>s.instance.onPress(t,e))}onRelease(t,e){super.onRelease(t,e),this._eventPropagation&&this._collection.forEach(s=>s.instance.onRelease(t,e))}stopEventPropagation(){this._eventPropagation=!1}allowEventPropagation(){this._eventPropagation=!0}render(t){this.sortCollection(),this._removeQueue.forEach(t=>{t.onRemove(),this._collection=this._collection.filter(e=>e.instance!=t)}),this._removeQueue=[],super.render(t),this._collection.forEach(e=>e.instance.render(t))}}class _ extends l{constructor(t=14,e="#00",s="serif",i=""){super(),this._fontsize=t,this._font=s,this._baseline="middle",this._textcolor=e,this.setText(i)}setText(t){this._text=t.toString()}render(t){super.render(t),t.font=`${this._fontsize}px ${this._font}`,t.fillStyle=this._textcolor,t.textBaseline=this._baseline;let e=t.measureText(this._text),s=this._x+(this._width-e.width)/2,i=this._y+this._height/2;s-=this._width*this._anchorX,i-=this._height*this._anchorY,t.fillText(this._text,s,i)}}class p extends _{constructor(t=14,e="#00",s="serif",i=""){super(t,e,s,i),this._baseImg=void 0,this._hoverImg=void 0,this._pressImg=void 0,this.setHoverInHandler(()=>{!this._isPressed&&this._hoverImg&&this.setBackgroundImage(this._hoverImg)}),this.setHoverOutHandler(()=>{!this._isPressed&&this._baseImg&&this.setBackgroundImage(this._baseImg)}),this.setPressHandler(()=>{this._pressImg&&this.setBackgroundImage(this._pressImg)}),this.setReleaseHandler(()=>{this._isHovered?this.setBackgroundImage(this._hoverImg):this.setBackgroundImage(this._baseImg)})}setBaseImage(t){this._baseImg=t,this.setBackgroundImage(t)}setHoverImage(t){this._hoverImg=t}setPressImage(t){this._pressImg=t}}class m extends p{constructor(t=14,e="#00",s="serif",i=""){super(t,e,s,i),this._isFixed=!1}getState(){return this._isFixed}fix(){this._isFixed=!0}reset(){this._isFixed=!1,this.setBackgroundImage(this._baseImg)}_onClick(){this._isFixed=!this._isFixed,super._onClick()}render(t){this._isFixed&&this.setBackgroundImage(this._pressImg),super.render(t)}}class f extends l{constructor(){super(),this._progress=0,this._progressX=0,this._progressY=0,this._progressWidth=0,this._progressStop=0,this._outerRadius=0,this._innerRadius=0,this._bar=void 0,this._border=0}_refresh(){super._refresh(),this._outerRadius=this._height/2,this._innerRadius=this._outerRadius-this._border,this._progressWidth=this._width-2*this._outerRadius,this._progressX=this._dx+this._outerRadius,this._progressY=this._dy+this._outerRadius}setProgress(t){t>1&&(t=1),this._progress=t,this._progressStop=this._progressWidth*t}setBarImage(t){this._bar=t}setBorder(t){this._border=t,this._refresh()}_clipper(t,e,s,i,o,n){t.beginPath(),t.arc(e,s,i,Math.PI/2,Math.PI+Math.PI/2,!1),t.arc(e+o,s,i,Math.PI+Math.PI/2,Math.PI/2,!1),t.closePath(),t.save(),t.clip(),n(),t.restore()}render(t){this._clipper(t,this._progressX,this._progressY,this._outerRadius,this._progressWidth,()=>super.render(t)),this._clipper(t,this._progressX,this._progressY,this._innerRadius,this._progressStop,()=>t.drawImage(this._bar,this._dx,this._dy,this._width,this._height))}}class b extends d{constructor(t){super(),this.game=t,this.addComponent("layout",new l),this.addComponent("grid",new u(i.config.cellsX,i.config.cellsY)),this.addComponent("scorePanel",new l),this.addComponent("topPanel",new l),this.addComponent("progressPanel",new l),this.addComponent("movesCaption",new _(30,"#FFF","Roboto Slab","Ходы:")),this.addComponent("movesLabel",new _(90,"#FFF","Roboto Slab")),this.addComponent("scoreCaption",new _(30,"#FFF","Roboto Slab","Очки:")),this.addComponent("scoreLabel",new _(50,"#FFF","Roboto Slab",0)),this.addComponent("bannerLabel",new _(90,"#CFF","Roboto Slab")),this.addComponent("groupsLabel",new _(20,"#FFF","Roboto Slab")),this.addComponent("shuffleButton",new p(20,"#FFF","Roboto Slab",`Перемешать (x${i.config.shuffles})`)),this.addComponent("boosterButton",new m(20,"#FFF","Roboto Slab",`Бустер (x${i.config.boosters})`)),this.addComponent("pauseButton",new m),this.addComponent("progress",new f),this.addComponent("progressLabel",new _(20,"#FFF","Roboto Slab","Прогресс"))}init(){this.collection.layout.setBackgroundImage(this.game.assets.images.background),this.collection.layout.setSize(i.config.screenWidth,i.config.screenHeight),this.collection.grid.setBackgroundImage(this.game.assets.images.field),this.collection.grid.setSize(i.config.gridWidth,i.config.gridHeight),this.collection.grid.setPosition(i.config.gridX,i.config.gridY),this.collection.scorePanel.setBackgroundImage(this.game.assets.images.scorePanel),this.collection.scorePanel.setAnchor(.5,.5),this.collection.scorePanel.scaleOnBackgroundWidth(300),this.collection.scorePanel.setPosition(780,300),this.collection.movesCaption.setPosition(780,160),this.collection.movesLabel.setBackgroundImage(this.game.assets.images.moves),this.collection.movesLabel.setAnchor(.5,.7),this.collection.movesLabel.scaleOnBackgroundWidth(180),this.collection.movesLabel.setText(i.config.movesLimit),this.collection.movesLabel.setPosition(780,300),this.collection.scoreCaption.setPosition(780,370),this.collection.scoreLabel.setPosition(780,410),this.collection.bannerLabel.setPosition(i.config.screenWidth/2,i.config.screenHeight/2),this.collection.groupsLabel.setPosition(150,130),this.collection.shuffleButton.setBaseImage(this.game.assets.images.buttonBase2),this.collection.shuffleButton.setHoverImage(this.game.assets.images.buttonHover2),this.collection.shuffleButton.setPressImage(this.game.assets.images.buttonPress2),this.collection.shuffleButton.setPosition(780,500),this.collection.shuffleButton.setAnchor(.5,.5),this.collection.shuffleButton.scaleOnBackgroundWidth(200),this.collection.shuffleButton.setSize(200,60),this.collection.shuffleButton.setClickHandler(this.game.shuffleClickHandler()),this.collection.boosterButton.setBaseImage(this.game.assets.images.buttonBase2),this.collection.boosterButton.setHoverImage(this.game.assets.images.buttonHover2),this.collection.boosterButton.setPressImage(this.game.assets.images.buttonPress2),this.collection.boosterButton.setPosition(780,570),this.collection.boosterButton.setAnchor(.5,.5),this.collection.boosterButton.scaleOnBackgroundWidth(200),this.collection.boosterButton.setSize(200,60),this.collection.boosterButton.setClickHandler(this.game.boosterClickHandler()),this.collection.pauseButton.setBaseImage(this.game.assets.images.pauseBase),this.collection.pauseButton.setHoverImage(this.game.assets.images.pauseHover),this.collection.pauseButton.setPressImage(this.game.assets.images.pausePress),this.collection.pauseButton.setPosition(930,50),this.collection.pauseButton.setAnchor(.5,.5),this.collection.pauseButton.scaleOnBackgroundWidth(60),this.collection.pauseButton.setClickHandler(this.game.pauseClickHandler()),this.collection.progress.setBackgroundImage(this.game.assets.images.barBack),this.collection.progress.setBarImage(this.game.assets.images.bar),this.collection.progress.setSize(300,25),this.collection.progress.setAnchor(.5,.5),this.collection.progress.setPosition(i.config.screenWidth/2,45),this.collection.progress.setBorder(3),this.collection.progress.setProgress(0),this.collection.topPanel.setBackgroundImage(this.game.assets.images.topPanel),this.collection.topPanel.setSize(700,100),this.collection.topPanel.setAnchor(.5,0),this.collection.topPanel.setPosition(i.config.screenWidth/2,0),this.collection.progressPanel.setBackgroundImage(this.game.assets.images.progressPanel),this.collection.progressPanel.setSize(400,70),this.collection.progressPanel.setAnchor(.5,0),this.collection.progressPanel.setPosition(i.config.screenWidth/2,0),this.collection.progressLabel.setPosition(i.config.screenWidth/2,15)}}class v extends d{constructor(t){super(),this.game=t,this.addComponent("waitLabel",new _(50,"#000","Roboto Slab","Загрузка...")),this.init()}init(){this.collection.waitLabel.setPosition(i.config.screenWidth/2,i.config.screenHeight/2)}}class x extends d{constructor(t){super(),this.game=t,this.addComponent("layout",new l),this.addComponent("title",new _(70,"#FFF","Roboto Slab","Blast Puzzle")),this.addComponent("startButton",new p(30,"#FFF","Roboto Slab","Играть"))}init(){this.collection.layout.setBackgroundImage(this.game.assets.images.startBackground),this.collection.layout.setSize(i.config.screenWidth,i.config.screenHeight),this.collection.title.setPosition(i.config.screenWidth/2,i.config.screenHeight/4),this.collection.startButton.setBaseImage(this.game.assets.images.buttonBase1),this.collection.startButton.setHoverImage(this.game.assets.images.buttonHover1),this.collection.startButton.setPressImage(this.game.assets.images.buttonPress1),this.collection.startButton.setPosition(i.config.screenWidth/2,i.config.screenHeight/1.7),this.collection.startButton.setAnchor(.5,.5),this.collection.startButton.scaleOnBackgroundWidth(200),this.collection.startButton.setClickHandler(this.game.startClickHandler())}}class S extends d{constructor(t){super(),this.game=t,this.addComponent("layout",new l),this.addComponent("title",new _(70,"#FFF","Roboto Slab","Вы победили!")),this.addComponent("startButton",new p(30,"#FFF","Roboto Slab","Играть ещё ?"))}init(){this.collection.layout.setBackgroundImage(this.game.assets.images.startBackground),this.collection.layout.setSize(i.config.screenWidth,i.config.screenHeight),this.collection.title.setPosition(i.config.screenWidth/2,i.config.screenHeight/4),this.collection.startButton.setBaseImage(this.game.assets.images.buttonBase1),this.collection.startButton.setHoverImage(this.game.assets.images.buttonHover1),this.collection.startButton.setPressImage(this.game.assets.images.buttonPress1),this.collection.startButton.setPosition(i.config.screenWidth/2,i.config.screenHeight/1.7),this.collection.startButton.setAnchor(.5,.5),this.collection.startButton.scaleOnBackgroundWidth(250),this.collection.startButton.setClickHandler(this.game.replayClickHandler())}}class k extends d{constructor(t){super(),this.game=t,this.addComponent("layout",new l),this.addComponent("title",new _(70,"#FFF","Roboto Slab","Вы проиграли")),this.addComponent("startButton",new p(30,"#FFF","Roboto Slab","Играть ещё ?"))}init(){this.collection.layout.setBackgroundImage(this.game.assets.images.startBackground),this.collection.layout.setSize(i.config.screenWidth,i.config.screenHeight),this.collection.title.setPosition(i.config.screenWidth/2,i.config.screenHeight/4),this.collection.startButton.setBaseImage(this.game.assets.images.buttonBase1),this.collection.startButton.setHoverImage(this.game.assets.images.buttonHover1),this.collection.startButton.setPressImage(this.game.assets.images.buttonPress1),this.collection.startButton.setPosition(i.config.screenWidth/2,i.config.screenHeight/1.7),this.collection.startButton.setAnchor(.5,.5),this.collection.startButton.scaleOnBackgroundWidth(250),this.collection.startButton.setClickHandler(this.game.replayClickHandler())}}function B(t,e,s,i){let o=void 0,n=void 0;return h=>{null==o&&(o=h._x<t?1:-1,n=h._y<e?1:-1);let r=h.getPosition();return r.x+=o*(s+i)/60,r.y+=n*(s+i)/60,h.setPosition(r.x,r.y),r.x*o>t*o&&h.setX(t),r.y*n>e*n&&h.setY(e),h._x==t&&h._y==e}}class y{constructor(t){this.screen=new h(t,i.config.screenWidth,i.config.screenHeight),this.game=new n(i.config.cellsX,i.config.cellsY,i.config.variety,i.config.minGroup,i.config.superGroup),this.assets=new r(i.images),this.superSprites=new r(i.superSprites),this.tiles=new a,this.preloaderScene=new v(this),this.sprites=[],this.screen.setScene(this.preloaderScene),this.screen.renderEngineStart(),Promise.all([this.assets.load(),this.superSprites.load()]).then(()=>{this.tiles.init(this.assets.images.tileBlock,5),this.tiles.split().then(()=>{this.sprites=this.tiles.images,setTimeout(()=>this.init(),i.config.preloaderDelay)})}).catch(t=>console.log(t))}init(){this.mainScene=new b(this),this.startScene=new x(this),this.winScene=new S(this),this.loseScene=new k(this),this.state={isPressed:!1,isRemoving:!1,isMoving:!1,isShuffling:!1,isBoosted:!1,isSupercell:!1,target:void 0,address:void 0,group:[],changes:void 0,moves:i.config.movesLimit,score:0,shuffles:i.config.shuffles,boosters:i.config.boosters},this.mainScene.init(),this.startScene.init(),this.winScene.init(),this.loseScene.init(),this.game.init();for(let t=0;t<i.config.cellsX;t++)for(let e=0;e<i.config.cellsY;e++){const s=g(this.sprites,this.game.getCell(t,e).type);s.setClickHandler(this.tileClickHandler(this.state)),this.mainScene.collection.grid.addItem(s,t,e)}this.screen.setScene(this.startScene),this.screen.clearTasks(),this.screen.addTask(()=>this.loop())}tileClickHandler(){return t=>{this.state.isPressed=!0,this.state.target=t}}pauseClickHandler(){return t=>{t.getState()?(this.mainScene.collection.bannerLabel.setText("Пауза"),this.uiLock()):(this.mainScene.collection.bannerLabel.setText(""),this.uiUnlock())}}boosterClickHandler(){return t=>{t.getState()&&this.state.boosters>0?this.state.isBoosted=!0:this.state.isBoosted=!1}}shuffleClickHandler(){return t=>{0!=this.state.shuffles&&(this.state.shuffles--,t.setText(`Перемешать (x${this.state.shuffles})`),this.state.isShuffling=!0)}}startClickHandler(){return t=>{this.screen.setScene(this.mainScene)}}replayClickHandler(){return t=>{this.init(),this.uiUnlock(),this.screen.setScene(this.mainScene)}}uiLock(){this.mainScene.collection.grid.stopEventPropagation(),this.mainScene.collection.shuffleButton.disableEvents(),this.mainScene.collection.boosterButton.disableEvents()}uiUnlock(){this.mainScene.collection.grid.allowEventPropagation(),this.mainScene.collection.shuffleButton.enableEvents(),this.state.boosters>0&&this.mainScene.collection.boosterButton.enableEvents()}loop(){if(this.state.isPressed){if(this.state.address=this.mainScene.collection.grid.getInstanceAddress(this.state.target),this.state.isBoosted?(this.state.group=this.game.getRadius(this.state.address.x,this.state.address.y,i.config.boostR),this.state.boosters--,this.mainScene.collection.boosterButton.setText(`Бустер (x${this.state.boosters})`)):(this.state.supercell=this.game.isSupercell(this.state.address.x,this.state.address.y),this.state.group=this.game.getGroup(this.state.address.x,this.state.address.y)),this.state.group.length<i.config.minGroup)return void(this.state.isPressed=!1);this.uiLock(),this.state.group=this.state.group.map(t=>this.mainScene.collection.grid.getCell(t.x,t.y)),this.state.group.forEach(t=>t.instance.addSerialTask(function(t,e,s,i){let o=t;return e<0&&(e=0),t=>(o-=(s+i)/60,o<e&&(o=e),t._alpha=o,o<=e)}(1,.4,1,2))),this.state.isPressed=!1,this.state.isRemoving=!0,this.state.moves--,this.state.score+=Math.pow(this.state.group.length,2)}if(this.state.isRemoving)this.state.isRemoving=!1,this.state.group.forEach(t=>{t.instance.getSerialQueueSize()>0?this.state.isRemoving=!0:this.mainScene.collection.grid.removeItem(t.instance)}),this.state.isRemoving||(this.game.collapse(),this.state.changes=this.game.getChanges(),this.state.changes=this.state.changes.map(t=>{const e=this.mainScene.collection.grid.getCell(t.dx,t.dy);let s=this.mainScene.collection.grid.getCellLocation(t.x,t.y);return e.instance.addSerialTask(B(s.x,s.y,100,300)),e.updateX=t.x,e.updateY=t.y,e}),this.state.isMoving=!0);else if(this.state.isMoving&&(this.state.isMoving=!1,this.state.changes.forEach(t=>{t.instance.getSerialQueueSize()>0&&(this.state.isMoving=!0)}),!this.state.isMoving)){this.mainScene.collection.grid.updateItems();if(this.game.randomFill().forEach(t=>{const e=g(this.sprites,t.type);e.setClickHandler(this.tileClickHandler(this.state)),this.mainScene.collection.grid.addItem(e,t.x,t.y)}),this.mainScene.collection.movesLabel.setText(this.state.moves),this.mainScene.collection.scoreLabel.setText(this.state.score),this.mainScene.collection.progress.setProgress(this.state.score/i.config.scoreToWin),this.state.score>=i.config.scoreToWin)this.screen.setScene(this.winScene);else if(0==this.state.moves)this.screen.setScene(this.loseScene);else{this.game.fixChanges();const t=this.game.getMoves();if(this.mainScene.collection.groupsLabel.setText("Доступно ходов: "+this.game.getMoves()),this.state.group.length>=i.config.superGroup&&!this.state.isBoosted&&!this.state.supercell&&!this.state.isShuffling){this.game.setSuperCell(this.state.address.x,this.state.address.y);const t=this.mainScene.collection.grid.getCell(this.state.address.x,this.state.address.y).instance;t.setBackgroundImage(this.superSprites.images.blue),t.scaleOnBackgroundWidth(t.getSize().width),t.setAnchor(0,0)}this.state.shuffles||this.state.boosters||t||this.mainScene.collection.bannerLabel.setText("Вы проиграли"),this.state.isBoosted=!1,this.mainScene.collection.boosterButton.reset(),this.state.isShuffling=!1,this.uiUnlock()}}this.state.isShuffling&&!this.state.isMoving&&(this.uiLock(),this.game.shuffle(),this.state.changes=[],this.game._field.forEach(t=>{const e=this.mainScene.collection.grid.getCell(t.dx,t.dy);let s=this.mainScene.collection.grid.getCellLocation(t.x,t.y);e.instance.addSerialTask(B(s.x,s.y,100,300)),e.updateX=t.x,e.updateY=t.y,this.state.changes.push(e)}),this.state.isMoving=!0)}}window.onload=function(){var t=document.querySelector(".main");new y(t)}}]);