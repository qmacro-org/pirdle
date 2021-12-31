const express = require('express')
const cookieParser = require('cookie-parser')
const { encode, decode } = require('./encode-decode.js')
const { randomiser } = require('./words.js')

const app = express()
const randomword = randomiser()
const port = 8000

app.use(cookieParser())

app.get('/', (_, res) => {
    res.send("<a href='/new'>New</a>")
})

app.get('/new', (_, res) => {
    res.cookie('guesses', [])
    res.redirect(`/${encode(randomword())}`)
})

app.get('/:puzzle', (req, res) => {

    // Get any previous guesses from the cookie
    let guesses = req.cookies.guesses || []

    // Allow for reset of guesses for puzzle
    if (req.query.reset == 'on') guesses = []

    // What's the guess? (empty string if no guess)
    const guess = req.query.guess || ''

    // Only increment the guesscount if there's an actual guess
    if (guess.length) {

        // TODO handle the guess

        // Record the guess
        guesses.push(guess)

    }

    console.log(guesses)

    // The response
    res.cookie('guesses', guesses)
    res.send(`
<h1>Puzzle</h1>
<p>Your guesses: ${guesses.join(",")}</p>
<form method="GET">
<input name="guess" placeholder="Enter your guess" autofocus />
<input name="reset" type="checkbox" />
<input type="submit" />
</form>
<p>Cookies from request that produced this response:</p>
<code>
${JSON.stringify(req.cookies)}
</code>
    `)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
