const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const fileUpload = require('express-fileupload');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
var TurndownService = require('turndown')
var turndownService = new TurndownService();

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
        const eventCollection = database.collection('event');
        const usersCollection = database.collection('users');
        const jobsCollection = database.collection('jobs');
        const booksCollection = database.collection('books');
        const libraryCollection = database.collection('library');
        const videoCollection = database.collection('video');

        const sort = { dated: -1 }
        const sort1 = {_id: -1}

        app.post('/event', upload.array('uploadedImages', 10), function(req, res) {
            var file = req.files;
            res.end();
          });
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
        app.get('/event', async (req, res) => {
            const cursor = eventCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        });

        //POST event API
        app.post('/event', async(req, res) =>{
            const name = req.body.name;
            const session = req.body.session;
            const msg = req.body.msg;
            const image1 = req.files.image1;
            const picData1 = image1.data;
            const encodedPic1 = picData1.toString('base64');
            const imageBuffer1 = Buffer.from(encodedPic1, 'base64');
            const image2 = req.files.image2;
            const picData2 = image2.data;
            const encodedPic2 = picData2.toString('base64');
            const imageBuffer2 = Buffer.from(encodedPic2, 'base64');
            const image3 = req.files.image3;
            const picData3 = image3.data;
            const encodedPic3 = picData3.toString('base64');
            const imageBuffer3 = Buffer.from(encodedPic3, 'base64');
            const image4 = req.files.image4;
            const picData4 = image4.data;
            const encodedPic4 = picData4.toString('base64');
            const imageBuffer4 = Buffer.from(encodedPic4, 'base64');
            const image5 = req.files.image5;
            const picData5 = image5.data;
            const encodedPic5 = picData5.toString('base64');
            const imageBuffer5 = Buffer.from(encodedPic5, 'base64');
            const event = {
                name,
                session,
                image1: imageBuffer1,
                image2: imageBuffer2,
                image3: imageBuffer3,
                image4: imageBuffer4,
                image5: imageBuffer5,
                msg
            }
            const result = await eventCollection.insertOne(event);
            res.json(result);
        });

        // check admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            let isLibrarian = false;
            if (user?.role1 === 'admin') {
                isAdmin = true;
            }if(user?.role2 === 'librarian'){
                isLibrarian = true;
            }
            res.json({ 
                    admin: isAdmin,
                    librarian: isLibrarian
              });
        })

        // // check librarian
        // app.get('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
            
        //     if () {
                
        //     }
        //     res.json({ librarian: isLibrarian });
        // })

        // GET event API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        // users post API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        // upsert for google login
        app.put('/users', async (req, res) => {
            const sid = req.body.sid;
            const session = req.body.session;
            const dept = req.body.dept;
            const blood = req.body.bloodGroup;
            const name = req.body.displayName;
            const email = req.body.email;
            const phone = req.body.phone;
            const address = req.body.address;
            const city = req.body.city;
            const company = req.body.company;
            const position = req.body.position;
            const image = req.files.image;
            const picData = image.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const user = {
                sid,
                session,
                dept,
                blood,
                name,
                email,
                phone,
                address,
                city,
                company,
                position,
                image: imageBuffer
            }
            const filter = { email: user.email};
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //update admin role
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role1: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        });

         //update librarian role
         app.put('/users/librarian', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role2: 'librarian' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        });

        // GET jobs API
        app.get('/jobs', async (req, res) => {
            const cursor = jobsCollection.find({});
            const jobs = await cursor.sort(sort1).toArray()
            ;
            res.send(jobs);
        });

        //POST jobs API
        app.post('/jobs', async(req, res) =>{
            const job = req.body;
            const result = await jobsCollection.insertOne(job);
            res.json(result);
        });

        //POST jobs API
        // app.post('/jobs', async(req, res) =>{
        //     const title = req.body.title;
        //     const postedBy = req.body.postedBy;
        //     const dated = req.body.dated;
        //     const desc = req.body.desc;
        //     var markdown = turndownService.turndown(desc);
        //     markdown = markdown.replace(/"*"/g, "/n");
        //     const job = {
        //         title,
        //         postedBy,
        //         dated,
        //         markdown
        //     }
        //     const result = await jobsCollection.insertOne(job);
        //     res.json(result);
        // });

        // GET books API
        app.get('/books', async (req, res) => {
            const cursor = booksCollection.find({});
            const books = await cursor.toArray();
            res.send(books);
        });

        //POST books API
        app.post('/books', async(req, res) =>{
            const book = req.body;
            const result = await booksCollection.insertOne(book);
            res.json(result);
        });

         // GET library API
         app.get('/library', async (req, res) => {
            const cursor = libraryCollection.find({});
            const lib = await cursor.toArray();
            res.send(lib);
        });

        //POST library API
        app.post('/library', async(req, res) =>{
            const lib = req.body;
            const result = await libraryCollection.insertOne(lib);
            res.json(result);
        });

         // GET video API
         app.get('/video', async (req, res) => {
            const cursor = videoCollection.find({});
            const vdo = await cursor.toArray();
            res.send(vdo);
        });

        //POST video API
        app.post('/video', async(req, res) =>{
            const vdo = req.body;
            const result = await videoCollection.insertOne(vdo);
            res.json(result);
        });

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