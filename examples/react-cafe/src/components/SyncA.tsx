import { store } from '@/store'
import React from 'react'

const SyncA = () => {

  const count = store.count()
  console.log("Render A")

  return (
    <div>
      <button onClick={()=>store.set.count(p => p + 1)} >Count</button>
      {count}
    </div>
  )
}

export default SyncA