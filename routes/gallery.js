const express = require(`express`);
const router = express.Router();
const knex = require(`../db/knex.js`);

const Photo = require('../db/models/Photo')

router.get('/new', (req, res) => {
  return res.render('partials/new');
})

router.route(`/:id`)

  .put((req, res) => {

    let id = req.params.id;
    let data = { author, link, description } = req.body;

    return new Photo({
      id: id
    })
      .save({
        author: data.author,
        link: data.link,
        description: data.description,
      })
      .then(edit => {
        return res.redirect(`/gallery/${id}`);
      })
      .catch(err => {
        message: err.message;
      })
  })


  .get((req, res) => {
    let id = req.params.id;
    return new Photo({
      id: id
    })
      .fetch()
      .then(result => {
        console.log(result.toJSON());
        return res.render('partials/gallery', result.toJSON());
      })
      .catch(err => {
        // res.json({err: err.message});
      })
  })

  .delete((req, res) => {
    let id = req.params.id;
    let data = { author, link, description } = req.body;

    return new Photo({
      id: id
    })
      .destroy()
      .then(result =>{
        return res.redirect(`/gallery`);
      })
      .catch(err => {
        res.json(err.message);
      })

  })

router.get('/:id/edit', (req, res) => {
  let id = req.params.id;
  return new Photo({
    id: id
  })
    .fetch()
    .then(result => {
      console.log(result.toJSON());
      return res.render('partials/edit', result.toJSON());
    })

})

router.route(`/`)

  .post((req, res) => {
    //requested information
    let { author, link, description } = req.body;

    //Create an instance of the class Photo
    return new Photo({ author, link, description })
      .save()
      .then(result => {
        //console.log(result);
        return res.redirect('/gallery');

      })
      .catch(err => {
        return res.json({ message: err.message })
      })
  })

  .get((req, res) => {
    return Photo
      .fetchAll()
      .then(photo => {


        return res.render('partials/index', { pro: photo.toJSON() })
      })
      .catch(err => {
        return res.json({ message: err.message });
      })
  })





module.exports = router;