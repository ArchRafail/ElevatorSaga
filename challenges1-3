{
    init: function(elevators, floors) {
        var elevator = elevators[0];
        const topFloor = floors.length - 1;

        elevator.on("idle", () => {
            let demand = floors.filter((floor) => (floor.buttonStates.up || floor.buttonStates.down));

            if (demand.length) {
                target = demand[0].floorNum();
            } else {
                target = 0;
            }

            elevator.goToFloor(target);
        });
        
        elevator.on("floor_button_pressed", (floorNum) => {
            elevator.goToFloor(floorNum);
        });
        
        
        elevator.on("stopped_at_floor", function (floorNum) {
            switch (floorNum) {
                case 0:
                    up = true;
                    down = false;
                    break;
                case topFloor:
                    up = false;
                    down = true;
                    break;
                default:
                    up = true;
                    down = true;
                    break;
            }
            elevator.goingUpIndicator(up);
            elevator.goingDownIndicator(down)
        });
    },
    
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
