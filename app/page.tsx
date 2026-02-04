"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { cardsData, type Card } from "@/data/cards"

// Using Bootstrap classes (provided via layout.tsx CDN)

const OCCASIONS = [
  { id: 1, name: "رمضان" },
  { id: 2, name: "عيد الفطر" },
  { id: 3, name: "عيد الأضحى" },
]

export default function Home() {
  const [name, setName] = useState("")

  const [step, setStep] = useState<"name" | "occasion" | "card" | "customize">("name")
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [posX, setPosX] = useState<number | null>(null)
  const [posY, setPosY] = useState<number | null>(null)
  const [fontSize, setFontSize] = useState<number>(115)
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    setStep("occasion")
  }

  const handleOccasionSelect = (occ: string) => {
    setSelectedOccasion(occ)
    setStep("card")
  }

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card)
    setPosX(card.x)
    setPosY(card.y)
    setFontSize(card.txtSize)
    setStep("customize")
  }

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !selectedCard || !imgRef.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imgRef.current
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    // Draw Background
    ctx.drawImage(img, 0, 0)

    // Draw Text
    ctx.font = `${fontSize || 115}px Almarai, sans-serif`
    ctx.fillStyle = selectedCard.txtColor || "#4A5456"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Calculate Position
    // Imgix coordinates usually put 0,0 at center or top-left? 
    // Usually card.y is absolute from top. 
    // card.x is horizontal. If null, we center it.
    const x = posX !== null ? (canvas.width / 2) + posX : canvas.width / 2
    const y = posY !== null ? posY : canvas.height / 2

    ctx.fillText(name || "الاسم هنا", x, y)
  }, [selectedCard, name, posX, posY, fontSize])

  useEffect(() => {
    if (step === "customize" && selectedCard) {
      if (!imgRef.current || imgRef.current.src !== window.location.origin + selectedCard.imgLink) {
        const img = new window.Image()
        img.src = selectedCard.imgLink
        img.onload = () => {
          imgRef.current = img
          setImageLoaded(true)
          // Ensure fonts are loaded before drawing
          document.fonts.ready.then(() => {
            drawCanvas()
          })
        }
      } else {
        document.fonts.ready.then(() => {
          drawCanvas()
        })
      }
    }
  }, [step, selectedCard, name, posX, posY, fontSize, drawCanvas])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `${name || "greeting"}.jpg`
    a.click()
    setStep("name")
  }

  const filteredCards = cardsData.filter(c => c.occasion === selectedOccasion)

  return (
    <div className="mainView" dir="rtl">
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="position-relative">
                <div className="text-center mb-5">
                  <img className="logo" src="/logo.png" alt="logo" draggable="false" />
                  <h4 id="title" className="mt-4">
                    {step === "name" && "صمم بطاقة التهنئة الخاصة بك في أقل من دقيقة"}
                    {step === "occasion" && "اختر المناسبة"}
                    {step === "card" && "اختر التصميم"}
                    {step === "customize" && selectedCard && `تعديل التصميم #${selectedCard.id}`}
                  </h4>
                </div>
              </div>

              {/* Step 1: Name Input */}
              {step === "name" && (
                <div className="row fade-in">
                  <div className="col-md-12">
                    <form onSubmit={handleSubmitName}>
                      <div className="form-group">
                        <label htmlFor="name">الاسم</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="اكتب اسمك هنا"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary mt-4">
                        <span>التالي</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(180deg)" }}><path d="m9 18 6-6-6-6" /></svg>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Step 2: Occasion Selection */}
              {step === "occasion" && (
                <div className="d-flex flex-column gap-2 fade-in">
                  {OCCASIONS.map(occ => (
                    <button
                      key={occ.id}
                      className="occasion-btn"
                      onClick={() => handleOccasionSelect(occ.name)}
                    >
                      {occ.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary mt-3"
                    onClick={() => setStep("name")}
                  >
                    رجوع
                  </button>
                </div>
              )}

              {/* Step 3: Card Selection */}
              {step === "card" && (
                <div className="fade-in">
                  <div className="row">
                    {filteredCards.map(card => (
                      <div key={card.id} className="col-6 mb-3">
                        <div className="card-item" onClick={() => handleCardSelect(card)}>
                          <Image
                            src={card.imgLink!}
                            alt="card"
                            width={300}
                            height={400}
                            className="img-fluid"
                            unoptimized
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 w-100"
                    onClick={() => setStep("occasion")}
                  >
                    رجوع
                  </button>
                </div>
              )}

              {/* Step 4: Customize Design */}
              {step === "customize" && selectedCard && (
                <div className="fade-in">
                  <div className="preview-container mb-4">
                    <canvas
                      ref={canvasRef}
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
                    />
                  </div>

                  <div className="controls-container">
                    <div className="control-group mb-4">
                      <label className="form-label fw-bold mb-2">الاسم</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="اكتب الاسم هنا"
                        style={{ textAlign: 'right' }}
                      />
                    </div>

                    <div className="control-group mb-3">
                      <label className="form-label d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold">حجم الخط</span>
                        <span className="badge bg-secondary rounded-pill px-3 py-2" style={{ direction: 'ltr' }}>{fontSize}px</span>
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        min="50"
                        max="400"
                        step="5"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary w-100 mt-4"
                    onClick={handleDownload}
                  >
                    تحميل البطاقة
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 w-100"
                    onClick={() => setStep("card")}
                  >
                    رجوع
                  </button>
                </div>
              )}

              <div className="step-indicator">
                <div className={`step-dot ${step === "name" ? "active" : ""}`} />
                <div className={`step-dot ${step === "occasion" ? "active" : ""}`} />
                <div className={`step-dot ${step === "card" ? "active" : ""}`} />
                <div className={`step-dot ${step === "customize" ? "active" : ""}`} />
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
