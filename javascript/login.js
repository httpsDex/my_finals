const form = document.getElementById("form")
const message = document.getElementById("message")
const submit_btn = document.querySelector(".btn")

submit_btn.addEventListener("click", (event) => {
    event.preventDefault()


    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    fetch("http://localhost:1804/api/login", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => {
            console.log("Response Status:", response.status)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`)
            }
            return response.json()
        })
        .then((data) => {
            console.log(data)

            if (data.success) {
                window.location.href = "mainpage.html"
            } else {
                message.innerText = data.message || "Invalid username or password"
            }
        })
        .catch((error) => {
            console.error(error)
            message.innerText = "Failed to login. Please try again later."
        })
})
