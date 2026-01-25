import ClientTopbar from "./layout/ClientTopbar"
import ClientSidebar from "./layout/ClientSidebar"

export default function ClientDashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientTopbar />
      <ClientSidebar />

      <main className="pt-16 bg-gray-50 min-h-screen px-6 py-6 transition-all duration-300 ml-64">
        {children}
      </main>
    </>
  )
}
