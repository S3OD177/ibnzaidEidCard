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
  const [fontSize, setFontSize] = useState<number>(55)
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

    // Use slider value directly as font size (40-70px)
    ctx.font = `${fontSize}px Almarai, sans-serif`
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

  const handleShare = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], `${name || "greeting"}.jpg`, { type: "image/jpeg" })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
          })
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            console.error("Share failed", err)
          }
        }
      } else {
        // Fallback to download if sharing is not supported
        handleDownload()
      }
    }, "image/jpeg", 0.9)
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
                    <div className="control-group mb-3">
                      <label className="form-label fw-bold mb-2">الاسم</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="اكتب الاسم هنا"
                        style={{ textAlign: 'right', borderRadius: '12px', height: '3rem' }}
                      />
                    </div>

                    {/* Compact Font Size Stepper */}
                    <div className="control-group mb-4">
                      <div className="d-flex align-items-center justify-content-between p-2 px-3 bg-light border" style={{ borderRadius: '16px' }}>
                        <button
                          type="button"
                          className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff' }}
                          onClick={() => setFontSize(Math.max(40, fontSize - 5))}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <span className="fw-bold fs-5 text-dark">{fontSize}px</span>
                        <button
                          type="button"
                          className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff' }}
                          onClick={() => setFontSize(Math.min(70, fontSize + 5))}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                      </div>
                    </div>

                    <div className="share-section mb-4 text-center">
                      <p className="text-muted small fw-bold mb-3 text-uppercase tracking-wider">شارك تهنئتك مع أحبابك</p>
                      <div className="d-flex justify-content-center">
                        <button type="button" className="btn d-flex align-items-center justify-content-center gap-2 px-4 shadow-sm"
                          onClick={handleShare}
                          style={{
                            height: '3.5rem',
                            borderRadius: '18px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white',
                            border: 'none',
                            fontWeight: '700',
                            minWidth: '200px'
                          }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                          <span>إرسال البطاقة</span>
                        </button>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="button"
                        className="btn w-100 d-flex align-items-center justify-content-center text-center"
                        onClick={handleDownload}
                        style={{
                          height: '3.75rem',
                          borderRadius: '16px',
                          background: '#1e293b',
                          color: 'white',
                          border: 'none',
                          fontWeight: '700',
                          fontSize: '1.25rem',
                          textAlign: 'center'
                        }}
                      >
                        <span style={{ width: '100%' }}>تحميل البطاقة</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary mt-3 w-100"
                        onClick={() => setStep("card")}
                      >
                        رجوع
                      </button>
                    </div>
                  </div>
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
      </section >
    </div >
  )
}
