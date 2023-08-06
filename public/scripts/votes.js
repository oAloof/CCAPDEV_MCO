$(document).ready(function() {

    // Listener for upvote button click
    $(".upvote-btn").on("click", function() {
        
        const ancestor_Element = $(this).parents()[2]
        var votesToAdd = 0
       
        // Check whether selected element is a post or a comment
        if (ancestor_Element.classList.contains("post")) {
            /* 
            Check if upvote button is already clicked.
            If clicked, subtract one from vote counter
            else, check if downvote button is clicked.
            */
            if (this.classList.contains("clicked")) {
                // Subtract 1 to vote counter
                this.classList.remove("clicked")
                this.src = "../images/upvote-icon.png"
                votesToAdd = -1

            } else {
                this.classList.add("clicked")
                this.src = "../images/upvote-icon-clicked.png"
                /**
                 * Check if downvote button is clicked.
                 * If clicked, add two to votes and reset downvote button to "unclicked"
                 * else, add 1
                 */
                const downvoteBtnHTMLobj = $(this).parents()[1].children[2].children[0]
                if (downvoteBtnHTMLobj.classList.contains("clicked")) {
                    downvoteBtnHTMLobj.classList.remove("clicked")
                    downvoteBtnHTMLobj.src = "../images/downvote-icon.png"
                    votesToAdd = 2
                } else {
                    votesToAdd = 1
                }
            }
            // Update post vote counter
            const postMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            
            const selector = `.post-vote-ctr.${postMongoDbId}`
            var htmlObject = $(selector)
            $.post("/upvote", {
                type: "post",
                postDataID: postMongoDbId,
                votes: votesToAdd
            }, (data) => {
                // Update Vote Counter
                htmlObject[0].innerText = data.votes
            })

        } else {
            /* 
            Check if upvote button is already clicked.
            If clicked, subtract one from vote counter
            else, check if downvote button is clicked.
            */
            if (this.classList.contains("clicked")) {
                // Subtract 1 to vote counter
                this.classList.remove("clicked")
                this.src = "../images/upvote-icon.png"
                votesToAdd = -1

            } else {
                this.classList.add("clicked")
                this.src = "../images/upvote-icon-clicked.png"
                /**
                 * Check if downvote button is clicked.
                 * If clicked, add two to votes and reset downvote button to "unclicked"
                 * else, add 1
                 */
                const downvoteBtnHTMLobj = $(this).parents()[0].children[2]
                if (downvoteBtnHTMLobj.classList.contains("clicked")) {
                    downvoteBtnHTMLobj.classList.remove("clicked")
                    downvoteBtnHTMLobj.src = "../images/downvote-icon.png"
                    votesToAdd = 2
                } else {
                    votesToAdd = 1
                }
            }

            const commentMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            const postMongoDbId = $(this).parents()[4].children[0].getAttribute("dataMongodbId")

            const selector = `.vote-ctr.${commentMongoDbId}`
            var htmlObject = $(selector)
            $.post("/upvote", {
                type: "comment",
                commentDataID: commentMongoDbId,
                postDataID: postMongoDbId,
                votes: votesToAdd
                }, (data) => {
                    // Update Vote Counter
                    htmlObject[0].innerHTML = data.votes
                })
        } 
    })

    // Listener for downvote button click
    $(".downvote-btn").on("click", function() {

        const ancestor_Element = $(this).parents()[2]
        var votesToAdd = 0

         // Check whether selected element is a post or a comment
         if (ancestor_Element.classList.contains("post")) {
            /* 
            Check if downvote button is already clicked.
            If clicked, subtract one from vote counter
            else, check if downvote button is clicked.
            */
            if (this.classList.contains("clicked")) {
                // Add 1 to vote counter
                this.classList.remove("clicked")
                this.src = "../images/downvote-icon.png"
                votesToAdd = 1

            } else {
                this.classList.add("clicked")
                this.src = "../images/downvote-icon-clicked.png"
                /**
                 * Check if upvote button is clicked.
                 * If clicked, subtract two to votes and reset upvote button to "unclicked"
                 * else, subtract 1
                 */
                const upvoteBtnHTMLobj = $(this).parents()[1].children[0].children[0]
                if (upvoteBtnHTMLobj.classList.contains("clicked")) {
                    upvoteBtnHTMLobj.classList.remove("clicked")
                    upvoteBtnHTMLobj.src = "../images/upvote-icon.png"
                    votesToAdd = -2
                } else {
                    votesToAdd = -1
                }
            }


            // Update post vote counter
            const postMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            
            const selector = `.post-vote-ctr.${postMongoDbId}`
            var htmlObject = $(selector)
            $.post("/downvote", {
                type: "post",
                postDataID: postMongoDbId,
                votes: votesToAdd
            }, (data) => {
                // Update Vote Counter
                htmlObject[0].innerText = data.votes
            })

        } else {
            /* 
            Check if downvote button is already clicked.
            If clicked, subtract one from vote counter
            else, check if upvote button is clicked.
            */
            if (this.classList.contains("clicked")) {
                // Subtract 1 to vote counter
                this.classList.remove("clicked")
                this.src = "../images/downvote-icon.png"
                votesToAdd = 1

            } else {
                this.classList.add("clicked")
                this.src = "../images/downvote-icon-clicked.png"
                /**
                 * Check if upvote button is clicked.
                 * If clicked, add two to votes and reset upvote button to "unclicked"
                 * else, add 1
                 */
                const upvoteBtnHTMLobj = $(this).parents()[0].children[0]
                if (upvoteBtnHTMLobj.classList.contains("clicked")) {
                    upvoteBtnHTMLobj.classList.remove("clicked")
                    upvoteBtnHTMLobj.src = "../images/upvote-icon.png"
                    votesToAdd = -2
                } else {
                    votesToAdd = -1
                }
            }

            const commentMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            const postMongoDbId = $(this).parents()[4].children[0].getAttribute("dataMongodbId")

            const selector = `.vote-ctr.${commentMongoDbId}`
            var htmlObject = $(selector)
            $.post("/downvote", {
                type: "comment",
                commentDataID: commentMongoDbId,
                postDataID: postMongoDbId,
                votes: votesToAdd
                }, (data) => {
                    // Update Vote Counter
                    htmlObject[0].innerHTML = data.votes
                })
        }
    })

    // Listener for edit post button click
    $(".edit").on("click", function() {
        const ancestor_Element = $(this).parents()[2]
        const postMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
        window.location.href = `/posts/${postMongoDbId}/edit`
    })

    // Listener for delete post button double-click
    $(".delete").click(function() {
        const url = window.location.href
        const ancestor_Element = $(this).parents()[2]

        if (ancestor_Element.classList.contains("post")) {
            const postMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            $.get(`/posts/${postMongoDbId}/delete`, (res) => {
                if (res == "OK") { window.location.href = url }
            })
        } else {
            const commentMongoDbId = ancestor_Element.getAttribute("dataMongodbId")
            const postMongoDbId = $(this).parents()[4].children[0].getAttribute("dataMongodbId")
            $.get(`/posts/${postMongoDbId}/${commentMongoDbId}/delete`, (res) => {
                if (res == "OK") { window.location.href = url }
            })
        }
    })
});