'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect, useCallback } from 'react'
import { ModuleProgress, getProgressFromMetadata } from '@/lib/progressStorage'

export function useModuleProgress(moduleNumber: number) {
  const { user, isLoaded } = useUser()
  const [progress, setProgress] = useState<ModuleProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load progress on mount
  useEffect(() => {
    if (!isLoaded) return

    const loadProgress = async () => {
      setIsLoading(true)
      
      // First try localStorage for quick load
      const localKey = `module${moduleNumber}_progress_${user?.id}`
      const localData = localStorage.getItem(localKey)
      
      if (localData) {
        try {
          setProgress(JSON.parse(localData))
        } catch {
          // Invalid local data, will try Clerk
        }
      }

      // Then try Clerk metadata (source of truth)
      if (user?.publicMetadata) {
        const clerkProgress = getProgressFromMetadata(user.publicMetadata)
        const moduleProgress = clerkProgress[`module${moduleNumber}` as keyof typeof clerkProgress] as ModuleProgress | undefined
        
        if (moduleProgress) {
          setProgress(moduleProgress)
          // Sync to localStorage
          localStorage.setItem(localKey, JSON.stringify(moduleProgress))
        }
      }

      setIsLoading(false)
    }

    loadProgress()
  }, [isLoaded, user?.id, user?.publicMetadata, moduleNumber])

  // Save progress function
  const saveProgress = useCallback(async (newProgress: ModuleProgress) => {
    if (!user?.id) return

    setProgress(newProgress)
    setIsSaving(true)

    // Save to localStorage immediately (for quick access)
    const localKey = `module${moduleNumber}_progress_${user.id}`
    localStorage.setItem(localKey, JSON.stringify(newProgress))

    // Save to Clerk in background (for persistence and admin visibility)
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleNumber,
          progressData: newProgress
        })
      })
    } catch (error) {
      console.error('Failed to save progress to Clerk:', error)
      // Progress is still saved locally, will sync later
    }

    setIsSaving(false)
  }, [user?.id, moduleNumber])

  return {
    progress,
    isLoading,
    isSaving,
    saveProgress
  }
}

// Hook to get overall course progress
export function useCourseProgress() {
  const { user, isLoaded } = useUser()
  const [progress, setProgress] = useState<Record<string, ModuleProgress>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !user) {
      setIsLoading(false)
      return
    }

    const loadProgress = async () => {
      setIsLoading(true)
      
      try {
        const response = await fetch('/api/progress')
        if (response.ok) {
          const data = await response.json()
          setProgress(data.progress || {})
        }
      } catch (error) {
        console.error('Failed to load course progress:', error)
        
        // Fallback to Clerk metadata
        if (user.publicMetadata) {
          const clerkProgress = getProgressFromMetadata(user.publicMetadata)
          setProgress(clerkProgress as Record<string, ModuleProgress>)
        }
      }
      
      setIsLoading(false)
    }

    loadProgress()
  }, [isLoaded, user])

  return { progress, isLoading }
}

