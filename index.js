;
(function() {
	var pixArr = [];
	var DrawImg = function(_obj) {};
	DrawImg.prototype = {
		init: function(_obj) {
			pixArr = [];
			_obj = _obj || {};
			this.width = _obj.width || 300;
			this.height = _obj.height || 150;
			this.src = _obj.src;
			this.parentId = _obj.parentId;
			this.parentDom = (this.parentId ? document.getElementById(this.parentId) : document.querySelector('body'));
			this.cvs = document.querySelector('canvas') || document.createElement('canvas');
			this.ctx = this.cvs.getContext('2d');
			this.createCanvasDom();
			this.dir = _obj.dir || 1;
			this.aniRun = true;
			this.center = _obj.center || false;
			return this;
		},
		createCanvasDom: function() {
			var that = this;
			if(this.src) {
				var image = new Image();
				this.image = image;
				image.src = this.src;
				image.onload = function() {
					that.cvs.width = image.width;
					that.cvs.height = image.height;
					that.ctx.drawImage(image, 0, 0, this.width, this.height, 0, 0, that.width, that.height);
					that.getCanvasInfo();
				}
			}
			document.querySelector('canvas') ? '' : this.parentDom.append(this.cvs);
		},
		getCanvasInfo: function(ctx, _dom) {
			var imgInfoArr = this.ctx.getImageData(0, 0, this.cvs.width, this.cvs.height),
				that = this;
			console.log(imgInfoArr)
			for(var y = 0; y < imgInfoArr.height; y += this.dir * 4) {
				for(var x = 0; x < imgInfoArr.width; x += this.dir * 4) {
					var curPix = (imgInfoArr.width * y + x) * 4;
					if(imgInfoArr.data[curPix + 3] != 0) {
						pixArr.push({
							width: this.dir * 2,
							height: this.dir,
							top: (that.cvs.height > that.height && this.center ? (that.cvs.height - that.height) / 2 : 0) + y + (this.dir),
							left: (that.cvs.width > that.width && this.center ? (that.cvs.width - that.width) / 2 : 0) + x + (this.dir),
							color: {
								r: imgInfoArr.data[curPix],
								g: imgInfoArr.data[curPix + 1],
								b: imgInfoArr.data[curPix + 2],
								a: imgInfoArr.data[curPix + 3],
							},
							tx: parseInt(Math.random() > 0.5 ? Math.random() * 1000 : -Math.random() * 1000),
							ty: parseInt(Math.random() > 0.5 ? Math.random() * 1000 : -Math.random() * 1000),
						})
					}
				}
			}
			console.log(pixArr)
			this.drawDot(pixArr);
			this.ani();
		},
		drawDot: function(arr) {
			this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
			for(var i = 0; i < arr.length; i += 1) {
				var dot = arr[i];
				if(dot.color.a !== 0) {
					this.ctx.save();
					this.ctx.fillStyle = `rgba(${dot.color.r},${dot.color.g},${dot.color.b},${dot.color.a/255})`;
					this.ctx.beginPath();
					this.ctx.arc(dot.left + dot.tx, dot.top + dot.ty, dot.width, 0, Math.PI * 2);
					this.ctx.closePath();
					this.ctx.fill();
					this.ctx.restore();
				}
			}
		},
		end: function() {
			if(this.image) {
				var left = this.cvs.width > this.width && this.center ? (this.cvs.width - this.width) / 2 : 0;
				var top = this.cvs.height > this.height && this.center ? (this.cvs.height - this.height) / 2 : 0;
				this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
				this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, left, top, this.width, this.height);
			}
		},
		ani: function() {
			var that = this;
			for(var i = pixArr.length - 1; i >= 0; i--) {
				var cx = pixArr[i].tx * 0.1;
				var cy = pixArr[i].ty * 0.1;
				if(pixArr[i].tx == 0 && pixArr[i].ty == 0) {
					continue;
				}
				pixArr[i].tx = pixArr[i].tx - cx;
				pixArr[i].ty = pixArr[i].ty - cy;
				if(Math.abs(pixArr[i].tx) < 1) {
					pixArr[i].tx = 0;

				}
				if(Math.abs(pixArr[i].ty) < 1) {
					pixArr[i].ty = 0;
				}
			}
			this.aniRun = pixArr.every(function(val, index) {
				return(parseInt(val.tx) == 0 && parseInt(val.ty) == 0);
			})
			this.drawDot(pixArr);
			if(!this.aniRun) {
				window.requestAnimationFrame(() => that.ani())
			} else {
				setTimeout(function() {
					that.end();
				}, 1000);
			}
		}
	}
	window.drawImg = new DrawImg();
})()