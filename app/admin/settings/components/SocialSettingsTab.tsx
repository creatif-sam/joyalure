import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import SaveButton from "./SaveButton"

interface Settings {
  facebook: string
  twitter: string
  instagram: string
  youtube: string
  [key: string]: any
}

interface Props {
  settings: Settings
  saving: string | null
  updateSetting: (key: string, value: any) => void
  onSave: (section: string) => void
}

const SOCIAL_FIELDS = [
  { key: "facebook", label: "Facebook URL", icon: Facebook },
  { key: "twitter", label: "Twitter URL", icon: Twitter },
  { key: "instagram", label: "Instagram URL", icon: Instagram },
  { key: "youtube", label: "YouTube URL", icon: Youtube },
] as const

export default function SocialSettingsTab({ settings, saving, updateSetting, onSave }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {SOCIAL_FIELDS.map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <Label htmlFor={key} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </Label>
              <Input
                id={key}
                value={settings[key]}
                onChange={(e) => updateSetting(key, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <SaveButton section="social" saving={saving} label="Save Social Settings" onSave={onSave} />
    </div>
  )
}
