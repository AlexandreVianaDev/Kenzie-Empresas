import { getUserInfo, checkAdmin, userCompanyDepartments, userCoworkers, isLogged, updateProfile } from "./requests.js"

import { menuMobile } from "./globalScripts.js"

async function checkIsLogged() {
    const logged = await isLogged()

    if (!logged) {
        window.location.replace("/")
    } else {
        const user = await checkAdmin()

        if(user.is_admin) {
            window.location.replace("/src/pages/dashboardAdmin.html")
        }
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
                </div>
            </div>
            <i class="fa-solid fa-pencil" id="editProfileBtn"></i>
        </section>
    `)

    const userInfos = document.querySelector(".user__infos")

    if(professional_level) {
        userInfos.insertAdjacentHTML("beforeend", `
            <span>${professional_level}</span>
        `)
    }

    if(kind_of_work) {
        userInfos.insertAdjacentHTML("beforeend", `
            <span>${kind_of_work}</span>
        `)
    }

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

    openModal ()
    userCoworkers()
}

function logout() {
    const logoutBtn = document.querySelector("#logoutBtn")

    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault()
        localStorage.clear()
        window.location.replace("/")
    })
}

async function openModal () {
    const editBtn = document.querySelector("#editProfileBtn")
    const modalEditProfile = document.querySelector(".modal__profile--edit")
    const closeBtn = document.querySelector("#closeBtn")
    const confirmBtn = document.querySelector("#confirmBtn")
    const inputs = document.querySelectorAll("input")

    const user = await getUserInfo()

    // inputs.forEach(input => {
    //     input.value = user[input.id]
    // })

    editBtn.addEventListener("click", (event) => {
        event.preventDefault()
        modalEditProfile.showModal()
    })

    closeBtn.addEventListener("click", (event) => {
        event.preventDefault()
        modalEditProfile.close()
    })

    confirmBtn.addEventListener("click", (event) => {
        event.preventDefault()
        const data = {}
        inputs.forEach(input => {
            if(input.value) {
                data[input.id] = input.value
            }
        })
        updateProfile(data)
        // window.location.replace("/src/pages/dashboard.html")
    })
}

function start() {
    checkIsLogged()
    menuMobile()
    renderUser()
    logout()
}

start()








