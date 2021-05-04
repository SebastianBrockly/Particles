// erstelle übersicht der datensätze
const fs = require('fs')

const files = fs.readdirSync('./data/sets').filter(file => file.endsWith('.json'))
fs.writeFileSync('./data/overview.json', JSON.stringify(files), {
    encoding: 'utf-8'
})