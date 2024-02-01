import { myStore } from '@/store'
import React from 'react'

const SyncB = () => {

  const [name, setName] = myStore.useName()
  
  console.log("Render B")

  return (
    <div>
      <button onClick={()=>setName(p => p + 'c')} >String</button>
      {name}
    </div>
  )
}

export default SyncB