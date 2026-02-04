"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { cardsData, type Card } from "@/data/cards"
import { Card as UICard, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SimpleDialog } from "@/components/ui/simple-dialog"
import { Download } from "lucide-react"

// Occasions derivation
const OCCASIONS = [
  { id: 1, name: "رمضان", img: "/cardsImg/ram1.jpeg" },
  { id: 2, name: "عيد الفطر", img: "/cardsImg/eidf1.jpeg" },
  { id: 3, name: "عيد الأضحى", img: "/cardsImg/bg1-2.jpg" },
]

export default function Home() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Filter cards based on selection
  const visibleCards = useMemo(() => {
    if (!selectedOccasion) return []
    return cardsData.filter((card) => card.occasion === selectedOccasion)
  }, [selectedOccasion])

  const handleOccasionClick = (occasionName: string) => {
    setSelectedOccasion(occasionName)
    // Removed auto-scroll for simplicity, relying on react re-render
  }

  const handleCardClick = (card: Card) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  const utf8_to_b64 = (str: string) => {
    return window.btoa(unescape(encodeURIComponent(str)))
  }

  const handleGenerate = async () => {
    if (!selectedCard || !name) return

    setIsGenerating(true)
    try {
      // Encode name
      let encodedName = utf8_to_b64(name)
      encodedName = encodedName.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

      const params = new URLSearchParams()
      params.append('txt64', encodedName)
      params.append('txt-size', selectedCard.txtSize.toString())
      params.append('txt-align', 'center')
      params.append('txt-font', 'AlTarikh')
      params.append('txt-fit', 'max')

      if (selectedCard.y) params.append('txt-y', selectedCard.y.toString())
      if (selectedCard.x) params.append('txt-x', selectedCard.x!.toString()) // x is nullable in type
      if (selectedCard.txtColor) params.append('txt-color', selectedCard.txtColor)

      const imageUrl = `${selectedCard.imgLink}?${params.toString()}`

      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name}.jpg`
      a.click()
      window.URL.revokeObjectURL(url)

      setIsModalOpen(false)
    } catch (error) {
      console.error("Error generating image", error)
      alert("حدث خطأ أثناء إنشاء الصورة")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-start bg-zinc-950 text-zinc-50 gap-12">

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl">
        <Image
          src="/logo.png"
          alt="Logo"
          width={180}
          height={180}
          className="mx-auto drop-shadow-2xl"
          priority
        />
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
          صمم بطاقة التهنئة الخاصة بك
        </h1>
        <p className="text-zinc-400">اختر المناسبة، ثم البطاقة، واكتب اسمك.</p>
      </div>

      {/* 1. Occasion Selector */}
      {!selectedOccasion && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.id}
              onClick={() => handleOccasionClick(occ.name)}
              className="group cursor-pointer relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all hover:scale-105"
            >
              <div className="aspect-video relative">
                <Image src={occ.img} alt={occ.name} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{occ.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Card Grid */}
      {selectedOccasion && (
        <div className="w-full max-w-6xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => setSelectedOccasion(null)}>← رجوع للمناسبات</Button>
            <h2 className="text-2xl font-bold">{selectedOccasion}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleCards.map((card) => (
              <UICard
                key={card.id}
                className="cursor-pointer overflow-hidden group hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-zinc-900/50"
                onClick={() => handleCardClick(card)}
              >
                <div className="aspect-[2/3] relative">
                  <Image
                    src={card.imgLink}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                    unoptimized // Imgix urls
                  />
                </div>
                <CardFooter className="p-4 justify-center bg-zinc-900/80 backdrop-blur-sm">
                  <span className="text-sm font-medium">اختر هذا التصميم</span>
                </CardFooter>
              </UICard>
            ))}
          </div>
        </div>
      )}

      {/* 3. Modal */}
      <SimpleDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="أكمل بيانات البطاقة"
      >
        <div className="space-y-6 py-4">
          {selectedCard && (
            <div className="relative aspect-[3/2] w-full rounded-md overflow-hidden border border-zinc-700">
              <Image src={selectedCard.imgLink} alt="Preview" fill className="object-cover" unoptimized />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              الاسم
            </label>
            <Input
              placeholder="اكتب اسمك هنا..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-right"
              autoFocus
            />
          </div>

          <Button
            className="w-full text-md font-bold py-6 bg-white text-black hover:bg-zinc-200"
            onClick={handleGenerate}
            disabled={!name || isGenerating}
          >
            {isGenerating ? (
              <span className="animate-pulse">جاري التصميم...</span>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> تحميل البطاقة
              </>
            )}
          </Button>
        </div>
      </SimpleDialog>

    </main>
  )
}
