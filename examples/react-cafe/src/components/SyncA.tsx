import { myStore } from '@/store'
import React from 'react'

const SyncA = () => {

  const [count, setCount] = myStore.useCount()

  console.log("Render A")

  return (
    <div>
      <button onClick={()=>setCount(p => p + 1)} >Count</button>
      {count}
    </div>
  )
}

export default SyncA