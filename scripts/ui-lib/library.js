const ui = {
	// Functions to be called when atlas is ready
	loadEvents: [],
	// Functions to be called when the mouse is clicked
	clickEvents: [],
	areas: {},
	// Custom drawing functions
	effects: [],
	// Dialog used to show any runtime errors
	errors: null,
	// Dialog used to select items from a list
	selection: null,
	// if the loadEvents have started processing
	loaded: false
};

/** UTILITY FUNCTIONS **/

/* Run a function when the client loads, or now if it already has. */
ui.onLoad = func => {
	if (ui.loaded) {
		func();
	} else {
		ui.loadEvents.push(func);
	}
};

/* Run events to add UI and stuff when assets are ready. */
ui.load = () => {
	var table;
	for (var i in ui.areas) {
		table = new Table();
		table.fillParent = true;
		table.visibility = () => !Vars.ui.minimapfrag.shown();
		ui.areas[i].table = table;
		ui.areas[i].init(table);
	}

	ui.loaded = true;
	for (var e of ui.loadEvents) e();
	ui.loadEvents = [];

	var area;
	for (var i in ui.areas) {
		area = ui.areas[i];
		// Sort the cells by name
		area.table.cells.sortComparing(cell => {
			const name = cell.get().name;
			return name[0] == '$' ? Core.bundle.get(name.substr(1)) : name;
		});

		area.post(area.table);
		// Add the UI elements to the HUD by default
		if (area.group !== null) {
			(area.group || Vars.ui.hudGroup).addChild(area.table);
		}
	}
};

ui.getIcon = (icon) => {
	// () => Icon.leftSmall
	if (typeof(icon) == "function") {
		icon = icon();
	}
	// "admin" / "error"
	if (typeof(icon) == "string") {
		try {
			icon = Icon[icon]
		} catch (e) {
			icon = Core.atlas.find(icon);
		}
	}
	// Blocks.duo
	if (icon instanceof UnlockableContent) {
		icon = icon.icon(Cicon.full);
	}
	// Core.atlas.find("error")
	if (icon instanceof TextureRegion) {
		icon = new TextureRegionDrawable(icon);
	}
	// Hopefully its a Drawable by now
	return icon;
};

ui.addArea = (name, area) => {
	ui.areas[name] = area;
};

ui.addTable = (area, name, user) => {
	ui.onLoad(() => {
		try {
			const root = ui.areas[area].table;
			const table = new Table();
			root.add(table).name(name);
			root.row();
			if (ui.areas[area].added) {
				ui.areas[area].added(table);
			}
			user(table);
		} catch (e) {
			ui.showError("Failed to add table " + name + " to area " + area, e);
		}
	});
};

ui.addButton = (name, icon, clicked, user) => {
	ui.onLoad(() => {
		try {
			icon = ui.getIcon(icon);
			const cell = ui.areas.buttons.table.button(icon, Styles.clearTransi, 45, ()=>{});
			cell.name(name);
			const button = cell.get();
			if (clicked) {
				button.clicked(() => {
					/* UI crashes are only printed to stdout, not a crash log */
					try {
						clicked(button);
					} catch (e) {
						ui.showError("Error when clicking button " + name, e);
					}
				});
			}
			if (user) user(cell);
		} catch (e) {
			ui.showError("Failed to add button " + name, e);
		}
	});
};

module.exports = ui;
global.ui = ui;
