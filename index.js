const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const fileUpload = require('express-fileupload');

const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ch1e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('bornaliDB');
        const messageCollection = database.collection('messages');
        const psCollection = database.collection('ps');
        const currentMembersCollection = database.collection('currentmembers');
        const advisorCollection = database.collection('advisor');
        const standingCommitteeCollection = database.collection('standingcommittee');
        const eventsCollection = database.collection('events');

        // GET messages API
        app.get('/messages', async (req, res) => {
            const cursor = messageCollection.find({});
            const messages = await cursor.toArray();
            res.send(messages);
        });

        //POST messages API
        app.post('/messages', async(req, res) =>{
            const name = req.body.name;
            const session = req.body.session;
            const msg = req.body.msg;
            const image = req.files.image;
            const picData = image.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const message = {
                name,
                session,
                image: imageBuffer,
                msg
            }
            const result = await messageCollection.insertOne(message);
            res.json(result);
        });

        // GET advisory committee API
        app.get('/advisor', async (req, res) => {
            const cursor = advisorCollection.find({});
            const advisors = await cursor.toArray();
            res.send(advisors);
        });

        //POST advisory committee API
        app.post('/advisor', async(req, res) =>{
                const advisors = req.body;
                const result = await advisorCollection.insertOne(advisors);
                res.json(result);
            });

        // GET president/secretary API
        app.get('/ps', async (req, res) => {
            const cursor = psCollection.find({});
            const ps = await cursor.toArray();
            res.send(ps);
        });

        //POST president/secretary API
        app.post('/ps', async(req, res) =>{
            const name = req.body.name;
            const designation = req.body.designation;
            const session = req.body.session;
            const phn = req.body.phn;
            const email = req.body.email;
            const image = req.files.image;
            const picData = image.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const ps = {
                name,
                designation,
                session,
                image: imageBuffer,
                phn,
                email
            }
            const result = await psCollection.insertOne(ps);
            res.json(result);
        });

        // GET current members API
        app.get('/currentmembers', async (req, res) => {
            const cursor = currentMembersCollection.find({});
            const currentMembers = await cursor.toArray();
            res.send(currentMembers);
        });

        //POST current members API
        app.post('/currentmembers', async(req, res) =>{
                const currentMembers = req.body;
                const result = await currentMembersCollection.insertOne(currentMembers);
                res.json(result);
            });

         // GET standing committee members API
         app.get('/standingcommittee', async (req, res) => {
            const cursor = standingCommitteeCollection.find({});
            const standingCommittee = await cursor.toArray();
            res.send(standingCommittee);
        });

        //POST standing committee API
        app.post('/standingcommittee', async(req, res) =>{
                const standingCommittee = req.body;
                const result = await standingCommitteeCollection.insertOne(standingCommittee);
                res.json(result);
            });

        // GET event API
        app.get('/events', async (req, res) => {
            const cursor = eventsCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        });

        //POST event API
        app.post('/events', async(req, res) =>{
            const name = req.body.name;
            const session = req.body.session;
            const msg = req.body.msg;
            const image = req.files.image;
            const picData = image.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const event = {
                name,
                session,
                image: imageBuffer,
                msg
            }
            const result = await eventsCollection.insertOne(event);
            res.json(result);
        });

        // // GET my orders API
        // app.get('/orders', async (req, res) => {
        //     const cursor = ordersCollection.find({});
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // });

        // //Orders API
        // app.post('/orders', async(req, res) =>{
        //     const order = req.body;
        //     const result = await ordersCollection.insertOne(order);
        //     res.json(result);
        // });

        // // DELETE API of my orders
        // app.delete('/orders/:id', async (req, res) => {
        //     // console.log('hit the post api', id);
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await ordersCollection.deleteOne(query);
        //     res.json(result);
        //     // res.json("delete");
        // });

        // //UPDATE API
        // app.put('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updatedOrder = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             status: 'Shipped'
        //         },
        //     };
        //     const result = await ordersCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // });

        // // DELETE API of my products
        // app.delete('/products/:id', async (req, res) => {
        //     // console.log('hit the post api', id);
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await productCollection.deleteOne(query);
        //     res.json(result);
        //     // res.json("delete");
        // });

        // // check admin
        // app.get('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
        //     let isAdmin = false;
        //     if (user?.role === 'admin') {
        //         isAdmin = true;
        //     }
        //     res.json({ admin: isAdmin });
        // })

        // // users API
        // app.post('/users', async (req, res) => {
        //     const user = req.body;
        //     const result = await usersCollection.insertOne(user);
        //     console.log(result);
        //     res.json(result);
        // });

        // // upsert for google login
        // app.put('/users', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const options = { upsert: true };
        //     const updateDoc = { $set: user };
        //     const result = await usersCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // });

        // //update admin role
        // app.put('/users/admin', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const updateDoc = { $set: { role: 'admin' } };
        //     const result = await usersCollection.updateOne(filter, updateDoc);
        //     res.json(result);

        // });

        // // GET API of reviews
        // app.get('/review', async (req, res) => {
        //     const cursor = reviewsCollection.find({});
        //     const reviews = await cursor.toArray();
        //     res.send(reviews);
        // });

        // //POST API of reviews
        // app.post('/review', async(req, res) =>{
        //     const review = req.body;
        //     console.log("hit the post api", review);
        //     const result = await reviewsCollection.insertOne(review);
        //     console.log(result);
        //     res.json(result);
        // });

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})