const { readFileSync } = require('fs')

// Returns a function that emits a random word
const randomiser = (length=5) => {
    const data = readFileSync('/etc/dictionaries-common/words', { encoding: 'utf-8', flag: 'r' })
    const words = data
        .split(/\n/)
        .filter(x => x.match(new RegExp(`^[a-z]{${length}}$`)))
    return () => words[Math.floor(Math.random() * words.length)]

}

module.exports = { randomiser }
