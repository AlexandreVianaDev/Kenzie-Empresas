import { acessDashboard } from "./globalScripts.js"

export const baseURL = "http://localhost:6278"

export const { token } = getUser()

export const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
}


export const red = ""
export const green = ""


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

    console.log(data)
    console.log(register)

    const registerJSON = await register.json()

    if(!register.ok) {
        // CHAMAR TOASTIFY AQUI
        console.log(registerJSON.error[0])
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

    // console.log(coworkers)

    const coworkersJSON = await coworkers.json()

    const coworkersList = await coworkersJSON[0].users

    // console.log(coworkersJSON[0].users)

    return coworkersList
}

export async function login(data) {
    const login = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })

    const loginJSON = await login.json()

    console.log(loginJSON)


    if(!login.ok) {
        // CHAMAR TOASTIFY AQUI
        console.log(loginJSON.error)
    }
    else {
        // const user = {}
        // user[email] = data
        // user[token] = loginJSON

        // console.log(user)

        setUser(loginJSON) // por enquanto passamos só o token pro localStorage
        // window.location.replace("/src/pages/dashboard.html")
        acessDashboard()
    }

    return loginJSON
}

export function setUser(token) {
    const user = localStorage.setItem("@KenzieEmpresas:user", JSON.stringify(token))
}


