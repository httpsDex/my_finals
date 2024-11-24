// Id selection
const productTable = document.getElementById("productTableBody")

// Loading page
window.addEventListener("load", () => {
    getProducts()
})

function getProducts() {
    let html = "" // Initialize empty HTML string
    const productTable = document.getElementById("productTableBody")

    fetch("http://localhost:1804/api/get", { mode: "cors" })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`)
            }
            return response.json()
        })
        .then((data) => {
            console.log(data)

            data.forEach((product) => {
                // Build the HTML for each row
                html += `
                    <tr>
                        <td>${product.product_code}</td>
                        <td>${product.product_name}</td>
                        <td>${product.product_brand}</td>
                        <td>₱ ${product.cost}</td>
                        <td>₱ ${product.srp}</td>
                        <td>
                            <button class="fa fa-edit btn edit-btn" data-id="${product.id}"></button>
                            <button class="fa fa-trash btn delete-btn" data-id="${product.id}"></button>
                        </td>
                    </tr>
                `
            })

            // After loop, update the table body with all rows
            productTable.innerHTML = html

            // Add event listeners to the buttons
            addProductEventListeners()
        })
        .catch((error) => {
            console.error(error)
            alert("Failed to load products. Please try again later.")
        })
}


// Function to add event listeners to buttons
function addProductEventListeners() {
    document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", handleEdit)
    })

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDelete)
    })
}

// Handlers for each action
const closeEditBtn = document.getElementById('close-edit')

closeEditBtn.addEventListener('click', () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById("editProductModal"))
    modal.hide()
})
    
function handleEdit(event) {
    const id = event.target.dataset.id

    fetch(`http://localhost:1804/api/request/${id}`, { method: "GET", mode: "cors" })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch product details")
            }
            return response.json()
        })
        .then((data) => {
            if (data.length > 0) {
                const product = data[0]

                // Populate the modal fields with the fetched data
                document.getElementById("editProductId").value = product.id
                document.getElementById("editProdName").value = product.product_name
                document.getElementById("editProdBrand").value = product.product_brand
                document.getElementById("editSrp").value = product.srp

                // Show the modal
                const modal = new bootstrap.Modal(document.getElementById("editProductModal"))
                modal.show()
            } else {
                alert("Product not found.")
            }
        })
        .catch((error) => {
            console.error("Error fetching product details:", error)
            alert("Error fetching product details.")
        })
}

function saveEditFromModal(event) {
    event.preventDefault()

    const id = document.getElementById("editProductId").value
    const updatedProduct = {
        prodName: document.getElementById("editProdName").value.trim(),
        prodBrand: document.getElementById("editProdBrand").value.trim(),
        srp: parseFloat(document.getElementById("editSrp").value),
        
    }

    if (!updatedProduct.prodName || isNaN(updatedProduct.srp) || updatedProduct.srp <= 0) {
        alert("Please fill in all fields correctly.")
        return
    }

    fetch(`http://localhost:1804/api/update/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to update the product.")
            }
            return response.json()
        })
        .then((data) => {
            alert("Product updated successfully!")
            const editModal = bootstrap.Modal.getInstance(document.getElementById("editProductModal"))
            editModal.hide()

            getProducts()
        })
        .catch((error) => {
            console.error("Error updating product:", error)
            alert("An error occurred while updating the product. Please try again.")
        })
}


document.getElementById("editProductForm").addEventListener("submit", saveEditFromModal)




function handleDelete(event) {
    const id = event.target.dataset.id
    if (confirm("Are you sure you want to delete this product?")) {
        fetch(`http://localhost:1804/api/delete/${id}`, { method: "DELETE" })
            .then((response) => {
                if (response.ok) {
                    alert(`Deleted product with ID: ${id}`)
                    getProducts() // Refresh the table after deletion
                } else {
                    alert("Failed to delete the product.")
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }
}

// Initialize the function to populate the table
getProducts()
