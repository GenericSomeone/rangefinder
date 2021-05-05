const ui = require("ui-lib/library");

const range = () => {
	let raw = Mathf.dst(Vars.player.unit().x, Vars.player.unit().y, Vars.player.mouseX, Vars.player.mouseY);
	let result = Math.round(raw/8);
	return result + " tiles away";
};

ui.addTable("side", "rangefinder", table => {
	table.label(range);
});