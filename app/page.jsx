import { currentUser } from "../app/modules/actions";
import UserButton from "./modules/components/user-button";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to T3 Chat!</h1>
      <UserButton user={user} />
    </div>
  );
}
