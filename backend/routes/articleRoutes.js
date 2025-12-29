const express = require('express')
const Article = require('..models\Article.js')
const router = express.Router()

router.post('/', async (req, res) => {
  const article = await Article.create(req.body)
  res.json(article)
})

router.get('/', async (req, res) => {
  const articles = await Article.find()
  res.json(articles)
})

router.get('/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.json(article)
})

router.put('/:id', async (req, res) => {
  const updated = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(updated)
})

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

module.exports = router
