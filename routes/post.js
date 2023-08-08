const { Router } = require('express')
const UserSchema = require('../models/user')
const router = Router()
const path = require('path')
const multer = require('multer')

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, path.join(__dirname, "../public"));
    },
    filename: function (req, file, callback) {
      callback(null, req.session.user + '-' + Date.now() + file.originalname.match(/\..*$/)[0]);
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

router.post('/upload', (req, res) => {
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
        console.log(req.body)
        res.status(200).json('Your files uploaded.').end();
    })
});

router.get('/', async (req, res) => {
    console.log(req.session.user)
})

module.exports = router;