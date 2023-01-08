import { baseURL, headers, red, green, getCompanies, getCompaniesBySector, getUser, register } from "./requests.js"

import { menuMobile, acessLogin, acessRegister } from "./globalScripts.js"

async function renderCompanies() {
    const companies = await getCompanies()

    const companiesList = document.querySelector(".company__list")

    companies.forEach(company => {
        // console.log(company)
        const { name, opening_hours } = company
        const { description } = company.sectors
        companiesList.insertAdjacentHTML("beforeend", `
            <li>
                <h4 class="title-4">${name}</h4>
                <div>
                <span>${opening_hours}</span>
                <span class="sector__tag">${description}</span>
                </div>
            </li>
        `)
    })
}

function renderCompaniesBySector() {
    const companiesSelector = document.querySelector("#sectors")
    const companiesList = document.querySelector(".company__list")

    companiesSelector.addEventListener("click", async (event) => {

        const companiesBySector = await getCompaniesBySector(event.target.value)

        companiesList.innerHTML = ""

        companiesBySector.forEach(company => {
            // console.log(company)
            const { name, opening_hours } = company
            const { description } = company.sectors
            companiesList.insertAdjacentHTML("beforeend", `
                <li>
                    <h4 class="title-4">${name}</h4>
                    <div>
                    <span>${opening_hours}</span>
                    <span class="sector__tag">${description}</span>
                    </div>
                </li>
            `)
        })

    })
}

function start () {
    menuMobile()
    acessLogin()
    acessRegister()
    renderCompanies()
    renderCompaniesBySector()
}

start ()