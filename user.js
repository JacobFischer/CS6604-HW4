// represents a user in this system, they must have a location, and can move around nodes (nodes cannot move)

var colors = ["orange", "limegreen", "DeepPink", "Wheat", "MediumOrchid"];
var colorIndex = 0;

function User(id, location) {
    this.id = id;
    this.location = location;
    //location.registerUser(this);
    this.color = colors[colorIndex++];
};
