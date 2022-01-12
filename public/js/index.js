'use strict';

const form = document.querySelector('form');
const btnSubmit = document.querySelector('#btn-add-user')
const urlAPI = "http://localhost/managerOneAPI/user";

function checkForm(){


    let nameField = form[0].value;
    let emailField = form[1].value;

    if (nameField.length > 0 && emailField.length > 0 && validateEmail(emailField)){
        btnSubmit.classList.remove('disabled');
    }else {
        btnSubmit.classList.add('disabled');
    }
}
function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function addUser(form){

    const emailParentDiv = document.querySelector('#email-div');
    let alert ;
    let name = form.elements["name"].value;
    let email = form.elements["email"].value;


    fetch(urlAPI,{
        method: 'POST',
        body : JSON.stringify({
            name : name,
            email : email
        })
    }).then(response =>{

        if (response.status === 503){
        //Cela signifie que l'email existe deja en base
        alert = document.querySelector('div');
        alert.classList = 'alert alert-danger mt-2';
        alert.setAttribute('roles', 'alert');
        alert.innerText = 'Cette adresse email est deja utilisée !';
        emailParentDiv.appendChild(alert);

        }else {

            const myModalEl = document.getElementById('addUserForm');
            var modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();

            form.reset();
        }
    }).catch((error =>{
        //Ajouter probleme serveur
        alert = document.querySelector('div');
        alert.classList = 'alert alert-danger mt-2';
        alert.setAttribute('roles', 'alert');
        alert.innerText = 'Problème serveur veuillez retenter ultérieurement';
        emailParentDiv.appendChild(alert);
        console.log(`erreur : ${error}`)
    }))

}


