// Progress storage using Clerk user metadata
// This allows admins to see student progress across devices

export interface ModuleProgress {
  currentStep: string
  completedSteps: string[]
  highestReached: number
  lastUpdated: string
}

export interface CourseProgress {
  module1?: ModuleProgress
  module2?: ModuleProgress
  module3?: ModuleProgress
  module4?: ModuleProgress
  module5?: ModuleProgress
  module6?: ModuleProgress
  conceptProgress?: Record<string, unknown>
  moneyAdventure?: Record<string, unknown>
}

// Get progress from Clerk metadata (client-side, read-only)
export function getProgressFromMetadata(publicMetadata: Record<string, unknown>): CourseProgress {
  return (publicMetadata?.courseProgress as CourseProgress) || {}
}

// Calculate overall course completion percentage
export function calculateOverallProgress(progress: CourseProgress): number {
  const modules = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6'] as const
  const moduleTotalSteps: Record<string, number> = {
    module1: 11,
    module2: 14,
    module3: 11,
    module4: 10,
    module5: 7,
    module6: 8
  }
  
  let totalCompleted = 0
  let totalSteps = 0
  
  for (const mod of modules) {
    const moduleProgress = progress[mod]
    totalSteps += moduleTotalSteps[mod]
    if (moduleProgress?.completedSteps) {
      totalCompleted += moduleProgress.completedSteps.length
    }
  }
  
  return totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0
}

// Get which module a student is currently on
export function getCurrentModule(progress: CourseProgress): number {
  const modules = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6'] as const
  
  for (let i = modules.length - 1; i >= 0; i--) {
    const moduleProgress = progress[modules[i]]
    if (moduleProgress?.completedSteps && moduleProgress.completedSteps.length > 0) {
      // Check if module is complete
      if (moduleProgress.currentStep === 'complete') {
        return i + 2 // Return next module
      }
      return i + 1 // Return current module
    }
  }
  
  return 1 // Default to module 1
}

// Check if a specific module is complete
export function isModuleComplete(progress: CourseProgress, moduleNumber: number): boolean {
  const moduleKey = `module${moduleNumber}` as keyof CourseProgress
  const moduleProgress = progress[moduleKey] as ModuleProgress | undefined
  return moduleProgress?.currentStep === 'complete'
}

// Get completion status for all modules
export function getModuleCompletionStatus(progress: CourseProgress): boolean[] {
  return [1, 2, 3, 4, 5, 6].map(num => isModuleComplete(progress, num))
}

