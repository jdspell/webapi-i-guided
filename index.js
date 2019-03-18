const express = require('express');
const db = require('./data/db.js');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.send("Hello Web 17");
});

server.get('/current-date-time', (req, res) => {
    const now = new Date().toISOString();
    res.send(now);
});

server.get('/hubs', (req, res) => {
    db.hubs.find()
        .then(hubs => {
            res.status(200).json(hubs);
        }).catch(error => {
            res.statusMessage(500).json({ message: 'error retrieving hubs'});
        });
});

server.post('/hubs', (req, res) => {
    const hubInfo = req.body;
    console.log('hub information', hubInfo);
    db.hubs.add(hubInfo)
        .then(hub => {
            res.status(201).json(hub);
        }).catch(error => {
            res.status(500).json({ message: "error creating the hub"});
        });
});

server.delete('/hubs/:id', (req, res) => {
    const id = req.params.id;

    db.hubs.remove(id)
        .then(deleted => {
            res.status(204).end();
        }).catch(error => {
            res.status(500).json({ message: "error deleting the hub"});
        });
});

server.put('/hubs/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db.hubs.update(id, changes)
        .then(updated => {
            if(updated) {
                res.status(200).json(updated);
            } else {
                res.status(404).json({ message: 'hub not found' });
            }
        }).catch(error => {
            res.status(500).json({ message: "error updating the hub"});
        })
})

server.listen(4000, () => {
    console.log('** API up and running on port 4000');
});