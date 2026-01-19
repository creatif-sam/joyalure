"use client"

type Section = {
  id: string
  title: string
}

export default function TableOfContents({
  sections
}: {
  sections: Section[]
}) {
  return (
    <div className="border rounded-xl p-6 bg-gray-50">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Table of Contents
      </h3>

      <ul className="space-y-3 text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-gray-700 hover:text-green-700 transition"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
