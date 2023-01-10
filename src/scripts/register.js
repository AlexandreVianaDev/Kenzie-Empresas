import { register } from "./requests.js"

import { menuMobile } from "./globalScripts.js"


function registerForm() {
    const inputs = document.querySelectorAll(".register > input")
    const selects = document.querySelectorAll(".register > select")
    const registerBtn = document.querySelector(".register__button")
    const returnBtn = document.querySelector(".return__button")

    returnBtn.addEventListener("click", (event) => {
        event.preventDefault()
        window.location.replace("/")
    })

    registerBtn.addEventListener("click", (event) => {
        event.preventDefault()

        const data = {}

        inputs.forEach(input => {
            data[input.id] = input.value
        })

        selects.forEach(select => {
            data[select.id] = select.value
        })

        register(data)
    })

    // console.log(inputs)
    // console.log(select)
    // console.log(registerBtn)
    // console.log(returnBtn)
}


function start() {
    menuMobile()
    registerForm()
}

start()