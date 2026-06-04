console.log("CODE.JS LOADED");
const urlBase = "https://feraltom.xyz/api";

// -------------------- LOGIN --------------------

function doLogin()
{
    let login =
        document.getElementById("loginName").value;

    let password =
        document.getElementById("loginPassword").value;

    fetch(urlBase + "/Login.php",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(
        {
            login: login,
            password: password
        })
    })
    .then(response => response.json())
    .then(data =>
    {
        if(data.error === "")
        {
            localStorage.setItem(
                "userId",
                data.id
            );

            localStorage.setItem(
                "firstName",
                data.firstName
            );

            window.location.href =
                "contacts.html";
        }
        else
        {
            document.getElementById(
                "loginResult"
            ).innerHTML =
                "Invalid username or password";
        }
    })
    .catch(error =>
    {
        console.log(error);

        document.getElementById(
            "loginResult"
        ).innerHTML =
            "Unable to connect to server";
    });
}

// -------------------- REGISTER --------------------

function doRegister()
{
    let firstName =
        document.getElementById("firstName").value;

    let lastName =
        document.getElementById("lastName").value;

    let login =
        document.getElementById("registerLogin").value;

    let password =
        document.getElementById("registerPassword").value;

    console.log("Register button clicked");

    console.log(
    {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: password
    });

    fetch(urlBase + "/Register.php",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(
        {
            firstName: firstName,
            lastName: lastName,
            login: login,
            password: password
        })
    })
    .then(response => response.json())
    .then(data =>
    {
        if(data.error === "")
        {
            alert(
                "Registration Successful"
            );

            window.location.href =
                "index.html";
        }
        else
        {
            document.getElementById(
                "registerResult"
            ).innerHTML =
                data.error;
        }
    })
    .catch(error =>
    {
        console.log(error);

        document.getElementById(
            "registerResult"
        ).innerHTML =
            "Unable to connect to server";
    });
}

// -------------------- LOGOUT --------------------

function doLogout()
{
    localStorage.removeItem("userId");
    localStorage.removeItem("firstName");

    window.location.href =
        "index.html";
}

// -------------------- CHECK LOGIN --------------------

function checkLogin()
{
    let userId =
        localStorage.getItem("userId");

    if(userId == null)
    {
        window.location.href =
            "index.html";
    }
}

// -------------------- LOAD CONTACTS --------------------

function loadContacts()
{
    document.getElementById(
        "searchText"
    ).value = "";

    searchContacts();
}

// -------------------- SEARCH CONTACTS --------------------

function searchContacts()
{
    let search =
        document.getElementById(
            "searchText"
        ).value;

    let userId =
        localStorage.getItem(
            "userId"
        );

    fetch(urlBase + "/SearchContacts.php",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(
        {
            search: search,
            userId: userId
        })
    })
    .then(response => response.json())
    .then(data =>
    {
        let html = "";

        for(let i = 0; i < data.results.length; i++)
        {
            let contact =
                data.results[i];

            html += '<tr>' +
                '<td>' + contact.FirstName + '</td>' +
                '<td>' + contact.LastName + '</td>' +
                '<td>' + contact.Email + '</td>' +
                '<td>' + contact.Phone + '</td>' +
                '<td>' +
                '<button class="btn btn-warning btn-sm me-2" ' +
                'onclick="editRow(' + contact.ID + ', this)">' +
                'Edit</button> ' +
                '<button class="btn btn-danger btn-sm" ' +
                'onclick="deleteContact(' + contact.ID + ')">' +
                'Delete</button>' +

                '</td>' +
                '</tr>';
        }

        document.getElementById(
            "contactTableBody"
        ).innerHTML = html;
    })
    .catch(error =>
    {
        console.log(error);
    });
}


// -------------------- ADD CONTACT --------------------

function addContact()
{
    let firstName =
        document.getElementById(
            "contactFirstName"
        ).value;

    let lastName =
        document.getElementById(
            "contactLastName"
        ).value;

    let email =
        document.getElementById(
            "contactEmail"
        ).value;

    let phone =
        document.getElementById(
            "contactPhone"
        ).value;

    let userId =
        localStorage.getItem(
            "userId"
        );

    fetch(urlBase + "/AddContact.php",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(
        {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            userId: userId
        })
    })
    .then(response => response.json())
    .then(data =>
    {
        if(data.error === "")
        {
            document.getElementById(
                "contactFirstName"
            ).value = "";

            document.getElementById(
                "contactLastName"
            ).value = "";

            document.getElementById(
                "contactEmail"
            ).value = "";

            document.getElementById(
                "contactPhone"
            ).value = "";

            searchContacts();
        }
        else
        {
            alert(data.error);
        }
    })
    .catch(error =>
    {
        console.log(error);
    });
}

// -------------------- DELETE CONTACT --------------------


function deleteContact(contactId)
{
    if(
        !confirm(
            "Are you sure you want to delete this contact?"
        )
    )
    {
        return;
    }

    let userId =
        localStorage.getItem(
            "userId"
        );

    fetch(urlBase + "/DeleteContact.php",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(
        {
            id: contactId,
            userId: userId
        })
    })
    .then(response => response.json())
    .then(data =>
    {
        if(data.error === "")
        {
            searchContacts();
        }
        else
        {
            alert(data.error);
        }
    })
    .catch(error =>
    {
        console.log(error);

        alert(
            "Unable to delete contact."
        );
    });
}


// -------------------- EDIT CONTACT --------------------
function editRow(contactId, button)
{
    let row =
        button.closest("tr");

    let firstName =
        row.cells[0].innerText;

    let lastName =
        row.cells[1].innerText;

    let email =
        row.cells[2].innerText;

    let phone =
        row.cells[3].innerText;

    row.cells[0].innerHTML =
        '<input class="form-control" id="editFirstName" value="' +
        firstName + '">';

    row.cells[1].innerHTML =
        '<input class="form-control" id="editLastName" value="' +
        lastName + '">';

    row.cells[2].innerHTML =
        '<input class="form-control" id="editEmail" value="' +
        email + '">';

    row.cells[3].innerHTML =
        '<input class="form-control" id="editPhone" value="' +
        phone + '">';

    row.cells[4].innerHTML =
        '<button class="btn btn-success btn-sm me-2" ' +
        'onclick="saveContact(' + contactId + ', this)">Save</button>' +

        '<button class="btn btn-secondary btn-sm" ' +
        'onclick="searchContacts()">Cancel</button>';
}


function saveContact(contactId, button)
{
    let row =
        button.closest("tr");

    let firstName =
        row.querySelector("#editFirstName").value;

    let lastName =
        row.querySelector("#editLastName").value;

    let email =
        row.querySelector("#editEmail").value;

    let phone =
        row.querySelector("#editPhone").value;

    let userId =
        localStorage.getItem(
            "userId"
        );

    fetch(urlBase + "/UpdateContacts.php",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(
        {
            id: contactId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            userId: userId
        })
    })
    .then(response => response.json())
    .then(data =>
    {
        if(data.error === "")
        {
            searchContacts();
        }
        else
        {
            alert(data.error);
        }
    });

    if(data.error === "")
    {
        alert("Contact updated successfully!");
        searchContacts();
    }
}