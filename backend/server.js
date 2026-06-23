require('dotenv').config();
const app = require('./src/app')
const connecttoDB = require('./src/config/mongodb')

connecttoDB()
const PORT = process.env.PORT || 3000
app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})