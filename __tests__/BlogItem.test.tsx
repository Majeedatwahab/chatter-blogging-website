import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import BlogItem from '../Components/BlogItem'

const blogPost = {
  title: 'Sample Blog Title',
  imageURL: 'https://via.placeholder.com/150',
  category: 'Sample Category',
  snippet: 'This is a sample snippet for the blog post.',
  content: 'This is a sample content for the blog post',
  author: 'John Doe',
  date: Date.now(),
  id: '1',
  onDelete: jest.fn(),
  onEdit: jest.fn(),
  onLike: jest.fn(),
  onBookmark: jest.fn(),
  isLiked: false,
  isBookmarked: false,
  likesCount: 10,
  bookmarksCount: 5,
};

it('should render blog post correctly', ()=>{
  render(<BlogItem{...blogPost} onLike={jest.fn()} onBookmark={jest.fn()} />);
  expect(screen.getByText(blogPost.title)).toBeInTheDocument();
  expect(screen.getByText(blogPost.snippet)).toBeInTheDocument();
  expect(screen.getByText(blogPost.author)).toBeInTheDocument();
    expect(screen.getByText(blogPost.category)).toBeInTheDocument();

})

   
  

  test('like button works correctly', () => {
    render(<BlogItem {...blogPost} />);
    
    const likeButton = screen.getByRole('button', { name: 'like' });
    fireEvent.click(likeButton);
    
    expect(blogPost.onLike).toHaveBeenCalledWith(blogPost.id);
  });

  test('bookmark button works correctly', () => {
    render(<BlogItem {...blogPost} />);
    
    const bookmarkButton = screen.getByRole('button', { name: 'bookmark' });
    fireEvent.click(bookmarkButton);
    
    expect(blogPost.onBookmark).toHaveBeenCalledWith(blogPost.id);
  });

  test('edit and delete buttons work correctly', () => {
    render(<BlogItem {...blogPost} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    expect(blogPost.onEdit).toHaveBeenCalledWith(blogPost.id);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(blogPost.onDelete).toHaveBeenCalledWith(blogPost.id);
  });

