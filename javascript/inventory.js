//this will populate the products from the database to the html frontend
const inventoryTable = document.getElementById("inventoryTable")

window.addEventListener("load", () => {
    getInventory()
})

function getInventory() {
    let html = "" // Initialize empty HTML string
    const inventoryTable = document.getElementById("inventoryTable")

    fetch("https://server-zdt4.onrender.com/api/get", { mode: "cors" })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`)
            }
            return response.json()
        })
        .then((data) => {
            console.log(data)

            data.forEach((inventory) => {
                // Build the HTML for each row

                let stockStatus = ""
                if (inventory.quantity <= 50) {
                    stockStatus = `<span class="stock-low">Low</span>`
                } else if (inventory.quantity <= 200) {
                    stockStatus = `<span class="stock-medium">Medium</span>`
                } else {
                    stockStatus = `<span class="stock-high">High</span>`
                }

                html += `
                    <tr>
                        <td>${inventory.product_code}</td>
                        <td>${inventory.product_name}</td>
                        <td>${inventory.product_brand}</td>
                        <td>₱ ${inventory.srp}</td>
                        <td class="quantity-cell"> ${inventory.quantity} <span class="stock-status">${stockStatus}</span> </td>
                        <td>
                            <button class="btn add-stock-btn" data-id="${inventory.id}">Add Stock</button>
                        </td>
                    </tr>
                `
            })

            // After loop, update the table body with all rows
            inventoryTable.innerHTML = html

            // Add event listeners to the buttons
            addEventListeners()
        })
        .catch((error) => {
            console.error(error)
            alert("Failed to load inventory. Please try again later.")
        })
}


function addEventListeners() {
    const addStockButtons = document.querySelectorAll(".add-stock-btn")

    addStockButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const id = event.target.dataset.id
            const quantityToAdd = prompt("Enter the quantity to add:")
    
            // Check if the input is a valid number
            if (quantityToAdd && !isNaN(quantityToAdd) && quantityToAdd > 0) {
                updateStock(id, quantityToAdd)
            } else {
                alert("Invalid quantity. Please enter a valid number.")
            }
        })
    })
}

function updateStock(id, quantityToAdd) {

    console.log(`Attempting to update product ${id} with quantity ${quantityToAdd}`)
    
    // Ensure the quantity is a number and greater than 0
    quantityToAdd = parseInt(quantityToAdd)
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
        alert("Invalid quantity entered. Please enter a valid number.")
        return
    }
    
    fetch(`https://server-zdt4.onrender.com/api/addStock/${id}`, {
        method: "PATCH", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ quantity: quantityToAdd })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`)
            }
            return response.json()
        })
        .then((data) => {
            console.log("Stock updated:", data)
            alert("Stock added successfully!")
            getInventory() // will reloas the inventory to reflect the updated stock
        })
        .catch((error) => {
            console.error(error)
            alert("Failed to add stock. Please try again later.")
        })
}
