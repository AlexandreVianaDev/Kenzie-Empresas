import { baseURL, headers, red, green, getCompanies, getCompaniesBySector, getUser, register, login, token, getUserInfo, checkAdmin, userCompanyDepartments, userCoworkers } from "./requests.js"

import { menuMobile, acessLogin, acessRegister, acessHome, acessDashboard } from "./globalScripts.js"

async function userType() {

    const user = await checkAdmin()

    if(user.isAdmin) {
        renderAdmin()
    } else {
        renderUser()
    }
}

async function renderUser() {

    const main = document.querySelector("main")
    const user = await getUserInfo()
    const {username, email, professional_level, kind_of_work, department_uuid
    } = user

    main.insertAdjacentHTML("beforeend", `
        <section class="user__section--1">
            <div>
            <h2 class="title-3">${username}</h2>
            <div class="user__infos">
                <span>Email: ${email}</span>
                <span>${professional_level}</span>
                <span>${kind_of_work}</span>
            </div>
            </div>
            <i class="fa-solid fa-pencil" id="editProfileBtn"></i>
        </section>
    `)

    if(!department_uuid) { // se estiver desempregado
        main.insertAdjacentHTML("beforeend", `
            <section class="user__section--2 job--no">
                <h2>Você ainda não foi contratado</h2>
            </section>
        `)
    } else { // se estiver trabalhando
        const company = await userCompanyDepartments()

        const {name, departments} = await company

        const department = departments.find(department => department.uuid == department_uuid)

        const coworkers = await userCoworkers()

        main.insertAdjacentHTML("beforeend", `
            <section class="user__section--2">
                <button class="title-blue company__name">${name} - ${department.name}</button>
                <ul class="coworkers__list">                   
                </ul>
            </section>
        `)

        const coworkersList = document.querySelector(".coworkers__list")

        coworkers.forEach(coworker => {

            const {username, professional_level} = coworker

            if(coworker.uuid !== user.uuid) { // só renderizar colegas de trabalho e não o próprio usuário
                coworkersList.insertAdjacentHTML("beforeend", `
                    <li>
                        <h4>${username}</h4>
                        <span>${professional_level}</span>
                    </li>
                `)
            }
        })

    }

    userCoworkers()
}

function renderAdmin() {
    // console.log("É ADMIN")
}


function logout() {
    const logoutBtn = document.querySelector("#logoutBtn")

    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault()
        localStorage.clear()
        window.location.replace("/")
    })
}

function start() {
    userType()
    menuMobile()
    logout()
}

start()















const modalDepartament = document.querySelector(".modal__departament--control")

const modalCreateDepartament = document.querySelector(".modal__departament--create")

const modalEditDepartament = document.querySelector(".modal__departament--edit")

const modalEditUser = document.querySelector(".modal__user--edit")

const modalWarningUserRemove = document.querySelector(".modal__warning--user-remove")

const modalWarningDepartamentRemove = document.querySelector(".modal__warning--departament-remove")

const modalEditProfile = document.querySelector(".modal__profile--edit")

// modalDepartament.showModal()

// modalCreateDepartament.showModal()

// modalEditDepartament.showModal()

// modalEditUser.showModal()

// modalWarningUserRemove.showModal()

// modalWarningDepartamentRemove.showModal()

// modalEditProfile.showModal()