import React from 'react';

const comments = [
  {
    id: 1,
    userName: 'Aarav Patel',
    userImage: 'https://via.placeholder.com/40', // Placeholder image URL
    text: 'I love the collection here! Brings back memories of my last trip to Sarojini Nagar.',
    timeAgo: '2 hours ago',
  },
  {
    id: 2,
    userName: 'Priya Sharma',
    userImage: 'https://via.placeholder.com/40', // Placeholder image URL
    text: 'Amazing! The products look so authentic. Can\'t wait to order.',
    timeAgo: '4 hours ago',
  },
  {
    id: 3,
    userName: 'Rahul Verma',
    userImage: 'https://via.placeholder.com/40', // Placeholder image URL
    text: 'This is exactly what I was looking for! Great job curating these collections.',
    timeAgo: '1 day ago',
  },
  
  
];

const CommentsSection = () => {
  return (
    <div className='w-full mt-8 bg-gradient-to-r from-Coral to-TangerineOrange  p-6 rounded-lg font-Playfair pl-5'>
      <h2 className='text-2xl font-semibold mb-4 font-Playfair text-white'>Comments</h2>

      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className='w-72 h-48 bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'
          >
            <div className='flex items-start mb-4'>
              <img
                src={comment.userImage}
                alt={`${comment.userName}'s profile`}
                className='w-12 h-12 rounded-full mr-4'
              />
              <div className='flex-1'>
                <p className='font-bold text-lg'>{comment.userName}</p>
                <p className='text-gray-700'>{comment.text}</p>
                <p className='text-sm text-gray-500 mt-1'>{comment.timeAgo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;