import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import SaveButton from "./SaveButton"

interface Settings {
  siteName: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  contactPhone: string
  businessAddress: string
  [key: string]: any
}

interface Props {
  settings: Settings
  saving: string | null
  updateSetting: (key: string, value: any) => void
  onSave: (section: string) => void
}

export default function SiteSettingsTab({ settings, saving, updateSetting, onSave }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting("siteName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => updateSetting("siteUrl", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => updateSetting("siteDescription", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting("contactEmail", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contactPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => updateSetting("contactPhone", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="businessAddress" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Business Address
            </Label>
            <Textarea
              id="businessAddress"
              value={settings.businessAddress}
              onChange={(e) => updateSetting("businessAddress", e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <SaveButton section="site" saving={saving} label="Save Site Settings" onSave={onSave} />
    </div>
  )
}
