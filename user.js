// represents a user in this system, they must have a location, and can move around nodes (nodes cannot move)

var colors = ["orange", "limegreen", "DeepPink", "Wheat", "MediumOrchid"];
var colorIndex = 0;

function User(id, location) {
    this.id = id;
    this.color = colors[colorIndex++];
    this.location = location;
    this.homeLocation = location;
    location.registerUser(this);
};
