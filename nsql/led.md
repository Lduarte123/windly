GET — Listar todos os registros
Invoke-WebRequest -Uri http://localhost:3005/api/rain -Method Get

POST — Criar um novo registro
Invoke-WebRequest -Uri http://localhost:3005/api/rain -Method Post -Body '{"chuva": true}' -ContentType "application/json"

 PUT — Atualizar um registro existente
Invoke-WebRequest -Uri http://localhost:3005/api/rain/60b9b1189f1b2b8b7c8a8a9c -Method Put -Body '{"chuva": false}' -ContentType "application/json"

DELETE — Excluir um registro
Invoke-WebRequest -Uri http://localhost:3005/api/rain/60b9b1189f1b2b8b7c8a8a9c -Method Delete


### mongo sh
show collections

db.rain.find()



  db.rain.insertOne({ chuva: true })

  db.rain.insertMany([
    { chuva: true },
    { chuva: false },
    { chuva: true }
  ])

  db.rain.find().pretty()

  db.rain.findOne({ _id: ObjectId("60b9b1189f1b2b8b7c8a8a9c") })

  db.rain.countDocuments({ chuva: true })

  db.rain.updateOne(
    { _id: ObjectId("60b9b1189f1b2b8b7c8a8a9c") },
    { $set: { chuva: false } }
  )