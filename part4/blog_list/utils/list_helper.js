const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, post) => {
    return total + post.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, post) => {
    return post.likes > favorite.likes ? post : favorite
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}