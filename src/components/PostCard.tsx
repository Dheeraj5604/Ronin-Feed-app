import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteImageFromBucket } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X,Heart } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: {
    id: string;
    image_url: string;
    caption: string | null;
    created_at: string;
    user_id: string;
    profiles: {
      username: string;
      avatar_url: string | null;
    };
    likes: { user_id: string }[];
  };
  currentUserId: string;
  onUpdate: () => void;
}

const PostCard = ({ post, currentUserId, onUpdate }: PostCardProps) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isLiked = post.likes.some((like) => like.user_id === currentUserId);
  const likesCount = post.likes.length;
  const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this post?")) return;
  setIsDeleting(true);

  try {
    // Extract the path inside the bucket
    const url = new URL(post.image_url);
    const path = url.pathname.split("/").slice(2).join("/"); // skip /storage/v1/object/public/bucket-name/

    // Remove from bucket
    await deleteImageFromBucket("post-images", path);

    // Delete DB record
    const { error: dbError } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);
    if (dbError) throw dbError;

    toast.success("Post deleted!");
    onUpdate(); // Refresh posts in the UI
  } catch (err: any) {
    console.error("Delete error:", err);
    toast.error(err.message || "Failed to delete post");
  } finally {
    setIsDeleting(false);
  }
};


  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", currentUserId);
      } else {
        await supabase
          .from("likes")
          .insert({
            post_id: post.id,
            user_id: currentUserId,
          });
      }
      onUpdate();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="shadow-card overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Link to={`/profile/${post.profiles.username}`}>
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={post.profiles.avatar_url || undefined} />
            <AvatarFallback>
              {post.profiles.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link 
            to={`/profile/${post.profiles.username}`}
            className="font-semibold hover:text-primary transition-smooth"
          >
            {post.profiles.username}
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>

      {/* Delete button only for post owner */}
{currentUserId === post.user_id && (
  <Button
    size="icon"
    variant="ghost"
    onClick={handleDelete}
    disabled={isDeleting}
    className="hover:bg-red-100 transition-smooth"
  >
    <X className="h-5 w-5 text-red-500" />
  </Button>
)}


      <CardContent className="p-0">
        <img
          src={post.image_url}
          alt={post.caption || "Post"}
          className="w-full aspect-square object-cover"
        />
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 pt-3">
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            disabled={isLiking}
            className="hover:bg-accent/50 transition-smooth"
          >
            <Heart
              className={`h-6 w-6 transition-smooth ${
                isLiked ? "fill-accent text-accent" : "text-foreground"
              }`}
            />
          </Button>
          <span className="text-sm font-semibold">
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </span>
        </div>
        
        {post.caption && (
          <p className="text-sm">
            <Link 
              to={`/profile/${post.profiles.username}`}
              className="font-semibold hover:text-primary transition-smooth mr-2"
            >
              {post.profiles.username}
            </Link>
            {post.caption}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
