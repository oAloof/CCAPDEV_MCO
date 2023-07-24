$(document).ready(function() {

    // Listener for upvote button click
    $(".upvote-btn").on("click", function() {
        this.src = "../images/upvote-icon-clicked.png"

        const ancestor_Element = $(this).parents()[2]

        // Check whether selected element is a post or a comment
        if (ancestor_Element.classList.contains("post")) {
            // Update post vote counter
            const postMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            
            const selector = `.post-vote-ctr.${postMongoDbId}`
            var htmlObject = $(selector)
            console.log(htmlObject[0].innerText);
            $.post("/upvote", {
                type: "post",
                postDataID: postMongoDbId
            }, (data) => {
                // Update Vote Counter
                htmlObject[0].innerText = data.votes
            })

        } else {
            const commentMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            const postMongoDbId = $(this).parents()[4].children[0].getAttribute("dataMongodbId")

            const selector = `.vote-ctr.${commentMongoDbId}`
            var htmlObject = $(selector)
            $.post("/upvote", {
                type: "comment",
                commentDataID: commentMongoDbId,
                postDataID: postMongoDbId
                }, (data) => {
                    // Update Vote Counter
                    htmlObject[0].innerHTML = data.votes
                })
        } 
    })
});