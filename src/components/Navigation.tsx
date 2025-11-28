import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Home, User, PlusSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
          setAvatarUrl(profile.avatar_url);
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/feed" className="text-2xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
            Ronin
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              to="/feed" 
              className="text-foreground hover:text-primary transition-smooth"
            >
              <Home className="h-6 w-6" />
            </Link>
            <Link 
              to={`/profile/${username}`}
              className="text-foreground hover:text-primary transition-smooth"
            >
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback>
                  {username[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
