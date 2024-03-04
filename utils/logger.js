const info = (...params) => {
  console.log(...params)
}

const error = (...perams) => {
  console.error(...perams)
}

module.exports = { info, error }