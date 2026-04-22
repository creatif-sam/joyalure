import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import SaveButton from "./SaveButton"

interface Settings {
  heroTitle: string
  heroSubtitle: string
  heroCtaText: string
  heroCtaLink: string
  featuresEnabled: boolean
  feature1Title: string
  feature1Description: string
  feature2Title: string
  feature2Description: string
  feature3Title: string
  feature3Description: string
  [key: string]: any
}

interface Props {
  settings: Settings
  saving: string | null
  updateSetting: (key: string, value: any) => void
  onSave: (section: string) => void
}

export default function HomepageSettingsTab({ settings, saving, updateSetting, onSave }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={settings.heroTitle}
              onChange={(e) => updateSetting("heroTitle", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={settings.heroSubtitle}
              onChange={(e) => updateSetting("heroSubtitle", e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heroCtaText">CTA Button Text</Label>
              <Input
                id="heroCtaText"
                value={settings.heroCtaText}
                onChange={(e) => updateSetting("heroCtaText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="heroCtaLink">CTA Button Link</Label>
              <Input
                id="heroCtaLink"
                value={settings.heroCtaLink}
                onChange={(e) => updateSetting("heroCtaLink", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="featuresEnabled"
              checked={settings.featuresEnabled}
              onCheckedChange={(checked) => updateSetting("featuresEnabled", checked)}
            />
            <Label htmlFor="featuresEnabled">Enable Features Section</Label>
          </div>

          {settings.featuresEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n}>
                  <Label htmlFor={`feature${n}Title`}>Feature {n} Title</Label>
                  <Input
                    id={`feature${n}Title`}
                    value={settings[`feature${n}Title`]}
                    onChange={(e) => updateSetting(`feature${n}Title`, e.target.value)}
                  />
                  <Textarea
                    className="mt-2"
                    value={settings[`feature${n}Description`]}
                    onChange={(e) => updateSetting(`feature${n}Description`, e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SaveButton section="homepage" saving={saving} label="Save Homepage Settings" onSave={onSave} />
    </div>
  )
}
