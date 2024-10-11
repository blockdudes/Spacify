'use client'
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import CreatePost from './CreatePost';
import Post from './PostComponent';

interface PrivateSpaceContentProps {
  selectedSpace: any;
  selectedChannel: string;
}

interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  time: string
}

interface Post {
  id: number
  author: string
  avatar: string
  time: string
  content: string
  resources: {
    resourceUrl: string
    dataType: string
  }[]
  likes: number
  comments: Comment[]
  reposts: number
  liked: boolean
  reposted: boolean
  upvotes: number
  downvotes: number
}


interface PostData {
  id: number,
  message: string,
  resources: {
    resourceUrl: string;
    dataType: string;
  }[];
}


function PrivateSpaceContent() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const selectedSpaceId = parseInt(pathSegments[2], 10);
  const selectedChannel = pathSegments[3];

  const [space, setSpace] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isOwner, setIsOwner] = useState<boolean>(true); 

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'George Lobko',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '2 hours ago',
      content: 'Hi everyone, today I was on the most beautiful mountain in the world 🌎, I also want to say hi to Silena, Olya and Davis!',
      resources: [
        {
          resourceUrl: 'https://tomato-characteristic-quail-246.mypinata.cloud/ipfs/bafkreib74sqrflitgziqaqvsgtynck6xnhlx3u5fmdyge7sflhy6b5cvmy',
          dataType: 'jpeg',
        },
        {
          resourceUrl: 'https://tomato-characteristic-quail-246.mypinata.cloud/ipfs/bafkreib74sqrflitgziqaqvsgtynck6xnhlx3u5fmdyge7sflhy6b5cvmy',
          dataType: 'jpeg',
        }
      ],
      likes: 6355,
      comments: [
        {
          id: 1,
          author: 'Jane Doe',
          avatar: '/placeholder.svg?height=32&width=32',
          content: 'Wow, that looks amazing! Which mountain is it?',
          time: '1 hour ago'
        },
        {
          id: 2,
          author: 'John Smith',
          avatar: '/placeholder.svg?height=32&width=32',
          content: 'Great shot! The view must have been breathtaking.',
          time: '30 minutes ago'
        },
        {
          id: 3,
          author: 'Alice Johnson',
          avatar: '/placeholder.svg?height=32&width=32',
          content: 'I wish I could visit there someday!',
          time: '15 minutes ago'
        },
        {
          id: 4,
          author: 'Bob Williams',
          avatar: '/placeholder.svg?height=32&width=32',
          content: 'What camera did you use for this shot?',
          time: '5 minutes ago'
        },
      ],
      reposts: 23,
      liked: false,
      reposted: false,
      upvotes: 123,
      downvotes: 5,
    },
  ]);

  const fetchSpaceData = async (spaceId: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = {
        id: spaceId,
        name: spaceId === 1 ? "CryptoArt Enthusiasts" : spaceId === 2 ? "NFT Traders" : "Blockchain Developers",
        description:
          spaceId === 1
            ? "A community for crypto art lovers and collectors"
            : spaceId === 2
            ? "Connect with fellow NFT traders and discuss market trends"
            : "A space for blockchain developers to share knowledge and collaborate.",
        image: "https://via.placeholder.com/400",
        members: spaceId === 1 ? 1234 : spaceId === 2 ? 5678 : 9012,
      };

      setSpace(data);
    } catch (err) {
      setError('Failed to fetch space data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSpaceId) {
      fetchSpaceData(selectedSpaceId);
    }
  }, [selectedSpaceId]);

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
          : post
      )
    );
  };

  const handleRepost = (postId: number) => {
    // Only allow reposting in general, or if owner in announcements
    if (selectedChannel === 'general' || (selectedChannel === 'announcement' && isOwner)) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, reposts: post.reposted ? post.reposts - 1 : post.reposts + 1, reposted: !post.reposted }
            : post
        )
      );
    }
  };

  const handleUpvote = (postId: number) => {
    // Only allow upvoting in the governance channel
    if (selectedChannel === 'governance') {
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, upvotes: (post.upvotes || 0) + 1 } : post
      ));
    }
  };

  const handleDownvote = (postId: number) => {
    // Only allow downvoting in the governance channel
    if (selectedChannel === 'governance') {
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, downvotes: (post.downvotes || 0) + 1 } : post
      ));
    }
  };

  const [commentingOn, setCommentingOn] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const commentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const handleComment = (postId: number, newComment: string) => {
    if (newComment.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  {
                    id: post.comments.length + 1,
                    author: 'You',
                    avatar: '/placeholder.svg?height=32&width=32',
                    content: newComment,
                    time: 'Just now',
                  },
                  ...post.comments,
                ],
              }
            : post
        )
      );
    }
    setNewComment('');
    setTimeout(() => {
      if (commentRefs.current[postId]) {
        commentRefs.current[postId]!.scrollTop = 0;
      }
    }, 0);
  };

  const toggleComments = (postId: number) => {
    setCommentingOn((current) => (current === postId ? null : postId));
  };

  if (loading) return <div>Loading space data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      {space && (
        <>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <img src={space.image} alt={space.name} className="w-10 h-10 object-cover rounded-full" />
            {space.name} - #{selectedChannel}
          </h2>
        </>
      )}

      {/* Only show the post creation UI if it's the 'general' channel or the owner in announcement/governance */}
      {(selectedChannel === 'general' || isOwner) && <CreatePost />}

      {posts.map((post) => (
         <Post 
          key={post.id} 
          post={post} 
          handleLike={handleLike} 
          handleRepost={handleRepost} 
          handleComment={handleComment} 
          handleUpvote={handleUpvote} // Only pass upvote handler in governance
          handleDownvote={handleDownvote} // Only pass downvote handler in governance
          selectedChannel={selectedChannel}
        />
      ))}
    </div>
  );
}

export default PrivateSpaceContent;
