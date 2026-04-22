import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SaveButton from "./SaveButton"

interface Settings {
  metaTitle: string
  metaDescription: string
  ogImage: string
  [key: string]: any
}

interface Props {
  settings: Settings
  saving: string | null
  updateSetting: (key: string, value: any) => void
  onSave: (section: string) => void
}

export default function SeoSettingsTab({ settings, saving, updateSetting, onSave }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Meta Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={settings.metaTitle}
              onChange={(e) => updateSetting("metaTitle", e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              {settings.metaTitle.length}/60 characters (recommended)
            </p>
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={settings.metaDescription}
              onChange={(e) => updateSetting("metaDescription", e.target.value)}
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              {settings.metaDescription.length}/160 characters (recommended)
            </p>
          </div>
          <div>
            <Label htmlFor="ogImage">Open Graph Image URL</Label>
            <Input
              id="ogImage"
              value={settings.ogImage}
              onChange={(e) => updateSetting("ogImage", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <SaveButton section="seo" saving={saving} label="Save SEO Settings" onSave={onSave} />
    </div>
  )
}
