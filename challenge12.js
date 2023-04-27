{
    init: function(elevators, floors) {
        const topFloor = floors.length - 1;
        const averagePassengerWeight = 0.15;
        var upFloorsList = [];
        var downFloorsList = [];
        
        elevators.forEach(elevator => elevator.unsynchonized = false);
        
        elevators.forEach((elevator, index) => {
            const fullElevatorLoadFactor = elevator.maxPassengerCount() * averagePassengerWeight;

            elevator.on("idle", () => {
                if (!elevator.unsynchonized) {
                    setTimeout(() => {
                        elevator.goToFloor(topFloor);
                        elevator.goToFloor(0);
                        elevator.unsynchonized = true;
                    }, index*500);
                } else {
                    elevator.goToFloor(topFloor);
                    elevator.goToFloor(0);
                }
            });                      

            elevator.on("stopped_at_floor", (floorNum) => {
                if (floorNum == 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);  
                } else if (floorNum == topFloor) {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);  
                }
            })
            
            elevator.on("passing_floor", (floorNum, direction) => {
                var loadFactor = elevator.loadFactor();
                var stop = false;
                if (loadFactor < fullElevatorLoadFactor &&
                    ((direction == "up" && upFloorsList.includes(floorNum)) ||
                     (direction == "down" && downFloorsList.includes(floorNum)))) {
                    stop = true;
                }
                if(stop || elevator.getPressedFloors().includes(floorNum)) {
                    elevator.goToFloor(floorNum,true);
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(false);
                    if (elevator.destinationQueue[1] > floorNum) {
                        elevator.goingUpIndicator(true);
                    } else {
                        elevator.goingDownIndicator(true);
                    }
                    if(direction=="up") {
                        removeFloor(upFloorsList, floorNum);
                    }
                    if(direction=="down") {
                        removeFloor(downFloorsList, floorNum);
                    }
                }
            });
        });
        
        floors.forEach((floor, index) => {
            floor.on("up_button_pressed", () => {
                if (!upFloorsList.includes(index)) {
                    upFloorsList.push(index);
                }
            });
            floor.on("down_button_pressed", () => {
                if (!downFloorsList.includes(index)) {
                    downFloorsList.push(index);
                }
            });
        });
        
        removeFloor = (array, floor) => {
            var index = array.indexOf(floor); 
            if (index > -1) {
                array.splice(index, 1);
            };
        };
    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
