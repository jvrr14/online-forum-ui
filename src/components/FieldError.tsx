export function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-xs text-red-700">
      {errors.join(". ")}
    </p>
  );
}
