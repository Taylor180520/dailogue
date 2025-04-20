"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ResizablePanelProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  className?: string
  onWidthChange?: (width: number) => void
}

export function ResizablePanel({
  children,
  defaultWidth = 380, // Increased default width from 288px to 380px
  minWidth = 320, // Increased minimum width from 240px to 320px
  maxWidth: propMaxWidth,
  className,
  onWidthChange,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isDragging, setIsDragging] = useState(false)
  const [maxWidth, setMaxWidth] = useState(propMaxWidth || 480)
  const panelRef = useRef<HTMLDivElement>(null)
  const initialX = useRef<number>(0)
  const initialWidth = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate max width based on parent container
  useEffect(() => {
    const calculateMaxWidth = () => {
      if (panelRef.current) {
        const parentElement = panelRef.current.parentElement?.parentElement
        if (parentElement) {
          const parentWidth = parentElement.getBoundingClientRect().width
          // Set max width to half of the parent container
          const calculatedMaxWidth = Math.floor(parentWidth / 2)
          setMaxWidth(propMaxWidth || calculatedMaxWidth)
        }
      }
    }

    calculateMaxWidth()
    window.addEventListener("resize", calculateMaxWidth)

    return () => {
      window.removeEventListener("resize", calculateMaxWidth)
    }
  }, [propMaxWidth])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    initialX.current = e.clientX
    initialWidth.current = width
    document.body.style.cursor = "ew-resize"
    document.body.style.userSelect = "none"
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = initialX.current - e.clientX // Reversed for correct direction
      const newWidth = Math.max(minWidth, Math.min(maxWidth, initialWidth.current + deltaX))
      setWidth(newWidth)

      if (onWidthChange) {
        onWidthChange(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, minWidth, maxWidth, onWidthChange])

  return (
    <div ref={panelRef} className={cn("relative flex h-full", className)} style={{ width: `${width}px` }}>
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-purple-500/20 z-50"
        onMouseDown={handleMouseDown}
      />
      <div ref={containerRef} className="w-full h-full">
        {children}
      </div>
    </div>
  )
}
