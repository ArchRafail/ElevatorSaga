{
    init: function(elevators, floors) {
        const topFloor = floors.length - 1;
        const averagePassengerWeight = 0.15;

        elevators.forEach((elevator, index) => {
            var fullElevatorLoadFactor = elevator.maxPassengerCount() * averagePassengerWeight;
            if (fullElevatorLoadFactor > 1) {
                fullElevatorLoadFactor = (fullElevatorLoadFactor/2)*0.9;
            }

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

            elevator.on("passing_floor", (floorNum, direction) => {
                if (elevator.getPressedFloors().includes(floorNum)) {
                    elevator.goToFloor(floorNum,true);
                }
                var loadFactor = elevator.loadFactor();
                if (loadFactor < fullElevatorLoadFactor) {
                    if (floors[floorNum].buttonStates.up && elevator.destinationDirection() == 'up') {
                        elevator.goToFloor(floorNum,true);
                    } else if (floors[floorNum].buttonStates.down && elevator.destinationDirection() == 'down') {
                        elevator.goToFloor(floorNum,true);
                    }
                }
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
                
                switch(elevator.currentFloor()) {
                    case 0:
                        elevator.goingDownIndicator(false);
                        elevator.goingUpIndicator(true);
                        break;
                    case topFloor:
                        elevator.goingDownIndicator(true);
                        elevator.goingUpIndicator(false);
                        break;
                }
            });
        })
    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
