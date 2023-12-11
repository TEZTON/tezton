import { LogOut } from "lucide-react";
import { auth } from "@/firebase-config";

function SignOutButton() {
  return (
    <div
      className={`group flex items-center justify-center min-w-[40px] min-h-[40px] rounded-md hover:bg-gray-300 dark:text-[gray] overflow-hidden p-1 group`}
    >
      <LogOut onClick={() => auth.signOut()} size={20} />
    </div>
  );
}

export default SignOutButton;
