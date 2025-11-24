const { server, app, express } = require('./config/index');
const { routeUser, routeAuth } = require('./routes/index');
const { upload, authN } = require('./middleware/index');
const AuthController = require('./controllers/AuthController');

app.get('/profile', authN, AuthController.profile);
app.use('/auth', routeAuth);

app.use('/users', routeUser);
app.use('/assets', express.static('public/images'));
app.post('/upload', upload.single('photo'), (req, res) => {
    res.json({ success: true, message: 'Upload Berhasil' })
});

app.use((err, req, res, next) => {
    res.json({ success: false, message: err.message })
})

app.listen(server.port, () => {
    console.log(`   
    Success app listening on port : ${server.port} 
    Clik Link : http://localhost:${server.port}`)
});
