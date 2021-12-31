// Simple encoding and decoding using Base 64 with the padding stripped

const encode = str => Buffer.from(str).toString('base64').replace(/=*$/, '')
const decode = str => Buffer.from(str, 'base64').toString('utf8')

module.exports = { encode, decode }
