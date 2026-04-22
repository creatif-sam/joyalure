"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Eye, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SettingsProvider, useSettings } from "@/lib/settings-context"
import { toast } from "sonner"
import SiteSettingsTab from "./components/SiteSettingsTab"
import HomepageSettingsTab from "./components/HomepageSettingsTab"
import SeoSettingsTab from "./components/SeoSettingsTab"
import SocialSettingsTab from "./components/SocialSettingsTab"
import FooterSettingsTab from "./components/FooterSettingsTab"
import ThemeSettingsTab from "./components/ThemeSettingsTab"
import SettingsPreviewMode from "./components/SettingsPreviewMode"

function SettingsContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const supabase = createClient()
  const { settings, updateSetting, isPreviewMode, setIsPreviewMode } = useSettings()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase.from("settings").select("key, value")
        if (error) { console.error("Error loading settings:", error); return }
        if (data) {
          data.forEach((setting: any) => {
            const key = setting.key.replace("_settings", "")
            if (["site", "seo", "social", "homepage", "footer", "theme"].includes(key)) {
              Object.assign(settings, setting.value)
            }
          })
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async (section: string) => {
    const sectionKeys: Record<string, string[]> = {
      site: ["siteName", "siteDescription", "siteUrl", "contactEmail", "contactPhone", "businessAddress"],
      seo: ["metaTitle", "metaDescription", "ogImage"],
      social: ["facebook", "twitter", "instagram", "youtube"],
      homepage: ["heroTitle", "heroSubtitle", "heroCtaText", "heroCtaLink", "featuresEnabled",
        "feature1Title", "feature1Description", "feature2Title", "feature2Description",
        "feature3Title", "feature3Description"],
      footer: ["footerAbout", "footerCopyright"],
      theme: ["primaryColor", "secondaryColor", "accentColor"],
    }
    const data = Object.fromEntries((sectionKeys[section] ?? []).map((k) => [k, settings[k]]))
    setSaving(section)
    try {
      const { error } = await supabase.from("settings").upsert({ key: `${section}_settings`, value: data })
      if (error) { toast.error(`Failed to save ${section} settings`) }
      else { toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved`) }
    } catch {
      toast.error(`Failed to save ${section} settings`)
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    )
  }

  if (isPreviewMode) {
    return <SettingsPreviewMode onExitPreview={() => setIsPreviewMode(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Headless CMS - Front-end Controls</h2>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Globe className="w-4 h-4 mr-2" />
            Live Preview Available
          </Badge>
          <Button onClick={() => setIsPreviewMode(true)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="site" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <SiteSettingsTab settings={settings} saving={saving} updateSetting={updateSetting} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="homepage">
          <HomepageSettingsTab settings={settings} saving={saving} updateSetting={updateSetting} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="seo">
          <SeoSettingsTab settings={settings} saving={saving} updateSetting={updateSetting} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="social">
          <SocialSettingsTab settings={settings} saving={saving} updateSetting={updateSetting} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="footer">
          <FooterSettingsTab settings={settings} saving={saving} updateSetting={updateSetting} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="theme">
          <ThemeSettingsTab settings={settings} saving={saving} updateSetting={updateSetting} onSave={handleSave} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AdminSettings() {
  return (
    <SettingsProvider>
      <SettingsContent />
    </SettingsProvider>
  )
}
