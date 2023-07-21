import { set, states } from '@/store'
import React from 'react'

const SyncA = () => {

  const count = states.count()
  console.log("Render A")

  return (
    <div>
      <button onClick={()=>set.count(p => p + 1)} >Count</button>
      {count}
    </div>
  )
}

export default SyncA