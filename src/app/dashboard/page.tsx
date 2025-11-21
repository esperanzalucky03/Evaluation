import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Example data, replace with real data source or props as needed
const stats = {
  students: 1200,
  professors: 45,
  professorsResponses: 0,
  maintenance: 18,
  maintenanceResponses: 0,
  facilities: 18,
  facilitiesResponses: 0,
}


export default function Page() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="bg-white shadow rounded-lg p-8 flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-600">{stats.students}</span>
              <span className="mt-2 text-lg font-medium text-gray-700">Total Students</span>
            </div>
            <div className="bg-white shadow rounded-lg p-8 flex flex-col items-center">
              <span className="text-4xl font-bold text-green-600">{stats.professors}</span>
              <span className="mt-2 text-lg font-medium text-gray-700">Total Professors</span>
              <span className="mt-4 text-sm text-gray-500">
                Responses: <span className="font-semibold text-green-700">{stats.professorsResponses}</span>
              </span>
            </div>
            <div className="bg-white shadow rounded-lg p-8 flex flex-col items-center">
              <span className="text-4xl font-bold text-yellow-600">{stats.maintenance}</span>
              <span className="mt-2 text-lg font-medium text-gray-700">Total Maintenance</span>
              <span className="mt-4 text-sm text-gray-500">
                Responses: <span className="font-semibold text-yellow-700">{stats.maintenanceResponses}</span>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 w-full max-w-4xl mt-8">
            <div className="bg-white shadow rounded-lg p-8 flex flex-col items-center">
              <span className="text-4xl font-bold text-purple-600">{stats.facilities}</span>
              <span className="mt-2 text-lg font-medium text-gray-700">Total Facilities</span>
              <span className="mt-4 text-sm text-gray-500">
                Responses: <span className="font-semibold text-purple-700">{stats.facilitiesResponses}</span>
              </span>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
