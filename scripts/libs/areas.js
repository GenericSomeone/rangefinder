// Sometimes being explicit about types is needed
if (typeof(cons) == "undefined") {
	const cons = method => extend(Cons, {get: method});
}

/* Create all the areas */

// To the right of the wave info / mobile buttons
ui.addArea("buttons", {
	init(buttons) {
		buttons.top().left();
		// Be obviously modded
		buttons.defaults().size(45).left();
		buttons.visibility = () => Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown();
	},

	post(buttons) {
		// Edges around buttons
		const count = buttons.cells.size;
		if (count == 0) return;

		// Not sure why this is needed
		Core.app.post(() => {
			// Dynamically set the margin to not overlap with the waves table
			const waves = Core.scene.find("waves");
			buttons.update(() => {
				buttons.marginLeft(waves.getPrefWidth());
			});
			if (!Vars.mobile) {
				const info = Core.scene.find("fps/ping");
				info.update(() => {
					info.translation.y = -Scl.scl(45 + 4);
				});
			}
		});

		/* Add edges around the buttons */
		buttons.image().color(Pal.gray).width(4).fillY()
			.get().touchable = Touchable.disabled;
		buttons.row();
		buttons.image().color(Pal.gray).size(45 * count + 4, 4).left()
			.colspan(buttons.columns).get().touchable = Touchable.disabled;
	}
});

ui.addArea("side", {
	init(side) {
		const base = Vars.mobile ? 65 * 2 : 65;
		const mtop = base + 130 + 8;
		side.top().left().marginTop(mtop).marginLeft(8);
		side.defaults().top().left().padBottom(8);
	},
	post(side) {},
	added(table) {
		if (this.first) {
			// avoid some clutter on the screen
			ui.addButton("!!!side-visibility", Icon.leftOpen, button => this.toggle(button));
			this.first = false;
		}
		table.visibility = () => this.shown;
	},

	toggle(button) {
		button.style.imageUp = this.shown ? Icon.leftOpen : Icon.rightOpen
		this.shown = !this.shown;
	},
	first: true,
	shown: false
});
// Logical alias
ui.areas.left = ui.areas.side;