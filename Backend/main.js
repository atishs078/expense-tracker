const express = require('express')
const app = express()
const port = 5000
const userRoute=require('./routes/userRoutes')
const expenseRoute=require('./routes/expenseRoute')
const incomeRoute = require('./routes/incomeRoute')
const cors=require('cors')
const mongoose=require('mongoose')
app.use(express.json());
app.use(cors())
const connectDB = async () => {
    try {
      await mongoose.connect("Paste_Your_URL", {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  };
  connectDB()
app.use('/api/user',userRoute)
app.use('/api/expense', expenseRoute)
app.use('/api/income', incomeRoute)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
