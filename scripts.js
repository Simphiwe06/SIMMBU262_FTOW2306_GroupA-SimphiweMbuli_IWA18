/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}


const handleDragStart = (event) => {
    const target = event.target
    const order = target.closest('.order')

    event.dataTransfer.setData('orderId', order.querySelector('.order-id').textContent)
}

const handleDragEnd = (event) => {
    const target = event.target
    const orderId = event.dataTransfer.getData('orderId')

    const order = getOrderById(orderId)

    const newStatus = target.dataset.area

    order.status = newStatus

    updateOrder(order)
}

const handleHelpToggle = (event) => {
    const target = event.target
    const helpOverlay = document.getElementById('help')

    if (target === helpOverlay.querySelector('.cancel')) {
        helpOverlay.classList.add('hidden')
    } else {
        helpOverlay.classList.remove('hidden')
        document.activeElement.blur()
    }
}

const handleAddToggle = (event) => {
    const target = event.target
    const addOverlay = document.getElementById('add')

    if (target === addOverlay.querySelector('.cancel')) {
        addOverlay.classList.add('hidden')
    } else {
        addOverlay.classList.remove('hidden')
        document.activeElement.blur()
    } 
}

const handleAddSubmit = (event) => {
    event.preventDefault()

    const form = event.target
    const orderText = form.querySelector('input[name="orderText"]').value
    const tableNumber = form.querySelector('input[name="tableNumber"]').value

    if (!orderText || !tableNumber) {
        return
    }

    const data = {
        orderText: orderText,
        tableNumber: tableNumber,
        status: 'Ordered'
    }

    addOrder(data)

    form.reset()
    addOverlay.classList.add('hidden')
}

const handleEditToggle = (event) => {
    const target = event.target
    const editOverlay = document.getElementById('edit')
    const order = event.target.closest('.order')

    if (target === editOverlay.querySelector('.cancel')) {
        editOverlay.classList.add('hidden')
    } else {
        editOverlay.classList.remove('hidden')
        editOverlay.querySelector('input[name="orderText"]').value = order.querySelector('.order-text').textContent
        editOverlay.querySelector('input[name="tableNumber"]').value = order.querySelector('.table-number').textContent
        editOverlay.querySelector('select[name="status"]').value = order.querySelector('.status').textContent
        document.activeElement.blur()
    } 
}

const handleEditSubmit = (event) => {
    event.preventDefault()

    const form = event.target
    const orderId = form.querySelector('input[name="orderId"]').value
    const orderText = form.querySelector('input[name="orderText"]').value
    const tableNumber = form.querySelector('input[name="tableNumber"]').value
    const status = form.querySelector('select[name="status"]').value

    if (!orderText || !tableNumber) {
        return
    }

    const data = {
        orderId: orderId,
        orderText: orderText,
        tableNumber: tableNumber,
        status: status
    }

    updateOrder(data)

    form.reset()
    editOverlay.classList.add('hidden')
}

const handleDelete = (event) => {
    const target = event.target
    const order = event.target.closest('.order')

    const orderId = order.querySelector('.order-id').textContent

    deleteOrder(orderId)

    order.remove()  
}

const html = {
    help: document.getElementById('help'),
    other: document.querySelector('.other'),
    add: document.getElementById('add'),
    otherAdd: document.querySelector('.other .add'),
    'add.cancel': document.querySelector('.add .cancel'),
    edit: document.getElementById('edit'),
    'edit.cancel': document.querySelector('.edit .cancel'),
};

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}