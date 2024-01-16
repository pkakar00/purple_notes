import express from 'express'
import sql from 'mysql2'
import bodyParser from 'body-parser'
import path, { dirname } from 'path'
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

let loggedIn = false
let email = ""
let password = ""
let name = ""

const app = express()
const __dirname = path.dirname(__filename);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const connection = sql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
}).promise()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'))
})

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/signin.html'))
})

app.post('/signin', async (req, res) => {
    let enteredEmail = req.body.email
    let enteredPassword = req.body.password
    const [signInQuery] = await connection.query('SELECT name FROM USERS WHERE EMAIL=? AND PASSWORD=?', [enteredEmail, enteredPassword])


    if (signInQuery.length == 0)
        res.sendFile(path.join(__dirname, '/views/wrong.html'))

    else {
        loggedIn = true
        email = enteredEmail
        password = enteredPassword
        //console.log(signInQuery);
        name = signInQuery[0].name
        res.status(200).redirect('/notes')
    }
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/signup.html'))
})
app.post('/signup', async (req, res) => {
    let enteredEmail = req.body.email
    let enteredName = req.body.name
    let enteredPassword = req.body.password
    const query = `CREATE TABLE ${enteredName}(id INT AUTO_INCREMENT PRIMARY KEY, note nvarchar(3000))`
    await connection.query('INSERT INTO USERS(name,email,password) VALUES(?,?,?)', [enteredName, enteredEmail, enteredPassword])
    await connection.query(query)
    res.redirect('/signin')
})

app.get('/notes', async (req, res) => {
    if (loggedIn) {
        await renderPage(res);
    }
    else res.send('AUTHENTICATION FAILED!!! <a href="/signin">LOGIN AGAIN</a>')
})

app.put('/updateNote', async (req, res) => {
    const text = req.body.text
    const id = req.body.id
    console.log(name);
    let query = `UPDATE ${name} SET NOTE=? WHERE ID=? ;`
    console.log(query);
    const updateNote = await connection.query(query, [text, id])
    res.redirect('/notes')
})
app.delete('/deleteNote', async (req, res) => {
    const id = req.body.id
    console.log(id);
    let query = `DELETE FROM ${name} WHERE ID=?`
    await connection.query(query, [id])
    await renderPage(res)
})

app.get('/newNote', async (req, res) => {
    let query = `INSERT INTO ${name}(note) VALUES("")`
    connection.query(query)
    res.redirect('/notes')
})
app.get('/index',(req,res)=>
{
    res.sendFile(path.join(__dirname,'index.js'))
})

app.listen(3000, () => { console.log("Listening") })

async function renderPage(res) {
    let [savedNotes] = await connection.query(`SELECT * FROM ${name}`);
    savedNotes = { notes: savedNotes };
    res.render('notes', savedNotes);
}