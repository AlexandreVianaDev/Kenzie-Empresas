import { baseURL, headers, red, green, getCompanies, getCompaniesBySector, getUser, register, login } from "./requests.js"

import { menuMobile, acessLogin, acessRegister, acessHome, acessDashboard } from "./globalScripts.js"

function loginForm() {
    const inputs = document.querySelectorAll(".register > input")
    const loginBtn = document.querySelector(".register__button")
    const registerBtn = document.querySelector(".return__button")

    registerBtn.addEventListener("click", (event) => {
        event.preventDefault()
        window.location.replace("/src/pages/register.html")
    })

    loginBtn.addEventListener("click", (event) => {
        event.preventDefault()

        const data = {}

        inputs.forEach(input => {
            data[input.id] = input.value
        })

        console.log(data)

        login(data)
    })

}

function start() {
    acessRegister()
    acessHome()   
    menuMobile()
    loginForm()
}

start()