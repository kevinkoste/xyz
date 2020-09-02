import axios from 'axios'

export const fetchSubstack = (substackName: string) => {
  return axios.get("https://api.rss2json.com/v1/api.json", {
    params: {
      rss_url: "https://" + substackName + ".substack.com/feed"
    }
  })
  .then(response => {
    return parseRss(substackName, response.data)
  }).catch(error => {
    console.error(error)
    return error
  });
}

export const fetchMedium = (mediumName: string) => {
  return axios.get("https://api.rss2json.com/v1/api.json", {
    params: {
      rss_url: "https://medium.com/feed/@" + mediumName
    }
  })
  .then(response => {
    return parseRss(mediumName, response.data)
  }).catch(error => {
    console.error(error)
    return error
  });
}

const parseRss = (name: string, rss: any) => {
  console.log(rss)
  let parsedRss = {
    name: name,
    title: rss.feed.title,
    description: rss.feed.description,
    posts: []
  }
  rss.items.forEach(post => {
    parsedRss.posts.push({
      tite: post.title,
      timestamp: post.pubDate,
      subtitle: post.description,
      link: post.link
    })
  });
  return parsedRss;
}