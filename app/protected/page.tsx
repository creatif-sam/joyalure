export default function ProtectedPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">
        Protected Page
      </h1>
      <p>
        You are authenticated. Access is enforced by the proxy.
      </p>
    </div>
  )
}
