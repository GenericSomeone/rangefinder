function range(){
	let raw = Mathf.dst(Vars.player.unit().x, Vars.player.unit().y, Vars.player.mouseX, Vars.player.mouseY);
	//Math.round() rounds to the nearest integer so we need to do this to make it round to the nearest decimal instead
	let result = (Math.round(10 * raw/8)/10);
	return result + " tiles away";
};

//for some reason, if this doesn't exist it will add a new rangefinder every time you load the world
let canAdd = true;

Events.on(ClientLoadEvent, () => {
    Events.on(WorldLoadEvent, () => {
	if(canAdd){
		Vars.ui.hudGroup.children.get(2).row();
	        Vars.ui.hudGroup.children.get(2).label(() => range())
	            .visible(true)
	            .touchable(Touchable.disabled)
	            .name("range")
	            .top().right();
		canAdd = false;
	}
    });
});
