export default function EditProfileModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl p-6 w-[90%] max-w-md space-y-4">
        <h3 className="text-lg font-bold">Edit Profile</h3>

        <input
          placeholder="Full Name"
          className="w-full p-3 rounded-xl border"
        />
        <input placeholder="Email" className="w-full p-3 rounded-xl border" />
        <input placeholder="Phone" className="w-full p-3 rounded-xl border" />

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border">
            Cancel
          </button>
          <button className="flex-1 py-2 rounded-xl bg-indigo-600 text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
