'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const sleep = require('system-sleep')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

let token = "EAATYbB3t24cBAKPUI2mq0fJRfV1VHedUW63d1a0WNXb1pldo42LkGIUVd63wLeamHg8zGf9wMyvRZBUhNrturg3JwIIjSY2H2Q1FXspzgVSqhcmR3ox7FZCLLnGfutH5VFhcZAy0Y7LySjYFoLQew6QOrmiqIbKMq32zUpvugZDZD"

// Facebook 

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "CityBot") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})
let status=0
app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	let attachment
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text=='Generic' && status==1) {
			let text = event.message.text
			sendText(sender, "Generic 2 " + text.substring(0, 100))
			status=0
		}
		if (event.message && event.message.text=='Generic') {
			let text = event.message.text
			sendText(sender, "Generic " + text.substring(0, 100))
			status=1
		}
		else if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender, "Μήνυμα Ελήφθη: "+text.substring(0, 200))
			sleep(300)
			if(text.indexOf('pos') > -1) {
				sendText(sender, "Παραβίαση POS" )
				sleep(300)
			}
			if(text.indexOf('parking') > -1) {
				sendText(sender, "Παραβίαση parking" )
				sleep(300)
			}
			sendText(sender, "Ευχαριστούμε πολύ")
		}
		else if (event.message && event.message.attachments && event.message.attachments.length > 0){
			attachment = event.message.attachments[0];
			if (attachment.type === 'location') {
				sendText(sender, "Τοποθεσία Ελήφθη")
                sendText(sender, attachment.payload.coordinates.long )
                sendText(sender, attachment.payload.coordinates.lat )
            }
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})