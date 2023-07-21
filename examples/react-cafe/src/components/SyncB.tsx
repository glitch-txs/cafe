import { set, states } from '@/store'
import React from 'react'

const SyncB = () => {

  const name = states.name()
  console.log("Render B")

  return (
    <div>
      <button onClick={()=>set.name(p => p + 'c')} >String</button>
      {name}
    </div>
  )
}

export default SyncB