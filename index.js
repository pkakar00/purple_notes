console.log("Hello")

// let edit = document.getElementsByClassName('editBtn')
// let tick = document.getElementsByClassName('tick')
// let deleteBtn = document.getElementsByClassName('deleteBtn')

document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('deleteBtn'))
        deleteBtnNote(e)
    else if(e.target && e.target.classList.contains('tick'))
    {
        saveNote(e)   
    }
    else if(e.target && e.target.classList.contains('editBtn'))
    {
        toggleContentEditable(e)
    }
    else if(e.target && (e.target.id=='newNote'))
    {
        createNewNote(e)
    }
})

function toggleContentEditable(e) {
    console.log(e)
    console.log(e.srcElement.previousElementSibling.contentEditable)
    e.srcElement.previousElementSibling.contentEditable = true
    console.log(e.srcElement.previousElementSibling.contentEditable)
}
async function saveNote(e) {
    const text = e.srcElement.previousElementSibling.previousElementSibling.innerText;
    const id = e.srcElement.previousElementSibling.parentElement.id
    console.log(id)
    console.log(text)
    const options = {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ id: id, text: text })
    }
    console.log(options.body)
    await fetch('http://localhost:3000/updateNote', options)
}
async function deleteBtnNote(e) {
    let card = e.target.parentElement
    console.log(card)

    const id = card.id;
    console.log(id)
    const options = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    }
    console.log(options.body)
    let deleteResponse = await fetch('http://localhost:3000/deleteNote', options)
    let deleteResponseBody = await deleteResponse.text()

    if (deleteResponse.ok)
        document.documentElement.innerHTML = deleteResponseBody
    else
        console.log('Error:', responseData);
}





let newNote = document.getElementById('newNote')
function createNewNote(e) {
    window.location.href = '/newNote'
}