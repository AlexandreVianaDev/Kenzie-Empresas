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

        menuBtn.classList.toggle("fa-bars")
        menuBtn.classList.toggle("fa-xmark")
    })
}