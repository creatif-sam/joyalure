import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit } from "lucide-react"
import { PreviewHero } from "@/components/preview/PreviewHero"
import { PreviewFooter } from "@/components/preview/PreviewFooter"
import { PreviewFeatures } from "@/components/preview/PreviewFeatures"
import { PreviewCategories } from "@/components/preview/PreviewCategories"

interface Props {
  onExitPreview: () => void
}

export default function SettingsPreviewMode({ onExitPreview }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Preview</h2>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Eye className="w-4 h-4 mr-2" />
            Preview Mode
          </Badge>
          <Button onClick={onExitPreview} variant="outline">
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
