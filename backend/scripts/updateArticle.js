require('dotenv').config()
const axios = require('axios')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const OpenAI = require('openai')
const Article = require('../models/article')

// ------------------ config ------------------
const BASE_API = 'http://localhost:5000'

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})

// ------------------ db connect ------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

// ------------------ helper: scrape content ------------------
async function scrapeContent(url) {
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)

  return (
    $('article').text().trim() ||
    $('main').text().trim() ||
    $('p').text().trim()
  )
}

// ------------------ helper: google search ------------------
async function googleSearch(query) {
  const res = await axios.get('https://serpapi.com/search.json', {
    params: {
      q: query,
      api_key: process.env.SERP_API_KEY,
      num: 5
    }
  })

  return res.data.organic_results
    .filter(r => r.link && !r.link.includes('beyondchats'))
    .slice(0, 2)
}

// ------------------ main logic ------------------
async function run() {
  // 1. Fetch articles from your API
  const articlesRes = await axios.get(`${BASE_API}/articles`)
  const articles = articlesRes.data

  // skip already updated or blank-title articles
  const article = articles.find(
    a => !a.isUpdated && a.title && a.title.trim() !== ''
  )

  if (!article) {
    console.log('No valid articles to update')
    process.exit()
  }

  console.log('Selected article:', article.title)

  // 2. Google search
  const searchResults = await googleSearch(article.title)
  console.log(
    'Reference links:',
    searchResults.map(r => r.link)
  )

  let referenceText = ''
  const references = []

  // 3. Scrape reference articles
  for (let result of searchResults) {
    const content = await scrapeContent(result.link)
    referenceText += truncateText(content, 2000) + '\n\n'
    references.push(result.link)
  }

  // 4. Call OpenAI to rewrite
  const prompt = `
Rewrite the original article to improve clarity, structure,
and formatting using ideas from the reference articles.

Rules:
- Do NOT copy sentences verbatim
- Keep the original meaning
- Use clear headings and paragraphs

Original Article:
${truncateText(article.content, 3000)}

Reference Articles:
${referenceText}
`

  const completion = await openai.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }]
  })

  const updatedContent =
    completion.choices[0].message.content +
    `\n\nReferences:\n${references.join('\n')}`

  // 5. Update article via your API
  await axios.put(`${BASE_API}/articles/${article._id}`, {
    content: updatedContent,
    isUpdated: true,
    references
  })

  console.log('Article updated successfully')
  process.exit()
}
function truncateText(text, maxChars = 3000) {
  if (!text) return ''
  return text.length > maxChars ? text.slice(0, maxChars) : text
}

run()
