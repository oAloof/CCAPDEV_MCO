$(document).ready(function() {
    $(".upvote-btn").on("click", function() {
        this.src = "../images/upvote-icon-clicked.png"

        const ancestor_Element = $(this).parents()[2]
        
        // Check whether selected element is a post or a comment
        if (ancestor_Element.classList.contains("post")) {
            // Update post vote counter
            const postMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            $.post("/upvote", {
                type: "post",
                postDataID: postMongoDbId
            })

        } else {
            const commentMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            const postMongoDbId = $(this).parents()[4].children[0].getAttribute("dataMongodbId")
            $.post("/upvote", {
                type: "comment",
                commentDataID: commentMongoDbId,
                postDataID: postMongoDbId
            }, function(data, status) {
                
            })
        }
        

        // const ancestor_commentElement = $(this).parents()[2]
        // const mongoDBobjectID = ancestor_commentElement.getAttribute("dataMongodbId")

        // const commentText = $(this).parents()[2].children[1].innerHTML
        // $.post("/upvote", {
        //     data: commentText
        // })
    })
});