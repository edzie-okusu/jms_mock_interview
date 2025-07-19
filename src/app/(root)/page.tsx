import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import InterviewCard from "../../../components/InterviewCard";
import { getCurrentUser, getInterviewByUserId, getLatestInterviews } from "../../../lib/actions/auth.actions";

const  Page = async () => {
  const user = await getCurrentUser();

  // Promise.all() allows for data to be fetched concurrently or parrallely
  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id),
    await getLatestInterviews({userId: user?.id})
  ]) 

  const hasPastInterview = userInterviews?.length > 0;
  const hasLatestInterviews = latestInterviews?.length > 0;


  return (
    <>
      <section className="card-cta">

        <div className="flex flex-col gap-6 max-w-lg">
        
          <h2>Get Interview-Ready with Ai-Powrerd Practice and FeedBack</h2>
        
          <p className="text-lg">
            Practice on real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href='/interview'>Start an Interview</Link>
          </Button>
        
        </div>
        <Image src='/robot.png' alt='robo-dude' width={400} height={400} className="max-sm:hidden" />

      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {
            hasPastInterview ? (
              userInterviews?.map((interview)=>(
                <InterviewCard {...interview} key={interview.id}/>
              ))) : (
                <p>You have not taken any interviews yet</p>
              )
          }
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>

        <div className="interviews-section">
           {
            hasLatestInterviews ? (
              latestInterviews?.map((interview)=>(
                <InterviewCard {...interview} key={interview.id}/>
              ))) : (
                <p>You have not taken any interviews yet</p>
              )
          }
        </div>
      </section>
    </>
  )
}

export default Page