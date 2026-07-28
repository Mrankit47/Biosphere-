'use client'

import React from 'react'
import { BackLink } from '@/components/ds'
import { EcologyEngineApp } from '@/ecology-engine/components/EcologyEngineApp'

export default function EcosystemSimulator() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto mb-4">
        <BackLink href="/dashboard" label="Back to Dashboard" />
      </div>

      <EcologyEngineApp initialBiomeId="forest" />
    </div>
  )
}
