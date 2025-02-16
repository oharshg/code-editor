import image from "../../assets/profile.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface ProfileProps {
  id: string;
}

function Profile({ id }: ProfileProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to={`/`} style={{color: 'inherit'}}>
          <DropdownMenuItem>
            Community
          </DropdownMenuItem>
        </Link>
        <Link to={`/profile/${id}`} style={{color: 'inherit'}}>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;

