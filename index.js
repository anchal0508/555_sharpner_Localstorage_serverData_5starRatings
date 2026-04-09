
window.addEventListener("DOMContentLoaded", () => {
    const rating1 = 0;
    const rating2 = 0;
    const rating3 = 0;
    const rating4 = 0;
    const rating5 = 0;
    axios.get("https://crudcrud.com/api/d8acabd76a014e4ea012b5eb3e996fdf/ratings/")
        .then((msg) => { 
      msg.data.forEach((i)=>{
        displayOnScreen(i);
        // if(i.rating === '1') rating1++;
        // if(i.rating === '2') rating2++;
        // if(i.rating === '3') rating3++;
        // if(i.rating === '4') rating4++;
        // if(i.rating === '5') rating5++;
        console.log(i.rating);
      })
    })
    .catch((err) => console.log(err));


    // document.getElementById("1").appendChild(document.createTextNode(rating1));
    // document.getElementById("2").appendChild(document.createTextNode(rating2));;
    // document.getElementById("3").appendChild(document.createTextNode(rating3));;
    // document.getElementById("4").appendChild(document.createTextNode(rating4));;
    // document.getElementById("5").appendChild(document.createTextNode(rating5));;
})

function handleFormSubmit(event) {
event.preventDefault();
    const userDetails = {
        username: event.target.username.value,
        rating: event.target.rating.value
    };

    axios.post("https://crudcrud.com/api/d8acabd76a014e4ea012b5eb3e996fdf/ratings", userDetails)
        .then((res) => {
            displayOnScreen(res.data);
        })
        .catch((err) => console.log(err));

}

function displayOnScreen(userDetails) {
    const li = document.createElement('li');
    li.appendChild(
        document.createTextNode(
            `${userDetails.username} : ${userDetails.rating}`
        )
    );

    const deleteButton = document.createElement('button');
    deleteButton.appendChild(
        document.createTextNode('Delete user Details')
    );
    li.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.appendChild(
        document.createTextNode("Edit User Ratings")
    );
    li.appendChild(editButton);

    const ul = document.querySelector('ul');
    ul.appendChild(li);



    deleteButton.addEventListener('click', function (event) {
        ul.removeChild(event.target.parentElement);
        axios.delete(`https://crudcrud.com/api/d8acabd76a014e4ea012b5eb3e996fdf/ratings/${userDetails._id}`)
            .then(() => console.log("deleted"))
            .chatch((err) => console.log(err));
    })


    editButton.addEventListener('click', function (event) {
        ul.removeChild(event.target.parentElement);
         axios.delete(`https://crudcrud.com/api/d8acabd76a014e4ea012b5eb3e996fdf/ratings/${userDetails._id}`)
            .then(() => console.log("deleted"))
            .chatch((err) => console.log(err));
        document.querySelector("#username").value = userDetails.username;
        document.querySelector("#ratings").value = userDetails.rating;

       
    })
}