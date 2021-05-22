function range(){
	let raw = Mathf.dst(Vars.player.unit().x, Vars.player.unit().y, Vars.player.mouseX, Vars.player.mouseY);
	let result = (Math.round(10 * raw/8)/10);
	return result + " tiles away";
};

Events.on(ClientLoadEvent, () => {
    Events.on(WorldLoadEvent, () => {
	Vars.ui.hudGroup.children.get(2).row();
        Vars.ui.hudGroup.children.get(2).label(() => range())
            .visible(true)
            .touchable(Touchable.disabled)
            .name("range")
            .top().right();
    });
});
