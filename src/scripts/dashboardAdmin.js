import { getCompanies, checkAdmin, isLogged, getAllDepartments, getAllDepartmentsFromCompany, getAllUsers, createDepartment, getUsersWithoutJob, hireUser, editDepartment, deleteDepartment, editUser, deleteUser, fireUser } from "./requests.js"

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
        select.insertAdjacentHTML("beforeend", `
            <option value="${uuid}">${name}</option>
        `)
    })

    select.addEventListener("change", (event) => {
        renderDepartmentsFromCompany(select.value)
    })
}

async function renderDepartments() {
    const departmentList = document.querySelector(".department__list")
    const departments = await getAllDepartments()

    departments.forEach(department => {
        const { name, description, uuid} = department
        const companyName = department.companies.name

        const li = document.createElement("li")

        const divHeader = document.createElement("div")
        divHeader.classList.add("department__header")

        const h4 = document.createElement("h4")
        h4.classList.add("title-4")
        h4.innerText = `${name}`

        const p = document.createElement("p")
        p.innerText = `${description}`

        const span = document.createElement("span")
        span.innerText = `${companyName}`

        divHeader.append(h4, p, span)
        li.appendChild(divHeader)

        const divControl = document.createElement("div")
        divControl.classList.add("department__control")

        const viewBtn = document.createElement("i")
        viewBtn.setAttribute("class", "fa-regular fa-eye")
        viewBtn.addEventListener("click", (event) => {
            event.preventDefault()
            modalViewDepartament(uuid)
        })

        const editBtn = document.createElement("i")
        editBtn.setAttribute("class", "fa-solid fa-pencil")
        editBtn.addEventListener("click", (event) => {
            event.preventDefault()
            modalEditDepartment(uuid)
        })

        const deleteBtn = document.createElement("i")
        deleteBtn.setAttribute("class", "fa-regular fa-trash-can")
        deleteBtn.addEventListener("click", (event) => {
            event.preventDefault()
            modalDeleteDepartment(uuid)
        })

        divControl.append(viewBtn, editBtn, deleteBtn)
        li.appendChild(divControl)

        departmentList.appendChild(li)
    })

}

async function renderDepartmentsFromCompany(uuid) {
    const departments = await getAllDepartmentsFromCompany(uuid)
    const departmentList = document.querySelector(".department__list")

    departmentList.innerHTML = ""

    if(departments.length > 0){
        departments.forEach(department => {
            const { name, description, uuid} = department
            const companyName = department.companies.name

            const li = document.createElement("li")

            const divHeader = document.createElement("div")
            divHeader.classList.add("department__header")

            const h4 = document.createElement("h4")
            h4.classList.add("title-4")
            h4.innerText = `${name}`

            const p = document.createElement("p")
            p.innerText = `${description}`

            const span = document.createElement("span")
            span.innerText = `${companyName}`

            divHeader.append(h4, p, span)
            li.appendChild(divHeader)

            const divControl = document.createElement("div")
            divControl.classList.add("department__control")

            const viewBtn = document.createElement("i")
            viewBtn.setAttribute("class", "fa-regular fa-eye")
            viewBtn.addEventListener("click", (event) => {
                event.preventDefault()
                modalViewDepartament(uuid)
            })

            const editBtn = document.createElement("i")
            editBtn.setAttribute("class", "fa-solid fa-pencil")
            editBtn.addEventListener("click", (event) => {
                event.preventDefault()
                modalEditDepartment(uuid)
            })

            const deleteBtn = document.createElement("i")
            deleteBtn.setAttribute("class", "fa-regular fa-trash-can")
            deleteBtn.addEventListener("click", (event) => {
                event.preventDefault()
                modalDeleteDepartment(uuid)
            })

            divControl.append(viewBtn, editBtn, deleteBtn)
            li.appendChild(divControl)

            departmentList.appendChild(li)
        })
    } else {
        departmentList.insertAdjacentHTML("beforeend", `
            <li class="department--no">
                <h2>A empresa ainda não possui departamentos</h2>
            </li>
        `)
    }
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
        editDepartment(data,uuid)
    })

    modal.showModal()
}

async function renderUsers() {
    const users = await getAllUsers();
    const usersList = document.querySelector(".users__list")

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

            const div = document.createElement("div")
            div.classList.add("user__control")

            const iEditUser = document.createElement("i")
            iEditUser.classList.add("fa-solid")
            iEditUser.classList.add("fa-pencil")

            iEditUser.addEventListener("click", (event) => {
                event.preventDefault()
                modalEditUser(uuid)
            })

            const iDeleteUser = document.createElement("i")
            iDeleteUser.classList.add("fa-regular")
            iDeleteUser.classList.add("fa-trash-can")

            iDeleteUser.addEventListener("click", (event) => {
                event.preventDefault()
                modalDeleteUser(uuid)
            })

            div.append(iEditUser, iDeleteUser)
            li.appendChild(div)
            usersList.appendChild(li)
        }
    })
}

function modalEditUser(uuid) {
    const modal = document.querySelector("dialog")

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
        const kindOfWorkInput = document.querySelector("#kind_of_work")
        const professionalLevelInput = document.querySelector("#professional_level")
        const data = {}

        if (kindOfWorkInput.value) {
            data.kind_of_work = kindOfWorkInput.value
        }
        if(professionalLevelInput.value){
            data.professional_level = professionalLevelInput.value
        }
        editUser(data,uuid)
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
    })
    modal.showModal()
}

export async function modalViewDepartament(uuid) {
    const modal = document.querySelector("dialog")

    modal.classList.remove("modal--small")
    modal.classList.remove("modal--medium")
    modal.classList.add("modal--big")

    const departments = await getAllDepartments()
  
    const department = await departments.find(department => { return department.uuid == uuid})

    const { name,  description } = department
    const companyName = department.companies.name

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
        modal.close()
        modalViewDepartament(uuid)
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
            fireUser(event.target.dataset.uuid)
            modal.close()
            modalViewDepartament(uuid)
        })
    })

    modal.showModal()
}

async function modalCreateDepartment() {
    const modal = document.querySelector("dialog")
    const createBtn = document.querySelector("#createBtn")


    createBtn.addEventListener("click", async (event) => {
        event.preventDefault()

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

        const createDepartmentBtn = document.querySelector("#createDepartmentBtn")

        createDepartmentBtn.addEventListener("click", (event) => {
            event.preventDefault()

            const data = {}

            const inputs = document.querySelectorAll("input")

            inputs.forEach(input => {
                data[input.id] = input.value
            })

            data.company_uuid = select.value

            createDepartment(data)            
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
}

start()