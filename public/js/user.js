'use strict';


const list = document.querySelector('#list');
const result = document.querySelector('#result');
const spinner = document.querySelector('#spinner');
const form = document.querySelector('form');
const btnSubmit = document.querySelector('#btn-add-task')
spinner.style.visibility = 'hidden';

let userId;

const urlAPI = "http://localhost/managerOneAPI/";

function getUserlist() {
    spinner.style.visibility = 'visible';

    //Recupere la liste des utilisateurs
    fetch(`${urlAPI}users`)
        .then(response => {
            //Si erreur 503 aucun user n'a été trouvé
            if (response.status === 503){
                result.innerText = 'Utilisateur(s) inexistant';
                result.classList.add('text-center');
            }else {
                response.json().then( response => {
                    let users = response.users;
                    createUserListView(users);
                    }
                )

            }
        }).catch(() => {
        createUserListView(null)
    });
}

function createUserListView(arr){

    if (arr != null){

        const ul = document.createElement('ul');

        //    Boucle sur le nombre d'element recupere
        for (let i = 0; i < arr.length; i++){

            //creation d'un li avec un button pour afficher les taches de l'user et un icone de suppression de l'utilsateur
            const li = document.createElement('li');
            li.classList = "row justify-content-evenly text-center removable-container align-items-center";


            //Button qui affiche au click les taches de l'user, button ajout de tache et suppression de l'user
            const userButton = document.createElement('button');
            userButton.innerText = arr[i].name;
            userButton.classList = "btn btn-success my-1 col-7";
            userButton.setAttribute('data-id', arr[i].id);
            userButton.addEventListener('click', getUserInformations);

            const removeUserBtn = document.createElement('button');
            removeUserBtn.classList = 'btn btn-danger col-auto';
            const fontRemove = document.createElement('i');
            fontRemove.classList = 'fas fa-trash-alt';
            removeUserBtn.setAttribute('data-id', arr[i].id);
            removeUserBtn.addEventListener('click', removeUser);



            const addTaskBtn = document.createElement('button');
            addTaskBtn.classList = 'btn btn-success col-auto';
            const fontAdd = document.createElement('i');
            fontAdd.classList = 'fas fa-plus';
            addTaskBtn.setAttribute('data-id', arr[i].id);
            //Permet de récupérer l'id du user pour faire la jointure avec la task
            addTaskBtn.addEventListener('click', getUserId);
            addTaskBtn.setAttribute('data-bs-toggle', "modal");
            addTaskBtn.setAttribute('data-bs-target', "#addTask");

            removeUserBtn.appendChild(fontRemove);
            addTaskBtn.appendChild(fontAdd);

            spinner.style.visibility = 'hidden';

            li.appendChild(userButton);

            li.appendChild(addTaskBtn);
            li.appendChild(removeUserBtn);

            ul.appendChild(li);
            list.appendChild(ul);

        }
    }else{
        //Si l'Api ne renvoie aucune donnée.
        const h2 = document.createElement('h2');
        h2.classList = "text-center my-5";
        h2.innerText = "Aucune donnée";
        spinner.style.visibility = 'hidden';

        list.appendChild(h2)
    }
}

//Permet de récupérer l'id de l'user pour le lier avec la nouvelle task
function getUserId(){
    userId = this.getAttribute('data-id');
}

function checkForm(){
    let titleField = form[0].value;
    let descriptionField = form[1].value;


    if (titleField.length > 0 && descriptionField.length > 0 ){
        btnSubmit.classList.remove('disabled');
    }else {
        btnSubmit.classList.add('disabled');
    }
}

function addTask (form){

    let title = form[0].value;
    let description = form[1].value;
    let statusEncours = form[2].checked;
    // let statusFait = form[3].checked;
    let status;

    //Récupere la radio qui est coché
    if (statusEncours){
        status = form[2].value;
    }else{
        status = form[3].value;
    }

    fetch(`${urlAPI}task`,{
        method: 'POST',
        body : JSON.stringify({
            userId : parseInt(userId),
            title : title,
            description : description,
            status : status
        })
    })
        .then(response =>{
            getUserlist
            const myModalEl = document.getElementById('addTaskf');
            var modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();
        }).catch((error) => {
        console.log(error)
    });
    form.reset();

}

function createUserInformationsView(user){
    spinner.style.visibility = 'visible';

    result.innerHTML = "";

    const email = document.createElement('p');
    const taskInfo = document.createElement('div');

    taskInfo.classList = "mb-2";
    email.style.fontStyle = "italic";
    email.style.fontSize = "0.8rem";
    email.innerText = `Contact : ${user.email}`

    if (user.tasks){

        result.classList.remove('align-items-center');
        user.tasks.forEach(function (task){

            const card = document.createElement('div');
            const cardHeader = document.createElement('div');
            const cardBody = document.createElement('div');
            const cardText  = document.createElement('div');
            const p  = document.createElement('p');
            const cardFooter  = document.createElement('div');
            const span = document.createElement('span');
            const cross = document.createElement('i');

            const a = document.createElement('a');

            card.classList = 'card text-center mb-2 removable-container ';
            cardHeader.classList = 'card-header fw-bold';
            cardBody.classList = 'card-body';
            cardText.classList = 'card-text';
            cardFooter.classList = 'card-footer text-muted fst-italic';

            a.setAttribute('href', '#');
            a.setAttribute('data-id', task.id);
            a.addEventListener('click', removeTask)


            cross.classList = "fas fa-times ms-2 text-danger";

            if (task.status === "En cours"){
                span.innerHTML = `<span class='badge bg-danger'>${task.status}</span>`;
            }else if(task.status === "Fait"){
                span.innerHTML = `<span class='badge bg-success'>${task.status}</span>`;
            }
            spinner.style.visibility = 'hidden';

            cardHeader.innerText = task.title;
            a.appendChild(cross)
            cardHeader.appendChild(a);
            p.innerText = task.description;
            cardFooter.innerText = `Crée le : ${task.creationDate}`;

            cardBody.appendChild(span)
            cardText.appendChild(p);
            cardBody.appendChild(cardText)
            card.appendChild(cardHeader);
            card.appendChild(cardBody)
            card.appendChild(cardFooter)

            result.appendChild(card)

        })
    }else {
        const info = document.createElement('h2')
        info.innerHTML = 'Aucune tâche';
        info.classList = 'text-center';
        spinner.style.visibility = 'hidden';

        taskInfo.appendChild(info)
        result.appendChild(taskInfo)
    }


}

function removeTask(e){
    e.preventDefault();

    if(confirm("êtes vous sûr de vouloir supprimer cette tâche?"))
    {
        let id = this.attributes["data-id"].value;
        let container = this.closest(".removable-container");

        fetch(`${urlAPI}task/${id}`, {
            method : "DELETE"
        }).then(response => {
                fadeOut(container);
            })
    }
}

function removeUser(e){
    e.preventDefault();

    if(confirm("êtes vous sûr de vouloir supprimer cet utilisateur?"))
    {
        let id = this.attributes["data-id"].value;
        let container = this.closest(".removable-container");

        fetch(`${urlAPI}user/${id}`, {
            method : "DELETE"
        }).then(response => {
                fadeOut(container);
                //Fermeture de la fenetre des taches de l'user
                result.innerHTML = "";

        })
    }
}

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
}



function getUserInformations(){

    let id = this.attributes["data-id"].value;
    //Recupere la liste des utilisateurs
    fetch(`${urlAPI}user/${id}`)
        .then(response => response.json())
        .then((datas) =>{
            createUserInformationsView(datas.user)
        }).catch((error) => {
        createUserListView(null)
    });
}

window.onload =  function() {
    getUserlist();
}

