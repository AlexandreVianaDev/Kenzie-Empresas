import { baseURL, headers, red, green, getCompanies, getCompaniesBySector, getUser, register, login, token, getUserInfo, checkAdmin, userCompanyDepartments, userCoworkers, isLogged, getAllDepartments, getAllDepartmentsFromCompany, getAllUsers, createDepartment, getUsersWithoutJob, hireUser, fireUser } from "./requests.js"

import { menuMobile } from "./globalScripts.js"

async function checkIsLogged() {
    const logged = await isLogged()

    if (!logged) {
        window.location.replace("/")
    } else {
        const user = await checkAdmin()

        if(!user.is_admin) {
            window.location.replace("/src/pages/dashboard.html")
        }
    }
}

async function renderCompanies() {
    const select = document.querySelector("#departments")
    const companies = await getCompanies()

    companies.forEach(company => {
        const { name, uuid } = company
        // console.log(company)
        select.insertAdjacentHTML("beforeend", `
            <option value="${uuid}">${name}</option>
        `)
    })

    select.addEventListener("change", (event) => {
        // console.log(select.value)
        renderDepartmentsFromCompany(select.value)
    })

    // console.log(companies)

}

async function renderDepartments() {
    const departmentList = document.querySelector(".department__list")
    const departments = await getAllDepartments()

    departments.forEach(department => {
        const { name, description, uuid} = department
        const companyName = department.companies.name

        departmentList.insertAdjacentHTML("beforeend", `
            <li>
                <div class="department__header">
                    <h4 class="title-4">${name}</h4>
                    <p>${description}</p>
                    <span>${companyName}</span>
                </div>
                <div class="department__control">
                    <i class="fa-regular fa-eye viewDepartment" data-uuid="${uuid}"></i>
                    <i class="fa-solid fa-pencil editDepartment" data-uuid="${uuid}"></i>
                    <i class="fa-regular fa-trash-can deleteDepartment" data-uuid="${uuid}"></i>
                </div>
            </li>
        `)
    })

    prepareDepartmentButtons()
}

async function renderDepartmentsFromCompany(uuid) {
    const departments = await getAllDepartmentsFromCompany(uuid)
    const departmentList = document.querySelector(".department__list")
    const main = document.querySelector("main")
    // console.log(departments)

    departmentList.innerHTML = ""

    if(departments.length > 0){
        departments.forEach(department => {
            const { name, description, uuid} = department
            const companyName = department.companies.name
    
            departmentList.insertAdjacentHTML("beforeend", `
                <li>
                    <div class="department__header">
                        <h4 class="title-4">${name}</h4>
                        <p>${description}</p>
                        <span>${companyName}</span>
                    </div>
                    <div class="department__control">
                        <i class="fa-regular fa-eye viewDepartment" data-uuid="${uuid}"></i>
                        <i class="fa-solid fa-pencil editDepartment" data-uuid="${uuid}"></i>
                        <i class="fa-regular fa-trash-can deleteDepartment" data-uuid="${uuid}"></i>
                    </div>
                </li>
            `)
        })
    } else {
        // console.log("a")
        departmentList.insertAdjacentHTML("beforeend", `
            <li class="department--no">
                <h2>A empresa ainda não possui departamentos</h2>
            </li>
        `)
    }
    prepareDepartmentButtons()
}

async function prepareDepartmentButtons() {
    const viewDepartmentBtns = document.querySelectorAll(".viewDepartment")
    const editDepartmentBtns = document.querySelectorAll(".editDepartment")
    const deleteDepartmentBtns = document.querySelectorAll(".deleteDepartment")

    viewDepartmentBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault()
            const uuid = event.target.dataset.uuid
            // console.log(uuid)
            modalViewDepartament(uuid)
        })
    })

    // console.log(viewDepartmentBtns)

}

async function renderUsers() {
    const users = await getAllUsers();
    const usersList = document.querySelector(".users__list")

    // console.log(users)
    // console.log(usersList)
    users.forEach(async user => {

        const { username, professional_level, department_uuid } = user

        if(!user.is_admin) {
            const li = document.createElement("li")

            const divHeader = document.createElement("div")
            divHeader.classList.add("user__header")


            const h4 = document.createElement("h4")
            h4.classList.add("title-4")
            h4.innerText = `${username}`
            divHeader.appendChild(h4)
            

            const spanProfessional = document.createElement("span")
            if (professional_level) {
                // console.log(professional_level)
                spanProfessional.innerText = `${professional_level}`
                divHeader.appendChild(spanProfessional)
            }
            
            const spanDepartment = document.createElement("span")
            if(department_uuid) {
                const departments = await getAllDepartments()
                const departmentFound = departments.find(department => department.uuid == department_uuid)
                spanDepartment.innerText = `${departmentFound.companies.name}`
                divHeader.appendChild(spanDepartment)
            }

            li.appendChild(divHeader)

            li.insertAdjacentHTML("beforeend", `
                <div class="user__control">
                    <i class="fa-solid fa-pencil"></i>
                    <i class="fa-regular fa-trash-can"></i>
                </div>
            `)

            usersList.appendChild(li)


            

            // usersList.insertAdjacentHTML("beforeend", `
            //     <li>
            //         <div class="user__header">
            //             <h4 class="title-4">${username}</h4>
            //             <span>${professional_level}</span>
            //             <span>${department_uuid}</span>
            //         </div>
            //         <div class="user__control">
            //             <i class="fa-solid fa-pencil"></i>
            //             <i class="fa-regular fa-trash-can"></i>
            //         </div>
            //     </li>
            // `)
            // if(user.department_uuid) {
            //     const userHeader = 
            //     console.log("a")
            // }
        }
    })
}

async function modalViewDepartament(uuid) {
    const modal = document.querySelector("dialog")

    modal.classList.remove("modal--small")
    modal.classList.remove("modal--medium")
    modal.classList.add("modal--big")

    const departments = await getAllDepartments()
  
    const department = await departments.find(department => { return department.uuid == uuid})

    const { name,  description } = department
    const companyName = department.companies.name

    console.log(department)

    modal.innerHTML = ""

    modal.insertAdjacentHTML("beforeend", `
        <div>
          <i class="fa-solid fa-xmark" id="closeBtn"></i>
          <h2 class="title-2">${name}</h2>
          <div class="department__general">
            <div class="department__informations">
              <p class="title-4">${description}</p>
              <span class="text-2">${companyName}</span>
            </div>
            <div class="hire__container">
              <select name="users" id="users" class="text-2">
                <option value="" class="text-2">Selecionar usuário</option>
              </select>
              <button class="button-green" id="hireBtn">Contratar</button>
            </div>
          </div>
          <div>
            <ul class="department__users--list">
            </ul>
          </div>
        </div>
    `)

    const closeBtn = document.querySelector("#closeBtn")

    closeBtn.addEventListener("click", (event) => {
        event.preventDefault()
        modal.close()
    })

    const select = document.querySelector("#users")
    const usersWithoutJob = await getUsersWithoutJob()



    usersWithoutJob.forEach(user => {
        // console.log(user)
        const { username, uuid } = user

        select.insertAdjacentHTML("beforeend", `
            <option value="${uuid}" class="text-2">${username}</option>
        `)
    })

    const hireBtn = document.querySelector("#hireBtn")

    hireBtn.addEventListener("click", (event) => {
        event.preventDefault()
        const data = {
            user_uuid: select.value,
            department_uuid: uuid
        }

        hireUser(data)
    })

    const departmentUsersList = document.querySelector(".department__users--list")

    const allUsers = await getAllUsers()
    const departamentUsers = allUsers.filter(user => { return user.department_uuid == uuid })

    departamentUsers.forEach(user => {
        const { username, professional_level, kind_of_work, uuid } = user

        const li = document.createElement("li")

        li.insertAdjacentHTML("beforeend", `
            <h4 class="title-4">${username}</h4>
        `)

        const spanProfessional = document.createElement("span")
        if (professional_level) {
            spanProfessional.innerText = `${professional_level}`
            li.appendChild(spanProfessional)
        }
        
        const spanDepartment = document.createElement("span")
        if (kind_of_work) {
            spanDepartment.innerText = `${kind_of_work}`
            li.appendChild(spanDepartment)
        }

        li.insertAdjacentHTML("beforeend", `
            <button class="button-white-red fireBtn" data-uuid="${uuid}">Desligar</button>
        `)

        departmentUsersList.appendChild(li)
    })

    const fireBtns = document.querySelectorAll(".fireBtn")

    fireBtns.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault()
            // console.log(event.target.dataset.uuid)
            fireUser(event.target.dataset.uuid)

        })
    })

    modal.showModal()
}

async function modalCreateDepartment() {
    const modal = document.querySelector("dialog")
    const createBtn = document.querySelector("#createBtn")

    // console.log(createBtn)

    createBtn.addEventListener("click", async (event) => {
        event.preventDefault()
        // console.log(event.target)

        modal.classList.remove("modal--big")
        modal.classList.remove("modal--medium")
        modal.classList.add("modal--small")

        modal.innerHTML = ""

        modal.insertAdjacentHTML("beforeend", `
            <div>
            <i class="fa-solid fa-xmark" id="closeBtn"></i>
            <h2 class="title-2">Criar departamento</h2>
            <form>
                <input type="text"  name="name" id="name" placeholder="Nome do departamento">
                <input type="text" name="description" id="description" placeholder="Descrição">
                <select name="companiesList" id="companiesList" class="text-2">
                <option value="" class="text-2">Selecionar empresa</option>
                </select>
                <button class="button-blue" id="createDepartmentBtn">Criar o departamento</button>
            </form>
            </div>
        `)

        const select = document.querySelector("#companiesList")
        const companies = await getCompanies()

        companies.forEach(company => {
            const { name, uuid } = company 
            select.insertAdjacentHTML("beforeend",`
                <option value="${uuid}" class="text-2">${name}</option>
            `)
        })

        select.addEventListener("change", (event) => {
            console.log(select.value)
        })

        const createDepartmentBtn = document.querySelector("#createDepartmentBtn")

        createDepartmentBtn.addEventListener("click", (event) => {
            event.preventDefault()

            const data = {}

            const inputs = document.querySelectorAll("input")

            inputs.forEach(input => {
                data[input.id] = input.value
            })

            data.company_uuid = select.value


            console.log(data)
            createDepartment(data)
            modal.close()
            location.reload()
        })

        const closeBtn = document.querySelector("#closeBtn")
        closeBtn.addEventListener("click", (event) => {
            event.preventDefault()
            modal.close()
        })

        modal.showModal()
    })

    
}

function logout() {
    const logoutBtn = document.querySelector("#logoutBtn")
  
    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault()
        localStorage.clear()
        window.location.replace("/")
    })
}

async function renderAdmin() {
    renderCompanies()
    renderDepartments()
    renderUsers()
}

function start() {
    checkIsLogged()
    menuMobile()
    renderAdmin()
    logout()
    modalCreateDepartment()
    // modalViewDepartament()
}

start()















const modalDepartament = document.querySelector(".modal__departament--control")



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