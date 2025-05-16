import { NextResponse } from 'next/server';

const TUMBLR_API_KEY = process.env.TUMBLR_API_KEY;
const BLOG_URL = 'gurselgallery.tumblr.com';

export async function GET() {
  try {
    if (!TUMBLR_API_KEY) {
      console.error('TUMBLR_API_KEY is not set');
      return NextResponse.json({ 
        error: 'Configuration error',
        details: 'Tumblr API key is not configured'
      }, { status: 500 });
    }

    // First, get the blog info to verify the API key
    const blogUrl = `https://api.tumblr.com/v2/blog/${BLOG_URL}/info?api_key=${TUMBLR_API_KEY}`;
    console.log('Fetching blog info from:', blogUrl);
    
    const blogResponse = await fetch(blogUrl);
    const blogData = await blogResponse.json();
    
    if (!blogResponse.ok) {
      console.error('Blog info error:', blogData);
      throw new Error(`Failed to fetch blog info: ${blogData.meta?.msg || 'Unknown error'}`);
    }

    console.log('Blog info response:', blogData);

    // Fetch all posts
    const postsUrl = `https://api.tumblr.com/v2/blog/${BLOG_URL}/posts?api_key=${TUMBLR_API_KEY}&limit=50`;
    console.log('Fetching posts from:', postsUrl);
    
    const postsResponse = await fetch(postsUrl);
    const postsData = await postsResponse.json();
    
    if (!postsResponse.ok) {
      console.error('Posts error:', postsData);
      throw new Error(`Failed to fetch posts: ${postsData.meta?.msg || 'Unknown error'}`);
    }

    // Check if we have posts
    if (!postsData.response?.posts || postsData.response.posts.length === 0) {
      console.log('No posts found in response');
      return NextResponse.json({ 
        error: 'No posts found',
        details: 'The Tumblr API returned no posts'
      }, { status: 404 });
    }

    // Get all posts that have images
    const postsWithImages = postsData.response.posts.filter((post: any) => {
      // Check if the post has an image in its body
      if (post.body && post.body.includes('<img')) {
        // Extract the first image URL from the post
        const imgMatch = post.body.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          console.log('Found image in post:', post.id, 'URL:', imgMatch[1]);
          return true;
        }
      }
      return false;
    });

    console.log('Total posts:', postsData.response.posts.length);
    console.log('Posts with images:', postsWithImages.length);

    if (postsWithImages.length === 0) {
      return NextResponse.json({ 
        error: 'No image posts found',
        details: 'No posts with images were found'
      }, { status: 404 });
    }

    // Transform the posts to include the image URL
    const transformedPosts = postsWithImages.map((post: any) => {
      const imgMatch = post.body.match(/<img[^>]+src="([^">]+)"/);
      return {
        id: post.id,
        photos: [{
          original_size: {
            url: imgMatch[1]
          }
        }]
      };
    });

    // Return the transformed posts
    return NextResponse.json({
      response: {
        posts: transformedPosts
      },
      meta: postsData.meta
    });
  } catch (error) {
    console.error('Tumblr API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch photos',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 