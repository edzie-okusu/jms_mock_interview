import React from 'react'
import { getCurrentUser } from '../../../../../../lib/actions/auth.actions';
import { getFeedbackByInterviewsId, getInterviewById } from '../../../../../../lib/actions/general.actions';
import { redirect } from 'next/navigation';

const page = async ({params}: RouteParams) => {
  
    const {id} = await params;
    const user = await getCurrentUser();

    const interview = await getInterviewById(id);
    if(!interview) redirect('/');

    const feedback = await getFeedbackByInterviewsId({
        interviewId: id,
        userId: user?.id,
    })
    
  return (
    <div>page</div>
  )
}

export default page 