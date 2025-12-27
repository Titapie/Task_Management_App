export default function Toast({ message, type = "success" }) {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-indigo-500",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 text-white px-4 py-3
      rounded-xl shadow ${colors[type]}`}
    >
      {message}
    </div>
  );
}
