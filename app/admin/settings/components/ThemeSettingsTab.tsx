import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SaveButton from "./SaveButton"

interface Settings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  [key: string]: any
}

interface Props {
  settings: Settings
  saving: string | null
  updateSetting: (key: string, value: any) => void
  onSave: (section: string) => void
}

const COLOR_FIELDS = [
  { key: "primaryColor", label: "Primary Color", placeholder: "#000000" },
  { key: "secondaryColor", label: "Secondary Color", placeholder: "#6B7280" },
  { key: "accentColor", label: "Accent Color", placeholder: "#10B981" },
] as const

export default function ThemeSettingsTab({ settings, saving, updateSetting, onSave }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLOR_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <div className="flex gap-2">
                  <Input
                    id={key}
                    type="color"
                    value={settings[key]}
                    onChange={(e) => updateSetting(key, e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings[key]}
                    onChange={(e) => updateSetting(key, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SaveButton section="theme" saving={saving} label="Save Theme Settings" onSave={onSave} />
    </div>
  )
}
