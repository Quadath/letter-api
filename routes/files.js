const {Router} = require('express')
const multer = require('multer')
const path = require('path')

const UserSchema = require('../models/user')

const router = Router()


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, path.join(__dirname, "../public"));
    },
    filename: function (req, file, callback) {
        const len = file.originalname.split('.').length;
      callback(null, req.session.user + '-' + Date.now() + `.${file.originalname.split('.')[len - 1]}`);
    }
  });

const multi_upload = multer({
storage,
limits: { fileSize: 64 * 1024 * 1024 },
fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        const err = new Error('Only .png, .jpg and .jpeg format allowed!')
        err.name = 'ExtensionError'
        return cb(err);
    }
},
}).array('images', 10)


router.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;

    const isOwner = filename.split('-')[0] == req.session.user;

    if (!req.session.user) return res.status(403).send({error: {message: "Authorization failure"}}).end()
    res.sendFile(path.join(__dirname, `../public/`, filename))
})

router.post('/images', async (req, res) => {

    if (!req.session.user) return res.status(403).send({error: {message: "Authorization failure"}}).end();
    multi_upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
            return;
        } else if (err) {
            // An unknown error occurred when uploading.
            if (err.name == 'ExtensionError') {
                res.status(413).send({ error: { message: err.message } }).end();
            } else {
                res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
            }
            return;
        }
        // Everything went fine.
        // show file `req.files`
        // show body `req.body`
        // console.log(req.files)
        const user = req.session.user
        const images = req.files.map((file) => { return {'path': file.path}});

        UserSchema.findByIdAndUpdate(user, {
            $push: {images: {$each: images }}
        }).then((result, error) => {
            if (error) throw error;
        }) 
        
        res.status(200).json('Your files uploaded.').end();
    })
});


module.exports = router