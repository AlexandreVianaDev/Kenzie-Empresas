export function menuMobile() {
    const menuBtn = document.querySelector("#mobileMenu__icon")
    const menuNav = document.querySelector("#menu")

    // Mostro o menu se não for mobile
    if (window.screen.width >= 769) {
        menuNav.classList.remove("hidden")
    }

    menuBtn.addEventListener("click", (event)=> {
        event.preventDefault()
        // console.log(event.target)
        menuNav.classList.toggle("hidden")
    })
}

export function acessLogin() {
    const loginBtn = document.querySelector("#loginBtn")

    loginBtn.addEventListener("click", (event) => {
        event.preventDefault()
        window.location.replace("/src/pages/login.html")
    })
}

export function acessRegister() {
    const registerBtn = document.querySelector("#registerBtn")

    registerBtn.addEventListener("click", (event) => {
        event.preventDefault()
        window.location.replace("/src/pages/register.html")
    })  
}

export function acessHome() {
    const homeBtn = document.querySelector("#homeBtn")

    homeBtn.addEventListener("click", (event) => {
        event.preventDefault()
        window.location.replace("/")
    })  
}

export function acessDashboard() {
    window.location.replace("/src/pages/dashboard.html")
}