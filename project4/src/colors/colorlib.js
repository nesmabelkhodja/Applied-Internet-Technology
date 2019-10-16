class Color {
    constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	//function that converts rgb to hex 
	//http://www.javascripter.net/faq/rgbtohex.htm
		let result = '';
		let red = this.r;
		let green = this.g;
		let blue = this.b;

		//red
		red = parseInt(r, 10);
		red = Math.max(0, Math.min(red, 255));
		result = "#" + "0123456789ABCDEF".charAt((red-red%16)/16)+ "0123456789ABCDEF".charAt(red%16);

		//green
		green = parseInt(g, 10);
		green = Math.max(0, Math.min(green, 255));
		result += "0123456789ABCDEF".charAt((green-green%16)/16)+ "0123456789ABCDEF".charAt(green%16);

		//blue
		blue = parseInt(b, 10);
		blue = Math.max(0, Math.min(blue, 255));
		result += "0123456789ABCDEF".charAt((blue-blue%16)/16)+ "0123456789ABCDEF".charAt(blue%16);
		this.hex=result;

	}

	
}

module.exports = {Color};