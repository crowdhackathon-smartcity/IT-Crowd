	'use strict'

	const express = require('express')
	const bodyParser = require('body-parser')
	const request = require('request')
	const sleep = require('system-sleep')
	const nodemailer = require('nodemailer');
	const app = express()

	app.set('port', (process.env.PORT || 5000))

	// Allows us to process the data
	app.use(bodyParser.urlencoded({extended: false}))
	app.use(bodyParser.json())

	// ROUTES
	let transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: 'citysens.contanct@gmail.com',
	        pass: 'bethesensor'
	    }
	})
	let mailOptions = {
	    from: '<nikos.fourtounis95@gmail.com>', // sender address
	    to: 'nickfortune@windowslive.com', // list of receivers
	    subject: 'Hello', // Subject line
	    text: 'Hello world ?', // plain text body
	    html: '<b>Hello world ?</b>' // html body
	}
	app.get('/', function(req, res) {
		res.send("Hi I am a chatbot")
	})

	let token = "EAAKsBmgEABIBANS3iAOZBKwZBSsaAPuYYDU8d5mI12ZCZApIosyqWsZBE8VYQZCMV7gRHuoBY8D9cWZANEv9fGlhXpFb09PQ86zXp2bqLGX0On5tnU6HyuNYFoWhV8JdcBYFqYpFKhXJBb9hMSMhF3y0yoE0gmJ2GekRZB8PaRKyXQZDZD"

	// Facebook 

	app.get('/webhook/', function(req, res) {
		if (req.query['hub.verify_token'] === "CitySens") {
			res.send(req.query['hub.challenge'])
		}
		res.send("Wrong token")
	})
	app.post('/webhook/', function(req, res) {
		let messaging_events = req.body.entry[0].messaging
		let attachment
		let issue=""
		for (let i = 0; i < messaging_events.length; i++) {
			let event = messaging_events[i]
			let sender = event.sender.id
			if(event.postback && event.postback.payload=="payload1"){
				flow1(sender)
			}
			else if(event.postback && event.postback.payload=="payload2"){
				flow2(sender)
			}
			else if(event.postback && event.postback.payload=="payload5"){
				sendText(sender, "Απάντησε ΝΑΙ εάν η επιχείρηση διαθέτει POS και εξυπηρετήθηκες κανονικά ή ΟΧΙ στην αντίθετη περίπτωση")
				issue="POS"
			}
			else if(event.postback && issue=="POS" && event.message.text=="ΟΧΙ"){
				sendText(sender, "Δώσε όνομα μαγαζιού")
			}
			else if (event.message && event.message.text) {
				
				flow(sender)
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
	function sendEmail(){
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
			   	sendText(sender,error)
			    return console.log(error);
			}
			sendText(sender,info.messageId, info.response)
			console.log('Message %s sent: %s', info.messageId, info.response);			    
		})
	}
	function flow(sender) {
			let messageData = {
			    "attachment": {
				    "type": "template",
				      "payload": {
				        "template_type": "button",
				          "text": "Διάλεξε κατηγορία:",
				            "buttons": [
				              {
				                "type": "postback",
				                "title": "Υποβολή θέματος",
				                "payload": "payload1"
				              },
				              {
				                "type": "postback",
				                "title": "Υποβολή ελέγχου",
				                "payload": "payload2"
				              }
				            ]
				      }
				}
	    	}
		sendGenericMessage(sender,messageData)
	}
	function flow1(sender) {
			let messageData = {
			    "attachment": {
				    "type": "template",
				      "payload": {
				        "template_type": "button",
				          "text": "Διάλεξε κατηγορία:",
				            "buttons": [
				              {
				                "type": "postback",
				                "title": "Υποβολή θέματος",
				                "payload": "payload3"
				              },
				              {
				                "type": "postback",
				                "title": "Υποβολή ελέγχου",
				                "payload": "payload4"
				              }
				            ]
				      }
				}
	    	}
		sendGenericMessage(sender,messageData)
	}
	function flow2(sender) {
		let messageData = {
			    "attachment": {
				    "type": "template",
				      "payload": {
				        "template_type": "button",
				          "text": "Διάλεξε έλεγχο:",
				            "buttons": [
				              {
				                "type": "postback",
				                "title": "Έλεγχος POS",
				                "payload": "payload5"
				              },
				              {
				                "type": "postback",
				                "title": "Έλεγχος parking",
				                "payload": "payload6"
				              },
				              {
				                "type": "postback",
				                "title": "Έλεγχος υπηρεσίας",
				                "payload": "payload7"
				              },
				            ]
				      }
				}
	    	}
		sendGenericMessage(sender,messageData)
	}
	function sendGenericMessage(sender,messageData){
		request({
		    url: 'https://graph.facebook.com/v2.6/me/messages',
		    qs: {access_token:token},
		    method: 'POST',
		    json: {
			    recipient: {id:sender},
			    message: messageData,
		    }
	    }, function(error, response, body) {
		    if (error) {
			    console.log('Error sending messages: ', error)
		    } else if (response.body.error) {
			    console.log('Error: ', response.body.error)
		    }
	    })
	}
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