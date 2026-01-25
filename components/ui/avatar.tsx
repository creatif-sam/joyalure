type AvatarProps = {
  src?: string | null
  name: string
}

export function Avatar({ src, name }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="h-8 w-8 rounded-full object-cover"
      />
    )
  }

  const initials = name
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  )
}
