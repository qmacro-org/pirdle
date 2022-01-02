# Puzzle

A simple Wordle / Lingo style puzzle server.

```bash
npm install
npm run server
```

Then go to [localhost:8000](http://localhost:8000) (or directly to the [/new](http://localhost:8000/new) link) to have a new word to guess. You can also (manually) add a word length value via the `wordlength` query parameter, like this: [http://localhost:8000/new?wordlength=6](http://localhost:8000/new?wordlength=6).

For now, the `words.js` module expects a dictionary of words in `/etc/dictionaries-common/words` (I'm developing this in a Debian based dev container, and [added the `wamerican-large` package](https://github.com/qmacro/dotfiles/commit/75a791b61790be8a17f458f684c48f2c410bbcd4) for this). 

Some general design principles guiding this experiment:

- puzzle server and (eventually) client(s)
- stateless server operation
- word to guess is encoded in the URL (encoding, not encryption, is enough)
- guess data maintained in cookies
- simple HTML and JSON outputs
