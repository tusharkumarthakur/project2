const likes = document.querySelector(".like-button");

likes.addEventListener("dblclick", (e) => {
    // console.log("Double clicked");
    likes.classList.add("like-button-on");
});

likes.addEventListener("click", (e) => {
    console.log("single clicked");
    likes.classList.add("like-button");
    if(likes.classList.contains("like-button-on")){
        console.log("inside");
        likes.classList.remove("like-button-on");
    }
});
