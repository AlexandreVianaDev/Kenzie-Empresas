import { baseURL, headers, red, green, getCompanies, getCompaniesBySector, getUser, register, login, token, getUserInfo, checkAdmin, userCompanyDepartments, userCoworkers, isLogged, getAllDepartments, getAllDepartmentsFromCompany, getAllUsers, createDepartment, getUsersWithoutJob, hireUser, fireUser, editDepartment, deleteDepartment, editUser, deleteUser } from "./requests.js"

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

    editDepartmentBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault()
            // console.log(event.target.dataset.uuid)
            const uuid = event.target.dataset.uuid
            modalEditDepartment(uuid)
        })
    })

    deleteDepartmentBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault()
            console.log(event.target.dataset.uuid)
            const uuid = event.target.dataset.uuid
            modalDeleteDepartment(uuid)
        })
    })

    // console.log(viewDepartmentBtns)

}

async function modalDeleteDepartment(uuid) {
    const departments = await getAllDepartments()
    const department = departments.find(department => department.uuid == uuid)
    const { name } = department

    const modal = document.querySelector("dialog")
    modal.classList.remove("modal--big")
    modal.classList.remove("modal--small")
    modal.classList.add("modal--medium")

    modal.innerHTML = ""

    modal.insertAdjacentHTML("beforeend",`
        <div>
            <i class="fa-solid fa-xmark" id="closeBtn"></i>
            <h3>Realmente deseja deletar o departamento ${name} e demitir seus funcionários?</h3>
            <button class="button-green" id="deleteBtn">Confirmar</button>
        </div>
    `)

    const closeBtn = document.querySelector("#closeBtn")
    closeBtn.addEventListener("click", (event) => {
        event.preventDefault()
        modal.close()
    })

    const deleteBtn = document.querySelector("#deleteBtn")
    deleteBtn.addEventListener("click", (event) => {
        event.preventDefault()
        deleteDepartment(uuid)
        modal.close()
        window.location.reload()
    })

    modal.showModal()
}

async function modalEditDepartment(uuid) {
    const departments = await getAllDepartments()
    const department = departments.find(department => department.uuid == uuid)
    const { description } = department


    const modal = document.querySelector("dialog")
    modal.classList.remove("modal--big")
    modal.classList.remove("modal--medium")
    modal.classList.add("modal--small")

    modal.innerHTML = ""

    modal.insertAdjacentHTML("beforeend",`
        <div>
            <i class="fa-solid fa-xmark" id="closeBtn"></i>
            <h2 class="title-2">Editar departamento</h2>
            <form>
                <textarea name="departament__description" id="departament__description" cols="30" rows="10" placeholder="Valores anteriores da descrição">${description}</textarea>
                <button class="button-blue" id="saveBtn">Salvar alterações</button>
            </form>
        </div>
    `)

    const closeBtn = document.querySelector("#closeBtn")
    closeBtn.addEventListener("click", (event) => {
        event.preventDefault()
        modal.close()
    })

    const saveBtn = document.querySelector("#saveBtn")
    saveBtn.addEventListener("click", (event) => {
        event.preventDefault()
        const input = document.querySelector("#departament__description")
        const data = {
            description: input.value
        }
        console.log(event.target)
        editDepartment(data,uuid)
        modal.close()
    })

    console.log(department.description)
    console.log(modal)

    modal.showModal()
}

async function renderUsers() {
    const users = await getAllUsers();
    const usersList = document.querySelector(".users__list")

    // console.log(users)
    // console.log(usersList)
    users.forEach(async user => {

        const { username, professional_level, department_uuid, uuid } = user

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
                    <i class="fa-solid fa-pencil editUser" data-uuid="${uuid}"></i>
                    <i class="fa-regular fa-trash-can deleteUser"  data-uuid="${uuid}"></i>
                </div>
            `)

            usersList.appendChild(li)
        }
    })
    prepareUsersButtons()
}

function prepareUsersButtons() {
    const editUserBtns = document.querySelectorAll(".editUser")
    const deleteUserBtns  = document.querySelectorAll(".deleteUser")

    editUserBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault()
            const uuid = event.target.dataset.uuid
            // console.log(uuid)
            modalEditUser(uuid)
        })
    })

    deleteUserBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault()
            // console.log(event.target.dataset.uuid)
            const uuid = event.target.dataset.uuid
            modalDeleteUser(uuid)
        })
    })
}

function modalEditUser(uuid) {
    const modal = document.querySelector("dialog")
    // const users = await getAllUsers();
    // const user = users.find(user => user.uuid == uuid)

    // const { professional_level, kind_of_work} = user

    modal.classList.remove("modal--big")
    modal.classList.remove("modal--medium")
    modal.classList.add("modal--small")

    modal.innerHTML = ""

    modal.insertAdjacentHTML("beforeend", `
        <div>
            <i class="fa-solid fa-xmark" id="closeBtn"></i>
            <h2 class="title-2">Editar Usuário</h2>
            <form>
                <select name="kind_of_work" id="kind_of_work" class="text-2">
                    <option value="">Selecionar modalidade de trabalho</option>
                    <option value="home office" class="text-2">Home Office</option>
                    <option value="presencial" class="text-2">Presencial</option>
                    <option value="hibrido" class="text-2">Híbrido</option>
                </select>
                <select name="professional_level" id="professional_level" class="text-2">
                    <option value="">Selecionar nível profissional</option>
                    <option value="estágio" class="text-2">Estágio</option>
                    <option value="júnior" class="text-2">Júnior</option>
                    <option value="pleno" class="text-2">Pleno</option>
                    <option value="sênior" class="text-2">Sênior</option>
                </select>
                <button class="button-blue" id="editBtn">Editar</button>
            </form>
        </div>
    `)

    const closeBtn = document.querySelector("#closeBtn")
    closeBtn.addEventListener("click", (event) => {
        event.preventDefault()
        modal.close()
    })

    const editBtn = document.querySelector("#editBtn")
    editBtn.addEventListener("click", (event) => {
        event.preventDefault()
        console.log(event.target)
        const kindOfWorkInput = document.querySelector("#kind_of_work")
        const professionalLevelInput = document.querySelector("#professional_level")
        const data = {}

        if (kindOfWorkInput.value) {
            data.kind_of_work = kindOfWorkInput.value
        }
        if(professionalLevelInput.value){
            data.professional_level = professionalLevelInput.value
        }
        console.log(data)
        console.log(editUser(data,uuid))
        modal.close()
        window.location.reload()
    })

    modal.showModal()
}

async function modalDeleteUser(uuid) {
    const modal = document.querySelector("dialog")
    const users = await getAllUsers();
    const user = users.find(user => user.uuid == uuid)
    const { username } = user

    modal.classList.remove("modal--big")
    modal.classList.remove("modal--small")
    modal.classList.add("modal--medium")

    modal.innerHTML = ""

    modal.insertAdjacentHTML("beforeend", `
    <div>
        <i class="fa-solid fa-xmark" id="closeBtn"></i>
        <h3>Realmente deseja remover o usuário ${username}?</h3>
        <button class="button-green" id="deleteBtn">Deletar</button>
    </div>
    `)

    const closeBtn = document.querySelector("#closeBtn")
    closeBtn.addEventListener("click", (event) => {
        event.preventDefault()
        modal.close()
    })

    const deleteBtn = document.querySelector("#deleteBtn")
    deleteBtn.addEventListener("click", (event) => {
        event.preventDefault()
        deleteUser(uuid)
        modal.close()
        window.location.reload()
    })
    modal.showModal()
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