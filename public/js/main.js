const ctxStates = [];
const vm = new Vue({
	el: "#app",
	data: {
		WIDTH: window.innerWidth - 50,
		angleStep: (-1+Math.sqrt(5))*0.5*Math.PI,
		radiusStep: 1,
		pointAmount: 90,
		ratio: 16/8,
		drawLines: true,
	},
	computed: {
		HEIGHT: function() {
			return this.WIDTH / this.ratio;
		},
		ctx: function() {
			return this.$refs.canvas.getContext("2d");
		},
		centerX: function() {
			return this.WIDTH >> 1;
		},
		centerY: function() {
			return this.HEIGHT >> 1;
		},
		pointRadius: function() {
			return Math.min(Math.max(this.radiusStep, 1), 5);
		},
		lineWidth: function() {
			return Math.min(Math.max(Math.sqrt(this.pointRadius), this.pointRadius), Math.max(this.pointRadius*2/3, 1));
		},
		lineColor: function() {
			return "rgb(127,0,0)";

		},

	},

	methods: {

		pushState: function(ctx, state) {
			const oldState = {strokStyle: ctx.strokeStyle, fillStyle: ctx.fillStyle, lineWidth: ctx.lineWidth};
			ctxStates.push(oldState);
			ctx.strokeStyle = state.strokeStyle || ctx.strokeStyle;
			ctx.fillStyle = state.fillStyle || ctx.fillStyle;
			ctx.lineWidth = state.lineWidth || ctx.lineWidth;
		},
		popState: function(ctx) {
			const state= ctxStates.pop();
			Object.keys(state).forEach(key=>ctx[key] = state[key]);
		},
		draw: function() {
			const ctx = this.ctx;
			ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);
			
			for (let i = 0; i < this.pointAmount; i++) {
				let r = i*this.radiusStep;
					phi = i*this.angleStep,
					  x = this.centerX+r*Math.cos(phi),
					  y = this.centerY-r*Math.sin(phi);
				
				if ( i !== 0 && this.drawLines) {
					ctx.beginPath()
					ctx.moveTo(x,y);
					ctx.lineTo(this.centerX+(r-this.radiusStep)*Math.cos(phi-this.angleStep),
										 this.centerY-(r-this.radiusStep)*Math.sin(phi-this.angleStep))
					
					this.pushState(ctx, {lineWidth: this.lineWidth, strokeStyle: this.lineColor});
					ctx.stroke();
					this.popState(ctx);
				}
				ctx.beginPath();
				ctx.arc(x,y, this.pointRadius, 0, Math.PI*2)
				this.pushState(ctx, {fillStyle: "black"});
				ctx.fill();
				ctx.closePath();
				this.popState(ctx);
				
			}

		}
	},
	mounted: function() {
		console.log("MOUNT")
		this.draw();
	},
	updated: function() {
		this.draw();
	}

});

let t = 0;
let maxR = 20;
let minR = 1;
function changeRadius() {	
	t += 1 / 60;
	vm.radiusStep = Math.cos(t)*(maxR-minR) + minR;
	requestAnimationFrame(changeRadius);
}
function changeAngleStep() {
	t += 1 / 2048;
	vm.angleStep = (Math.sin(t)+1)*0.5*Math.PI * 2;
	requestAnimationFrame(changeAngleStep);
}
changeAngleStep();
//setTimeout(changeRadius, 1000)