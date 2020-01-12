/**
 * Copyright (c) 2020, Arek Krawczyk
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const bodyParser = require('body-parser')
const compression = require('compression')

const express = require('./asyncExpress')
const pgQuery = require('./pgQuery')
const renderView = require('./renderView')
const { sendMail } = require('./sendMail')

const app = express()

app.use(compression())
app.use(express.static(__dirname + '/../static', { maxAge: 3600 }))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/rsvp', async (request, response) => {
  const emoji = request.query.emoji
  // Enable the below to collect addresses
  // const { rows } = await pgQuery(
  //   'SELECT firstname, partyname, addressprovidedtime FROM invitees WHERE emoji = $1::text',
  //   [ emoji ]
  // )
  // if (rows.length === 0) {
  //   return response.redirect(303, '/')
  // }
  // const { firstname, partyname, addressprovidedtime } = rows[0]
  // if (addressprovidedtime) {
  //   response.render('thanks.html.ejs', { firstname, partyname })
  // } else {
  //   response.render('form.html.ejs', { firstname, partyname, emoji })
  // }

  // Enable the below to collect RSVPs
  response.render('rsvp.html.ejs', {  emoji })
})

app.get('/rsvp-pl', async (request, response) => {
  const emoji = request.query.emoji
  // Enable the below to collect addresses
  // const { rows } = await pgQuery(
  //   'SELECT firstname, partyname, addressprovidedtime FROM invitees WHERE emoji = $1::text',
  //   [ emoji ]
  // )
  // if (rows.length === 0) {
  //   return response.redirect(303, '/')
  // }
  // const { firstname, partyname, addressprovidedtime } = rows[0]
  // if (addressprovidedtime) {
  //   response.render('thanks.html.ejs', { firstname, partyname })
  // } else {
  //   response.render('form.html.ejs', { firstname, partyname, emoji })
  // }

  response.render('rsvp-pl.html.ejs', { emoji})
})

app.get('/', (request, response) => {
  response.render('index.html.ejs')
})

app.get('/full', (request, response) => {
  return response.redirect(303, '/')
})

app.get('/thank-you', (request, response) => {
  response.render('thanks.html.ejs')
})

app.get('/thank-you-pl', (request, response) => {
  response.render('thanks-pl.html.ejs')
})

app.get('/index-pl', (request, response) => {
  response.render('index-pl.html.ejs')
})

app.get('/emoji', (request, response) => {
  response.render('emoji.html.ejs', { emoji: require('./emoji') })
})

app.post('/:emoji/rsvp-pl/', async (request, response) => {
  const emoji = request.params.emoji
  const rsvp = request.body.attending === 'no' ? {
    attending: false,
    message: trim(request.body.noMessage),
  } : {
    attending: true,
    kids: request.body.kids,
    plusOne: trim(request.body.plusOne),
    normaldiet: (request.body.normal),
    vege: (request.body.vege),
    diet: trim(request.body.diet),
    message: trim(request.body.yesMessage),
  }
let stmt = `INSERT INTO todos(title,completed)  VALUES ?  `;
let todos = [
  ['Insert multiple rows at a time', false],
  ['It should work perfectly', true]
];
  await pgQuery(
    `insert into invitees (emoji, rsvp, rsvptime) values ($1, $2, $3)`,
    [ emoji, rsvp, new Date()]
  )
  response.redirect(303, '/thank-you-pl')
})



app.post('/:emoji/rsvp/', async (request, response) => {
  const emoji = request.params.emoji
  const rsvp = request.body.attending === 'no' ? {
    attending: false,
    message: trim(request.body.noMessage),
  } : {
    attending: true,
    kids: request.body.kids,
    plusOne: trim(request.body.plusOne),
    normaldiet: (request.body.normal),
    vege: (request.body.vege),
    diet: trim(request.body.diet),
    message: trim(request.body.yesMessage),
  }
let stmt = `INSERT INTO todos(title,completed)  VALUES ?  `;
let todos = [
  ['Insert multiple rows at a time', false],
  ['It should work perfectly', true]
];
  await pgQuery(
    `insert into invitees (emoji, rsvp, rsvptime) values ($1, $2, $3)`,
    [ emoji, rsvp, new Date()]
  )
  response.redirect(303, '/thank-you')
})



function trim(str) {
  return str && str.trim() || null
}

function value(str) {
  return str || ''
}

// 404
app.use((request, response, next) => {
  response.status(404)
  response.render('index.html.ejs', {
    message: 'Whoa! Check your browser address bar'
  })
})

// 500
app.use((error, request, response, next) => {
  console.error(error.stack)
  response.status(500)
  response.render('index.html.ejs', {
    message: 'Whoa! Something went wrong, could you let us know?'
  })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('Running: http://localhost:' + port)
})
