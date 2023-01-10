import { getCompanies, getCompaniesBySector, getSectors } from "./requests.js"

import { menuMobile } from "./globalScripts.js"

async function renderCompanies() {
    const companies = await getCompanies()

    const companiesList = document.querySelector(".company__list")

    companies.forEach(company => {
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

async function renderSectorOptions() {
    const select = document.querySelector("#sectors")
    const sectors = await getSectors()

    sectors.forEach(sector => {
        const { description } = sector
        select.insertAdjacentHTML("beforeend", `
            <option value="${description}">${description}</option>
        `)
    })
}

function renderCompaniesBySector() {
    const companiesSelector = document.querySelector("#sectors")
    const companiesList = document.querySelector(".company__list")

    companiesSelector.addEventListener("change", async (event) => {

        const companiesBySector = await getCompaniesBySector(event.target.value)

        companiesList.innerHTML = ""

        companiesBySector.forEach(company => {
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
    renderCompanies()
    renderSectorOptions()
    renderCompaniesBySector()
}

start ()