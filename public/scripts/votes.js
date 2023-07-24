$(document).ready(function() {
    $(".upvote-btn").on("click", function() {
        this.src = "../images/upvote-icon-clicked.png"

        // const ancestor_commentElement = $(this).parents()[2]
        // const mongoDBobjectID = ancestor_commentElement.getAttribute("dataMongodbId")
        const commentText = $(this).parents()[2].children[1].innerHTML
        $.post("/upvote", {
            data: commentText
        })

        
    })
});