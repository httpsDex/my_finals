const popup = document.getElementById('addProductModal')
const add_productBtn = document.getElementById('add-product')
const closeBtn = document.getElementById('close-add-product')

// Open modal
add_productBtn.addEventListener('click', () => {
    popup.style.display = 'block'
})

// Close modal
closeBtn.addEventListener('click', () => {
    const modal = bootstrap.Modal.getInstance(document.querySelector('#addProductModal'))
    modal.hide()
})


const addProductForm = document.querySelector('#addProductForm')

addProductForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(addProductForm)
  const data = Object.fromEntries(formData)

  fetch('http://localhost:1804/api/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }
      return response.json()
    })
    .then(() => {
      alert('Product added successfully!')
      addProductForm.reset()
      const modal = bootstrap.Modal.getInstance(document.querySelector('#addProductModal'))
      modal.hide() // Close the modal
      getProducts() // Refresh the product list
    })
    .catch((error) => {
      console.error('Error:', error)
      alert('Failed to add product. Please try again later.')
    })
})
