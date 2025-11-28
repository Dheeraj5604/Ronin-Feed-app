import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface Post {
  id: string;
  image_url: string;
  caption: string | null;
}

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = session?.user?.id === profile?.id;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username, session]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: postsData } = await supabase
        .from("posts")
        .select("id, image_url, caption")
        .eq("user_id", profileData.id)
        .order("created_at", { ascending: false });

      setPosts(postsData || []);

      const { count: followersCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profileData.id);

      const { count: followingCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", profileData.id);

      setFollowersCount(followersCount || 0);
      setFollowingCount(followingCount || 0);

      if (session?.user?.id && session.user.id !== profileData.id) {
        const { data: followData } = await supabase
          .from("follows")
          .select("*")
          .eq("follower_id", session.user.id)
          .eq("following_id", profileData.id)
          .maybeSingle();

        setIsFollowing(!!followData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Profile not found");
      navigate("/feed");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!session?.user?.id || !profile) return;

    try {
      if (isFollowing) {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", session.user.id)
          .eq("following_id", profile.id);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await supabase
          .from("follows")
          .insert({
            follower_id: session.user.id,
            following_id: profile.id,
          });
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container max-w-4xl mx-auto px-4 pt-20">
          <div className="space-y-4">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-24 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container max-w-4xl mx-auto px-4 pt-20 pb-8">
        <div className="space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-elegant">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-4xl font-display">
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-3xl font-display font-bold">{profile.username}</h1>
              {profile.full_name && (
                <p className="text-muted-foreground mt-1">{profile.full_name}</p>
              )}
            </div>

            <div className="flex gap-8 text-center">
              <div>
                <p className="text-2xl font-bold">{posts.length}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{followersCount}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{followingCount}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>

            {profile.bio && (
              <p className="text-muted-foreground max-w-md">{profile.bio}</p>
            )}

            {isOwnProfile ? (
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={handleFollow}
                className={isFollowing ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-gradient-primary"}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {posts.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No posts yet</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square relative overflow-hidden rounded-lg cursor-pointer group"
                >
                  <img
                    src={post.image_url}
                    alt={post.caption || "Post"}
                    className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
