const express = require('express')
const cookieParser = require('cookie-parser')
const { encode, decode } = require('./encode-decode.js')
const { randomiser, check, colours } = require('./words.js')

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
        guesses.push({guess, result, display: colours(result)})

    }

    // The response
    res.cookie('guesses', guesses, { path: `/${req.params.puzzle}` })
    res.send(`
<h1>Puzzle (${wordlength} letter word)</h1>
<form method="GET">
<input name="guess" placeholder="Enter your guess" maxlength="${wordlength}" style="text-transform: uppercase" autofocus />
<input type="submit" />
<input name="reset" type="checkbox">Reset guess data</input>
</form>
<code>
<div style="white-space: pre-wrap;">
${guesses.map(x => x.guess + ' ' + x.result + ' ' + x.display).join('\n') }
</div>
    `)
})

app.listen(port, () => {
    console.log(`Puzzle server listening at http://localhost:${port}`)
})
