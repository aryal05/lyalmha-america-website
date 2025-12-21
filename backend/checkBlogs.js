import { initializeDatabase, getDatabase } from './database.js'

async function checkBlogs() {
  try {
    await initializeDatabase()
    const db = getDatabase()
    
    const blogs = await db.all('SELECT * FROM blogs')
    
    console.log('\n📚 BLOGS IN DATABASE:')
    console.log('Total blogs:', blogs.length)
    console.log('\nBlog details:')
    blogs.forEach(blog => {
      console.log(`\nID: ${blog.id}`)
      console.log(`Title: ${blog.title}`)
      console.log(`Status: ${blog.status}`)
      console.log(`Category: ${blog.category}`)
      console.log(`Author: ${blog.author}`)
      console.log(`Date: ${blog.date}`)
      console.log(`Banner: ${blog.banner}`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkBlogs()
