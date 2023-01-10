import { callToastify } from "./toastify.js"

export const baseURL = "http://localhost:6278"

export const { token } = getUser()

export const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
}

export const red = "#CE4646"
export const green = "#4BA036"


export function getUser() {
    const user = JSON.parse(localStorage.getItem("@KenzieEmpresas:user")) || {}

    return user
}

export async function getUserInfo() {
    const user = await fetch(`${baseURL}/users/profile`, {
        method: "GET",
        headers: headers
    })

    const userJSON = await user.json()

    return userJSON
}

export async function checkAdmin() {
    const admin = await fetch(`${baseURL}/auth/validate_user`, {
        method: "GET",
        headers: headers
    })

    const adminJSON = await admin.json()

    return adminJSON
}

export async function register(data) {
    const register = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })

    const registerJSON = await register.json()

    if(!register.ok) {
        callToastify("O email já está registrado",red)
    } else {
        window.location.replace("/src/pages/login.html")
    }

    return registerJSON
}

export async function getCompanies() {
    const companies =  await fetch(`${baseURL}/companies`)

    const companiesJSON = await companies.json()

    return companiesJSON
}

export async function getCompaniesBySector(sector) {
    const companies = await fetch(`${baseURL}/companies/${sector}`)

    const companiesJSON = await companies.json()

    return companiesJSON
}

export async function userCompanyDepartments(){
    const companyDepartments = await fetch(`${baseURL}/users/departments`, {
        method: "GET",
        headers: headers
    })

    const companyDepartmentsJSON = await companyDepartments.json()

    return companyDepartmentsJSON // retorna a compania + departamentos
}

export async function userCoworkers() {
    const coworkers = await fetch(`${baseURL}/users/departments/coworkers`, {
        method: "GET",
        headers: headers
    })

    const coworkersJSON = await coworkers.json()

    if(coworkersJSON.length > 0) {
        const coworkersList = await coworkersJSON[0].users
        return coworkersList
    }

    return coworkersJSON
}

export async function login(data) {
    const login = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })

    const loginJSON = await login.json()


    if(!login.ok) {
        callToastify("Email ou senha incorretos",red)
    }
    else {
        setUser(loginJSON) // por enquanto passamos só o token pro localStorage
        window.location.reload()
    }

    return loginJSON
}

export function setUser(token) {
    const user = localStorage.setItem("@KenzieEmpresas:user", JSON.stringify(token))
}

export async function getSectors() {
    const sectors = await fetch(`${baseURL}/sectors`)

    const sectorsJSON = await sectors.json()

    return sectorsJSON
}

export async function isLogged(){
    const user = await getUser()
    
    if(user.token) {
        const userIsAdmin = await checkAdmin() 

        if(userIsAdmin.is_admin) {
            return "admin"
        } else if (userIsAdmin.is_admin == false){
            return "usuario"
        }
    }
    else {
        return false
    }
}

export async function updateProfile(data) {
    const user = await fetch(`${baseURL}/users`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(data)
    })

    const userJSON = await user.json()

    if(!user.ok) {
        callToastify("Erro ao atualizar perfil",red)
    } else {
        callToastify("Perfil atualizado",green)
        setTimeout(() => {window.location.replace("/src/pages/dashboard.html")}, 1100)
    }


    return userJSON
}

// ADMIN ONLY
export async function getAllDepartments() {
    const departments = await fetch(`${baseURL}/departments`, {
        method: "GET",
        headers: headers
    })

    const departmentsJSON = await departments.json()

    return departmentsJSON
}

export async function getAllDepartmentsFromCompany(uuid) {
    const departments = await fetch(`${baseURL}/departments/${uuid}`, {
        method: "GET",
        headers: headers
    })

    const departmentsJSON = await departments.json()

    return departmentsJSON
}

export async function getAllUsers() {
    const users = await fetch(`${baseURL}/users`, {
        method: "GET",
        headers: headers
    })

    const usersJSON = users.json()

    return usersJSON
}

export async function createDepartment(data) {
    const department = await fetch(`${baseURL}/departments`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })

    const departmentJSON = await department

    if(!department.ok) {
        callToastify("Erro ao criar departamento",red)
    } else {
        callToastify("Departamento criado",green)
        setTimeout(() => {window.location.replace("/src/pages/dashboardAdmin.html")}, 1100)
    }

    return departmentJSON
}

export async function getUsersWithoutJob(){
    const users = await fetch(`${baseURL}/admin/out_of_work`, {
        method:"GET",
        headers: headers
    })

    const usersJSON = await users.json()

    return usersJSON
}

export async function hireUser(data) {
    const user = await fetch(`${baseURL}/departments/hire/`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(data)
    })

    const userJSON = await user.json()

    if(!user.ok) {
        callToastify("Erro ao contratar",red)
    } else {
        callToastify("Usuário contratado",green)
    }

    return userJSON
}

export async function fireUser(uuid) {
    const modal = document.querySelector("dialog")

    const user = await fetch(`${baseURL}/departments/dismiss/${uuid}`, {
        method:"PATCH",
        headers: headers
    })

    const userJSON = await user.json()

    if(!user.ok) {
        callToastify("Erro ao demitir",red)
    } else {
        callToastify("Usuário demitido",green)
    }
    return userJSON
}

export async function editDepartment(data, uuid) {
    const department = await fetch(`${baseURL}/departments/${uuid}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(data)
    })

    const departmentJSON = await department

    if(!department.ok) {
        callToastify("Erro ao atualizar departamento",red)
    } else {
        callToastify("Departamento atualizado",green)
        setTimeout(() => {window.location.replace("/src/pages/dashboardAdmin.html")}, 1100)
    }

    return departmentJSON
}

export async function deleteDepartment(uuid) {
    const department = await fetch(`${baseURL}/departments/${uuid}`, {
        method: "DELETE",
        headers: headers
    })

    if(!department.ok) {
        callToastify("Erro ao deletar departamento",red)
    } else {
        callToastify("Departamento deletado",green)
        setTimeout(() => {window.location.replace("/src/pages/dashboardAdmin.html")}, 1100)
    }
}

export async function editUser(data, uuid) {
    const user = await fetch(`${baseURL}/admin/update_user/${uuid}`,{
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(data)
    })

    const userJSON = await user.json()

    if(!user.ok) {
        callToastify("Erro ao atualizar usuário",red)
    } else {
        callToastify("Usuário atualizado",green)
        setTimeout(() => {window.location.reload()}, 1100)
    }

    return userJSON
}

export async function deleteUser(uuid) {
    const user = await fetch(`${baseURL}/admin/delete_user/${uuid}`, {
        method:"DELETE",
        headers: headers
    })

    if(!user.ok) {
        callToastify("Erro ao deletar usuário",red)
    } else {
        callToastify("Usuário deletado",green)
        setTimeout(() => {window.location.replace("/src/pages/dashboardAdmin.html")}, 1100)
    }
}