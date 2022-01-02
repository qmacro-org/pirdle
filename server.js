const express = require('express')
const cookieParser = require('cookie-parser')
const { encode, decode } = require('./encode-decode.js')
const { randomiser, check, colours, checksolved } = require('./words.js')

const app = express()
const defaultwordlength = 5
const port = 8000

app.use(cookieParser())

app.get('/', (_, res) => {
    res.send("<a href='/new'>New puzzle</a>")
})

app.get('/new', (req, res) => {
    res.cookie('guesses', [])
    const wordlength = req.query.wordlength || defaultwordlength
    const word = randomiser(wordlength)().toUpperCase()
    console.log(`New puzzle for '${word}'`)
    res.redirect(`/${encode(word)}`)
})

app.get('/:puzzle', (req, res) => {

    // This is the 'answer'
    const word = decode(req.params.puzzle)
    const wordlength = word.length

    // Get any previous guesses from the cookie
    let guesses = req.cookies.guesses || []

    // Allow for reset of guesses for puzzle
    if (req.query.reset == 'on') guesses = []

    // What's the guess? (empty string if no guess)
    const guess = (req.query.guess || '').toUpperCase()

    // Only increment the guesscount if there's an actual guess
    if (guess.length) {

        // Record the guess
        const result = check(word, guess)
        guesses.push({guess, result})
    }

    res.cookie('guesses', guesses, { path: `/${req.params.puzzle}` })

    const solved = guesses.length && checksolved(guesses[guesses.length - 1].result)

    // The response
    if (req.accepts().includes('text/html')) {
        res.send(`
<h1>Puzzle (${wordlength} letter word)</h1>
<form method="GET">
<input name="guess" placeholder="Enter your guess" maxlength="${wordlength}" style="text-transform: uppercase" autofocus />
<input type="submit" />
<input name="reset" type="checkbox">Reset guess data</input>
</form>
<div>${solved ? "🎉 SOLVED! <a href='/new'>New puzzle</a>" : ""}</div>
<code>
<div style="white-space: pre-wrap;">
${guesses.map(x => x.guess + ' ' + colours(x.result)).join('\n') }
</div>
        `)
    } else {
        res.setHeader('Content-Type', 'application/json')
        res.json({ solved, wordlength, guesses })
    }
})

app.listen(port, () => {
    console.log(`Puzzle server listening at http://localhost:${port}`)
})
