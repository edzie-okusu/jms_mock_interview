import React from 'react'
import { getCurrentUser } from '../../../../../../lib/actions/auth.actions';
import { getFeedbackByInterviewsId, getInterviewById } from '../../../../../../lib/actions/general.actions';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
   <section>

       <div>
        <h1>Feedback on the Interview - {''}
            <span>{interview.role}</span>
        </h1>
      </div>

      <div>
        <div>
          <div>
            <Image src='/star.svg' height={22} width={22} alt='star' />
            <p>
              Overall Impression: {''}
              <span>
                {feedback?.totalScore}
              </span>
              / 100
            </p>
          </div>

          <div>
            <Image src='/calendar.svg' width={22} height={22} alt='calendar' />
            <p>
              {feedback?.createdAt?dayjs(feedback.createdAt).format("MMM D, YYY h:mm A") : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      <hr />

      <p>
        {feedback?.finalAssessment}

        <div>
          <h2>
            Breakdown of the Interview
          </h2>

          {feedback?.categoryScores?.map((category, index) => (
            <div key={index}>
              <p>
                {index + 1}. {category.name} ({category.score}/100)
              </p>

              <p>{category.comment}</p>
            </div>
          ))}

        </div>
            
        <div>
            <h3>Strengths</h3>
            <ul>
              {feedback?.strengths?.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
        </div>

        <div>
            <h3>Areas for Improvement</h3>
            <ul>
              {feedback?.areasForImprovement?.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
        </div>

        <div className='buttons'>
          <Button>
            <Link href='/' className='flex w-full justify-center'>
              <p>
                Back to Dashboard
              </p>
            </Link> 
          </Button>

          <Button>
            <Link href={`/interview/${id}`}  className='flex w-full justify-center'>
              <p>
                Retake Interview
              </p>
            </Link> 
          </Button>
        </div>
      </p>
   </section>
  )
}

export default page 