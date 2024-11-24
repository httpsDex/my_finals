document.getElementById('logout-btn').addEventListener('click', () => {
    // Clear user data from localStorage or sessionStorage
    localStorage.removeItem('loggedInUser')

    // Redirect to the login page
    window.location.href = 'login.html'
})

 document.getElementById("dashboardLink").addEventListener("click", function () {
    showSection("dashboard")
})
document.getElementById("productsLink").addEventListener("click", function () {
    showSection("products")
})
document.getElementById("inventoryLink").addEventListener("click", function () {
    showSection("inventory")
})
document.getElementById("salesLink").addEventListener("click", function () {
    showSection("sales")
})


function showSection(sectionId) {
    // Hides all sections
    document.querySelectorAll(".content-section").forEach(function (section) {
        section.style.display = "none"
    })
    // Shows the selected section
    document.getElementById(sectionId).style.display = "block"
}