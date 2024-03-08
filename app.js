const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
let db = null
const dbPath = path.join(__dirname, 'cricketTeam.db')
const intialisationDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is listening at 3000')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
intialisationDb()
const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}
app.get('/players/', async (request, response) => {
  const query = `select * from cricket_team`
  const playersArray = await db.all(query)
  response.send(
    playersArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `select * from cricket_team 
  where player_id=${playerId}`
  const result = await db.get(query)
  response.send(convertDbObjectToResponseObject(result))
})
app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const createPlayerQuery = ` insert into cricket_team(player_name,
    jersey_number,role) 
    values(${playerName},${jerseyNumber},${role});`
  const createPlayerQueryResponse = await db.run(createPlayerQuery)
  response.send('Player Added to Team')
})

module.exports = app
