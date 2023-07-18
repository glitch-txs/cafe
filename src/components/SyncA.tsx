import { store } from '@/store/store'
import React from 'react'

const SyncA = () => {

  const count = store.count()

  return (
    <div>
      <button onClick={()=>store.set.count((v: number) => v + 1)} >Sync A</button>
      {count}
    </div>
  )
}

export default SyncA