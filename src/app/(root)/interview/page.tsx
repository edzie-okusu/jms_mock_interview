import React from 'react'
import Agent from '../../../../components/Agent'
import { getCurrentUser } from '../../../../lib/actions/auth.actions'
import {google, createGoogleGenerativeAI} from '@ai-sdk/google'

const page = async () => {
  const user = await getCurrentUser()
  const geminiApiKey = process.env.GEMINI_API_KEY;
    const google = createGoogleGenerativeAI({
      apiKey:geminiApiKey
    })
  return (
    <>
        <h3>Interview Generation</h3>
        <Agent userName={user?.name} userId={user?.id} type='generate' />
    </>
  )
}

export default page