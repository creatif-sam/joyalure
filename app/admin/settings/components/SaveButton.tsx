import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"

interface Props {
  section: string
  saving: string | null
  label: string
  onSave: (section: string) => void
}

export default function SaveButton({ section, saving, label, onSave }: Props) {
  return (
    <div className="flex justify-end">
      <Button onClick={() => onSave(section)} disabled={saving === section}>
        {saving === section ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {label}
          </>
        )}
      </Button>
    </div>
  )
}
