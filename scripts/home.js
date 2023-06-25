class User {
    constructor(first_name, last_name, username) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
    }
}

class Post {
    constructor(title, author, content) {
        this.title = title;
        this.author = author;
        this.content = content;
    }

    generatePreview() {
        let preview_main = document.createElement("div");
        preview_main.setAttribute("class", "post-preview");

        let preview_title = document.createElement("div");
        preview_title.setAttribute("class", "post-title");
        preview_title.innerHTML = this.title;
        preview_main.appendChild(preview_title);

        let preview_author = document.createElement("div");
        preview_author.setAttribute("class", "post-author");
        preview_author.innerHTML = `posted by ${this.author}`;
        preview_main.appendChild(preview_author);

        let preview_content = document.createElement("div");
        preview_content.setAttribute("class", "post-content");
        preview_content.innerHTML = (this.content.length < 75)?
            this.content:`${this.content.slice(0,76)}<br><b>...See More</b>`;
        preview_main.appendChild(preview_content);

        return preview_main;
    }
}

var currentUser = new User("Tyrone","Uy","alooooof");

let posts = [new Post("Post Title","admin","Lorem ipsum dolor sit amet, consectetur adipisicing elit. \
Dicta quae repudiandae unde fugit non minima accusamus modi! Enim blanditiis rem neque tenetur officia, \
ratione explicabo, reprehenderit sunt minus doloribus corporis.")]

$(document).ready(function() {
    for (let post of posts) {
        let post_preview  = post.generatePreview();
        $("#content-container").append(post_preview);
    }

    $("#greeting").text(`Hello, ${currentUser.first_name}!`);

    $(".filter span").click(function() {
        $(this).parent().remove();
    });

    $("#add-filter-btn").click(function(e) {
        e.preventDefault();
        displayNewFilter($("#add-filter").val());
        $("#add-filter").val('');
    });

    $(".post-content b").click(function() {
        window.location.href = "./post.html"
    });

    // CUSTOM FUNCTIONS

    function displayNewFilter(filter_name) {
        let filter_main = document.createElement("div");
        filter_main.setAttribute("class", "filter");
        filter_main.innerHTML = `${filter_name} <span>X</span>`;

        $("#filter-container").append(filter_main);
    };
})