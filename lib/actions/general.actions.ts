'use server'
import { generateObject } from "ai";
import { auth, db } from "../../firebase/admin";
import {google, createGoogleGenerativeAI} from '@ai-sdk/google'
import { feedbackSchema } from "../../constants";
// for this line of code, will get an error requireing me to authenticate and create the indeces on firestore 
export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
  const interviews = await db.collection('interviews').where('userId', '==', userId).orderBy('createdAt', 'desc').get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
  const {userId, limit=20} = params;

  const interviews = await db.collection('interviews').orderBy('createdAt', 'desc').where('finalized', '==', true).where('userId', '!=', userId).limit(limit).get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection('interviews').doc(id).get()
  return interview.data() as Interview | null;
}

export async function createFeedback(params:CreateFeedbackParams) {
    const {interviewId, userId, transcript} = params
    const geminiApiKey = process.env.GEMINI_API_KEY;
        const google = createGoogleGenerativeAI({
          apiKey:geminiApiKey
        })


    try {
        const formattedTranscript = transcript.map((sentence: {role: string; content: string}) => (
            `-${sentence.role}: ${sentence.content} \n`
        )).join('');

        const {object: {totalScore, categoryScores, strengths, areasForImprovement, finalAssessment }} = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false,
            }),
            schema: feedbackSchema, 
            prompt: `You are an AI interviewer analzying a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis.
             Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out
             ${formattedTranscript}
             Please score the candidae from 0 to 100 in the following areas. Do not add categories other than the ones provided
             -** Communication Skills**: Clarity, articulation, structured responses. 
             -** Technical Knowledge**: Understanding of key concepts for the role. 
             -** Problem Solving**: Ability to analyze problems and propose solutions.
             -** Cultural & Role fit**: Alignment with company values and job role 
            -** Confidence & Clarity **: Confidence in responses, engagement, and clarity          
             `,
             system:
             'You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories',
        })

        const feedback = await db.collection('feedback').add({
            interviewId,
            userId,
            totalScore,
            categoryScores, strengths,
            areasForImprovement,
            finalAssessment,
            createdAt: new Date().toISOString()
        }) 
        return {
            success: true,
            feedbackId: feedback
        }
         
    } catch(e) {
        console.log('Error saving feedback', e)
        return {
          success: false
        }

    }
}

export async function getFeedbackByInterviewsId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
  const {interviewId, userId} = params;

  const feedback = await db.collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '!=', userId)
    .limit(1)
    .get();

  if(feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];
  return {
    id: feedbackDoc.id, ...feedbackDoc.data()
  } as Feedback;
}