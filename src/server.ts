import app from './index'

const port = process.env.PORT || 2003
app.listen(port, () => {
    console.log(`app running on port: ${port}`)
})