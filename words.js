const { readFileSync } = require('fs')

const green = 2
const yellow = 1
const black = 0

// Returns a function that emits a random word
const randomiser = (length=5) => {
    const data = readFileSync('/etc/dictionaries-common/words', { encoding: 'utf-8', flag: 'r' })
    const words = data
        .split(/\n/)
        .filter(x => x.match(new RegExp(`^[a-z]{${length}}$`)))
    return () => words[Math.floor(Math.random() * words.length)]

}

const check = (w, g) => {
    const word = w.split('')
    const guess = g.split('')

    // Check for green (right letter right position)
    const greens = guess.reduce((a, x, i) => {
        if (word[i] == x) a[i] = i
        return a
    }, [])

    // Now check for yellows (right letter wrong position), adding them to the greens
    const positions = guess.reduce((a, x, i) => {

        // Otherwise, if the letter (x) is in the word (somewhere else) and
        // we haven't already "consumed" that somewhere else position before
        // now, then record that somewhere else position (which is a yellow).
        if (
            a[i] == undefined                // curr pos (i) is still undetermined
            && word.indexOf(x) >= 0          // letter (x) is somewhere (else)
            && ! a.includes(word.indexOf(x)) // that somewhere (else) not already used
        ) {
            a[i] = word.indexOf(x)
        }

        return a
    }, greens)

    // At this stage we have an array 'positions' with positions for greens and
    // yellows and empty items for blacks (wrong letter). The greens can be
    // determined as those values that match their position in the array.

    // Create an array of "check results" with the following representations:
    // green:  2
    // yellow: 1
    // black:  0
    const results = []
    for (let i = 0; i < word.length; i++) {
        if (positions[i] == undefined) results[i] = black
        else if (positions[i] == i) results[i] = green
        else results[i] = yellow
    }
    return results

}

const colours = results => {
    const colours = ['⬛', '🟨', '🟩']
    return results
        .map(x => colours[x])
        .join('')
}

module.exports = { randomiser, check, colours }
