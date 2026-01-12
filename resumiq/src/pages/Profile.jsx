import { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser({
          name: u.displayName || "User",
          email: u.email,
          joined: new Date(
            u.metadata.creationTime
          ).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        });
      }
    });

    return () => unsub();
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-20">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <p className="text-gray-500 text-sm">Full Name</p>
          <p className="text-lg">{user.name}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Email</p>
          <p className="text-lg">{user.email}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Member Since</p>
          <p className="text-lg">{user.joined}</p>
        </div>
      </div>
    </div>
  );
}
