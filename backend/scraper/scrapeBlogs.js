const axios = require('axios')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
require('dotenv').config()

const Article = require('../models/article.js')

mongoose.connect(process.env.MONGO_URI)

async function scrape() {
  const { data } = await axios.get('https://beyondchats.com/blogs/')
  const $ = cheerio.load(data)

const BASE_URL = 'https://beyondchats.com'
const links = []
$('a').each((_, el) => {
  let href = $(el).attr('href')

  if (href && href.startsWith('/blogs/')) {
    href = BASE_URL + href   // 🔥 FIX HERE
    links.push(href)
  }
})


  const uniqueLinks = [...new Set(links)].slice(-5)

  for (let link of uniqueLinks) {
    const page = await axios.get(link)
    const $$ = cheerio.load(page.data)

    const title = $$('h1').text()
    const content = $$('article').text()

    await Article.create({
      title,
      content,
      source_url: link
    })
  }

  console.log("Scraping done")
  process.exit()
}

scrape()
