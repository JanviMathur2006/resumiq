import PageTransition from "../components/PageTransition";

export default function Profile() {
  // Dummy user data (later can come from backend / context)
  const user = {
    name: "John Doe",
    email: "john@example.com",
    joined: "March 2024",
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-semibold">Your Profile</h1>
          <p className="text-gray-500 mt-1">
            Manage your personal information
          </p>
        </div>

        {/* Profile Info */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p className="text-lg font-medium">{user.name}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Member Since</label>
            <p className="text-lg font-medium">{user.joined}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow flex gap-4">
          <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
            Edit Profile
          </button>

          <button className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 transition">
            Change Password
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
