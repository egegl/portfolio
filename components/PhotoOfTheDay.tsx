'use client';

import React, { useEffect, useState, useRef } from 'react';
import './PhotoOfTheDay.css';

interface TumblrPost {
  photos: Array<{
    original_size: {
      url: string;
    };
  }>;
}

interface TumblrResponse {
  response: {
    posts: TumblrPost[];
  };
  meta: {
    status: number;
    msg: string;
  };
}

export default function PhotoOfTheDay() {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchRandomPhoto = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching from Tumblr API...');
      const response = await fetch('/api/tumblr');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch photos');
      }

      const tumblrData = data as TumblrResponse;
      console.log('Parsed Tumblr data:', tumblrData);

      if (!tumblrData.response?.posts) {
        console.error('Invalid response structure:', tumblrData);
        throw new Error('Invalid response format from Tumblr API');
      }

      const posts = tumblrData.response.posts;
      console.log('Number of posts found:', posts.length);
      
      if (posts.length === 0) {
        throw new Error('No photo posts found in your Tumblr blog');
      }

      // Select a random post
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      console.log('Selected post:', randomPost);
      
      if (!randomPost.photos || randomPost.photos.length === 0) {
        throw new Error('Selected post has no photos');
      }

      const photoUrl = randomPost.photos[0].original_size.url;
      console.log('Selected photo URL:', photoUrl);
      setPhotoUrl(photoUrl);
    } catch (error) {
      console.error('Error in fetchRandomPhoto:', error);
      setError(error instanceof Error ? error.message : 'Failed to load photo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPhoto();
  }, []);

  // Update container height only when a new image is loaded
  useEffect(() => {
    if (imageRef.current && !loading) {
      const updateHeight = () => {
        if (imageRef.current) {
          const newHeight = imageRef.current.offsetHeight;
          setContainerHeight(newHeight);
        }
      };

      // Update height when image loads
      imageRef.current.addEventListener('load', updateHeight);
      // Initial height update
      updateHeight();

      return () => {
        if (imageRef.current) {
          imageRef.current.removeEventListener('load', updateHeight);
        }
      };
    }
  }, [photoUrl, loading]);

  if (error) {
    return (
      <div className="photo-container">
        <div className="photo-error">
          {error}
          <br />
          <small>Please check the console for more details.</small>
        </div>
        <a href="https://www.tumblr.com/blog/gurselgallery" className="photo-link" target="_blank" rel="noopener noreferrer">
          <u>More photos on my photoblog!</u>
        </a>
      </div>
    );
  }

  return (
    <div className="photo-container" ref={containerRef}>
      <div className="photo-content">
        <div 
          className="photo-wrapper" 
          style={{ 
            height: containerHeight ? `${containerHeight}px` : 'auto',
            minHeight: '200px'
          }}
        >
          {loading ? (
            <div className="photo-loading">Loading photo...</div>
          ) : photoUrl ? (
            <div className="photo-container-inner">
              <img 
                ref={imageRef}
                src={photoUrl} 
                alt="Photo of the day" 
                className="photo-image"
                style={{ opacity: loading ? 0 : 1 }}
              />
            </div>
          ) : (
            <div className="photo-error">No photo available</div>
          )}
        </div>
      </div>
      {photoUrl && (
        <button 
          onClick={fetchRandomPhoto} 
          className="refresh-button"
          aria-label="Load another random photo"
        >
          ↻ Load Another Photo
        </button>
      )}
      <a href="https://www.tumblr.com/blog/gurselgallery" className="photo-link" target="_blank" rel="noopener noreferrer">
        <u>More photos on my photoblog!</u>
      </a>
    </div>
  );
} 