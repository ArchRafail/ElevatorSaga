{
    init: function(elevators, floors) {
        const topFloor = floors.length - 1;

        elevators.forEach(elevator => {

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
                if (elevator.destinationQueue.length === 0) {
                    elevator.goingDownIndicator(true);
                    elevator.goingUpIndicator(true);
                    return
                }

                elevator.goingDownIndicator(false);
                elevator.goingUpIndicator(false);

                var next = elevator.destinationQueue[0];

                if (elevator.currentFloor() > next) {
                    elevator.goingDownIndicator(true);
                } else {
                    elevator.goingUpIndicator(true);
                }
            });
        })
    },
        
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
