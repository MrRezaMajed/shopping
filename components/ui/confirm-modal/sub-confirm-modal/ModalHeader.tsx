
interface ModalHeaderProps {
  title: string;
  message?: string;
}

export default function ModalHeader({ title, message }: ModalHeaderProps) {
  return (
    <>
      <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
          {message}
        </p>
      )}
    </>
  );
}