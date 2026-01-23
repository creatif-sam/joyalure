"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

export interface SettingsData {
  // Site Settings
  siteName: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  contactPhone: string
  businessAddress: string

  // SEO Settings
  metaTitle: string
  metaDescription: string
  ogImage: string

  // Social Media
  facebook: string
  twitter: string
  instagram: string
  youtube: string
  tiktok: string

  // Homepage Content
  heroTitle: string
  heroSubtitle: string
  heroCtaText: string
  heroCtaLink: string

  // Features Section
  featuresEnabled: boolean
  feature1Title: string
  feature1Description: string
  feature2Title: string
  feature2Description: string
  feature3Title: string
  feature3Description: string

  // Footer Content
  footerAbout: string
  footerCopyright: string

  // Theme Settings
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

interface SettingsContextType {
  settings: SettingsData
  updateSetting: (key: string, value: any) => void
  isPreviewMode: boolean
  setIsPreviewMode: (mode: boolean) => void
}

const defaultSettings: SettingsData = {
  siteName: "Joyalure",
  siteDescription: "Premium skincare products for radiant, healthy skin",
  siteUrl: "https://joyalure.com",
  contactEmail: "hello@joyalure.com",
  contactPhone: "+1 (555) 123-4567",
  businessAddress: "123 Beauty Street, Skincare City, SC 12345",

  metaTitle: "Joyalure - Premium Skincare Products",
  metaDescription: "Discover premium skincare products at Joyalure. Natural ingredients, proven results.",
  ogImage: "/images/og-image.jpg",

  facebook: "https://facebook.com/joyalure",
  twitter: "https://twitter.com/joyalure",
  instagram: "https://instagram.com/joyalure",
  youtube: "https://youtube.com/joyalure",
  tiktok: "https://tiktok.com/@joyalure",

  heroTitle: "Radiant Skin Starts Here",
  heroSubtitle: "Discover our premium collection of natural skincare products",
  heroCtaText: "Shop Now",
  heroCtaLink: "/products",

  featuresEnabled: true,
  feature1Title: "Natural Ingredients",
  feature1Description: "100% natural, organic ingredients for healthy skin",
  feature2Title: "Dermatologist Tested",
  feature2Description: "Clinically proven results and safety",
  feature3Title: "Cruelty Free",
  feature3Description: "Never tested on animals, ethical beauty",

  footerAbout: "Joyalure is committed to providing premium skincare solutions using only the finest natural ingredients.",
  footerCopyright: "© 2024 Joyalure. All rights reserved.",

  primaryColor: "#000000",
  secondaryColor: "#6B7280",
  accentColor: "#10B981",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      isPreviewMode,
      setIsPreviewMode
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}