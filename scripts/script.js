class User {
    constructor(first_name, last_name, username) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
    }
}

var currentUser = new User("Tyrone","Uy","alooooof");

$(document).ready(function() {
    $("#greeting").text(`Hello, ${currentUser.first_name}!`);
})