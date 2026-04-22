import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SaveButton from "./SaveButton"

interface Settings {
  footerAbout: string
  footerCopyright: string
  [key: string]: any
}

interface Props {
  settings: Settings
  saving: string | null
  updateSetting: (key: string, value: any) => void
  onSave: (section: string) => void
}

export default function FooterSettingsTab({ settings, saving, updateSetting, onSave }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Footer Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="footerAbout">About Text</Label>
            <Textarea
              id="footerAbout"
              value={settings.footerAbout}
              onChange={(e) => updateSetting("footerAbout", e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="footerCopyright">Copyright Text</Label>
            <Input
              id="footerCopyright"
              value={settings.footerCopyright}
              onChange={(e) => updateSetting("footerCopyright", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <SaveButton section="footer" saving={saving} label="Save Footer Settings" onSave={onSave} />
    </div>
  )
}
