import { login, isLogged } from "./requests.js"

import { menuMobile } from "./globalScripts.js"

async function checkIsLogged () {
    const logged = await isLogged()
    if (logged == "admin") {
        window.location.replace("/src/pages/dashboardAdmin.html")
    } else if (logged == "usuario") {
        window.location.replace("/src/pages/dashboard.html")
    }
}

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

        login(data)
    })
}

function start() {  
    checkIsLogged ()
    menuMobile()
    loginForm()
}

start()