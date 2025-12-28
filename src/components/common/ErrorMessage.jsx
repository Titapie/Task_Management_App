export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <p className="text-sm text-red-500 dark:text-red-400 mt-1 animate-fade-in-fast transition-colors duration-200">
      {message}
    </p>
  );
}