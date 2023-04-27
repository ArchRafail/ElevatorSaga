{
    init: function(elevators, floors) {
        const topFloor = floors.length - 1;
        const averagePassengerWeight = 0.15;

        elevators.forEach((elevator, index) => {
            const fullElevatorLoadFactor = elevator.maxPassengerCount() * averagePassengerWeight;

            elevator.on("idle", () => {
                let demand = floors.filter((floor) => (floor.buttonStates.up || floor.buttonStates.down));

                if (demand.length) {
                    target = demand[0].floorNum();
                }
                elevator.goToFloor(target);
            });                      
          
            elevator.on("floor_button_pressed", (floorNum) => {
                elevator.goToFloor(floorNum);
            });            
            
            elevator.on("passing_floor", function(floorNum, direction) {
                if (elevator.loadFactor() < 0.8*fullElevatorLoadFactor) {
                    elevator.goToFloor(floorNum, true);
                }

            });
            
        })
    },
        
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
