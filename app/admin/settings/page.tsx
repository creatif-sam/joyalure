"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Save, Loader2, Eye, Edit } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SettingsProvider, useSettings } from "@/lib/settings-context"
import { PreviewHero } from "@/components/preview/PreviewHero"
import { PreviewFooter } from "@/components/preview/PreviewFooter"
import { PreviewFeatures } from "@/components/preview/PreviewFeatures"
import { PreviewCategories } from "@/components/preview/PreviewCategories"

function SettingsContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const supabase = createClient()
  const { settings, updateSetting, isPreviewMode, setIsPreviewMode } = useSettings()

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('key, value')

        if (error) {
          console.error('Error loading settings:', error)
          return
        }

        if (data) {
          data.forEach((setting: any) => {
            if (setting.key === 'site_settings') {
              Object.assign(settings, setting.value)
            } else if (setting.key === 'seo_settings') {
              Object.assign(settings, setting.value)
            } else if (setting.key === 'social_settings') {
              Object.assign(settings, setting.value)
            } else if (setting.key === 'homepage_settings') {
              Object.assign(settings, setting.value)
            } else if (setting.key === 'footer_settings') {
              Object.assign(settings, setting.value)
            } else if (setting.key === 'theme_settings') {
              Object.assign(settings, setting.value)
            }
          })
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const saveSettings = async (section: string, data: any) => {
    setSaving(section)
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: `${section}_settings`,
          value: data
        })

      if (error) {
        console.error(`Error saving ${section} settings:`, error)
        alert(`Failed to save ${section} settings`)
      } else {
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`)
      }
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error)
      alert(`Failed to save ${section} settings`)
    } finally {
      setSaving(null)
    }
  }

  const handleSave = async (section: string) => {
    let data: any = {}

    switch (section) {
      case 'site':
        data = {
          siteName: settings.siteName,
          siteDescription: settings.siteDescription,
          siteUrl: settings.siteUrl,
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          businessAddress: settings.businessAddress,
        }
        break
      case 'seo':
        data = {
          metaTitle: settings.metaTitle,
          metaDescription: settings.metaDescription,
          ogImage: settings.ogImage,
        }
        break
      case 'social':
        data = {
          facebook: settings.facebook,
          twitter: settings.twitter,
          instagram: settings.instagram,
          youtube: settings.youtube,
        }
        break
      case 'homepage':
        data = {
          heroTitle: settings.heroTitle,
          heroSubtitle: settings.heroSubtitle,
          heroCtaText: settings.heroCtaText,
          heroCtaLink: settings.heroCtaLink,
          featuresEnabled: settings.featuresEnabled,
          feature1Title: settings.feature1Title,
          feature1Description: settings.feature1Description,
          feature2Title: settings.feature2Title,
          feature2Description: settings.feature2Description,
          feature3Title: settings.feature3Title,
          feature3Description: settings.feature3Description,
        }
        break
      case 'footer':
        data = {
          footerAbout: settings.footerAbout,
          footerCopyright: settings.footerCopyright,
        }
        break
      case 'theme':
        data = {
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          accentColor: settings.accentColor,
        }
        break
    }

    await saveSettings(section, data)
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
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Live Preview</h2>
          <div className="flex gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Eye className="w-4 h-4 mr-2" />
              Preview Mode
            </Badge>
            <Button onClick={() => setIsPreviewMode(false)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-50 px-4 py-2 border-b text-sm text-gray-600">
            Live Preview - How your site will look with current settings
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            <PreviewHero />
            <PreviewCategories />
            <PreviewFeatures />
            <PreviewFooter />
          </div>
        </div>
      </div>
    )
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

        {/* Site Settings */}
        <TabsContent value="site" className="space-y-6">
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
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => updateSetting('siteUrl', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
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
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
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
                    onChange={(e) => updateSetting('contactPhone', e.target.value)}
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
                  onChange={(e) => updateSetting('businessAddress', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('site')} disabled={saving === 'site'}>
              {saving === 'site' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Site Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Homepage Content */}
        <TabsContent value="homepage" className="space-y-6">
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
                  onChange={(e) => updateSetting('heroTitle', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={(e) => updateSetting('heroSubtitle', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heroCtaText">CTA Button Text</Label>
                  <Input
                    id="heroCtaText"
                    value={settings.heroCtaText}
                    onChange={(e) => updateSetting('heroCtaText', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="heroCtaLink">CTA Button Link</Label>
                  <Input
                    id="heroCtaLink"
                    value={settings.heroCtaLink}
                    onChange={(e) => updateSetting('heroCtaLink', e.target.value)}
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
                  onCheckedChange={(checked) => updateSetting('featuresEnabled', checked)}
                />
                <Label htmlFor="featuresEnabled">Enable Features Section</Label>
              </div>

              {settings.featuresEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="feature1Title">Feature 1 Title</Label>
                    <Input
                      id="feature1Title"
                      value={settings.feature1Title}
                      onChange={(e) => updateSetting('feature1Title', e.target.value)}
                    />
                    <Textarea
                      className="mt-2"
                      value={settings.feature1Description}
                      onChange={(e) => updateSetting('feature1Description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="feature2Title">Feature 2 Title</Label>
                    <Input
                      id="feature2Title"
                      value={settings.feature2Title}
                      onChange={(e) => updateSetting('feature2Title', e.target.value)}
                    />
                    <Textarea
                      className="mt-2"
                      value={settings.feature2Description}
                      onChange={(e) => updateSetting('feature2Description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="feature3Title">Feature 3 Title</Label>
                    <Input
                      id="feature3Title"
                      value={settings.feature3Title}
                      onChange={(e) => updateSetting('feature3Title', e.target.value)}
                    />
                    <Textarea
                      className="mt-2"
                      value={settings.feature3Description}
                      onChange={(e) => updateSetting('feature3Description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('homepage')} disabled={saving === 'homepage'}>
              {saving === 'homepage' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Homepage Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-6">
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
                  onChange={(e) => updateSetting('metaTitle', e.target.value)}
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
                  onChange={(e) => updateSetting('metaDescription', e.target.value)}
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
                  onChange={(e) => updateSetting('ogImage', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('seo')} disabled={saving === 'seo'}>
              {saving === 'seo' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save SEO Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook URL
                </Label>
                <Input
                  id="facebook"
                  value={settings.facebook}
                  onChange={(e) => updateSetting('facebook', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter URL
                </Label>
                <Input
                  id="twitter"
                  value={settings.twitter}
                  onChange={(e) => updateSetting('twitter', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram URL
                </Label>
                <Input
                  id="instagram"
                  value={settings.instagram}
                  onChange={(e) => updateSetting('instagram', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  YouTube URL
                </Label>
                <Input
                  id="youtube"
                  value={settings.youtube}
                  onChange={(e) => updateSetting('youtube', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('social')} disabled={saving === 'social'}>
              {saving === 'social' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Social Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Footer Content */}
        <TabsContent value="footer" className="space-y-6">
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
                  onChange={(e) => updateSetting('footerAbout', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="footerCopyright">Copyright Text</Label>
                <Input
                  id="footerCopyright"
                  value={settings.footerCopyright}
                  onChange={(e) => updateSetting('footerCopyright', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('footer')} disabled={saving === 'footer'}>
              {saving === 'footer' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Footer Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      placeholder="#6B7280"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => updateSetting('accentColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => updateSetting('accentColor', e.target.value)}
                      placeholder="#10B981"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('theme')} disabled={saving === 'theme'}>
              {saving === 'theme' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Theme Settings
                </>
              )}
            </Button>
          </div>
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