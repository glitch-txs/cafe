import { store } from '@/store'
import React from 'react'

const SyncB = () => {

  const name = store.name()
  console.log("Render B")

  return (
    <div>
      <button onClick={()=>store.set.name(p => p + 'c')} >String</button>
      {name}
    </div>
  )
}

export default SyncB