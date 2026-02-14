import React from 'react';
import PostCard from '@/components/card/PostCard';

const OfficePostCard = ({
  className,
  post,
  currentUserId,
  isVisible,
}: {
  className?: string;
  post?: any;
  currentUserId?: string;
  isVisible?: boolean;
}) => {
  return (
    <PostCard
      post={post}
      className={className}
      currentUserId={currentUserId}
      isVisible={isVisible}
      officeVariant
    />
  );
};

export default OfficePostCard;
