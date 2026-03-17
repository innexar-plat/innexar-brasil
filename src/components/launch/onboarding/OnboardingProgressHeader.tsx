'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { TOTAL_STEPS } from './types'

export type StepConfig = { id: number; title: string; icon: LucideIcon; description: string }

type Props = {
  steps: StepConfig[]
  currentStep: number
  setCurrentStep: (step: number) => void
  t: (key: string) => string
}

export default function OnboardingProgressHeader({ steps, currentStep, setCurrentStep }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          return (
            <div key={step.id} className="flex items-center">
              <motion.button
                type="button"
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                disabled={currentStep < step.id}
                animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors ${
                  currentStep > step.id ? 'bg-green-500 cursor-pointer' : currentStep === step.id ? 'bg-blue-500' : 'bg-white/10'
                }`}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
              </motion.button>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 md:w-12 h-1 mx-1 rounded-full ${currentStep > step.id ? 'bg-green-500' : 'bg-white/10'}`}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="text-center">
        <span className="text-blue-400 font-semibold">
          Step {currentStep} of {TOTAL_STEPS}:
        </span>{' '}
        <span className="text-white">{steps[currentStep - 1]?.title}</span>
        <p className="text-slate-400 text-sm mt-1">{steps[currentStep - 1]?.description}</p>
      </div>
    </div>
  )
}
