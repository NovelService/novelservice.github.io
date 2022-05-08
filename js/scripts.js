const postUrl = 'https://my6pmey7adsjxo46zbqxk3nw7e0nvazt.lambda-url.eu-central-1.on.aws/'
const getUrl = 'https://35647flwmbq46rhlty6ulnbnhq0jyxni.lambda-url.eu-central-1.on.aws/'

const postForm = document.getElementById('postForm')
const postButton = document.getElementById('postSubmit')
const postButtonLoading = document.getElementById('postSubmitLoading')
const urlsTextArea = document.getElementById('urls')
const idInput = document.getElementById('id')
const getForm = document.getElementById('getForm')
const getButton = document.getElementById('getSubmit')
const getButtonLoading = document.getElementById('getSubmitLoading')
const downloadA = document.getElementById('download')

function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

function addPostFormListener() {
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        postButton.classList.add('d-none')
        postButtonLoading.classList.remove('d-none')

        const urls = urlsTextArea.value.trim().split('\n')
        const id = createUUID()
        const data = {
            id: id,
            urls: urls,
            options: {
                output: id + '.epub'
            }
        }
        try {
            await fetch(postUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            idInput.value = id
            getButton.click()
        } finally {
            postButton.classList.remove('d-none')
            postButtonLoading.classList.add('d-none')
        }
    })
}

function addGetFormListener() {
    getForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        getButton.classList.add('d-none')
        getButtonLoading.classList.remove('d-none')

        async function pollUntilDone(id) {
            const data = { 'id': id }
            const response = await fetch(getUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            console.log(response)
            const jsonResponse = await response.json()
            if (jsonResponse.status === 'done') {
                done(jsonResponse.url)
            } else {
                setTimeout(pollUntilDone, 5000, id)
            }
        }

        function done(url) {
            downloadA.href = url
            downloadA.click()

            getButton.classList.remove('d-none')
            getButtonLoading.classList.add('d-none')
        }

        const id = idInput.value

        await pollUntilDone(id)
    })
}

function setupNavbar() {
    window.addEventListener('DOMContentLoaded', () => {

        // Activate Bootstrap scrollspy on the main nav element
        const mainNav = document.body.querySelector('#mainNav')
        if (mainNav) {
            new bootstrap.ScrollSpy(document.body, {
                target: '#mainNav',
                offset: 74,
            })
        };

        // Collapse responsive navbar when toggler is visible
        const navbarToggler = document.body.querySelector('.navbar-toggler')
        const responsiveNavItems = [].slice.call(
            document.querySelectorAll('#navbarResponsive .nav-link')
        )
        responsiveNavItems.map(function (responsiveNavItem) {
            responsiveNavItem.addEventListener('click', () => {
                if (window.getComputedStyle(navbarToggler).display !== 'none') {
                    navbarToggler.click()
                }
            })
        })

    })
}

function addFormValidationListeners() {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach((form) => {
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
}

setupNavbar()
addFormValidationListeners()
addPostFormListener()
addGetFormListener()