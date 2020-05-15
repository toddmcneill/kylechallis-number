const axios = require('axios')
const { parse } = require('node-html-parser')
const formData = require('form-data')

async function makeRequest() {
  const form = new formData()
  form.append('name', 'Araziah')
  form.append('submit', 'Submit They Name and Receive They Number')
  const formHeaders = form.getHeaders()

  return axios.post('https://kylechallis.com/number/', form, { headers: formHeaders }).then(response => {
    const root = parse(response.data)
    try {
      const thyNumber = parseInt(root.querySelector('#thy_number').rawText.split(': ')[1].replace(/,/g, ''), 10)
      return thyNumber
    } catch (err) {
      return null
    }
  })
}

async function run(batches, batchSize) {
  const numbers = []
  console.log(`Running ${batches} batches of ${batchSize} requests each`)
  for (let i = 0; i < batches; i++) {
    process.stdout.write('.')
    const batchNumbers = await runBatch(batchSize)
    numbers.push(...batchNumbers)
  }
  return numbers
}

async function runBatch(count) {
  const numbers = []
  const promises = []
  for (let i = 0; i < count; i++) {
    promises.push(makeRequest().then(number => numbers.push(number)))
  }
  await Promise.all(promises)
  return numbers
}

console.time()
run(100, 300).then(numbers => {
  console.log('\ndone!')
  const nullCount = numbers.filter(n => n === null).length
  console.log('null count: ', nullCount)
  console.log('numbers: ', numbers.filter(n => n !== null).sort((a, b) => {
    return parseInt(a, 10) < parseInt(b, 10) ? -1 : 1
  }).reverse())
  console.timeEnd()
})
