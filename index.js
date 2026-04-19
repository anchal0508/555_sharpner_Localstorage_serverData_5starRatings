const API_LINK = "https://crudcrud.com/api/96fbbbbc94b24ef1bcde0226a95235b6/ratings";

const createTracker = () => {
    let tamount = 0;
    let tquantity = 0;
    return {
        add: (quantity, amount) => {
            tamount += +amount;
            tquantity += +quantity;
        },
        getData: () => ({
            tamount,
            tquantity,
            average: tquantity > 0 ? (tamount / tquantity).toFixed(2) : 0
        })
    };
};

const tracker = createTracker();

const uiUPdate = () => {
    const status = tracker.getData();
    document.getElementById('total-amount').appendChild(
        document.createTextNode(status.tamount)

    );
    document.getElementById('total-fruits').appendChild(
        document.createTextNode(status.tquantity)
    );
    document.getElementById('avarage-amount').appendChild(
        document.createTextNode(status.average)
    );

};
const getLocalData = (database) => {
    return new Promise((resolve) => {
        let data = localStorage.getItem(database);
        try {
            data = data ? JSON.parse(data) : [];
        }
        catch (e) {
            data = [];
        }
        resolve(Array.isArray(data) ? data : []);
    });
};


const displayOnScreen = (item) => {

    const content = `
        <span> ${item.fruitName}</span>
        <span> ${item.amount}</span>
        <span> ${item.quantity}</span>
        <span> ${item.block}</span>
    `
    return {
        localDisplay: () => {
            let li = createNewElement('li', content, 'list-item', 'fruit');
            const deleteButton = createNewElement('button', 'Delete', 'horizontal-span', '', () => handleDeleteLocal(item, li));
            const editButton = createNewElement('button', 'Edit', 'horizontal-span', '', () => handleEdit(item, li));
            li.appendChild(deleteButton);
            li.appendChild(editButton);
            document.getElementById('list-ul-local').appendChild(li);
        },
        serverDisplay: () => {
            let li = createNewElement('li', content, 'list-item', 'fruit');
            const deleteButton = createNewElement('button', 'Delete', 'horizontal-span', '', () => handleDeleteServer(item, li));
            const editButton = createNewElement('button', 'Edit', 'horizontal-span', '', () => handleEdit(item, li));
            li.appendChild(deleteButton);
            li.appendChild(editButton);
            document.getElementById('list-ul-server').appendChild(li);
        }

    }
};
// const screenDisplay = displayOnScreen();
const handleRefresh = () => {
    window.location.reload();
}
const handleDeleteLocal = async (item, li) => {
    li.remove();
    let currData = await getLocalData('fruitsData');
    localStorage.removeItem(li);
    const updated = currData.filter((f) => f.id !== item.id);
    localStorage.setItem('fruitsData', JSON.stringify(updated));

};

const handleDeleteServer = () => {

}

const handleEdit = (item, li) => {
    li.remove();
    localStorage.removeItem(li);

    document.getElementById('fruitName').value = item.fruitName;
    document.getElementById('amount').value = item.amount;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('block').value = item.block;

};

const createNewElement = (tag, content = '', className = '', idName = "", onClick = null) => {
    let e = document.createElement(tag);
    if (content) e.innerHTML = content;
    if (className) e.classList.add(...className.split(' '));
    if (idName) e.id = idName;
    if (onClick) e.onclick = onClick;
    return e;
};
const handleSubmitForm = async (event) => {
    event.preventDefault();
    const { fruitName, quantity, amount, block } = event.target;
    const newFruit = {
        // id: Date.now(),
        fruitName: fruitName.value,
        quantity: quantity.value,
        amount: amount.value,
        block: block.value
    };

    axios.post(API_LINK, newFruit)
        .then((res) => {
            // displayOnScreen(res.data);
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        });

    displayOnScreen(newFruit).localDisplay();
    // displayOnScreen(newFruit);
    let currData = await getLocalData('fruitsData');
    currData.push(newFruit);
    localStorage.setItem('fruitsData', JSON.stringify(currData));


    event.target.reset();
};


document.addEventListener('DOMContentLoaded', async () => {

    // getting Data form the localhost
    const currentData = await getLocalData('fruitsData');

    // displaying data to the Localhost Section
    currentData.forEach((element) => {
        tracker.add(element.quantity, element.amount);
        displayOnScreen(element).localDisplay();
    });

    // updating Dahsboards Data
    uiUPdate();

    // To get Data from server using button (to save number of requests out of "100")
    const refreshButton = createNewElement('button', 'Get-Updated Data', 'horizontal-span Data-btn', () => handleRefresh());
    document.getElementById('dashboard').appendChild(refreshButton);

    // adding Stars for Ratings

    displayRatings();

    // await axios.get(API_LINK).then((resole) => console.log(resole.data)).catch(err => console.log(err));
});

getNumberOfStars = async (i) => {
    const localRating = await getLocalData('MyRatings') || [];
    return localRating.filter(num => num.stars == i).length;

}

const displayRatings = async() => {
    const ul = document.getElementById('ratings');
    ul.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        let star = '*'.repeat(i)
        const count = await getNumberOfStars(i);
        let content = `<span>${star}</span> <span> ${count}</span>`
        const li = createNewElement('li', content, 'star-list', '');
        ul.appendChild(li);
    }

}


// filter functionality for local host
const fruitItems = document.getElementById('search-fruit');
fruitItems.addEventListener('keyup', function (event) {
    const fruitItems = document.getElementsByClassName('list-item');
    let text = event.target.value.toLowerCase();
    for (let fruit of fruitItems) {
        let getFruit = fruit.textContent.toLowerCase();
        if (getFruit.includes(text)) fruit.style.display = "";
        else
            fruit.style.display = "none";
    }
})

// Making function enable to get Data form server
const getButton = document.getElementById('getData');
getButton.addEventListener('click', () => GetDataFromServer());

const GetDataFromServer = async () => {
    await axios.get(API_LINK).then((resolve) => {
        for (let itm of resolve.data)
            displayOnScreen(itm).serverDisplay();
    })
    // console.log(resolve.data);
};



// Handling Star Ratings
const handleRatings = async (event) => {
    event.preventDefault();
    const { username, stars } = event.target;
    const newRating = {
        username: username.value,
        stars: stars.value
    }

    const currnetRatings = await getLocalData('MyRatings');
    currnetRatings.push(newRating);
    localStorage.setItem('MyRatings', JSON.stringify(currnetRatings));
    await displayRatings();
    event.target.reset();
}



