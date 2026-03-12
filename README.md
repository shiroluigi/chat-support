# Chat support application 

A simple real-time customer support chat system built using **React**, **Express**, and **Socket.IO**.

The application allows customers to start a chat instantly while agents can view and join waiting customers in real time.

## Features

- A new **chat room is automatically created** when a customer joins.
- Agents can **see available customer rooms** waiting for support.
- Only **one agent can join a room at a time**.
- Rooms **disappear from the agent list once taken**.
- Real-time messaging between customer and agent.
- Customer chat is **disabled when the agent leaves**.

# Installation steps
- Install node and go into each of the folders and type `npm i`
- Navigate to the client folder
- Run the client using `npm run build` followed by `npm run preview`
- Navigate to the server folder
- Run the server using `node server.js`

## Defaults
|Type|Port|
|---|---|
| Server| 5000 |
| Client (Build) | 4173 |
| Client (Build) | 5173 |
