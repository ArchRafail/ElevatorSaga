{
    init: function(elevators, floors) {
        const topFloor = floors.length - 1;
        const averagePassengerWeight = 0.15;
        
        elevators.forEach(elevator => elevator.unsynchonized = false);
        
        unsyncElevator = (elevator, index) => {
            setTimeout(() => {
                elevator.goToFloor(topFloor);
                elevator.goToFloor(0);
                elevator.unsynchonized = true;
            }, (elevators.length - 1 - index)*1000);
        }
        
        elevators.forEach((elevator, index) => {
            const fullElevatorLoadFactor = elevator.maxPassengerCount() * averagePassengerWeight;

            elevator.on("idle", () => {
                if (index > 1 && !elevator.unsynchonized) {
                    unsyncElevator(elevator, index);
                } else if (index == 1) {
                    let demand = floors.filter((floor) => (floor.buttonStates.up || floor.buttonStates.down));

                    if (demand.length) {
                        target = demand[0].floorNum();
                    } else {
                        target = 0;
                    }
                    elevator.goToFloor(target);
                } else {
                    elevator.goToFloor(topFloor);
                    elevator.goToFloor(0);
                }
            });                      

            elevator.on("floor_button_pressed", (floorNum) => {
                elevator.goToFloor(floorNum);
            });
            
            elevator.on("passing_floor", (floorNum, direction) => {
                var loadFactor = elevator.loadFactor();
                if (elevator.getPressedFloors().includes(floorNum) && loadFactor < fullElevatorLoadFactor) {
                    elevator.goToFloor(floorNum,true);
                }
                if (floors[floorNum].buttonStates.up || floors[floorNum].buttonStates.down) {
                    elevator.goToFloor(floorNum,true);
                }
            });

        })
    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
